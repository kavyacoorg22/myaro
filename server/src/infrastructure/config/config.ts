import dotenv from 'dotenv';
dotenv.config();

function required(name: string, value?: string): string {
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

export const appConfig = {
    server: {
        port: Number(process.env.PORT) || 4323,
        nodeEnv: process.env.NODE_ENV || 'development',
        frontendUrl: required('FRONTEND_URL', process.env.FRONTEND_URL),
    },

    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    },

    jwt: {
        accessTokenSecret: required(
            'ACCESS_TOKEN_SECRET',
            process.env.ACCESS_TOKEN_SECRET,
        ),
        refreshTokenSecret: required(
            'REFRESH_TOKEN_SECRET',
            process.env.REFRESH_TOKEN_SECRET,
        ),
        signupTokenSecret: required(
            'SIGNUP_TOKEN_SECRET',
            process.env.JWT_SECRET,
        ),
        accessTokenExpireTime:required(
            'ACCESS_TOKEN_EXPIRETIME',
       process.env.ACCESS_TOKEN_EXPIRETIME
        ) as string,
         refreshTokenExpireTime:required(
            'REFRESH_TOKEN_EXPIRETIME',
       process.env.REFRESH_TOKEN_EXPIRETIME
        ) as string
    },

    db: {
        url: required('MONGODB_URI', process.env.MONGO_URI),
    },

    redis: {
        redisHost: process.env.REDIS_HOST,
        redisPort: Number(process.env.REDIS_PORT),
        redisPassword: process.env.REDIS_PASSWORD,
    },

    nodemailer: {
        emailHost: required('SMTP_HOST', process.env.SMTP_HOST),
        emailPort: Number(process.env.EMAIL_PORT) || 587,
        emailUser: required('SMTP_USER', process.env.SMTP_USER),
        emailPassword: required('SMTP_PASS', process.env.SMTP_PASS),
    },

    cloudinary: {
        cloudName: required(
            'CLOUDINARY_CLOUD_NAME',
            process.env.CLOUDINARY_CLOUD_NAME,
        ),
        apiKey: required('CLOUDINARY_API_KEY', process.env.CLOUDINARY_API_KEY),
        apiSecret: required(
            'CLOUDINARY_API_SECRET',
            process.env.CLOUDINARY_API_SECRET,
        ),
    },

    google: {
        clientId: required('GOOGLE_CLIENT_ID', process.env.GOOGLE_CLIENT_ID),
    },

 
};