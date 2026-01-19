
export interface IUpdateServiceUseCase{
  execute(id:string,name:string):Promise<void>
}