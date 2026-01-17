
export interface ITogggleActiveStatusUseCase{
  execute(id:string,isActive:boolean):Promise<void>
}