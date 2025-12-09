
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { authApi } from '../../../services/api/auth'
import { UserRole } from '../../../constants/types/User'
import { generalMessages } from '../../../message/generalmessage'
import { setCurrentUser } from '../../../redux/userSlice/userSlice'
import { publicFrontendRoutes } from '../../../constants/frontendRoutes/publicFrontendRoutes'
import { handleApiError } from '../../../lib/utils/handleApiError'




interface GoogleAuthButtonProps {
  mode?: 'signin' | 'signup'
}

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ 
  mode = 'signin' 
}) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      console.log(`🚀 Google ${mode} success, sending credential to backend`)
      
      if (!credentialResponse.credential) {
        toast.error(`Google ${mode} failed. No credential received.`)
        return
      }

      // Only send role during signup to register as CUSTOMER
      // During signin, backend determines role from existing user data
      const payload: any = {
        credential: credentialResponse.credential
      }
      
      if (mode === 'signup') {
        payload.role = UserRole.CUSTOMER
      }
      
      const res = await authApi.googleLogin(payload)

      console.log(`✅ Google ${mode} response:`, res)

      if (!res.data?.data) {
        toast.error(generalMessages.ERROR.INTERNAL_SERVER_ERROR)
        return
      }

      const userData = res.data.data
      
      if (!userData.userId || !userData?.role) {
        toast.error("Invalid response from server")
        return
      }

      dispatch(
        setCurrentUser({
          userId: userData.userId,
          userName: userData.userName,
          role: userData.role,
          fullName: userData.fullName,
          profileImg: userData.profileImg,
        })
      )

      const successMessage = mode === 'signin' 
        ? res.data.message || "Successfully logged in with Google"
        : res.data.message || "Successfully signed up with Google"
      
      toast.success(successMessage)
      navigate(publicFrontendRoutes.landing, { replace: true })

    } catch (err) {
      console.log(`❌ Google ${mode} error:`, err)
      handleApiError(err)
    }
  }

  const handleGoogleError = () => {
    console.log(`❌ Google ${mode} failed`)
    toast.error(`Google ${mode} failed. Please try again.`)
  }

  return (
    <>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="w-full">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          theme="outline"
          size="large"
          text={mode === 'signin' ? 'signin_with' : 'signup_with'}
          shape="rectangular"
          width="100%"
          logo_alignment="left"
          auto_select={false}
          cancel_on_tap_outside={true}
        />
      </div>
    </>
  )
}