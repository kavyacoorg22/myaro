import type { RouteObject } from "react-router";
import { publicFrontendRoutes } from "../constants/frontendRoutes/publicFrontendRoutes";
import PrivateRoute from "../components/routes/privateRoute";
import { UserRole } from "../constants/types/User";
import { customerFrontendRoutes } from "../constants/frontendRoutes/customerFrontendRoutes";
import { beauticianFrontendRoutes } from "../constants/frontendRoutes/beauticianFrontendRoutes";
import { lazy } from "react";

const ProfilePage = lazy(() => import("../features/user/pages/profile"));
const BeauticianRegistration = lazy(
  () => import("../features/user/pages/beauticianRegistration"),
);
const BeauticianAgreementScreen = lazy(
  () => import("../features/user/component/aggrement"),
);
const BeauticianProfileForm = lazy(
  () => import("../features/shared/profileService"),
);
const ServicePageList = lazy(
  () => import("../features/service/pages/serviceListPage"),
);
const ServiceLocationForm = lazy(
  () => import("../features/service/pages/locationPage"),
);
const ServicePageListForUser = lazy(
  () => import("../features/user/component/viewServicePage"),
);
const ChatList = lazy(() => import("../features/user/component/chat/chatList"));
const BeauticianBookingsPage=lazy(()=>import('../features/beautician/booking/beautcianBookingsPage'))
export const userRoutes: RouteObject[] = [
  {
    path: publicFrontendRoutes.profile,
    element: (
      <PrivateRoute allowedRoles={[UserRole.CUSTOMER, UserRole.BEAUTICIAN]}>
        <ProfilePage />
      </PrivateRoute>
    ),
  },
  {
    path: publicFrontendRoutes.profileByid,
    element: (
      <PrivateRoute allowedRoles={[UserRole.CUSTOMER, UserRole.BEAUTICIAN]}>
        <ProfilePage />
      </PrivateRoute>
    ),
  },
  {
    path: customerFrontendRoutes.register,
    element: (
      <PrivateRoute allowedRoles={[UserRole.CUSTOMER]}>
        <BeauticianRegistration />
      </PrivateRoute>
    ),
  },
  {
    path: beauticianFrontendRoutes.aggrement,
    element: (
      <PrivateRoute allowedRoles={[UserRole.BEAUTICIAN]}>
        <BeauticianAgreementScreen />
      </PrivateRoute>
    ),
  },

  {
    path: beauticianFrontendRoutes.editProfile,
    element: (
      <PrivateRoute allowedRoles={[UserRole.BEAUTICIAN, UserRole.CUSTOMER]}>
        <BeauticianProfileForm />
      </PrivateRoute>
    ),
  },
  {
    path: beauticianFrontendRoutes.serviceList,
    element: (
      <PrivateRoute allowedRoles={[UserRole.BEAUTICIAN]}>
        <ServicePageList />
      </PrivateRoute>
    ),
  },
  {
    path: beauticianFrontendRoutes.Location,
    element: (
      <PrivateRoute allowedRoles={[UserRole.BEAUTICIAN]}>
        <ServiceLocationForm />
      </PrivateRoute>
    ),
  },
  {
    path: publicFrontendRoutes.getServiceList,
    element: (
      <PrivateRoute allowedRoles={[UserRole.BEAUTICIAN, UserRole.CUSTOMER]}>
        <ServicePageListForUser />
      </PrivateRoute>
    ),
  },
  {
    path: publicFrontendRoutes.chat,
    element: (
      <PrivateRoute allowedRoles={[UserRole.BEAUTICIAN, UserRole.CUSTOMER]}>
        <ChatList />
      </PrivateRoute>
    ),
  },
  {
    path: publicFrontendRoutes.specificChat,
    element: (
      <PrivateRoute allowedRoles={[UserRole.BEAUTICIAN, UserRole.CUSTOMER]}>
        <ChatList />
      </PrivateRoute>
    ),
  },
  {
    path: beauticianFrontendRoutes.booking,
    element:(
      <PrivateRoute allowedRoles={[UserRole.BEAUTICIAN]}>
         <BeauticianBookingsPage/>
      </PrivateRoute>
    )
  },
];
