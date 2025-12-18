import { NextFunction ,Request,Response} from "express";
import { OwnProfileUseCase } from "../../../../application/usecases/public/ownProfileUseCase";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { userMessages } from "../../../../shared/constant/message/userMessage";
import { AppError } from "../../../../domain/errors/appError";
import { generalMessages } from "../../../../shared/constant/message/generalMessage";
import { authMessages } from "../../../../shared/constant/message/authMessages";
import { ProfileImageChangeUseCase } from "../../../../application/usecases/public/profileImageChangeUseCase";




export class ProfileController{
  private _ownProfileUC:OwnProfileUseCase
  private _profileImageChangeUC:ProfileImageChangeUseCase
  constructor(ownProfileUC:OwnProfileUseCase,profileImageChange:ProfileImageChangeUseCase)
  {
    this._ownProfileUC=ownProfileUC
    this._profileImageChangeUC=profileImageChange
  }


  ownProfile=async(req:Request, res: Response, next: NextFunction): Promise<void> => {
        try {
          console.log('request reached')
            const id=req.params.id||req.user?.id
             if (!id) {
             throw new Error('User ID is required');
           }
           const user=await this._ownProfileUC.execute(id);
          console.log(`user ${user}`)
         res.status(HttpStatus.OK).json({
          success: true,
          message: userMessages.SUCCESS.PROFILE_FETCHED,
         data: user
        });
        } catch (error) {
            next(error);
        }
    }

changeProfileImage=async(req:Request, res: Response, next: NextFunction): Promise<void>=>{
  try{
    const id=req.user?.id
    const profileImg=req.file
    if(!id)
    {
      throw new AppError(authMessages.ERROR.UNAUTHORIZED,HttpStatus.UNAUTHORIZED)
    }

    if(!profileImg)
    {
      throw new AppError(generalMessages.ERROR.BAD_REQUEST,HttpStatus.BAD_REQUEST)
    }
   
    const user=await this._profileImageChangeUC.execute(id,profileImg)

    res.status(HttpStatus.OK).json({
      success:true,
      message:generalMessages.SUCCESS.OPERATION_SUCCESS,
      data:user.profileImg
    })
  }catch(err)
  {
     next(err)
  }
}

  
}
