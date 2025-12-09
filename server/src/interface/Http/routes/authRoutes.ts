import { NextFunction, Request, Response, Router } from "express"
import { validateEmail, validatePassword, validateUserInput } from "../middleware/validateUserInput";
import { authenticateUser, completeSignupController, googleLoginController, loginController, logoutController, otpController, preSignupController, refreshTokenController, registerController, resetPasswordController } from "../../../infrastructure/config/di";
import { RefreshTokenController } from "../controllers/auth/refreshTokenController";
const router=Router()



router.post('/register',validateUserInput,(req:Request,res:Response)=>
{
  
  registerController.handle(req,res)
})

router.post("/pre-signup", validateUserInput,(req:Request, res:Response) => 
{
  preSignupController.handle(req, res)
});

router.post('/google-login', googleLoginController.handle);
router.post("/verify-otp", (req:Request, res:Response) => otpController.verifyOtp(req, res));
router.post("/send-otp", (req:Request, res:Response) => otpController.sendOtp(req, res));
router.post("/resend-otp", (req:Request, res:Response) => otpController.resendOtp(req, res));
router.post("/complete-signup", (req:Request, res:Response) => completeSignupController.handle(req, res));

router.post('/login',(req:Request,res:Response,next:NextFunction)=>
{
    console.log('📥 Login endpoint hit');
  console.log('Body:', req.body);
  console.log('Cookies:', req.cookies);
  loginController.handle(req,res,next)})
  
  ;
router.post('/logout',(req:Request,res:Response,next:NextFunction)=>logoutController.handle(req,res,next))
router.post('/refresh',(req:Request,res:Response,next:NextFunction)=>refreshTokenController.handle(req,res,next))

router.post('/forgotPassword',validateEmail,(req:Request,res:Response,next:NextFunction)=>{
  console.log(req.body)
  resetPasswordController.forgotpassword(req,res,next)
})
router.patch('/resetPassword',validatePassword,(req:Request,res:Response,next:NextFunction)=>
  resetPasswordController.resetPassword(req,res,next)
)


export default router