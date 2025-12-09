import jwt from 'jsonwebtoken';
import { ConflictError } from '../../../domain/errors/systemError';
import { IUserRepository } from '../../../domain/repositoryInterface/IUserRepository';

export interface PreSignupInput{
  email:string,
  fullName:string,
  userName:string,
  password:string,
  confirmPassword:string
}

export interface PreSignupOutput{
  signupToken:string
}


export class PreSignupUseCase
{
  constructor(private jwtSecret:string,private jwtExpire:"10m",private userRepo:IUserRepository){}

  async execute(input:PreSignupInput):Promise<PreSignupOutput> {
   
    const {email,userName,fullName,password}=input
   
       const existingByEmail=await this.userRepo.findByEmail(input.email)
        if(existingByEmail)
        {
          throw new ConflictError("Email alredy registered")
        }
    
        const existByUserName=await this.userRepo.findByUserName(input.userName)
        if(existByUserName)
        {
          throw new ConflictError("User Name already taken")
        }
    const signupToken=jwt.sign({email,userName,fullName,password},this.jwtSecret,{expiresIn:this.jwtExpire})

    return {signupToken}
  }
}