import type { RouteObject } from "react-router-dom";
import PrivateRoute from "../components/routes/privateRoute";
import { UserRole } from "../constants/types/User";
import { adminFrontendRoute } from "../constants/frontendRoutes/adminFrontenRoutes";
import { Dashboard } from "../features/admin/pages/dashboard";
import UsersList from "../features/admin/component/userList";
import { BeauticianListPage } from "../features/admin/pages/BeauticianPage";



export const adminRoutes:RouteObject[]=[
  {
    path:adminFrontendRoute.dashboard,
    element:(
      <PrivateRoute allowedRoles={[UserRole.ADMIN]}>
    <Dashboard/>
    </PrivateRoute>
  )
  },
  //  {
  //   path:adminFrontendRoute.checkUser,
  //   element:(
  //     <PrivateRoute allowedRoles={[UserRole.ADMIN]}>
  //   <UsersList/>
  //   </PrivateRoute>
  // )
  // },

    {
    path:adminFrontendRoute.checkBeautician,
    element:(
      <PrivateRoute allowedRoles={[UserRole.ADMIN]}>
    <BeauticianListPage/>
    </PrivateRoute>
  )
  },

]