import { ITokenService } from '../../../domain/serviceInterface/ItokenService';
import { IAuthAccountRepository } from '../../../domain/repositoryInterface/IAuthAccountRepository';
import { AppError } from '../../../domain/errors/appError';
import { IRefreshTokenUseCase } from '../../interface/auth/IrefreshToken';
import { authMessages } from '../../../shared/constant/message/authMessages';
import { HttpStatus } from '../../../shared/enum/httpStatus';
import { userMessages } from '../../../shared/constant/message/userMessage';

export class RefreshTokenUseCase implements IRefreshTokenUseCase {
    private _tokenService: ITokenService;
    private _authAccountRepository: IAuthAccountRepository; 

    constructor(
        tokenService: ITokenService, 
        authAccountRepository: IAuthAccountRepository
    ) {
        this._tokenService = tokenService;
        this._authAccountRepository = authAccountRepository; 
    }

    async execute(refreshToken: string): Promise<{ 
        accessToken: string; 
        user: any 
    }> {
        const decoded = this._tokenService.verifyRefreshToken(refreshToken);
        
        if (!decoded) {
            throw new AppError(
                authMessages.ERROR.INVALID_REFRESH_TOKEN,
                HttpStatus.UNAUTHORIZED
            );
        }

        // ✅ ADD: Fetch current user from database
        const user = await this._authAccountRepository.findById(decoded.userId);
        
        if (!user) {
            throw new AppError(
                userMessages.ERROR.USER_NOT_FOUND,
                HttpStatus.NOT_FOUND
            );
        }

        if (!user.isActive) {
            throw new AppError(
                authMessages.ERROR.BLOCKED_USER,
                HttpStatus.FORBIDDEN
            );
        }

       
        const accessToken = this._tokenService.generateAccessToken(
            user.id,
            user.role, 
            user.email,
            user.isActive ?? true
        );

       
        return {
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                isActive: user.isActive ?? true,
                isAuthenticated: true,
            },
        };
    }
}