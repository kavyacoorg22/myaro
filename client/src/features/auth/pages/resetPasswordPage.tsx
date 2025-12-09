import { Header } from "../../public"
import { ResetPasswordForm } from "../components/resetPasswordForm"

export const ResetPasswordPage=()=>{
     return(
      <>
     
      <Header/>
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white p-8 sm:p-10 rounded-[20px] shadow-2xl w-full max-w-md">
        <h2 className="text-xl font-bold text-[#0a0a0a] text-center pb-3">Reset Password</h2>
        <ResetPasswordForm/>
      </div>
    </div>
     </>
     )
}