
import React, { useState, useRef, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { handleApiError } from "../../../lib/utils/handleApiError";

import type { ProfileType, BankDetailsType } from "../../../lib/validations/user/validateProfileData";
import BeauticianEditProfileUI from "../component/editProfileUi";
import { BeauticianEditBankDetailsUi } from "../component/editBankDetails";
import { BeauticianApi } from "../../../services/api/beautician";
import type { IBeauticianProfileUpdate } from "../../../types/api/beautician";
import { Header } from "../../public";
import { publicAPi } from "../../../services/api/public";

const BeauticianProfileForm = () => {
  const navigate = useNavigate();
 const fileInputRef = useRef<HTMLInputElement >(null!);

  const [activeTab, setActiveTab] = useState<"profile" | "service">("profile");
  const [showAccountNumber, setShowAccountNumber] = useState(false);

  const [profileData, setProfileData] = useState({
    userName: "",
    fullName: "",
    about: "",
    shopName: "",
    shopAddress: { address: "", city: "", pincode: "" },
    yearsOfExperience: "1",
    profileImg: undefined as string | undefined,
  });

  const [bankData, setBankData] = useState({
    accountHolderName: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
    bankName: "",
    upiId: "",
  });


  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await BeauticianApi.viewProfile();
     
      const data = response.data?.data;
         console.log('✅ Extracted data:', data);
    console.log('✅ Bank details check:', {
      accountHolderName: data?.accountHolderName,
      accountNumber: data?.accountNumber,
      ifscCode: data?.ifscCode,
      bankName: data?.bankName,
      upiId: data?.upiId
    });

      setProfileData({
        userName: data?.userName|| "",
        fullName: data?.fullName|| "",
        about: data?.about || "",
        shopName: data?.shopName || "",
        shopAddress: data?.shopAddress||{ address: "", city: "", pincode: "" } ,
        yearsOfExperience: String(data?.yearsOfExperience || 1),
        profileImg: data?.profileImg,
      });
      console.log('profileData',profileData)
      setBankData({
        accountHolderName: data?.accountHolderName || "",
        accountNumber: data?.accountNumber || "",
        confirmAccountNumber: data?.accountNumber || "",
        ifscCode: data?.ifscCode || "",
        bankName: data?.bankName || "",
        upiId: data?.upiId || "",
      });
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleProfileImageUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('profileImg', file);

      const loadingToast = toast.loading("Uploading profile image...");

      const response = await publicAPi.changeProfilePhoto(formData);
      
    
      setProfileData(prev => ({
        ...prev,
        profileImg: response.data?.data?.profileImg
      }));

  
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      toast.dismiss(loadingToast);
      toast.success("Profile image updated successfully!");
      fetchProfileData()
    } catch (error) {
      toast.dismiss();
      handleApiError(error);
    }
  };


   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
     
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      
      const previewUrl = URL.createObjectURL(file);
      setProfileData((prev) => ({ ...prev, profileImg: previewUrl }));
      
      
      handleProfileImageUpload(file);
    }
  };

 const handleSaveProfile = async (data: ProfileType) => {
  try {
    const payload: IBeauticianProfileUpdate = {
      userName: data.userName,
      fullName: data.fullName,
      about: data.about,
      shopName: data.shopName || "",
      shopAddress: data.shopAddress ? {
        address: data.shopAddress.address,
        city: data.shopAddress.city, 
        pincode: ""
      } : undefined,
      yearsOfExperience: data.yearsOfExperience,
    };

    await BeauticianApi.updateProfile(payload);
    toast.success("Profile saved successfully!");
    await fetchProfileData();
  } catch (error) {
    handleApiError(error);
  }
};

  const handleCancelProfile = () => {
    fetchProfileData();
  };

  const handleSaveBankDetails = async (data: BankDetailsType) => {
    try {
      await BeauticianApi.updateProfile({
        accountHolderName: data.accountHolderName.trim(),
        accountNumber: data.accountNumber.trim(),
        ifscCode: data.ifscCode.trim().toUpperCase(),
        bankName: data.bankName.trim(),
        upiId: data.upiId ? data.upiId.trim().toLowerCase() : undefined,
      });

      toast.success("Bank details saved successfully!");
      await fetchProfileData(); 
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleTabChange = (tab: "profile" | "service") => {
    setActiveTab(tab);
  };

  return (
    <>
    <Header/>
    <BeauticianEditProfileUI
      profileData={profileData}
      activeTab={activeTab}
      handleFileChange={handleFileChange}
      handleSaveProfile={handleSaveProfile}
      handleCancelProfile={handleCancelProfile}
      handleBack={handleBack}
      handleTabChange={handleTabChange}
      fileInputRef={fileInputRef}
    />
    <BeauticianEditBankDetailsUi
     bankData={bankData}
     showAccountNumber={showAccountNumber}
     handleSaveBankDetails={handleSaveBankDetails}
      setShowAccountNumber={setShowAccountNumber}
    />
    </>
  );
};

export default BeauticianProfileForm;