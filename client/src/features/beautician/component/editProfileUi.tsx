import { ArrowLeft, Camera, } from "lucide-react";
import { FormControl, FormField, FormLabel, FormMessage } from "../../../components/ui/form";
import { FormProvider, useForm } from "react-hook-form";
import {  ProfileSchema, type ProfileType,  } from "../../../lib/validations/user/validateProfileData";
import { zodResolver } from "@hookform/resolvers/zod";
import type {  IProfileUpdateRequest, IProfileViewData } from "../../../types/api/beautician";
import { useEffect } from "react";


interface BeauticianProfileUIProps {
  profileData: IProfileViewData,
  activeTab: "profile" | "service";
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSaveProfile: (data: ProfileType) => void;
  handleCancelProfile: () => void;
  handleBack: () => void;
  handleTabChange: (tab: "profile" | "service") => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}
export const BeauticianEditProfileUI= ({
  profileData,
  activeTab,
  handleFileChange,
  handleSaveProfile,
  handleCancelProfile,
  handleTabChange,
  fileInputRef,
}: BeauticianProfileUIProps) => {

const profileMethods=useForm<ProfileType>({
  resolver:zodResolver(ProfileSchema),
defaultValues: {
    
      userName:  "",
      fullName: "",
      about: "",
      shopName: "",
      shopAddress: { address: "", city: "" },
      yearsOfExperience: "1" ,
     
    },

})

useEffect(() => {
    if (profileData.userName) { 
      profileMethods.reset({
        userName: profileData.userName || "",
        fullName: profileData.fullName || "",
        about: profileData.about || "",
        shopName: profileData.shopName || "",
        shopAddress: profileData.shopAddress || { address: "", city: "", pincode: "" },
        yearsOfExperience: profileData.yearsOfExperience || "1",
      });
      
    }
  }, [profileData, profileMethods]);


const { register: registerProfile, formState: { errors: profileErrors, isSubmitting: isSubmittingProfile } } = profileMethods;

 return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white sticky top-[56px] z-20 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => handleTabChange("profile")}
              className={`py-3 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "profile"
                  ? "border-rose-500 text-rose-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Edit Profile
            </button>
            <button
              onClick={() => handleTabChange("service")}
              className={`py-3 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "service"
                  ? "border-rose-500 text-rose-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Service Page
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {activeTab === "profile" && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-6">Profile Information</h2>

            <div className="flex items-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {profileData.profileImg? (
                    <img
                      src={profileData.profileImg}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-rose-500 text-white p-2 rounded-full hover:bg-rose-600"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="ml-6 text-rose-500 font-medium hover:text-rose-600"
              >
                Change photo
              </button>
            </div>

            <FormProvider {...profileMethods}>
              <form onSubmit={profileMethods.handleSubmit(handleSaveProfile)}>
                <FormField name="userName">
                  <FormLabel>Username</FormLabel>
                  <FormControl error={profileErrors.userName}>
                    <input type="text" {...registerProfile("userName")} />
                  </FormControl>
                  <FormMessage error={profileErrors.userName} />
                </FormField>

                <div className="mt-4">
                  <FormField name="fullName">
                    <FormLabel>Full Name</FormLabel>
                    <FormControl error={profileErrors.fullName}>
                      <input type="text" {...registerProfile("fullName")} />
                    </FormControl>
                    <FormMessage error={profileErrors.fullName} />
                  </FormField>
                </div>

                <div className="mt-4">
                  <FormField name="about">
                    <FormLabel>About</FormLabel>
                    <FormControl error={profileErrors.about}>
                      <textarea
                        rows={4}
                        placeholder="Tell us about yourself..."
                        {...registerProfile("about")}
                      />
                    </FormControl>
                    <FormMessage error={profileErrors.about} />
                  </FormField>
                </div>

                <div className="mt-4">
                  <FormField name="shopName">
                    <FormLabel>Shop Name</FormLabel>
                    <FormControl error={profileErrors.shopName}>
                      <input
                        type="text"
                        placeholder="Enter shop name"
                        {...registerProfile("shopName")}
                      />
                    </FormControl>
                    <FormMessage error={profileErrors.shopName} />
                  </FormField>
                </div>

                <div className="mt-4">
                  <FormField name="shopAddress.address">
                    <FormLabel>Shop Address</FormLabel>
                    <FormControl error={profileErrors.shopAddress?.address}>
                      <textarea
                        rows={3}
                        placeholder="Enter complete address"
                        {...registerProfile("shopAddress.address")}
                      />
                    </FormControl>
                    <FormMessage error={profileErrors.shopAddress?.address} />
                  </FormField>
                </div>

                <div className="mt-4">
                  <FormField name="shopAddress.city">
                    <FormLabel>City</FormLabel>
                    <FormControl error={profileErrors.shopAddress?.city}>
                      <input
                        type="text"
                        placeholder="Enter city"
                        {...registerProfile("shopAddress.city")}
                      />
                    </FormControl>
                    <FormMessage error={profileErrors.shopAddress?.city} />
                  </FormField>
                </div>

                <div className="mt-4">
                  <FormField name="yearsOfExperience">
                    <FormLabel>Years of Experience</FormLabel>
                    <FormControl error={profileErrors.yearsOfExperience}>
                      <select {...registerProfile("yearsOfExperience")}>
                        {[...Array(30)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1} year{i > 0 ? "s" : ""}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage error={profileErrors.yearsOfExperience} />
                  </FormField>
                </div>

                <div className="flex space-x-4 mt-6">
                  <button
                    type="submit"
                    disabled={isSubmittingProfile}
                    className="flex-1 bg-rose-500 text-white py-2 px-4 rounded-lg hover:bg-rose-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmittingProfile ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelProfile}
                    disabled={isSubmittingProfile}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </FormProvider>
          </div>
        )}
      </div>
    </div>
  );
};

export default BeauticianEditProfileUI;