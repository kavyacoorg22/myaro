import { FormProvider, useForm } from "react-hook-form"
import { LoginSchema, type LoginType } from "../../../lib/validations/user/validateLogin"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormField,FormControl,FormLabel,FormMessage } from "../../../components/ui/form"
import { Link, replace, useLocation, useNavigate } from "react-router-dom"
import { publicFrontendRoutes } from "../../../constants/frontendRoutes/publicFrontendRoutes"
import { useEffect, useState } from "react"
import {EyeClosed,Eye} from 'lucide-react'
import { authApi } from "../../../services/api/auth"
import { toast } from "react-toastify"
import { generalMessages } from "../../../message/generalmessage"
import { useDispatch, useSelector } from "react-redux"
import { setCurrentUser } from "../../../redux/userSlice/userSlice"
import { handleApiError } from "../../../lib/utils/handleApiError"
import { adminApi } from "../../../services/api/admin"
import { adminFrontendRoute } from "../../../constants/frontendRoutes/adminFrontenRoutes"
import { UserRole } from "../../../constants/types/User"
import type { RootState } from "../../../redux/appStore"
import { GoogleAuthButton } from "./googleAuthButton"


export const LoginForm=()=>{
  const [show,setShow]=useState(false)
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const location=useLocation()
  const isAdminLogin = location.pathname === adminFrontendRoute.login;
  
  useEffect(() => {
    console.log('Component rendered');
  });

  
  
  const currentUser=useSelector((store:RootState)=>store.user.currentUser)

  useEffect(() => {
    console.log('LoginForm - checking auth status:', currentUser);
    
    if (currentUser?.isAuthenticated && currentUser?.role) {
      console.log('✅ User already logged in, redirecting...');
      
      if (currentUser.role === UserRole.ADMIN) {
        navigate(adminFrontendRoute.dashboard, { replace: true });
      } else {
        navigate(publicFrontendRoutes.landing, { replace: true });
      }
    }
  }, [currentUser, navigate]);
  
  const methods=useForm<LoginType>({
    resolver:zodResolver(LoginSchema),
    defaultValues:{
      identifier:"",
      password:""
    }
  })

  const {register,handleSubmit,watch,formState:{errors,isSubmitting}}=methods

  const watchAll=watch()

  const onSubmit = async (data: LoginType) => {
    try {
      let res;
      
      if (isAdminLogin) {
        const adminPayload = {
          email: data.identifier,
          password: data.password,
        };
        console.log('🚀 Sending admin login request');
        res = await adminApi.login(adminPayload);
        console.log('✅ Admin login response:', res);
       
        if (!res.data?.data) {
          toast.error(generalMessages.ERROR.INTERNAL_SERVER_ERROR);
          return;
        }

        const role = res.data.data; 
        
        if (!role) {
          toast.error("Invalid response from server");
          return;
        }

        dispatch(
          setCurrentUser({
            userId: 'admin', 
            userName: null,
            role: role, 
            fullName: 'Admin',
            profileImg:undefined,
          })
        );

        setTimeout(() => {
          navigate(adminFrontendRoute.dashboard, {replace: true });
        }, 100);

        toast.success(res.data.message);

      } else {
        console.log('🚀 Sending user login request');
        res = await authApi.login(data);
        console.log('✅ User login response:', res);
        
        if (!res.data?.data) {
          toast.error(generalMessages.ERROR.INTERNAL_SERVER_ERROR);
          return;
        }

        const userData = res.data.data;
        
        if (!userData.userId || !userData?.role) {
          toast.error("Invalid response from server");
          return;
        }

        dispatch(
          setCurrentUser({
            userId: userData.userId,
            userName: userData.userName,
            role: userData.role,
            fullName: userData.fullName,
            profileImg: userData.profileImg,
          })
        );

        toast.success(res.data.message);
        navigate(publicFrontendRoutes.landing, { replace: true });
      }

    } catch (err) {
    
      handleApiError(err);
    }
  };

  return(
    <FormProvider {...methods} >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <FormField name="identifier">
          <div className="relative">
            <FormControl>
              <input 
                {...register("identifier")} 
                placeholder=" " 
                className={watchAll.identifier ? "pt-5 pb-1.5" : ""}
              />
            </FormControl>
            <FormLabel className={watchAll.identifier ? "top-0.5 text-xs text-blue-500" : ""}>
              {isAdminLogin?"email":"Email or Username"}
            </FormLabel>
          </div>
          <FormMessage error={errors.identifier} />
        </FormField>

        <FormField name="password">
          <div className="relative">
            <FormControl>
              <input 
                {...register("password")} 
                type={show?'text':'password'} 
                placeholder=" "
                className={watchAll.password ? "pt-5 pb-1.5" : ""}
              />
            </FormControl>
            <button  
              type="button"  
              onClick={() => setShow(!show)}  
              className="absolute right-3 top-3 text-gray-500 hover:text-black"
            >
              {show ? (<Eye className="h-5 w-5" />) : (<EyeClosed className="h-5 w-5" />)}
            </button>
            <FormLabel className={watchAll.password ? "top-0.5 text-xs text-blue-500" : ""}>
              Password
            </FormLabel>
          </div>
          <FormMessage error={errors.password} />
        </FormField>

        {!isAdminLogin && (
          <Link to={publicFrontendRoutes.forgetPassword}>
            <p className="float-right text-xs text-blue-700 font-medium">Forgot password?</p>
          </Link>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 w-full rounded bg-sky-500 text-white py-2 hover:bg-sky-600 disabled:opacity-50 transition"
        >
          {isSubmitting ? "Loading..." : "Login"}
        </button>

        {/* Google Login Button - Only for Users */}
        {!isAdminLogin && <GoogleAuthButton mode="signin" />}
      </form>
    </FormProvider>
  )
}