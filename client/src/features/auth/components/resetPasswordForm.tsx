import { FormProvider, useForm } from "react-hook-form"
import { ResetPasswordSchema,  type ResetPasswordInput } from "../../../lib/validations/user/validateResetPassword"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormControl, FormField, FormLabel, FormMessage } from "../../../components/ui/form"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { authApi } from "../../../services/api/auth"
import { toast } from "react-toastify"
import { generalMessages } from "../../../message/generalmessage"
import { publicFrontendRoutes } from "../../../constants/frontendRoutes/publicFrontendRoutes"
import { handleApiError } from "../../../lib/utils/handleApiError"
import {EyeClosed,Eye} from 'lucide-react'
import { useState } from "react"


export const ResetPasswordForm=()=>{
  const methods=useForm<ResetPasswordInput>({
   resolver:zodResolver(ResetPasswordSchema),
   defaultValues:{
    password:'',
    confirmPassword:''
   }
  })
  const navigate=useNavigate()
  const [show,setShow]=useState(false)
  const location=useLocation()

  const {email}=(location.state||{})
  console.log(email)

  const {register,watch,handleSubmit,formState:{isSubmitting,errors}}=methods
  const watchAll=watch()

  const onSubmit=async(data:ResetPasswordInput)=>{
    try{
      const {password,confirmPassword}=data
    const res=await authApi.passwordReset({email,password,confirmPassword})
    if(!res.data)
    {
      toast.error(generalMessages.ERROR.INTERNAL_SERVER_ERROR)
      return
    } 
    toast.success(res.data?.message)
    navigate(publicFrontendRoutes.login)
    }catch(err)
    {
       handleApiError(err)
    }
  }

  return(
   <FormProvider {...methods} >
       <form onSubmit={methods.handleSubmit(onSubmit)}className="space-y-3">
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
                          <button  type="button"  onClick={() => setShow(!show)}  className="absolute right-3 top-3 text-gray-500 hover:text-black">
                                                  {show ? (   <Eye className="h-5 w-5" />  ) : (    <EyeClosed className="h-5 w-5" />  )}
                                                   </button>
                                    <FormLabel className={watchAll.password ? "top-0.5 text-xs text-blue-500" : ""}>
                                     New  Password
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
                                    <FormLabel className={watchAll.password ? "top-0.5 text-xs text-blue-500" : ""}>
                                     confirm Password
                                    </FormLabel>
                  </div>
                  <FormMessage error={errors.confirmPassword} />
                </FormField>

                  <button
          disabled={isSubmitting}
          className="mt-4 w-full rounded bg-sky-500 text-white py-2 hover:bg-sky-600 disabled:opacity-50 transition"
        >
          {isSubmitting ? "Loading..." : "Reset Password"}
        </button>
        <p className="text-xs font-normal px-5">Password must be at least 8 characters long and include uppercase,
 lowercase, number, and   special character (e.g., !@#$%^&*).</p>
              </form>
            </FormProvider>
  )
}