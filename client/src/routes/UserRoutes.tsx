import type { RouteObject } from "react-router";
import { publicFrontendRoutes } from "../constants/frontendRoutes/publicFrontendRoutes";
import { ProfilePage } from "../features/user/pages/profile";
import PrivateRoute from "../components/routes/privateRoute";
import { UserRole } from "../constants/types/User";
import { customerFrontendRoutes } from "../constants/frontendRoutes/customerFrontendRoutes";
import BeauticianRegistration from "../features/user/pages/beauticianRegistration";
import { beauticianFrontendRoutes } from "../constants/frontendRoutes/beauticianFrontendRoutes";
import { BeauticianAgreementScreen } from "../features/user/component/aggrement";
import BeauticianProfileForm from "../features/beautician/pages/editProfile"



export const userRoutes:RouteObject[]=[
  {
    path:publicFrontendRoutes.profile,
    element:(
      <PrivateRoute allowedRoles={[UserRole.CUSTOMER,UserRole.BEAUTICIAN]}>
    <ProfilePage/>
    </PrivateRoute>
  )
  },
  {
    path:publicFrontendRoutes.profileByid,
    element:(
      <PrivateRoute allowedRoles={[UserRole.CUSTOMER,UserRole.BEAUTICIAN]}>
    <ProfilePage/>
    </PrivateRoute>
  )
  },
  {
    path:customerFrontendRoutes.register,
    element:(
      <PrivateRoute allowedRoles={[UserRole.CUSTOMER]}>
        <BeauticianRegistration/>
      </PrivateRoute>
    )
  },
  {
    path:beauticianFrontendRoutes.aggrement,
      element:(
      <PrivateRoute allowedRoles={[UserRole.BEAUTICIAN]}>
        <BeauticianAgreementScreen />
      </PrivateRoute>
    )
  },

  {
     path:beauticianFrontendRoutes.editProfile,
      element:(
      <PrivateRoute allowedRoles={[UserRole.BEAUTICIAN]}>
        <BeauticianProfileForm />
      </PrivateRoute>
    )
  }
  
  
]