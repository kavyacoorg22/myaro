import { Request, Response } from "express";
import { ITokenBlacklistService } from "../../../domain/serviceInterface/ITokenBlackListService";
import { ITokenService } from "../../../domain/serviceInterface/ItokenService";
import { ILogoutUseCase } from "../../interface/auth/logoutUseCase";

import { appConfig } from "../../../infrastructure/config/config";


export class LogoutUseCase implements ILogoutUseCase{
      private _tokenBlacklistService: ITokenBlacklistService;
    private _tokenService: ITokenService;

    constructor(tokenBlacklistService: ITokenBlacklistService, jwtService: ITokenService) {
        this._tokenBlacklistService = tokenBlacklistService;
        this._tokenService = jwtService;
    }
  async execute(req: Request, res: Response): Promise<void> {
        const refreshToken = req.cookies.refreshToken;
        
        if (!refreshToken) {
            
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: appConfig.server.nodeEnv === 'production',
                sameSite: 'strict',
            });
            return;
        }
  
        let payload: any;

        try {
            payload = this._tokenService.verifyAccessToken(refreshToken);
        } catch (error:any) {
            if (error.name === 'TokenExpiredError') {
                
                payload = null;
            } else {
               payload=null;
            }
        }

        
        if (payload && payload.exp) {
            const ttl = payload.exp - Math.floor(Date.now() / 1000);
            if (ttl > 0) {
                await this._tokenBlacklistService.blacklistToken(refreshToken, ttl);
            }
        }

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: appConfig.server.nodeEnv === 'production',
            sameSite: 'strict',
        });
    
}
}