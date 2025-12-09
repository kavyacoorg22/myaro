
import { useState } from "react";
import { useLocation } from "react-router-dom"; 
import type { Step1Data, Step2Data, Step3Data } from "../../../lib/validations/user/validateBeauticianRegiter";
import { Step1Component } from "../component/registerForm/step1";
import { Step2Component } from "../component/registerForm/step2";
import { Step3Component } from "../component/registerForm/step3";
import { Header } from "../../public";
import { ReviewModal } from "../../models/reviewModel";
import { useNavigate } from "react-router-dom";
import { publicFrontendRoutes } from "../../../constants/frontendRoutes/publicFrontendRoutes";
import { BeauticianApi } from "../../../services/api/beautician";
import { useRefreshUser } from "../../../hooks/useRefreshUser";
import { handleApiError } from "../../../lib/utils/handleApiError";
import { beauticianFrontendRoutes } from "../../../constants/frontendRoutes/beauticianFrontendRoutes";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "../../../redux/userSlice/userSlice";
import type { RootState } from "../../../redux/appStore";

interface RegistrationData {
  step1?: Step1Data;
  step2?: Step2Data;
  step3?: Step3Data;
}

export default function BeauticianRegistration() {
  const location = useLocation(); 
  const { refreshUserData } = useRefreshUser();
  const navigate = useNavigate();
  const dispatch=useDispatch()
  const currentUser=useSelector((store:RootState)=>store.user.currentUser)
  

 
  const [currentStep, setCurrentStep] = useState(
    location.state?.startAtStep || 1
  );
  
  const [registrationData, setRegistrationData] = useState<Partial<RegistrationData>>({});
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStep1Complete = (data: Step1Data) => {
    setRegistrationData(prev => ({ ...prev, step1: data }));
    setCurrentStep(2);
  };

  const handleStep2Complete = async (
    data: Step2Data, 
    files: {
      portfolioFiles: File[];
      certificateFiles: File[];
      shopPhotos?: File[];
      licenseFiles?: File[];
    }
  ) => {
    setRegistrationData(prev => ({ ...prev, step2: data }));
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      formData.append('yearsOfExperience', registrationData.step1!.yearsOfExperience.toString());
      formData.append('about', registrationData.step1!.about);

 
      formData.append('hasShop', data.hasShop.toString());

      files.portfolioFiles.forEach((file) => {
        formData.append('portfolioImage', file);
      });

      files.certificateFiles.forEach((file) => {
        formData.append('certificateImage', file);
      });

      if (data.hasShop && data.shop) {
        formData.append('shopName', data.shop.shopName);
        formData.append('shopAddress', data.shop.address);
        formData.append('shopCity', data.shop.city);
        formData.append('shopPincode', data.shop.pincode);

        files.shopPhotos?.forEach((file) => {
          formData.append('shopPhotos', file);
        });

        files.licenseFiles?.forEach((file) => {
          formData.append('shopLicence', file);
        });
      }

      console.log('📤 Submitting registration with FormData...');
      
      const response = await BeauticianApi.beauticianRegister(formData);

      console.log('✅ Registration successful:', response);
      
    setShowReviewModal(true);
    } catch (error: any) {
      console.error('❌ Registration failed:', error);
      
      if (error.status) {
        alert(error.body?.message || `Error ${error.status}: Registration failed`);
      } else {
        alert(error.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStep3Complete = async (data: Step3Data) => {
    setRegistrationData(prev => ({ ...prev, step3: data }));
    setIsSubmitting(true);

    try {
      console.log('📤 Submitting payment details...');
      
      const response=await BeauticianApi.updateRegister(data);
     
        if (response.data?.data) {
      dispatch(setCurrentUser({
        userId: response.data.data.userId,
        role: response.data.data.role,
        isVerified: response.data.data.isVerified,
       
        userName: currentUser.userName,
        fullName: currentUser.fullName,
        profileImg: currentUser.profileImg,
      }));
    }
    
      await refreshUserData();
     
    
      navigate(beauticianFrontendRoutes.aggrement,{replace:true});
    } catch (error: any) {
      
      handleApiError(error)
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev:number) => prev - 1);
  };

  const handleModalClose = () => {
    setShowReviewModal(false);
    navigate(publicFrontendRoutes.profile);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Header />

      {currentStep === 1 && <Step1Component onNext={handleStep1Complete} />}
      
      {currentStep === 2 && (
        <Step2Component 
          onNext={handleStep2Complete} 
          onBack={handleBack} 
        />
      )}

      {currentStep === 3 && (
        <Step3Component 
          onNext={handleStep3Complete} 
          onBack={handleBack} 
        />
      )}

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center max-w-sm mx-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
            <p className="text-gray-700 font-medium text-center">
              {currentStep === 2 ? 'Uploading files...' : 'Saving payment details...'}
            </p>
            <p className="text-gray-500 text-sm text-center mt-2">This may take a few moments</p>
          </div>
        </div>
      )}

      <ReviewModal isOpen={showReviewModal} onClose={handleModalClose} />
    </div>
  );
}
