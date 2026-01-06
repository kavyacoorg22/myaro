

import { PutObjectCommand,DeleteObjectCommand} from "@aws-sdk/client-s3";
import { s3Client } from "./s3Client";
import { IFileStorage } from "../../application/interface/IFileStorage";
import path from 'path'
import crypto from 'crypto'
import { appConfig } from "../config/config";




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