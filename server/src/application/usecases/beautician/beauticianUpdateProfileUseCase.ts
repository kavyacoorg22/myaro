import { BankDetailsVO } from "../../../domain/entities/Beautician";
import { AppError } from "../../../domain/errors/appError";
import { IBeauticianRepository } from "../../../domain/repositoryInterface/IBeauticianRepository";
import { IUserRepository } from "../../../domain/repositoryInterface/IUserRepository";
import { generalMessages } from "../../../shared/constant/message/generalMessage";
import { HttpStatus } from "../../../shared/enum/httpStatus";
import { IBeauticianEditProfileUseCase } from "../../interface/beautician/IBeauticianEditProfileUseCase";
import { IResponse } from "../../interfaceType/authtypes";
import { IBeauticianEditProfileInput } from "../../interfaceType/beauticianType";



export class BeauticianEditProfileUseCase implements IBeauticianEditProfileUseCase
{
   private _beauticianRepo:IBeauticianRepository
   private _userRepo:IUserRepository

   constructor(beauticianRepo:IBeauticianRepository,userRepo:IUserRepository)
   {
    this._beauticianRepo=beauticianRepo,
    this._userRepo=userRepo
   }

  async execute(userId:string,data: IBeauticianEditProfileInput): Promise<IResponse> {
     const existing = await this._beauticianRepo.findByUserId(userId);
    if (!existing) {
      throw new AppError("Beautician not found", HttpStatus.NOT_FOUND);
    }

      const userUpdate: any = {};
    if (data.userName !== undefined) userUpdate.userName = data.userName;
    if (data.fullName !== undefined) userUpdate.fullName = data.fullName;
    

     const beauticianUpdate: any = {};
    if (data.about !== undefined) beauticianUpdate.about = data.about;
    if (data.shopName !== undefined) beauticianUpdate.shopName = data.shopName;
    if (data.shopAddress !== undefined) beauticianUpdate.shopAddress = data.shopAddress;
    if (data.yearsOfExperience !== undefined) {
      beauticianUpdate.yearsOfExperience = Number(data.yearsOfExperience);
    }

      const hasAnyBankField = 
      data.accountHolderName !== undefined ||
      data.accountNumber !== undefined ||
      data.ifscCode !== undefined ||
      data.bankName !== undefined ||
      data.upiId !== undefined;

    if (hasAnyBankField) {
      const existingBank = (existing.bankDetails || {}) as BankDetailsVO;
      beauticianUpdate.bankDetails = {
        accountHolderName: data.accountHolderName ?? existingBank.accountHolderName ?? "",
        accountNumber: data.accountNumber ?? existingBank.accountNumber ?? "",
        ifscCode: data.ifscCode ? data.ifscCode.trim().toUpperCase() : (existingBank.ifscCode ?? ""),
        bankName: data.bankName ?? existingBank.bankName ?? "",
        upiId: data.upiId ?? existingBank.upiId ?? "",
      };
    }


        if (Object.keys(userUpdate).length > 0) {
      await this._userRepo.updateById(userId, userUpdate);
    }

   
    if (Object.keys(beauticianUpdate).length > 0) {
      await this._beauticianRepo.updateByUserId(userId, beauticianUpdate);
    }

     return {success:true ,message:generalMessages.SUCCESS.OPERATION_SUCCESS}
  }

 
}