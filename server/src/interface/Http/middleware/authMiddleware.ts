import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ITokenService } from '../../../domain/serviceInterface/ItokenService';
import { HttpStatus } from '../../../shared/enum/httpStatus';
import { authMessages } from '../../../shared/constant/message/authMessages';
import { AppError } from '../../../domain/errors/appError';
import { UserRole } from '../../../domain/enum/userEnum';
import { ITokenBlacklistService } from '../../../domain/serviceInterface/ITokenBlackListService';
import { generalMessages } from '../../../shared/constant/message/generalMessage';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      email: string;
      role: UserRole;
      isActive: boolean;
    };
  }
}

export const authMiddleware = (
    jwtService: ITokenService,
    blacklistService: ITokenBlacklistService,
    allowedRoles: Array<'customer' | 'beautician' | 'admin'>,
): RequestHandler => async(req: Request, res: Response, next: NextFunction) => {
    try {
     
         const token = 
            req.cookies.accessToken || 
            req.cookies.access_token ||
            req.cookies.token ||
            req.cookies.jwt;
        
       
        if (!token) {
            throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
        }

        const tokenBlacklisted = await blacklistService.isTokenBlacklisted(token);
        if (tokenBlacklisted) {
            throw new AppError(authMessages.ERROR.INVALID_TOKEN, HttpStatus.UNAUTHORIZED);
        }

        
        let payload;
        try {
            payload = jwtService.verifyAccessToken(token);
        } catch (jwtError: any) {
            if (jwtError.name === 'TokenExpiredError') {
                throw new AppError(authMessages.ERROR.TOKEN_EXPIRED, HttpStatus.UNAUTHORIZED);
            }
            if (jwtError.name === 'JsonWebTokenError') {
                throw new AppError(authMessages.ERROR.INVALID_TOKEN, HttpStatus.UNAUTHORIZED);
            }
            if (jwtError.name === 'NotBeforeError') {
                throw new AppError(authMessages.ERROR.INVALID_TOKEN, HttpStatus.UNAUTHORIZED);
            }
            
            throw new AppError(authMessages.ERROR.INVALID_TOKEN, HttpStatus.UNAUTHORIZED);
        }

        if (!payload || !payload.userId || !payload.email || !payload.role) {
            throw new AppError(authMessages.ERROR.INVALID_TOKEN, HttpStatus.UNAUTHORIZED);
        }

        // ✅ Check if user is blocked
        const userBlocked = await blacklistService.isUserBlocked(payload.userId);
        if (userBlocked) {
            throw new AppError(authMessages.ERROR.BLOCKED_USER, HttpStatus.FORBIDDEN);
        }

        const userRole = payload.role as UserRole;

        // ✅ Check role permissions
        if (!allowedRoles.includes(userRole)) {
            throw new AppError(authMessages.ERROR.FORBIDDEN, HttpStatus.FORBIDDEN);
        }

        // ✅ Check if account is active
        if (payload.isActive === false) {
            throw new AppError(authMessages.ERROR.BLOCKED_USER, HttpStatus.FORBIDDEN);
        }

        // ✅ Set user in request
        req.user = {
            id: payload.userId,
            email: payload.email,
            role: userRole,
            isActive: payload.isActive,
        };

        console.log('✅ Auth successful, user:', req.user.id);
        console.log('request reached');
        console.log('user', req.user);
        
        next();
        
    } catch (err: unknown) {
        // ✅ Pass AppError to error handler
        if (err instanceof AppError) {
            return next(err);
        }
        
        // ✅ Convert unknown errors to AppError
        console.log('💥 Unexpected error in auth middleware:', err);
        return next(new AppError(generalMessages.ERROR.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR));
    }
};