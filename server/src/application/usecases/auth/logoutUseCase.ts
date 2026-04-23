import { Request, Response } from "express";
import { ITokenBlacklistService } from "../../serviceInterface/ITokenBlackListService";
import { ITokenService } from "../../serviceInterface/ItokenService";
import { ILogoutUseCase } from "../../interface/auth/logoutUseCase";
import { appConfig } from "../../../infrastructure/config/config";

type TokenPayload = {
  exp?: number;
};

export class LogoutUseCase implements ILogoutUseCase {
  private _tokenBlacklistService: ITokenBlacklistService;
  private _tokenService: ITokenService;

  constructor(
    tokenBlacklistService: ITokenBlacklistService,
    jwtService: ITokenService,
  ) {
    this._tokenBlacklistService = tokenBlacklistService;
    this._tokenService = jwtService;
  }

  async execute(req: Request, res: Response): Promise<void> {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      this.clearRefreshCookie(res);
      return;
    }

    let payload: TokenPayload | null = null;

    try {
      payload = this._tokenService.verifyRefreshToken(
        refreshToken,
      ) as TokenPayload;
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "name" in error &&
        (error as { name?: string }).name === "TokenExpiredError"
      ) {
        payload = null;
      } else {
        payload = null;
      }
    }

    if (payload?.exp) {
      const ttl = payload.exp - Math.floor(Date.now() / 1000);

      if (ttl > 0) {
        await this._tokenBlacklistService.blacklistToken(refreshToken, ttl);
      }
    }

    this.clearRefreshCookie(res);
  }

  private clearRefreshCookie(res: Response) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: appConfig.server.nodeEnv === "production",
      sameSite: "strict",
    });
  }
}
