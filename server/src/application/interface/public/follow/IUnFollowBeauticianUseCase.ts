export interface IUnFollowBeauticianUseCase{
  execute(userId:string,beauticianId:string):Promise<{ isFollowing: boolean }>
}