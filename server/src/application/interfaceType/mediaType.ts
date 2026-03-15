export interface IMediaInput {
  s3Key: string;
  fileType: "image" | "video";
  trimStart?: number;
  trimEnd?: number;
  soundOn?: boolean;
}

export interface ISignedUrl{
index:number,
signedUrl:string,
s3Key:string
}
export interface ISignedUrlOutput{
  data:ISignedUrl[]
}