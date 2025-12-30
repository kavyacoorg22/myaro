import crypto from 'crypto'
import redisClient from '../redis/redisClient';
import { IOtpService } from '../../domain/serviceInterface/IOtpService';

export class OtpService implements IOtpService {
  private otpTtl=60;
  private maxAttempts=5;
  private maxResends=3;
  private resendWindow=600

  private hashOtp(otp:string):string{
   return crypto.createHash('sha256').update(otp).digest('hex')
  }

  async setOtp(email:string,otp:string):Promise<void>{
   const otphash=this.hashOtp(otp)

   await redisClient.setEx(`otp:${email}`,this.otpTtl,otphash)
   await redisClient.setEx(`otp_attempts:${email}`,this.otpTtl,'0')
  }

  async verifyOtp(email:string,otp:string):Promise<boolean>{
   const otpKey=`otp:${email}`;
   const attemptsKey=`otp_attempts:${email}`

   const storedHash=await redisClient.get(otpKey)
   if(!storedHash)return false

   const attempts=Number(await redisClient.get(attemptsKey))||0
   if(attempts>=this.maxAttempts) return false

   const isValid=storedHash===this.hashOtp(otp)
   if(!isValid)
   {
    await redisClient.incr(attemptsKey)
    return false
   }


   await redisClient.del([otpKey,attemptsKey])
   return true

  }

   async resendOtp(email: string): Promise<boolean> {
    const resendKey = `otp_resend:${email}`;

    const resendCount = Number(await redisClient.get(resendKey)) || 0;
    if (resendCount >= this.maxResends) return false;

    await redisClient.incr(resendKey);
    await redisClient.expire(resendKey, this.resendWindow);

    return true;
  }

}