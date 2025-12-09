import { FormProvider, useForm } from "react-hook-form"
import { ForgotPasswordSchema,  type ForgotPasswordInput } from "../../../lib/validations/user/validateResetPassword"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormControl, FormField, FormLabel, FormMessage } from "../../../components/ui/form"
import { publicFrontendRoutes } from "../../../constants/frontendRoutes/publicFrontendRoutes"
import { Link, useNavigate } from "react-router-dom"
import { authApi } from "../../../services/api/auth"
import { toast } from "react-toastify"
import { generalMessages } from "../../../message/generalmessage"
import { handleApiError } from "../../../lib/utils/handleApiError"

export const ForgotPasswordForm=()=>{
  const methods=useForm<ForgotPasswordInput>({
    resolver:zodResolver(ForgotPasswordSchema),
    defaultValues:{
      email:''
    }
  })
 const navigate=useNavigate()
  const {register,watch,handleSubmit,  formState:{isSubmitting,errors}}=methods
  const watchAll=watch()

const onSubmit=async (data:ForgotPasswordInput)=>{
    try{
    const res=await authApi.forgotPassword(data);
     if(!res.data?.success)
     {
      toast.error(generalMessages.ERROR.INTERNAL_SERVER_ERROR)
      return
     }
     const email=data.email
   
    


     //send otp
     const otpRes=await authApi.sendOtp({email})
     console.log(otpRes)
     toast.success(otpRes.data?.message)
     navigate(publicFrontendRoutes.verifyOtp,{state:{email}})
    }catch(err)
    {
     handleApiError(err)
    }
  }

  


  return(
   <FormProvider {...methods} >
       <form   onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <FormField name="identifier">
                  <div className="relative">
                    <FormControl>
                      <input 
                        {...register("email")} 
                        placeholder=" " 
                        className={watchAll.email ? "pt-5 pb-1.5" : ""}
                      />
                    </FormControl>
                    <FormLabel className={watchAll.email ? "top-0.5 text-xs text-blue-500" : ""}>
                      Enter your email
                    </FormLabel>
                  </div>
                  <FormMessage error={errors.email} />
                </FormField>
     <Link to={publicFrontendRoutes.login}>  <p className=" text-xs text-blue-700 font-medium">Back to Login</p></Link>

                  <button
          disabled={isSubmitting}
          className="mt-4 w-full rounded bg-sky-500 text-white py-2 hover:bg-sky-600 disabled:opacity-50 transition"
        >
          {isSubmitting ? "Loading..." : "Reset Password"}
        </button>
              </form>
            </FormProvider>
  )
}