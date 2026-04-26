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

router.post("/register", validateUserInput, (req: Request, res: Response) => {
  registerController.handle(req, res);
});

router.post("/pre-signup", validateUserInput, (req: Request, res: Response) => {
  preSignupController.handle(req, res);
});

router.post("/google-login", googleLoginController.handle);
router.post("/verify-otp", (req: Request, res: Response) =>
  otpController.verifyOtp(req, res),
);
router.post("/send-otp", (req: Request, res: Response) =>
  otpController.sendOtp(req, res),
);
router.post("/resend-otp", (req: Request, res: Response) =>
  otpController.resendOtp(req, res),
);
router.post("/complete-signup", (req: Request, res: Response) =>
  completeSignupController.handle(req, res),
);

router.post("/login", (req: Request, res: Response) => {
  loginController.handle(req, res);
});
router.post("/logout", (req: Request, res: Response) =>
  logoutController.handle(req, res),
);
router.post("/refresh", (req: Request, res: Response) =>
  refreshTokenController.handle(req, res),
);

router.post("/forgotPassword", validateEmail, (req: Request, res: Response) => {
  resetPasswordController.forgotpassword(req, res);
});
router.patch(
  "/resetPassword",
  validatePassword,
  (req: Request, res: Response) =>
    resetPasswordController.resetPassword(req, res),
);

export default router;
