import { UserRole } from "../../../domain/enum/userEnum";

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