import ffmpeg from "fluent-ffmpeg";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as crypto from "crypto";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../../../infrastructure/fileStorage/s3Client";
import { appConfig } from "../../../infrastructure/config/config";
import { Readable } from "stream";
import { AppError } from "../../../domain/errors/appError";
import { HttpStatus } from "../../../shared/enum/httpStatus";


// ── Constraints ───────────────────────────────────────────────────────────────
const MAX_DURATION_SECONDS = 180;  // 3 minutes
const MIN_DURATION_SECONDS = 1;
const MIN_WIDTH = 360;
const MIN_HEIGHT = 360;
const MAX_WIDTH = 3840;            // 4K
const MAX_HEIGHT = 2160;

export interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
  codec: string;
  bitrate: number;  // kb/s
}

// ── Download S3 object to a local temp file ───────────────────────────────────
async function downloadFromS3(s3Key: string): Promise<string> {
  const tmpPath = path.join(os.tmpdir(), `probe_${crypto.randomUUID()}.mp4`);

  const { Body } = await s3Client.send(
    new GetObjectCommand({ Bucket: appConfig.aws.bucketName, Key: s3Key })
  );

  await new Promise<void>((resolve, reject) => {
    const stream = fs.createWriteStream(tmpPath);
    (Body as Readable).pipe(stream);
    stream.on("finish", resolve);
    stream.on("error", reject);
  });

  return tmpPath;
}

// ── Run ffprobe on a local file ───────────────────────────────────────────────
function probeVideo(filePath: string): Promise<VideoMetadata> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) return reject(err);

      const videoStream = metadata.streams.find((s) => s.codec_type === "video");
      if (!videoStream) return reject(new Error("No video stream found"));

      resolve({
        duration: metadata.format.duration ?? 0,
        width: videoStream.width ?? 0,
        height: videoStream.height ?? 0,
        codec: videoStream.codec_name ?? "unknown",
        bitrate: Math.round((metadata.format.bit_rate ?? 0) / 1000),
      });
    });
  });
}

// ── Validate metadata against constraints ─────────────────────────────────────
function assertVideoMetadata(meta: VideoMetadata, trimEnd?: number): void {
  if (meta.duration < MIN_DURATION_SECONDS) {
    throw new AppError(
      `Video too short (${meta.duration.toFixed(1)}s). Minimum is ${MIN_DURATION_SECONDS}s.`,
      HttpStatus.BAD_REQUEST
    );
  }
  if (meta.duration > MAX_DURATION_SECONDS) {
    throw new AppError(
      `Video too long (${Math.round(meta.duration)}s). Maximum is ${MAX_DURATION_SECONDS}s.`,
      HttpStatus.BAD_REQUEST
    );
  }
  if (meta.width < MIN_WIDTH || meta.height < MIN_HEIGHT) {
    throw new AppError(
      `Resolution too low (${meta.width}x${meta.height}). Minimum is ${MIN_WIDTH}x${MIN_HEIGHT}.`,
      HttpStatus.BAD_REQUEST
    );
  }
  if (meta.width > MAX_WIDTH || meta.height > MAX_HEIGHT) {
    throw new AppError(
      `Resolution too high (${meta.width}x${meta.height}). Maximum is ${MAX_WIDTH}x${MAX_HEIGHT}.`,
      HttpStatus.BAD_REQUEST
    );
  }
  if (meta.codec === "unknown" || meta.bitrate === 0) {
    throw new AppError(
      "Video file appears to be corrupted or unreadable.",
      HttpStatus.BAD_REQUEST
    );
  }
  // trimEnd must not exceed actual video duration
  if (trimEnd !== undefined && trimEnd > meta.duration + 0.5) {
    throw new AppError(
      `trimEnd (${trimEnd}s) exceeds actual video duration (${meta.duration.toFixed(1)}s).`,
      HttpStatus.BAD_REQUEST
    );
  }
}


export async function validateVideoFromS3(
  s3Key: string,
  trimEnd?: number
): Promise<VideoMetadata> {
  let tmpPath: string | null = null;
  try {
    tmpPath = await downloadFromS3(s3Key);
    const meta = await probeVideo(tmpPath);
    console.log(`[videoValidator] ${s3Key}:`, meta);
    assertVideoMetadata(meta, trimEnd);
    return meta;
  } finally {
    if (tmpPath && fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
  }
}