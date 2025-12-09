import { IGoogleAuthService } from '../../domain/serviceInterface/IGoogleAuthService';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class GoogleAuthService implements IGoogleAuthService {
    async verifyToken(token: string) {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload) return undefined;

        return {
            email: payload.email,
            name: payload.name,
            picture: payload.picture,
            sub: payload.sub!, 
        };
    }
}
