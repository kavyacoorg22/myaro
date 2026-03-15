import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "./s3Client";
import { IFileStorage } from "../../application/interface/IFileStorage";
import path from 'path'
import crypto from 'crypto'
import { appConfig } from "../config/config";
import { Readable } from "stream";
import * as fs from "fs";
import * as os from "os";
import ffmpeg from "fluent-ffmpeg";


export class S3Storage implements IFileStorage {

  private generateKey(filename: string, folder: string) {
    const ext = path.extname(filename);
    const uniqueName = crypto.randomUUID();
    return `${folder}/${uniqueName}${ext}`;
  }

  async upload(
    fileBuffer: Buffer,
    filename: string,
    folder: string
  ): Promise<string> {

    const key = this.generateKey(filename, folder);

    await s3Client.send(
      new PutObjectCommand({
        Bucket: appConfig.aws.bucketName,
        Key: key,
        Body: fileBuffer,
        ContentType: this.getContentType(filename),
      })
    );

    return this.getPublicUrl(key);
  }

  async uploadFromUrl(
    url: string,
    filename: string,
    folder: string
  ): Promise<string> {

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch file from URL");
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    return this.upload(buffer, filename, folder);
  }

  async delete(url: string): Promise<void> {
    try {
      const key = this.extractKeyFromUrl(url);

      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: appConfig.aws.bucketName,
          Key: key,
        })
      );
    } catch (err) {
      console.warn("S3 delete failed:", err);
    }
  }

  // ── NEW: Generate a presigned PUT URL for direct client → S3 upload ──────
  async generateSignedUploadUrl(
    fileType: string,   // e.g. "video/mp4", "image/jpeg"
    folder: string = "posts/raw"
  ): Promise<{ signedUrl: string; s3Key: string }> {
    const ext = fileType.split("/")[1] ?? "bin";
    const s3Key = `${folder}/${crypto.randomUUID()}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: appConfig.aws.bucketName,
      Key: s3Key,
      ContentType: fileType,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 }); // 5 min
    return { signedUrl, s3Key };
  }

  // ── NEW: Download raw video from S3, trim with ffmpeg, re-upload ─────────
  async trimAndReplaceVideo(
    rawS3Key: string,
    trimStart: number,
    trimEnd: number,
    soundOn: boolean
  ): Promise<string> {
    const tmpDir = os.tmpdir();
    const inputPath = path.join(tmpDir, `input_${crypto.randomUUID()}.mp4`);
    const outputPath = path.join(tmpDir, `output_${crypto.randomUUID()}.mp4`);

    try {
      // 1. Download raw video from S3 to temp file
      const { Body } = await s3Client.send(
        new GetObjectCommand({ Bucket: appConfig.aws.bucketName, Key: rawS3Key })
      );

      await new Promise<void>((resolve, reject) => {
        const writeStream = fs.createWriteStream(inputPath);
        (Body as Readable).pipe(writeStream);
        writeStream.on("finish", resolve);
        writeStream.on("error", reject);
      });

      // 2. Check if trim is actually needed
      const trimDuration = trimEnd - trimStart;
      const noTrimNeeded = trimStart < 0.1 && trimDuration >= (trimEnd - 0.1);
      if (noTrimNeeded) {
        return this.getPublicUrl(rawS3Key);
      }

      // 3. Trim with ffmpeg
      await new Promise<void>((resolve, reject) => {
        let cmd = ffmpeg(inputPath)
          .setStartTime(trimStart)
          .setDuration(trimDuration)
          .videoCodec("libx264")
          .addOption("-preset", "fast")
          .addOption("-crf", "23")
          .addOption("-movflags", "+faststart")
          .addOption("-avoid_negative_ts", "make_zero");

        cmd = soundOn ? cmd.audioCodec("aac") : cmd.noAudio();

        cmd.output(outputPath)
          .on("end", () => resolve())
          .on("error", (err) => reject(err))
          .run();
      });

      // 4. Upload trimmed file to posts/trimmed/
      const trimmedKey = rawS3Key.replace("posts/raw/", "posts/trimmed/");
      const fileBuffer = fs.readFileSync(outputPath);

      await s3Client.send(
        new PutObjectCommand({
          Bucket: appConfig.aws.bucketName,
          Key: trimmedKey,
          Body: fileBuffer,
          ContentType: "video/mp4",
        })
      );

      // 5. Delete the raw file
      await s3Client.send(
        new DeleteObjectCommand({ Bucket: appConfig.aws.bucketName, Key: rawS3Key })
      ).catch(() => {}); // non-fatal

      return this.getPublicUrl(trimmedKey);
    } finally {
      // Clean up temp files
      if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    }
  }

  private getPublicUrl(key: string): string {
    return `https://${appConfig.aws.bucketName}.s3.${appConfig.aws.region}.amazonaws.com/${key}`;
  }

  private extractKeyFromUrl(url: string): string {
    const cleanUrl = url.split("?")[0];
    const bucketBase = `https://${appConfig.aws.bucketName}.s3.${appConfig.aws.region}.amazonaws.com/`;
    return cleanUrl.replace(bucketBase, "");
  }

  private getContentType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    if (ext === ".png") return "image/png";
    if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
    if (ext === ".webp") return "image/webp";
    if (ext === ".pdf") return "application/pdf";
    return "application/octet-stream";
  }
}