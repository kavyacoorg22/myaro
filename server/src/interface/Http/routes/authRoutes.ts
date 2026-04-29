import { Request, Response, Router } from "express";
import {
  validateEmail,
  validatePassword,
  validateUserInput,
} from "../middleware/validateUserInput";
import {
  completeSignupController,
  googleLoginController,
  loginController,
  logoutController,
  otpController,
  preSignupController,
  refreshTokenController,
  registerController,
  resetPasswordController,
} from "../../../infrastructure/config/di";
const router = Router();

router.post("/login", loginController.handle.bind(loginController));
router.post("/register", validateUserInput, registerController.handle.bind(registerController));
router.post("/pre-signup", validateUserInput, preSignupController.handle.bind(preSignupController));
router.post("/complete-signup", completeSignupController.handle.bind(completeSignupController));
router.post("/logout", logoutController.handle.bind(logoutController));
router.post("/refresh", refreshTokenController.handle.bind(refreshTokenController));
router.post("/forgotPassword", validateEmail, resetPasswordController.forgotpassword.bind(resetPasswordController));
router.patch("/resetPassword", validatePassword, resetPasswordController.resetPassword.bind(resetPasswordController));
router.post("/google-login", googleLoginController.handle.bind(googleLoginController));
router.post("/verify-otp", otpController.verifyOtp.bind(otpController));
router.post("/send-otp", otpController.sendOtp.bind(otpController));
router.post("/resend-otp", otpController.resendOtp.bind(otpController));
export default router;
