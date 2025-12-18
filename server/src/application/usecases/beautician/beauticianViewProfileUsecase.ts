import { AppError } from "../../../domain/errors/appError";
import { IBeauticianRepository } from "../../../domain/repositoryInterface/IBeauticianRepository";
import { IUserRepository } from "../../../domain/repositoryInterface/IUserRepository";
import { generalMessages } from "../../../shared/constant/message/generalMessage";
import { HttpStatus } from "../../../shared/enum/httpStatus";
import { IBeauticianViewEditProfileUseCase } from "../../interface/beautician/IBeauticianViewEditProfileUseCase";
import { IBeauticianViewEditProfileOutput } from "../../interfaceType/beauticianType";
import { toBeauticianEditProfileDto } from "../../mapper/beauticianMapper";



export class BeauticianViewEditProfileUseCase implements IBeauticianViewEditProfileUseCase{
   private _beauticianRepo:IBeauticianRepository
   private _userRepo:IUserRepository

   constructor(beauticianRepo:IBeauticianRepository,userRepo:IUserRepository)
   {
    this._beauticianRepo=beauticianRepo
    this._userRepo=userRepo
   }

  async execute(userId: string): Promise<IBeauticianViewEditProfileOutput> {
    
    const beautician=await this._beauticianRepo.findByUserId(userId)

    console.log(`usecase output ${beautician}`)
    
    if(!beautician)
    {
      throw new AppError(
        generalMessages.ERROR.NOT_FOUND,
        HttpStatus.NOT_FOUND
      )
    }

    const id=beautician.userId

    const userData=await this._userRepo.findByUserId(id)
    if(!userData)
    {
      throw new AppError(generalMessages.ERROR.NOT_FOUND,HttpStatus.NOT_FOUND)
    }
    return toBeauticianEditProfileDto(beautician,userData)
  }
}