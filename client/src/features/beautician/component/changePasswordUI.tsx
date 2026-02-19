//change password code

import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  ChangePasswordSchema,
  type ChangePasswordType,
} from "../../../lib/validations/user/validateProfileData";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { Eye, EyeOff, Lock } from "lucide-react";

interface ChangePasswordUiProps {
  onSubmit: (data: ChangePasswordType) => Promise<void>;
}

export const ChangePasswordUi = ({ onSubmit }: ChangePasswordUiProps) => {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const methods = useForm<ChangePasswordType>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const {
    register,
    watch,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = methods;

  const watchAll = watch();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <Lock className="w-5 h-5 text-rose-500" />
          <h2 className="text-lg font-semibold">Change Password</h2>{" "}
        </div>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {/* Old Password */}
            <FormField name="oldPassword">
              <div className="relative">
                <FormControl>
                  <input
                    {...register("oldPassword")}
                    type={showOld ? "text" : "password"}
                    placeholder=" "
                    className={watchAll.oldPassword ? "pt-5 pb-1.5" : ""}
                  />
                </FormControl>
                <button
                  type="button"
                  onClick={() => setShowOld((p) => !p)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-black"
                >
                  {showOld ? (
                    <Eye className="h-5 w-5" />
                  ) : (
                    <EyeOff className="h-5 w-5" />
                  )}
                </button>
                <FormLabel
                  className={
                    watchAll.oldPassword ? "top-0.5 text-xs text-blue-500" : ""
                  }
                >
                  current password
                </FormLabel>
              </div>
              <FormMessage error={errors.oldPassword} />
            </FormField>

            {/* New Password */}
            <FormField name="newPassword">
              <div className="relative">
                <FormControl>
                  <input
                    {...register("newPassword")}
                    type={showNew ? "text" : "password"}
                    placeholder=" "
                    className={watchAll.newPassword ? "pt-5 pb-1.5" : ""}
                  />
                </FormControl>
                <button
                  type="button"
                  onClick={() => setShowNew((p) => !p)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-black"
                >
                  {showNew ? (
                    <Eye className="h-5 w-5" />
                  ) : (
                    <EyeOff className="h-5 w-5" />
                  )}
                </button>
                <FormLabel
                  className={
                    watchAll.newPassword ? "top-0.5 text-xs text-blue-500" : ""
                  }
                >
                  New Password
                </FormLabel>
              </div>
              <FormMessage error={errors.newPassword} />
            </FormField>

            {/* Confirm Password */}
            <FormField name="confirmPassword">
              <div className="relative">
                <FormControl>
                  <input
                    {...register("confirmPassword")}
                    type={showConfirm ? "text" : "password"}
                    placeholder=" "
                    className={watchAll.confirmPassword ? "pt-5 pb-1.5" : ""}
                  />
                </FormControl>
                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-black"
                >
                  {showConfirm ? (
                    <Eye className="h-5 w-5" />
                  ) : (
                    <EyeOff className="h-5 w-5" />
                  )}
                </button>
                <FormLabel
                  className={
                    watchAll.confirmPassword
                      ? "top-0.5 text-xs text-blue-500"
                      : ""
                  }
                >
                  Confirm Password
                </FormLabel>
              </div>
              <FormMessage error={errors.confirmPassword} />
            </FormField>

            <button
              disabled={isSubmitting}
              className="mt-4 w-full rounded bg-rose-500 text-white py-2 hover:bg-red-500 disabled:opacity-50 transition"
            >
              {isSubmitting ? "Updating..." : "Update Password"}
            </button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};
