import z from "zod";

export const LoginSchema=z.object({
  identifier:z.string().min(1,{message:"email or username is required"}),
  password:z.string().min(1,{message:"Enter password to continue"})
})

export type LoginType=z.infer<typeof LoginSchema>