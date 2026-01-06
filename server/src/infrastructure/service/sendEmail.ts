
import nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { otpEmailTemplate } from "../../shared/emailTemplate";
import logger from "../../utils/logger";
import { ISendMailService } from '../../domain/serviceInterface/mailService';

export class NodemailerOtpService implements ISendMailService{
   
   
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
