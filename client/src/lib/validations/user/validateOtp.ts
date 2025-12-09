import z from "zod";

const otpSchema = z.object({
  otp: z
    .string()
    .length(4, 'Please enter all 4 digits')
    .regex(/^\d{4}$/, 'OTP must contain only numbers'),
});

export type OtpFormData=z.infer<typeof otpSchema>