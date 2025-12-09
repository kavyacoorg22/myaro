import React, { useState } from "react";
import { useForm, FormProvider, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type registerInput } from "../../../lib/validations/user/validateRegister";
import {  FormField,FormLabel,  FormControl,  FormMessage,} from "../../../components/ui/form";
import { authApi } from "../../../services/api/auth";
import {toast} from 'react-toastify'
import { generalMessages } from "../../../message/generalmessage";
import { useNavigate } from "react-router";
import { publicFrontendRoutes } from "../../../constants/frontendRoutes/publicFrontendRoutes";
import { handleApiError } from "../../../lib/utils/handleApiError";
import {EyeClosed,Eye} from 'lucide-react'
import { GoogleAuthButton } from "./googleAuthButton";

const RegisterForm: React.FC = () => {
const navigate=useNavigate()
const [ssignupToken,setSignuptoken]=useState("")
const [semail,setEmail]=useState('')
const [show,setShow]=useState(false)

  const methods = useForm<registerInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      userName: "",
      fullName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {  register,  handleSubmit,  watch,  formState: { errors, isSubmitting },setError } = methods;

  const onSubmit=async (data:registerInput)=>{
    try{
   

    //pre sign-up Api

    const res=await authApi.preSignup(data);
     if(!res.data?.data)
     {
      toast.error(generalMessages.ERROR.INTERNAL_SERVER_ERROR)
      return
     }
     const signupToken=res.data?.data?.signupToken
     const email=data.email
     setSignuptoken(signupToken)
     setEmail(data.email)
    


     //send otp
     const otpRes=await authApi.sendOtp({email,signupToken})
     console.log(otpRes)
     toast.success(otpRes.data?.message)
     navigate(publicFrontendRoutes.verifyOtp,{state:{email,signupToken}})
    }catch(err)
    {
     handleApiError(err,setError)
    }
  }

  
  
  const watchAll = watch();

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        
        <FormField name="email">
          <div className="relative">
            <FormControl>
              <input 
                {...register("email")} 
                placeholder=" " 
                className={watchAll.email ? "pt-5 pb-1.5" : ""}
              />
            </FormControl>
            <FormLabel className={watchAll.email ? "top-0.5 text-xs text-blue-500" : ""}>
              Email
            </FormLabel>
          </div>
          <FormMessage error={errors.email} />
        </FormField>

        <FormField name="userName">
          <div className="relative">
            <FormControl>
              <input 
                {...register("userName")} 
                placeholder=" "
                className={watchAll.userName ? "pt-5 pb-1.5" : ""}
              />
            </FormControl>
            <FormLabel className={watchAll.userName ? "top-0.5 text-xs text-blue-500" : ""}>
              User Name
            </FormLabel>
          </div>
          <FormMessage error={errors.userName} />
        </FormField>

        <FormField name="fullName">
          <div className="relative">
            <FormControl>
              <input 
                {...register("fullName")} 
                placeholder=" "
                className={watchAll.fullName ? "pt-5 pb-1.5" : ""}
              />
            </FormControl>
            <FormLabel className={watchAll.fullName ? "top-0.5 text-xs text-blue-500" : ""}>
              Full Name
            </FormLabel>
          </div>
          <FormMessage error={errors.fullName} />
        </FormField>

        <FormField name="password">
          <div className="relative">
            <FormControl>
              <input 
                {...register("password")} 
                type='text' 
                placeholder=" "
                className={watchAll.password ? "pt-5 pb-1.5" : ""}
              />
            </FormControl>
            <FormLabel className={watchAll.password ? "top-0.5 text-xs text-blue-500" : ""}>
              Password
            </FormLabel>
          </div>
          <FormMessage error={errors.password} />
        </FormField>

        <FormField name="confirmPassword">
          <div className="relative">
            <FormControl>
              <input 
                {...register("confirmPassword")} 
                type={show?'text':'password'} 
                placeholder=" "
                className={watchAll.confirmPassword ? "pt-5 pb-1.5" : ""}
              />
            
            </FormControl>
                 <button  type="button"  onClick={() => setShow(!show)}  className="absolute right-3 top-3 text-gray-500 hover:text-black">
              {show ? (   <Eye className="h-5 w-5" />  ) : (    <EyeClosed className="h-5 w-5" />  )}
               </button>
            <FormLabel className={watchAll.confirmPassword ? "top-0.5 text-xs text-blue-500" : ""}>
              Confirm Password
            </FormLabel>
          </div>
          <FormMessage error={errors.confirmPassword} />
        </FormField>

        <button
          disabled={isSubmitting}
          className="mt-4 w-full rounded bg-sky-500 text-white py-2 hover:bg-sky-600 disabled:opacity-50 transition"
        >
          {isSubmitting ? "Loading..." : "Sign up"}
        </button>
        <GoogleAuthButton mode="signup" />
      </form>
    </FormProvider>
  );
};

export default RegisterForm;