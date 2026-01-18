
export interface IApproveCustomServiceUseCase {
  execute(adminID:string,customServiceId:string):Promise<void>
}