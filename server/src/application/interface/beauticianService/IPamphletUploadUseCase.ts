
export interface IUploadPamphletUseCase{
  execute(id:string,pamphletImg:Express.Multer.File):Promise<void>
} 