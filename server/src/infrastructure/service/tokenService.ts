import jwt from 'jsonwebtoken';
import { ITokenService } from '../../domain/serviceInterface/ItokenService';

export class JwtTokenService implements ITokenService {
    private _accessTokenSecret: string;
    private _refreshTokenSecret: string;

    constructor() {
        this._accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || '';
        this._refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || '';
    }

    generateAccessToken(userId: string, role: string, email: string, isActive: boolean): string {
        return jwt.sign({ userId, role, email, isActive }, this._accessTokenSecret, { expiresIn: '5m' });
    }

    generateRefreshToken(userId: string, role: string, email: string, isActive: boolean): string {
        return jwt.sign({ userId, role, email, isActive }, this._refreshTokenSecret, { expiresIn: '7d' });
    }

    verifyRefreshToken(token: string): { userId: string; role: string; email: string; isActive: boolean } | null {
        return jwt.verify(token, this._refreshTokenSecret) as {
            userId: string;
            role: string;
            email: string;
            isActive: boolean;
        };
    }

    verifyAccessToken(
        token: string,
    ): { userId: string; email: string; role: string; isActive: boolean; exp: number } | null {
        return jwt.verify(token, this._accessTokenSecret) as {
            userId: string;
            role: string;
            email: string;
            isActive: boolean;
            exp: number;
        };
    }

    
}