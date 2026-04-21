import type { RouteObject } from "react-router";
import { publicFrontendRoutes } from "../constants/frontendRoutes/publicFrontendRoutes";
import PrivateRoute from "../components/routes/privateRoute";
import { UserRole } from "../constants/types/User";
import { customerFrontendRoutes } from "../constants/frontendRoutes/customerFrontendRoutes";
import { beauticianFrontendRoutes } from "../constants/frontendRoutes/beauticianFrontendRoutes";
import { lazy } from "react";
// import WalletCard from "../features/wallet/walletCard";

const CUSTOMER_ONLY      = [UserRole.CUSTOMER];
const BEAUTICIAN_ONLY    = [UserRole.BEAUTICIAN];
const CUSTOMER_BEAUTICIAN = [UserRole.CUSTOMER, UserRole.BEAUTICIAN];


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
const BookingsPage=lazy(()=>import('../features/beautician/booking/beautcianBookingsPage'))
const WalletCard=lazy(()=>import('../features/wallet/walletCard'))
export const userRoutes: RouteObject[] = [
  {
    path: publicFrontendRoutes.profile,
    element: (
      <PrivateRoute allowedRoles={CUSTOMER_BEAUTICIAN}>
        <ProfilePage />
      </PrivateRoute>
    ),
  },
  {
    path: publicFrontendRoutes.profileByid,
    element: (
      <PrivateRoute allowedRoles={CUSTOMER_BEAUTICIAN}>
        <ProfilePage />
      </PrivateRoute>
    ),
  },
  {
    path: customerFrontendRoutes.register,
    element: (
      <PrivateRoute allowedRoles={CUSTOMER_ONLY}>
        <BeauticianRegistration />
      </PrivateRoute>
    ),
  },
  {
    path: beauticianFrontendRoutes.aggrement,
    element: (
      <PrivateRoute allowedRoles={BEAUTICIAN_ONLY}>
        <BeauticianAgreementScreen />
      </PrivateRoute>
    ),
  },

  {
    path: beauticianFrontendRoutes.editProfile,
    element: (
      <PrivateRoute allowedRoles={CUSTOMER_BEAUTICIAN}>
        <BeauticianProfileForm />
      </PrivateRoute>
    ),
  },
  {
    path: beauticianFrontendRoutes.serviceList,
    element: (
      <PrivateRoute allowedRoles={BEAUTICIAN_ONLY}>
        <ServicePageList />
      </PrivateRoute>
    ),
  },
  {
    path: beauticianFrontendRoutes.Location,
    element: (
      <PrivateRoute allowedRoles={BEAUTICIAN_ONLY}>
        <ServiceLocationForm />
      </PrivateRoute>
    ),
  },
  {
    path: publicFrontendRoutes.getServiceList,
    element: (
      <PrivateRoute allowedRoles={CUSTOMER_BEAUTICIAN}>
        <ServicePageListForUser />
      </PrivateRoute>
    ),
  },
  {
    path: publicFrontendRoutes.chat,
    element: (
      <PrivateRoute allowedRoles={CUSTOMER_BEAUTICIAN}>
        <ChatList />
      </PrivateRoute>
    ),
  },
  {
    path: publicFrontendRoutes.specificChat,
    element: (
      <PrivateRoute allowedRoles={CUSTOMER_BEAUTICIAN}>
        <ChatList />
      </PrivateRoute>
    ),
  },
  {
    path: beauticianFrontendRoutes.booking,
    element:(
      <PrivateRoute allowedRoles={CUSTOMER_BEAUTICIAN}>
         <BookingsPage/>
      </PrivateRoute>
    )
  },
  {
    path: customerFrontendRoutes.wallet,
    element: (
      <PrivateRoute allowedRoles={CUSTOMER_ONLY}>
        <WalletCard />
      </PrivateRoute>
    ),
  },
];
