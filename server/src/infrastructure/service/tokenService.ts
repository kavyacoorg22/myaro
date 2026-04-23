import jwt, { SignOptions } from "jsonwebtoken";
import { ITokenService } from "../../application/serviceInterface/ItokenService";
import { appConfig } from "../config/config";

type TokenPayload = {
  userId: string;
  role: string;
  email: string;
  isActive: boolean;
};

type AccessTokenPayload = TokenPayload & {
  exp: number;
};

export class JwtTokenService implements ITokenService {
  private _accessTokenSecret: string;
  private _refreshTokenSecret: string;

  constructor() {
    this._accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "";
    this._refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "";
  }

  generateAccessToken(
    userId: string,
    role: string,
    email: string,
    isActive: boolean,
  ): string {
    const options: SignOptions = {
      expiresIn: appConfig.jwt.accessTokenExpireTime * 60,
    };

    return jwt.sign(
      { userId, role, email, isActive },
      this._accessTokenSecret,
      options
    );
  }

  generateRefreshToken(
    userId: string,
    role: string,
    email: string,
    isActive: boolean,
  ): string {
    const options: SignOptions = {
      expiresIn: Number(appConfig.jwt.refreshTokenExpireTime) * 24 * 60 * 60,
    };

    return jwt.sign(
      { userId, role, email, isActive },
      this._refreshTokenSecret,
      options
    );
  }

  verifyRefreshToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, this._refreshTokenSecret) as TokenPayload;
    } catch {
      return null;
    }
  }

  verifyAccessToken(token: string): AccessTokenPayload | null {
    try {
      return jwt.verify(token, this._accessTokenSecret) as AccessTokenPayload;
    } catch {
      return null;
    }
  }
}