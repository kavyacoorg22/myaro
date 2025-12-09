import { Link, useLocation } from "react-router"
import { LoginForm } from "../components/loginForm"
import { publicFrontendRoutes } from "../../../constants/frontendRoutes/publicFrontendRoutes"
import { Header } from "../../public"
import { adminFrontendRoute } from "../../../constants/frontendRoutes/adminFrontenRoutes"



export const LoginPage=()=>{
  const location = useLocation();
  const isAdminLogin = location.pathname === adminFrontendRoute.login;

     return(
      <>
     
      <Header/>
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white p-8 sm:p-10 rounded-[20px] shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-[#0a0a0a] text-left pb-3">Login</h2>
        {!isAdminLogin&&(<p className="text-left text-gray-500 text-sm mb-6">New User?<Link to={publicFrontendRoutes.register}><span className="text-amber-900 font-medium">Sign Up</span></Link></p>)}
        <LoginForm/>
      </div>
    </div>
     </>
     )
}