import { AppError } from "../../../../domain/errors/appError";
import { IToggleActiveStatusRepository } from "../../../../domain/repositoryInterface/IToggleActiveRepository";
import { IUserRepository } from "../../../../domain/repositoryInterface/IUserRepository";
import { ITokenBlacklistService } from "../../../../domain/serviceInterface/ITokenBlackListService";
import { appConfig } from "../../../../infrastructure/config/config";
import { userMessages } from "../../../../shared/constant/message/userMessage";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { IToggleUserStatusUseCase } from "../../../interface/admin/management/ItoggleUserUseCase";

export class ToggleUserStatusUseCase implements IToggleUserStatusUseCase {
  private _userRepo: IUserRepository;
  private _tokenBlacklistService: ITokenBlacklistService;
  private _repository:IToggleActiveStatusRepository

  constructor(
    userRepo: IUserRepository,
    tokenBlacklistService: ITokenBlacklistService,
    repository:IToggleActiveStatusRepository
  ) {
    this._userRepo = userRepo;
    this._tokenBlacklistService = tokenBlacklistService;
    this._repository=repository
  }

  async execute(userId: string, status: "active" | "inactive"): Promise<void> {
    const user = await this._userRepo.findByUserId(userId);
    if (!user)
      throw new AppError(userMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);

    const isActive = status === "active";
    await this._repository.toggleActive(userId, isActive);

    if (!isActive) {
      const ttl = Number(appConfig.jwt.accessTokenExpireTime) * 60;
      await this._tokenBlacklistService.blackListUser(userId, ttl);
    } else {
      await this._tokenBlacklistService.removeBlockedUser(userId);
    }
  }
}
