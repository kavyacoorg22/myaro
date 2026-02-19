// CustomerViewProfileUseCase.ts
import { AppError } from "../../../domain/errors/appError";
import { IUserRepository } from "../../../domain/repositoryInterface/IUserRepository";
import { generalMessages } from "../../../shared/constant/message/generalMessage";
import { HttpStatus } from "../../../shared/enum/httpStatus";
import { IViewEditProfileUseCase } from "../../interface/customer/IViewEditProfileUseCase";
import { ICustomerViewProfileOutput } from "../../interfaceType/customerType";
import { toCustomerProfileDto } from "../../mapper/customerMapper";

export class CustomerViewProfileUseCase implements IViewEditProfileUseCase{
  private _userRepo: IUserRepository;

  constructor(userRepo: IUserRepository) {
    this._userRepo = userRepo;
  }

  async execute(userId: string): Promise<ICustomerViewProfileOutput> {
    const userData = await this._userRepo.findByUserId(userId);

    if (!userData) {
      throw new AppError(generalMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return toCustomerProfileDto(userData);
  }
}