import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '../../redux/appStore';
import { useEffect, useState, type ReactNode } from 'react';
import { UserRole, type UserRoleType } from '../../constants/types/User';
import { publicFrontendRoutes } from '../../constants/frontendRoutes/publicFrontendRoutes';

interface Props {
  allowedRoles: UserRoleType[];
  children: ReactNode;
}

const PrivateRoute = ({ allowedRoles, children }: Props) => {
  const { userId, role,isAuthenticated } = useSelector((store:RootState)=>store.user.currentUser)
  
const location = useLocation();
console.log('PrivateRoute start ->', { path: location.pathname, userId, role, isAuthenticated, allowedRoles });


    console.log('PrivateRoute currentUser:', userId,role,isAuthenticated);
  console.log('allowedRoles:', allowedRoles, 'location:', location.pathname);
const isAdminPath = location.pathname.includes("/admin");

if (isAuthenticated === undefined) {
  return null;
}

if (isAdminPath) {
  if (!role || !isAuthenticated) {
    const redirectRole: UserRoleType = UserRole.ADMIN;
    return <Navigate to={publicFrontendRoutes.adminLogin} state={{ from: location, role: redirectRole }} replace />;
  }
} else {
  
  if (!userId || !role || !isAuthenticated) {
    let redirect = publicFrontendRoutes.login;
    let redirectRole: UserRoleType = UserRole.CUSTOMER;
    if (location.pathname.includes("/beautician")) redirectRole = UserRole.BEAUTICIAN;
    return <Navigate to={redirect} state={{ from: location, role: redirectRole }} replace />;
  }
}

const roleStr = String(role ?? "").toString();
const allowedUpper = allowedRoles.map(r => String(r).toUpperCase());
if (!allowedUpper.includes(roleStr.toUpperCase())) {
  console.warn('Redirecting because role not allowed', { role, allowedRoles });
  let loginRedirect = publicFrontendRoutes.login;
  let redirectRole: UserRoleType = UserRole.CUSTOMER;
  if (String(role).toUpperCase() === String(UserRole.ADMIN).toUpperCase()) {
    loginRedirect = publicFrontendRoutes.adminLogin;
  } else if (String(role).toUpperCase() === String(UserRole.BEAUTICIAN).toUpperCase()) {
    redirectRole = UserRole.BEAUTICIAN;
  }
  return <Navigate to={loginRedirect} state={{ from: location, role: redirectRole }} replace />;
}

return <>{children}</>;
};

export default PrivateRoute;