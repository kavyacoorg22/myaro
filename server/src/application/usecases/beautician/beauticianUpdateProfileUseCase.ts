import {
  BankDetailsVO,
  Beautician,
  ShopAddressVO,
} from "../../../domain/entities/Beautician";
import { User } from "../../../domain/entities/User";
import { ServiceModes } from "../../../domain/enum/beauticianEnum";
import { AppError } from "../../../domain/errors/appError";
import { IBeauticianRepository } from "../../../domain/repositoryInterface/IBeauticianRepository";
import { IUserRepository } from "../../../domain/repositoryInterface/IUserRepository";
import { beauticianMessages } from "../../../shared/constant/message/beauticianMessage";
import { HttpStatus } from "../../../shared/enum/httpStatus";
import { IBeauticianEditProfileUseCase } from "../../interface/beautician/IBeauticianEditProfileUseCase";
import { IResponse } from "../../interfaceType/authtypes";
import { IBeauticianEditProfileInput } from "../../interfaceType/beauticianType";

type UserUpdateDto = Partial<Pick<User, "userName" | "fullName">>;
type BeauticianUpdateDto = Partial<
  Omit<Beautician, "id" | "createdAt" | "updatedAt" | "homeserviceCount">
>;

export class BeauticianEditProfileUseCase implements IBeauticianEditProfileUseCase {
  constructor(
    private _beauticianRepo: IBeauticianRepository,
    private _userRepo: IUserRepository,
  ) {}

  async execute(
    userId: string,
    data: IBeauticianEditProfileInput,
  ): Promise<IResponse> {
    const existing = await this._beauticianRepo.findByUserId(userId);
    if (!existing) {
      throw new AppError(
        beauticianMessages.ERROR.BEAUTICIAN_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    const userUpdate: UserUpdateDto = {};
    if (data.userName !== undefined) userUpdate.userName = data.userName;
    if (data.fullName !== undefined) userUpdate.fullName = data.fullName;

    const beauticianUpdate: BeauticianUpdateDto = {};
    if (data.about !== undefined) beauticianUpdate.about = data.about;
    if (data.shopName !== undefined) beauticianUpdate.shopName = data.shopName;
    if (data.shopAddress !== undefined) {
      const existingAddress = existing.shopAddress || {};
      beauticianUpdate.shopAddress = {
        ...existingAddress,
        ...data.shopAddress,
      } as ShopAddressVO;
    }

    if (data.yearsOfExperience !== undefined) {
      beauticianUpdate.yearsOfExperience = Number(data.yearsOfExperience);
    }

    if (data.serviceModes !== undefined) {
      if (!Array.isArray(data.serviceModes)) {
        throw new AppError(
          beauticianMessages.ERROR.INVALID_SERVICE_MODE_ARRAY,
          HttpStatus.BAD_REQUEST,
        );
      }
      const validModes = Object.values(ServiceModes);

      const isValid = data.serviceModes.every((mode) =>
        validModes.includes(mode),
      );

      if (!isValid) {
        throw new AppError(
          beauticianMessages.ERROR.INVALID_SERVICE_MODE,
          HttpStatus.BAD_REQUEST,
        );
      }
      if (
        data.serviceModes?.includes(ServiceModes.SHOP) &&
        !data.shopName &&
        !existing.shopName
      ) {
        throw new AppError(
          beauticianMessages.ERROR.SHOP_NAME_REQUIRED,
          HttpStatus.BAD_REQUEST,
        );
      }

      beauticianUpdate.serviceModes = data.serviceModes;
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
        accountHolderName:
          data.accountHolderName ?? existingBank.accountHolderName ?? "",
        accountNumber: data.accountNumber ?? existingBank.accountNumber ?? "",
        ifscCode: data.ifscCode
          ? data.ifscCode.trim().toUpperCase()
          : (existingBank.ifscCode ?? ""),
        bankName: data.bankName ?? existingBank.bankName ?? "",
        upiId: data.upiId ?? existingBank.upiId ?? "",
      };
    }

    if (Object.keys(userUpdate).length > 0) {
      await this._userRepo.updateByUserId(userId, userUpdate);
    }

    if (Object.keys(beauticianUpdate).length > 0) {
      await this._beauticianRepo.updateByUserId(userId, beauticianUpdate);
    }

    return {
      success: true,
      message: beauticianMessages.SUCCESS.PROFILE_UPDATED,
    };
  }
}
