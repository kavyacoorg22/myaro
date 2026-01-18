
export interface IRejectCustomServiceUseCase{
  execute(adminId:string,customServiceId:string):Promise<void>
}