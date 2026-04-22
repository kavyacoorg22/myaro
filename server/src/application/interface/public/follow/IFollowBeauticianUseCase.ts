
export interface IFollowBeauticianUseCase{
  execute(userId:string,beauticianId:string):Promise<void>
}