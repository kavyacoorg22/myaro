import z from "zod";

export const ForgotPasswordSchema=z.object({
  email:z.email()
})

export type ForgotPasswordInput=z.infer<typeof ForgotPasswordSchema>

export const ResetPasswordSchema=z.object({
password:z.string().min(8,{message:"password must contain at least 8 character"})
        .max(30,{message:"password must be at most 30 character"})
        .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).*$/,{message:"Password must include uppercase, lowercase, number, and symbol"}),
 confirmPassword:z.string()
}).refine((data)=>data.password===data.confirmPassword,{
  message:"password do not match",
  path:['confirmPassword']
})

export type ResetPasswordInput=z.infer<typeof ResetPasswordSchema>