import type { RouteObject } from "react-router-dom";
import PrivateRoute from "../components/routes/privateRoute";
import { UserRole } from "../constants/types/User";
import { adminFrontendRoute } from "../constants/frontendRoutes/adminFrontenRoutes";
import { lazy } from "react";

const ADMIN_ONLY         = [UserRole.ADMIN];
const AdminDashboard=lazy(()=>import('../features/admin/component/dashboard/dashBoard'))
const UsersList =lazy(()=>import('../features/admin/component/userList'))
const BeauticianListPage =lazy(()=>import('../features/admin/pages/BeauticianPage'))
const ManageServicesCategoriesContainer =lazy(()=>import('../features/service/component/adminmanageServiceCategory'))
const SubmissionsPage =lazy(()=>import('../features/service/pages/adminCustomServieReviewPage'))
const RefundRequestsPage=lazy(()=>import('../features/admin/component/getAllRefundPage'))
const DisputePage=lazy(()=>import('../features/admin/component/getAllDispute'))
const PaymentManagementPage=lazy(()=>import('../features/admin/component/paymentManagementPage'))
export const adminRoutes: RouteObject[] = [
  {
    path: adminFrontendRoute.dashboard,
    element: (
      <PrivateRoute allowedRoles={ADMIN_ONLY}>
        <AdminDashboard />
      </PrivateRoute>
    ),
  },
  {
    path: adminFrontendRoute.checkUser,
    element: (
      <PrivateRoute allowedRoles={ADMIN_ONLY}>
        <UsersList />
      </PrivateRoute>
    ),
  },

  {
    path: adminFrontendRoute.checkBeautician,
    element: (
      <PrivateRoute allowedRoles={ADMIN_ONLY}>
        <BeauticianListPage />
      </PrivateRoute>
    ),
  },
   {
    path: adminFrontendRoute.services,
    element: (
      <PrivateRoute allowedRoles={ADMIN_ONLY}>
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
     {
    path: adminFrontendRoute.refunds,
    element: (
      <PrivateRoute allowedRoles={ADMIN_ONLY}>
        <RefundRequestsPage/>
      </PrivateRoute>
    ),
  },
    {
    path: adminFrontendRoute.dispute,
    element: (
      <PrivateRoute allowedRoles={ADMIN_ONLY}>
        <DisputePage/>
      </PrivateRoute>
    ),
  },
    {
    path: adminFrontendRoute.booking,
    element: (
      <PrivateRoute allowedRoles={ADMIN_ONLY}>
        <PaymentManagementPage/>
      </PrivateRoute>
    ),
  },

];
