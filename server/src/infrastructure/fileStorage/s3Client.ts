import { appConfig } from "../config/config";
import { S3Client } from "@aws-sdk/client-s3";

export const s3Client=new S3Client({
region:appConfig.aws.region,
credentials:{
  accessKeyId:appConfig.aws.awsAccessKeyId,
  secretAccessKey:appConfig.aws.awsSecretAccessKey
}
})