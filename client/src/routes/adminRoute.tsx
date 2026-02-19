import type { RouteObject } from "react-router-dom";
import PrivateRoute from "../components/routes/privateRoute";
import { UserRole } from "../constants/types/User";
import { adminFrontendRoute } from "../constants/frontendRoutes/adminFrontenRoutes";
import { lazy } from "react";

const Dashboard =lazy(()=>import('../features/admin/pages/dashboard'))
const UsersList =lazy(()=>import('../features/admin/component/userList'))
const BeauticianListPage =lazy(()=>import('../features/admin/pages/BeauticianPage'))
const ManageServicesCategoriesContainer =lazy(()=>import('../features/service/component/adminmanageServiceCategory'))
const SubmissionsPage =lazy(()=>import('../features/service/pages/adminCustomServieReviewPage'))

export const adminRoutes: RouteObject[] = [
  {
    path: adminFrontendRoute.dashboard,
    element: (
      <PrivateRoute allowedRoles={[UserRole.ADMIN]}>
        <Dashboard />
      </PrivateRoute>
    ),
  },
  {
    path: adminFrontendRoute.checkUser,
    element: (
      <PrivateRoute allowedRoles={[UserRole.ADMIN]}>
        <UsersList />
      </PrivateRoute>
    ),
  },

  {
    path: adminFrontendRoute.checkBeautician,
    element: (
      <PrivateRoute allowedRoles={[UserRole.ADMIN]}>
        <BeauticianListPage />
      </PrivateRoute>
    ),
  },
   {
    path: adminFrontendRoute.services,
    element: (
      <PrivateRoute allowedRoles={[UserRole.ADMIN]}>
        <ManageServicesCategoriesContainer/>
      </PrivateRoute>
    ),
  },
   {
    path: adminFrontendRoute.customService,
    element: (
      <PrivateRoute allowedRoles={[UserRole.ADMIN]}>
        <SubmissionsPage/>
      </PrivateRoute>
    ),
  },

];
