import React, { useState, useRef, useEffect } from "react";
import OtpUI from "../pages/otpPage";
import { Header } from "../../public";
import { authApi } from "../../../services/api/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { publicFrontendRoutes } from "../../../constants/frontendRoutes/publicFrontendRoutes";
import { toast } from "react-toastify";
import { handleApiError } from "../../../lib/utils/handleApiError";

const OtpForm = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(59);
  const [error, setError] = useState("");
  const location=useLocation()
  const navigate=useNavigate()

  interface OtpLocationState {email:string,signupToken:string}
   
  const {email,signupToken}=(location.state||{}) as OtpLocationState
   
  useEffect(()=>{
   if(!email && !signupToken)
   {
    navigate(publicFrontendRoutes.register)
    return
   }
  },[email,signupToken,navigate])

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (!pasted) return;

    const newOtp = ["", "", "", ""];
    pasted.split("").forEach((char, i) => (newOtp[i] = char));

    setOtp(newOtp);
    const lastIndex = Math.min(pasted.length, 4) - 1;
    inputRefs.current[lastIndex]?.focus();
  };

  const handleResend = async() => {
    try{
    setTimer(59);
    setOtp(["", "", "", ""]);
    setError("");
    inputRefs.current[0]?.focus();
    await authApi.resendOtp({email,signupToken})
    toast.success('otp resent')
    }catch(err)
    {
      handleApiError(err)
    }
  };

  const handleSubmit =async (e: React.FormEvent) => {
    e.preventDefault();

    const otpValue = otp.join("");
    if (otpValue.length !== 4) {
      setError("Please enter all 4 digits");
      return;
    }
    try{
      if(signupToken)
      {
        await authApi.completeSignup({email,signupToken,otp:otpValue})
       toast.success('User created')
       navigate(publicFrontendRoutes.login)
      }else 
      {
        await authApi.verifyOtp({email,otp:otpValue})
       toast.success('otp verified')
       navigate(publicFrontendRoutes.resetPassword,{state:{email}})
      }
       
    }catch(err)
    {
      handleApiError(err)
    }

    
  };

  return (
    <>
    <Header/>
    <OtpUI
      otp={otp}
      timer={timer}
      error={error}
      inputRefs={inputRefs}
      handleChange={handleChange}
      handleKeyDown={handleKeyDown}
      handlePaste={handlePaste}
      handleResend={handleResend}
      handleSubmit={handleSubmit}
      email={email}
      signupToken={signupToken}
    />
    </>
  );
};

export default OtpForm;
