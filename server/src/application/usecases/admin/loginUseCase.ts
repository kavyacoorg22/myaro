import { IAdminRepository } from '../../../domain/repositoryInterface/IAdminRepository';
import { IAuthService } from '../../../domain/serviceInterface/IAuthService';
import { ITokenService } from '../../../domain/serviceInterface/ItokenService';
import { IAdminLoginResponse, IAdminLoginRequest } from '../../interfaceType/adminType';
import { IAdminLoginUseCase } from '../../interface/admin/auth/ILoginUseCase'
import { AppError } from '../../../domain/errors/appError';
import { authMessages } from '../../../shared/constant/message/authMessages';
import { HttpStatus } from '../../../shared/enum/httpStatus';
import { UserRole } from '../../../domain/enum/userEnum';

export class AdminLoginUseCase implements IAdminLoginUseCase {
    private _adminRepository: IAdminRepository;
    private _tokenService: ITokenService;
    private _authService: IAuthService;

    constructor(adminRepository: IAdminRepository, tokenService: ITokenService, authService: IAuthService) {
        this._adminRepository = adminRepository;
        this._tokenService = tokenService;
        this._authService = authService;
    }

    async execute(request: IAdminLoginRequest): Promise<IAdminLoginResponse> {
        const admin = await this._adminRepository.findByEmail(request.email);
        if (!admin) {
            throw new AppError(authMessages.ERROR.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
        }

        const isMatch = await this._authService.comparePassword(request.password, admin.passwordHash);
        if (!isMatch) {
            throw new AppError(authMessages.ERROR.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
        }

        const accessToken = this._tokenService.generateAccessToken(admin.id, UserRole.ADMIN, admin.email, true);
        const refreshToken = this._tokenService.generateRefreshToken(admin.id, UserRole.ADMIN, admin.email, true);
         const role=admin.role
        return {
            accessToken,
            refreshToken,
            role
        };
    }
}