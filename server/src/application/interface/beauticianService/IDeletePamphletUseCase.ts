
export interface IDeletePamphletUseCase{
  execute(id:string):Promise<void>
}