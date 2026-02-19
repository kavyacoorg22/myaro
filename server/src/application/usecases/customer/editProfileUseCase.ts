import { AppError } from "../../../domain/errors/appError";
import { IUserRepository } from "../../../domain/repositoryInterface/IUserRepository";
import { authMessages } from "../../../shared/constant/message/authMessages";
import { generalMessages } from "../../../shared/constant/message/generalMessage";
import { HttpStatus } from "../../../shared/enum/httpStatus";
import { ICustomerEditProfileUseCase } from "../../interface/customer/IEditProfileUseCase";
import { ICustomerEditProfileInput } from "../../interfaceType/customerType";


export class CustomerEditProfileUseCase implements ICustomerEditProfileUseCase{
  constructor(private readonly userRepo:IUserRepository){}

  async execute(id: string, input: ICustomerEditProfileInput): Promise<void> {
    const user=await this.userRepo.findByUserId(id)
    if(!user)
    {
      throw new AppError(generalMessages.ERROR.NOT_FOUND,HttpStatus.NOT_FOUND)
    }

    await this.userRepo.updateByUserId(id,input)
  }
}