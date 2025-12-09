import { NextFunction, Request, Response } from "express";


export function valiadteAdminAuthInput(req:Request,res:Response,next:NextFunction)
{
  const {email,password}=req.body;
  if(!email||!password)
  {
    return res.status(400).json({error:"enter all fields"})
  }
    const regexEmail=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if(!regexEmail.test(email))
  {
   return res.status(400).json({error:"Please enter valid email"})
  }
  const regexPassword=/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
  if(!regexPassword.test(password))
  {
    return res.status(400).json({error:
      "Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special symbol"
    });
  }
  next()
}