export interface IRefreshTokenUseCase {
    execute(refreshToken: string): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            role: string;
            isActive: boolean;
            isAuthenticated: boolean;
        };
    }>;
}