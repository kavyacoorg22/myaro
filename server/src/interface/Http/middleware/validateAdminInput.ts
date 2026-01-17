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

export function ValidateAdminCategoryInput(req:Request,res:Response,next:NextFunction){
  const {name,description}=req.body;
  if(!name)
  {
    return res.status(400).json({error:"Enter name of the category"})
  }

  if(name.trim()===''|| (description && description.trim()===''))
  {
    return res.status(400).json({error: "Name or Description can't be empty or only spaces"})
  }
  
   const nameRegex = /^[A-Za-z\s]+$/;

  if (!nameRegex.test(name)) {
    return res.status(400).json({
      error: "Name must contain only characters (A-Z, a-z)",
    });
  }
 
  next()
}

export function ValidateCategoryUpdateInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, description } = req.body;

  if (!name && !description) {
    return res.status(400).json({
      error: "At least one field is required to update",
    });
  }

  if (name && typeof name !== "string") {
    return res.status(400).json({
      error: "Name must be a string",
    });
  }

  if (description && typeof description !== "string") {
    return res.status(400).json({
      error: "Description must be a string",
    });
  }

  if (name && name.trim() === "") {
    return res.status(400).json({
      error: "Name can't be empty or only spaces",
    });
  }

  if (description && description.trim() === "") {
    return res.status(400).json({
      error: "Description can't be empty or only spaces",
    });
  }

  const nameRegex = /^[A-Za-z\s]+$/;

  if (name && !nameRegex.test(name)) {
    return res.status(400).json({
      error: "Name must contain only characters (A-Z, a-z)",
    });
  }

  next();
}

export function ValidateAdminServiceInput(req:Request,res:Response,next:NextFunction){
  const {name}=req.body
   if (name && typeof name !== "string") {
    return res.status(400).json({
      error: "Name must be a string",
    });
  }
    const nameRegex = /^[A-Za-z\s]+$/;

  if (name && !nameRegex.test(name)) {
    return res.status(400).json({
      error: "Name must contain only characters (A-Z, a-z)",
    });
  }
 
  next()
}

