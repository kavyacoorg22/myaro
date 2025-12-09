// import { Link } from "react-router";
import { Link } from "react-router";
import { publicFrontendRoutes } from "../../../constants/frontendRoutes/publicFrontendRoutes";
import RegisterForm from "../components/registerForm";

export const RegistrationPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-blue-50 to-blue-100">
  
      <div className="bg-white p-8 sm:p-10 rounded-[20px] shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-[#0a0a0a] text-left pb-2">Create Account</h2>
        <p className="text-left text-gray-500 text-sm mb-6">Already have an account?<Link to={publicFrontendRoutes.login}><span className="text-amber-900 font-medium">Login</span></Link></p>
        <RegisterForm />
      </div>
    
   </div>
  );
};

