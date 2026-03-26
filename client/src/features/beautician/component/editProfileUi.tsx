import { Camera } from "lucide-react";
import { FormControl, FormField, FormLabel, FormMessage } from "../../../components/ui/form";
import { FormProvider, useForm, type FieldErrors, type FieldError } from "react-hook-form";
import { CustomerProfileSchema, ProfileSchema, type CustomerProfileType, type ProfileType } from "../../../lib/validations/user/validateProfileData";
import { zodResolver } from "@hookform/resolvers/zod";
import type { IProfileViewData } from "../../../types/api/beautician";
import { useEffect, useRef } from "react";
import type { ServiceModesType } from "../../../constants/types/beautician";
import { ServiceModeSelector } from "./profileServiceModeSelector";

interface BeauticianProfileUIProps {
  profileData: IProfileViewData;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSaveProfile: (data: ProfileType | CustomerProfileType) => void;
  handleCancelProfile: () => void;
  handleBack: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  isCustomer: boolean;
}


// ─── Main Component ───────────────────────────────────────────────────────────

export const BeauticianEditProfileUI = ({
  profileData,
  handleFileChange,
  handleSaveProfile,
  handleCancelProfile,
  fileInputRef,
  isCustomer,
}: BeauticianProfileUIProps) => {
  const hasReset = useRef(false);
  const profileMethods = useForm({
    resolver: zodResolver(isCustomer ? CustomerProfileSchema : ProfileSchema),
    defaultValues: isCustomer
      ? { userName: "", fullName: "" }
      : {
          userName: "",
          fullName: "",
          about: "",
          shopName: "",
          shopAddress: { address: "", city: "" },
          yearsOfExperience: "1",
          serviceModes: [] as ServiceModesType[],
        },
  });
useEffect(() => {
  if (profileData.userName && !hasReset.current) {
    hasReset.current = true; 
    profileMethods.reset({
      userName: profileData.userName || "",
      fullName: profileData.fullName || "",
      about: profileData.about || "",
      shopName: profileData.shopName || "",
      shopAddress: profileData.shopAddress || { address: "", city: "" },
      yearsOfExperience: profileData.yearsOfExperience || "1",
      serviceModes: (profileData.serviceModes as ServiceModesType[]) || [],
    });
  }
}, [profileData, profileMethods]);

  const profileErrors = profileMethods.formState.errors as FieldErrors<ProfileType>;
  const { register: registerProfile, formState: { isSubmitting: isSubmittingProfile } } = profileMethods;
        console.log("serviceModes watch:", profileMethods.watch("serviceModes"));
console.log("form errors:", profileMethods.formState.errors);
  const selectedModes: ServiceModesType[] = profileMethods.watch("serviceModes") ?? [];
  const shopSelected = selectedModes.includes("SHOP");

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-6">Profile Information</h2>

        {/* Profile Photo */}
        <div className="flex items-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {profileData.profileImg ? (
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

            {/* Username */}
            <FormField name="userName">
              <FormLabel>Username</FormLabel>
              <FormControl error={profileErrors.userName}>
                <input type="text" {...registerProfile("userName")} />
              </FormControl>
              <FormMessage error={profileErrors.userName} />
            </FormField>

            {/* Full Name */}
            <div className="mt-4">
              <FormField name="fullName">
                <FormLabel>Full Name</FormLabel>
                <FormControl error={profileErrors.fullName}>
                  <input type="text" {...registerProfile("fullName")} />
                </FormControl>
                <FormMessage error={profileErrors.fullName} />
              </FormField>
            </div>

            {!isCustomer && (
              <>
                {/* About */}
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

                {/* Service Modes */}
                <div className="mt-4">
                  <FormField name="serviceModes">
                    <FormLabel>
                      Service Modes <span className="text-rose-500">*</span>
                    </FormLabel>
                    <ServiceModeSelector
                      value={selectedModes}
                      onChange={(modes) =>
                        profileMethods.setValue("serviceModes", modes, { shouldValidate: true })
                      }
                      error={profileErrors.serviceModes as FieldError | undefined}
                    />
                    <FormMessage error={profileErrors.serviceModes as FieldError | undefined} />
                  </FormField>
                </div>

                {/* Shop fields — only when SHOP is selected */}
                {shopSelected && (
                  <>
                    <div className="mt-4">
                      <FormField name="shopName">
                        <FormLabel>
                          Shop Name <span className="text-rose-500">*</span>
                        </FormLabel>
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
                        <FormLabel>
                          Shop Address <span className="text-rose-500">*</span>
                        </FormLabel>
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
                        <FormLabel>
                          City <span className="text-rose-500">*</span>
                        </FormLabel>
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
                  </>
                )}

                {/* Years of Experience */}
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
              </>
            )}

            {/* Action Buttons */}
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
    </div>
  );
};

export default BeauticianEditProfileUI;