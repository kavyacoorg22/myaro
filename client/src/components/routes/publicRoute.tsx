import type { ReactNode } from "react";
import { publicFrontendRoutes } from "../../constants/frontendRoutes/publicFrontendRoutes";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/appStore";
import { Navigate, useLocation } from "react-router-dom";
import { UserRole } from "../../constants/types/User";




interface PublicRouteProps{
     children:ReactNode
}


const PublicRoute=({children}:PublicRouteProps)=>{
  const currentUser=useSelector((store:RootState)=>store.user.currentUser)
  
  const location=useLocation()

  const authPages=[publicFrontendRoutes.adminLogin,publicFrontendRoutes.login,publicFrontendRoutes.register]
  type authPageType=(typeof authPages)[number]

  if(!currentUser)
    return <>{children}</>
 
  const role=currentUser?.role;

  function isAuthPage(path:string):path is authPageType{
    return authPages.includes(path as authPageType)
  }
  if(role&&isAuthPage(location.pathname)){
    switch(role)
    {
      case UserRole.BEAUTICIAN:
       return <Navigate to={publicFrontendRoutes.landing} replace/>
      case UserRole.CUSTOMER:
        return <Navigate to={publicFrontendRoutes.landing} replace/>
      case UserRole.ADMIN:
        return <Navigate to={publicFrontendRoutes.adminLogin} replace/>
      default :
      return <Navigate to={publicFrontendRoutes.landing} replace/>
    }

  }

return <>{children}</>;

}

export default PublicRoute