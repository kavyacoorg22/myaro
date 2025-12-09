import { IUserRepository } from "../../domain/repositoryInterface/IUserRepository";

import nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { otpEmailTemplate } from "../../shared/emailTemplate";
import { IOtpRepository } from "../../domain/repositoryInterface/IOtpRepository";
import logger from "../../utils/logger";
import { IOtpService } from "../../domain/serviceInterface/mailService";

export class NodemailerOtpService implements IOtpService{
   private _otpRepo:IOtpRepository

   constructor(otpRepo:IOtpRepository)
   {
    this._otpRepo=otpRepo
   }
   
    private _transporter=nodemailer.createTransport({
     host:process.env.SMTP_HOST,
     port:process.env.SMTP_PORT,
     secure:false,
     auth:{
       user:process.env.SMTP_USER,
       pass:process.env.SMTP_PASS
     },
       tls: {
       rejectUnauthorized: false 
     }
   }as SMTPTransport.Options)

   async sendOtp(email: string,otp:string): Promise<void> {
   try{
    
    
    await this._transporter.sendMail({
      from:process.env.SMTP_USER,
      to:email,
      subject:"Here’s Your account verification OTP",
      html:otpEmailTemplate(otp)
   })

   }catch(err)
   {
     logger.error(`Error occurred while sending OTP to ${email}`, err);

   }
}


}
