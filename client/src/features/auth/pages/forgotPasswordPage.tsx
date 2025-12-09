
import { Header } from "../../public"
import { ForgotPasswordForm } from "../components/forgotPassword"

export const ForgotPasswordPage=()=>{
     return(
      <>
     
      <Header/>
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white p-8 sm:p-10 rounded-[20px] shadow-2xl w-full max-w-md">
        <p className="text-left font-medium text-sm mb-6">**Please Enter your registered Email</p>
        <ForgotPasswordForm/>
      </div>
    </div>
     </>
     )
}