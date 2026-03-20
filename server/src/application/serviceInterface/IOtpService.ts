
export interface IOtpService{
  setOtp(email:string,otp:string):Promise<void>;
  verifyOtp(email:string,otp:string):Promise<boolean>;
  resendOtp(email:string):Promise<boolean>
}