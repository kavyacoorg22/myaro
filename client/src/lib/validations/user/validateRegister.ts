import {z} from "zod"

export const registerSchema=z.object({
  email:z.email()
        .max(50,{message:"Email must be at most 50 character long"}),
 fullName:z.string().trim()
         .min(4,{message:"Full name must be atleast 4 character long"})
         .max(30,{message:"Full name must be at most 30 character long"}),
 userName:z.string().regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*_)[A-Za-z0-9_]+$/,{
        message:
          "Username must include a letter, number, and underscore.",
      }),
         
 password:z.string().min(8,{message:"password must contain at least 8 character"})
        .max(30,{message:"password must be at most 30 character"})
        .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).*$/,{message:"Password must include uppercase, lowercase, number, and symbol"}),
 confirmPassword:z.string()
})
.refine((data)=>data.password===data.confirmPassword,{
  message:"password do not match",
  path:['confirmPassword']
})

export type registerInput=z.infer<typeof registerSchema>