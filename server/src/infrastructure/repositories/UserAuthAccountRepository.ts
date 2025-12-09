import { IAuthAccountRepository } from '../../domain/repositoryInterface/IAuthAccountRepository';
import { UserRole } from '../../domain/enum/userEnum';
import { IUserRepository } from '../../domain/repositoryInterface/IUserRepository';
import { IAdminRepository } from '../../domain/repositoryInterface/IAdminRepository';

export class AuthAccountRepository implements IAuthAccountRepository {
    private _userRepo: IUserRepository;
    private _adminRepo: IAdminRepository;

    constructor(userRepo: IUserRepository, adminRepo: IAdminRepository) {
        this._userRepo = userRepo;
        this._adminRepo = adminRepo;
    }

    async findById(id: string): Promise<{
        id: string;
        role: UserRole;
        email: string;
        isActive?: boolean;
    } | null> {
        // Query both repositories in parallel for better performance
        const [user, admin] = await Promise.all([
            this._userRepo.findByUserId(id),
            this._adminRepo.findById(id)
        ]);

        const account = user || admin;

        if (!account) {
            return null;
        }

        return {
            id: account.id,
            role: account.role,
            email: account.email,
            isActive: account.isActive,
        };
    }
}