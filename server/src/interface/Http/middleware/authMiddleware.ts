import { Request, Response, NextFunction, RequestHandler } from "express";
import { ITokenService } from "../../../application/serviceInterface/ItokenService";
import { HttpStatus } from "../../../shared/enum/httpStatus";
import { authMessages } from "../../../shared/constant/message/authMessages";
import { AppError } from "../../../domain/errors/appError";
import { UserRole } from "../../../domain/enum/userEnum";
import { ITokenBlacklistService } from "../../../application/serviceInterface/ITokenBlackListService";
import { generalMessages } from "../../../shared/constant/message/generalMessage";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      email: string;
      role: UserRole;
      isActive: boolean;
    };
  }
}

// ✅ Added type (only typing fix)
type AccessTokenPayload = {
  userId: string;
  email: string;
  role: UserRole;
  isActive: boolean;
};

export const authMiddleware =
  (
    jwtService: ITokenService,
    blacklistService: ITokenBlacklistService,
    allowedRoles: Array<"customer" | "beautician" | "admin">,
  ): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token =
        req.cookies.accessToken ||
        req.cookies.access_token ||
        req.cookies.token ||
        req.cookies.jwt;

      if (!token) {
        throw new AppError(
          authMessages.ERROR.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED,
        );
      }

      const tokenBlacklisted = await blacklistService.isTokenBlacklisted(token);
      if (tokenBlacklisted) {
        throw new AppError(
          authMessages.ERROR.INVALID_TOKEN,
          HttpStatus.UNAUTHORIZED,
        );
      }

      // ✅ FIXED (removed implicit any)
      let payload: AccessTokenPayload | null;

      try {
payload = jwtService.verifyAccessToken(token) as AccessTokenPayload;      } catch (jwtError: unknown) { // ✅ removed `any`
        if (
          typeof jwtError === "object" &&
          jwtError !== null &&
          "name" in jwtError
        ) {
          const errorName = (jwtError as { name?: string }).name;

          if (errorName === "TokenExpiredError") {
            throw new AppError(
              authMessages.ERROR.TOKEN_EXPIRED,
              HttpStatus.UNAUTHORIZED,
            );
          }

          if (errorName === "JsonWebTokenError") {
            throw new AppError(
              authMessages.ERROR.INVALID_TOKEN,
              HttpStatus.UNAUTHORIZED,
            );
          }

          if (errorName === "NotBeforeError") {
            throw new AppError(
              authMessages.ERROR.INVALID_TOKEN,
              HttpStatus.UNAUTHORIZED,
            );
          }
        }

        throw new AppError(
          authMessages.ERROR.INVALID_TOKEN,
          HttpStatus.UNAUTHORIZED,
        );
      }

      if (!payload || !payload.userId || !payload.email || !payload.role) {
        throw new AppError(
          authMessages.ERROR.INVALID_TOKEN,
          HttpStatus.UNAUTHORIZED,
        );
      }

      const userBlocked = await blacklistService.isUserBlocked(payload.userId);
      if (userBlocked) {
        throw new AppError(
          authMessages.ERROR.BLOCKED_USER,
          HttpStatus.FORBIDDEN,
        );
      }

      const userRole = payload.role as UserRole;

      if (!allowedRoles.includes(userRole)) {
        throw new AppError(authMessages.ERROR.FORBIDDEN, HttpStatus.FORBIDDEN);
      }

      if (payload.isActive === false) {
        throw new AppError(
          authMessages.ERROR.BLOCKED_USER,
          HttpStatus.FORBIDDEN,
        );
      }

      req.user = {
        id: payload.userId,
        email: payload.email,
        role: userRole,
        isActive: payload.isActive,
      };

      next();
    } catch (err: unknown) {
      if (err instanceof AppError) {
        return next(err);
      }
      return next(
        new AppError(
          generalMessages.ERROR.INTERNAL_SERVER_ERROR,
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  };

export const optionalAuthMiddleware =
  (
    jwtService: ITokenService,
    blacklistService: ITokenBlacklistService,
  ): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token =
        req.cookies.accessToken ||
        req.cookies.access_token ||
        req.cookies.token ||
        req.cookies.jwt;

      if (!token) return next();

      const tokenBlacklisted = await blacklistService.isTokenBlacklisted(token);
      if (tokenBlacklisted) return next();

      // ✅ FIXED (removed implicit any)
      let payload: AccessTokenPayload | null;

      try {
payload = jwtService.verifyAccessToken(token) as AccessTokenPayload;      } catch {
        return next();
      }

      if (!payload || !payload.userId || !payload.email || !payload.role) {
        return next();
      }

      const userBlocked = await blacklistService.isUserBlocked(payload.userId);
      if (userBlocked) return next();

      if (payload.isActive === false) return next();

      req.user = {
        id: payload.userId,
        email: payload.email,
        role: payload.role as UserRole,
        isActive: payload.isActive,
      };

      next();
    } catch (err) {
      next(err);
    }
  };