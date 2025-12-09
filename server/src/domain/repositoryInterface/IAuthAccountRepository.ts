import { UserRole } from '../enum/userEnum';

export interface IAuthAccountRepository {
    findById(
        id: string,
    ): Promise<{
        id: string;
        role: UserRole;
        email: string;
        isActive?: boolean;
    } | null>;
}