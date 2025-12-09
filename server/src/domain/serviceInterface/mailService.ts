export interface IOtpService {
    sendOtp(email: string, otp: string): Promise<void>
}