export interface ISendMailService {
    sendOtp(email: string, otp: string): Promise<void>
}