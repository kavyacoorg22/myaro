import type { RouteObject } from "react-router";
import { publicFrontendRoutes } from "../constants/frontendRoutes/publicFrontendRoutes";
import { Landing } from "../features/user/pages/landing";
import { RegistrationPage } from "../features/auth/pages/registrationPage";
import PublicRoute from "../components/routes/publicRoute";
import { LoginPage } from "../features/auth/pages/loginPage";
import OtpForm from "../features/auth/components/otpform";
import { ForgotPasswordPage } from "../features/auth/pages/forgotPasswordPage";
import { ResetPasswordPage } from "../features/auth/pages/resetPasswordPage";
import { adminFrontendRoute } from "../constants/frontendRoutes/adminFrontenRoutes";



export const publicRoutes:RouteObject[]=[
  {
    path:publicFrontendRoutes.landing,
    element:<Landing/>
  },
  {
    path:publicFrontendRoutes.register,
    element:(
      <PublicRoute>
       <RegistrationPage/>
      </PublicRoute>
    )
  },
   {
    path:publicFrontendRoutes.login,
    element:(
      <PublicRoute>
       <LoginPage/>
      </PublicRoute>
    )
  },{
    path:publicFrontendRoutes.verifyOtp,
    element:(
      <PublicRoute>
        <OtpForm/>
      </PublicRoute>
    )
  },
  {
    path:publicFrontendRoutes.forgetPassword,
    element:(
      <PublicRoute>
        <ForgotPasswordPage/>
      </PublicRoute>
    )
  },
   {
    path:publicFrontendRoutes.resetPassword,
    element:(
      <PublicRoute>
        <ResetPasswordPage/>
      </PublicRoute>
    )
  },
  {
     path:adminFrontendRoute.login,
    element:(
      <PublicRoute>
    <LoginPage/>
    </PublicRoute>
  )
  }
]