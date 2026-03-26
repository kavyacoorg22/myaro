
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { handleApiError } from "../../../lib/utils/handleApiError";
import type {
  ProfileType,
  BankDetailsType,
  ChangePasswordType,
  CustomerProfileType,
} from "../../../lib/validations/user/validateProfileData";
import BeauticianEditProfileUI from "../component/editProfileUi";
import { BeauticianEditBankDetailsUi } from "../component/editBankDetails";
import { BeauticianApi } from "../../../services/api/beautician";
import type { IBeauticianProfileUpdate } from "../../../types/api/beautician";
import { publicAPi } from "../../../services/api/public";
import { ChangePasswordUi } from "../component/changePasswordUI";
import { publicFrontendRoutes } from "../../../constants/frontendRoutes/publicFrontendRoutes";
import type { ServiceModesType } from "../../../constants/types/beautician";

export const ProfileEditPage = ({ isCustomer = false }: { isCustomer?: boolean }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null!);
  const [showAccountNumber, setShowAccountNumber] = useState(false);

  const [profileData, setProfileData] = useState({
    userName: "",
    fullName: "",
    about: "",
    shopName: "",
    shopAddress: { address: "", city: "", pincode: "" },
    yearsOfExperience: "1",
    profileImg: undefined as string | undefined,
      serviceModes: [] as ServiceModesType[], 
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

      setProfileData({
        userName: data?.userName || "",
        fullName: data?.fullName || "",
        about: data?.about || "",
        shopName: data?.shopName || "",
        shopAddress: data?.shopAddress || {
          address: "",
          city: "",
          pincode: "",
        },
        yearsOfExperience: String(data?.yearsOfExperience || 1),
        profileImg: data?.profileImg,
          serviceModes: data?.serviceModes || [], 
      });

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
      formData.append("profileImg", file);

      const loadingToast = toast.loading("Uploading profile image...");

      const response = await publicAPi.changeProfilePhoto(formData);

      setProfileData((prev) => ({
        ...prev,
        profileImg: response.data.data?.profileImg,
      }));

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast.dismiss(loadingToast);
      toast.success("Profile image updated successfully!");
      navigate(publicFrontendRoutes.profile)
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

      handleProfileImageUpload(file);
    }
  };

const handleSaveProfile = async (data: ProfileType | CustomerProfileType) => {
  try {
    const payload: IBeauticianProfileUpdate = {
      userName: data.userName,
      fullName: data.fullName,
      about: "about" in data ? data.about : undefined,
      shopName: "shopName" in data ? data.shopName || "" : undefined,
      shopAddress: "shopAddress" in data && data.shopAddress
        ? {
            address: data.shopAddress.address,
            city: data.shopAddress.city,
            pincode: "",
          }
        : undefined,
      yearsOfExperience: "yearsOfExperience" in data ? data.yearsOfExperience : undefined,
       serviceModes: "serviceModes" in data ? data.serviceModes : undefined, 
    };

    await BeauticianApi.updateProfile(payload);
    toast.success("Profile saved successfully!");
    navigate(publicFrontendRoutes.profile)
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

  const handleChangePassword = async (data: ChangePasswordType) => {
  try {
    await publicAPi.changePassword({
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
      confirmPassword:data.confirmPassword
    });
    toast.success("Password updated successfully!");
    navigate(publicFrontendRoutes.profile)
  } catch (error) {
    handleApiError(error);
  }
};

  return (
    <>
      <BeauticianEditProfileUI
        profileData={profileData}
        handleFileChange={handleFileChange}
        handleSaveProfile={handleSaveProfile}
        handleCancelProfile={handleCancelProfile}
        handleBack={handleBack}
        fileInputRef={fileInputRef}
        isCustomer={isCustomer}
      />
          {!isCustomer && (
      <BeauticianEditBankDetailsUi
        bankData={bankData}
        showAccountNumber={showAccountNumber}
        handleSaveBankDetails={handleSaveBankDetails}
        setShowAccountNumber={setShowAccountNumber}
      />)}
        <ChangePasswordUi onSubmit={handleChangePassword} />
    </>
  );
};