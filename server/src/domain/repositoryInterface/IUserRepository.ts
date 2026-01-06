import { User } from "../entities/User";
import { SortFilter } from "../enum/sortFilterEnum";
import { UserRole, UserRoleFilter } from "../enum/userEnum";


export interface CreateUserDTO{
   email:string,
   fullName:string,
   userName:string,
   passwordHash?:string,
   role:UserRole,
   profileImg?:string,
   isVerified?:boolean
   isActive:boolean
}


export interface IUserRepository{
   create(dto: Omit<User, 'id' | 'createdAt' | 'updatedAt'|'isVerified'>):Promise<User>
   findByEmail(email:string):Promise<User|null>
   findByUserName(userName:string):Promise<User|null>
   findByUserId(id:string):Promise<User|null>
   updatePassword(email: string, newPassword: string): Promise<User|null>
    findAll(params: {
        search?: string;
        sort?: SortFilter;
        role?: UserRoleFilter;
        skip: number;
        limit: number
    }): Promise<User[]>
     countAll(params?: {
        search?: string;
        role?: UserRoleFilter;
    }): Promise<number>
     isUserBlocked(userId: string): Promise<boolean>
   updateStatus(id: string,isActive: boolean): Promise<User|null>
   updateRoleAndVerification(userId: string, role: UserRole, isVerified: boolean): Promise<User | null>;
    updateByUserId(id: string, data: Partial<User>): Promise<boolean>
   updateProfileImageById(id:string,profileImg:string):Promise<User|null> 
    update(id: string, data: Partial<User>): Promise<User | null>;
    searchBeauticians(query: string): Promise<User[]>;
    getBeauticiansById(id:string[]):Promise<User[]>;
    findUsersByIds(id:string[]):Promise<User[]>
}

