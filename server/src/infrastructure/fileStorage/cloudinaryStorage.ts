import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'
import { appConfig } from '../../infrastructure/config/config';
import path from 'path'
import { IFileStorage } from '../../application/interface/IFileStorage';


cloudinary.config({
    cloud_name: appConfig.cloudinary.cloudName,
    api_key: appConfig.cloudinary.apiKey,
    api_secret: appConfig.cloudinary.apiSecret,
});

export class CloudinaryStorage implements IFileStorage {
    async upload(
        fileBuffer: Buffer,
        filename: string,
        folder: string,
    ): Promise<string> {
        return new Promise((resolve, reject) => {
            const baseFilename = path.parse(filename).name;
            cloudinary.uploader
                .upload_stream(
                    { folder, public_id: baseFilename, resource_type: 'auto' },
                    (error, result) => {
                        if (error) return reject(error);
                        if (!result || !result.secure_url)
                            return reject(
                                new Error(
                                    'Upload failed: no result returned from Cloudinary',
                                ),
                            );
                        resolve(result.secure_url); 
                    },
                )
                .end(fileBuffer);
        });
    }

    async uploadFromUrl(
        url: string,
        filename: string,
        folder: string,
    ): Promise<string> {
        const baseFilename = path.parse(filename).name;
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(
                url,
                {
                    folder,
                    public_id: baseFilename,
                    resource_type: 'auto',
                    overwrite: true,
                },
                (error, result) => {
                    if (error) return reject(error);
                    if (!result?.secure_url)
                        return reject(new Error('Upload from URL failed: no result returned from Cloudinary'));
                    resolve(result.secure_url); 
                },
            );
        });
    }

    async delete(url: string): Promise<void> {
  try {
    
    const cleanUrl = url.split("?")[0];

    
    const parts = cleanUrl.split("/");
    const lastPart = parts.slice(-2).join("/"); 
    const publicId = lastPart.replace(/\.[^/.]+$/, ""); 

    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
  } catch (err) {
    console.warn("Cloudinary delete failed:", err);
  }
}

}