// import {v2 as cloudinary} from 'cloudinary'
// import { appConfig } from '../../infrastructure/config/config';
// import path from 'path'
// import { IFileStorage } from '../../application/interface/IFileStorage';


// cloudinary.config({
//     cloud_name: appConfig.cloudinary.cloudName,
//     api_key: appConfig.cloudinary.apiKey,
//     api_secret: appConfig.cloudinary.apiSecret,
// });

// export class CloudinaryStorage implements IFileStorage {
//     async upload(
//         fileBuffer: Buffer,
//         filename: string,
//         folder: string,
//     ): Promise<string> {
//         return new Promise((resolve, reject) => {
//             const baseFilename = path.parse(filename).name;
//             cloudinary.uploader
//                 .upload_stream(
//                     { folder, public_id: baseFilename, resource_type: 'auto' },
//                     (error, result) => {
//                         if (error) return reject(error);
//                         if (!result || !result.secure_url)
//                             return reject(
//                                 new Error(
//                                     'Upload failed: no result returned from Cloudinary',
//                                 ),
//                             );
//                         resolve(result.secure_url); 
//                     },
//                 )
//                 .end(fileBuffer);
//         });
//     }

//     async uploadFromUrl(
//         url: string,
//         filename: string,
//         folder: string,
//     ): Promise<string> {
//         const baseFilename = path.parse(filename).name;
//         return new Promise((resolve, reject) => {
//             cloudinary.uploader.upload(
//                 url,
//                 {
//                     folder,
//                     public_id: baseFilename,
//                     resource_type: 'auto',
//                     overwrite: true,
//                 },
//                 (error, result) => {
//                     if (error) return reject(error);
//                     if (!result?.secure_url)
//                         return reject(new Error('Upload from URL failed: no result returned from Cloudinary'));
//                     resolve(result.secure_url); 
//                 },
//             );
//         });
//     }

//     async delete(url: string): Promise<void> {
//   try {
    
//     const cleanUrl = url.split("?")[0];

    
//     const parts = cleanUrl.split("/");
//     const lastPart = parts.slice(-2).join("/"); 
//     const publicId = lastPart.replace(/\.[^/.]+$/, ""); 

//     await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
//   } catch (err) {
//     console.warn("Cloudinary delete failed:", err);
//   }
// }

// }

import { PutObjectCommand,DeleteObjectCommand,ListBucketsCommand} from "@aws-sdk/client-s3";
import { s3Client } from "./s3Client";
import { IFileStorage } from "../../application/interface/IFileStorage";
import path from 'path'
import crypto from 'crypto'
import { appConfig } from "../config/config";

async function testS3() {
  try {
    const result = await s3Client.send(new ListBucketsCommand({}));
    console.log('✅ S3 works! Buckets:', result.Buckets?.map(b => b.Name));
  } catch (error) {
    console.error('❌ S3 connection failed:', error);
  }
}


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