import { Request, Response, NextFunction } from "express";


export function validateUserInput(req:Request,res:Response,next:NextFunction)
{
  const {email,userName,fullName,password,confirmPassword}=req.body

  if(!email||!userName||!fullName||!password||!confirmPassword)
  {
    return res.status(400).json({error:"Please enter all the fields"})
  }

  const regexEmail=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if(!regexEmail.test(email))
  {
   return res.status(400).json({error:"Please enter valid email"})
  }

  const regexUserName=/^(?=.*[A-Za-z])(?=.*\d)(?=.*_)[A-Za-z0-9_]+$/

  if(!regexUserName.test(userName) )
  {
    return res.status(400).json({error: "Username must include a letter, number, and underscore." })
  }

  if(userName.length<6|| userName.length>40)
  {
     return res.status(400).json({error:"Username must be between 6 and 40 characters"  })
  }
  
  if(typeof fullName!=="string")
  {
    return res.status(400).json({error:"full name must contain characters (a-zA-Z)"})
  }
  if(fullName.trim().length===0)
  {
    return res.status(400).json({error:"full name can't be Empty or Whitespace "})
  }

  if(fullName.length>20)
  {
    return res.status(400).json({error:"full name should not exceed 20 characters"})
  }
  const regexPassword=/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
  if(!regexPassword.test(password))
  {
    return res.status(400).json({error:
      "Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special symbol"
    });
  }

  if(password!==confirmPassword)
  {
    return res.status(400).json({error:"password do not match"})
  }

  next()
}


export function validateEmail(req:Request,res:Response,next:NextFunction)
{
  const {email}=req.body
  console.log(email)
  
  const regexEmail=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if(!email)
  {
     return res.status(400).json({error:"Please enter required field"})
  }
   if(!regexEmail.test(email))
   {
    return res.status(400).json({error:"Please enter valid email"})
   }
   next()
}

export function validatePassword(req:Request,res:Response,next:NextFunction){

   const {password,confirmPassword}=req.body
    const regexPassword=/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
  if(!regexPassword.test(password))
  {
    return res.status(400).json({error:
      "Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special symbol"
    });
  }

  if(password!==confirmPassword)
  {
    return res.status(400).json({error:"password do not match"})
  }
  next()
}




