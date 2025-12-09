import { FormProvider } from "react-hook-form";
import { FormField, FormMessage } from "../../../../components/ui/form";
import { useState } from "react";
import { Eye, EyeClosedIcon } from "lucide-react";
import { EyeClosed } from "@phosphor-icons/react";

export function Step3UI({
  methods,
  handleSubmit,
  onBack
}: any) {
  const { register } = methods;
const [show,setShow]=useState(false)
  
  return (
    <FormProvider {...methods}>
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-center mb-2">
            Register as Beautician - Step 3 of 3
          </h2>
          <p className="text-sm text-center text-blue-600 mb-1">Add Payout Details</p>
          <p className="text-xs text-center text-gray-600">
            Show your work & prove your skills ✨ This helps customers trust and choose you.
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          <div className="h-1 w-16 bg-purple-500 rounded"></div>
          <div className="h-1 w-16 bg-purple-500 rounded"></div>
          <div className="h-1 w-16 bg-purple-500 rounded"></div>
        </div>

        {/* Bank Details Section */}
        <div className="mb-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-800 mb-4">Bank Details</h3>

          <div className="space-y-4">
            <FormField name="accountHolderName">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account holder name
              </label>
              <input
                type="text"
                placeholder="Eg: Kavya MS"
                className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none transition focus:border-blue-500 focus:ring-blue-300"
                {...register('accountHolderName')}
              />
              <FormMessage />
            </FormField>

            <FormField name="accountNumber">
             <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Number
              </label>
              <input
                type={show?'text':'password'} 
                placeholder="Enter Account number"
                className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none transition focus:border-blue-500 focus:ring-blue-300"
                {...register('accountNumber')}
              />
                 <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-2 top-9 text-gray-500 hover:text-black"
                  aria-label={show ? "Hide account number" : "Show account number"}
                >
                  {show ? <Eye className="h-5 w-5" /> : <EyeClosedIcon className="h-5 w-5" />}
                </button>
               </div>
              <FormMessage />
            </FormField>

            <FormField name="confirmAccountNumber">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Account number
              </label>
              <input
                type="text"
                placeholder="Re-Enter Account number"
                className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none transition focus:border-blue-500 focus:ring-blue-300"
                {...register('confirmAccountNumber')}
              />
              <FormMessage />
            </FormField>

            <FormField name="ifscCode">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IFSC code
              </label>
              <input
                type="text"
                placeholder="Eg: HDFC0001234"
                className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none transition focus:border-blue-500 focus:ring-blue-300 uppercase"
                {...register('ifscCode')}
                maxLength={11}
              />
              <FormMessage />
            </FormField>

            <FormField name="bankName">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Name
              </label>
              <input
                type="text"
                placeholder="Eg: HDFC"
                className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none transition focus:border-blue-500 focus:ring-blue-300"
                {...register('bankName')}
              />
              <FormMessage />
            </FormField>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
              <span className="text-green-600 text-lg">✓</span>
              <p className="text-xs text-green-700">
                🔒 Your payout information is secure. <br />
                Used only to deposit earnings into your account
              </p>
            </div>
          </div>
        </div>

        {/* UPI Section */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-800 mb-4">UPI ID (Optional)</h3>

          <FormField name="upiId">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              UPI ID
            </label>
            <input
              type="text"
              placeholder="Eg: Kavya@paytm@okbi"
              className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none transition focus:border-blue-500 focus:ring-blue-300"
              {...register('upiId')}
            />
            <FormMessage />
          </FormField>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 rounded-lg transition"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 bg-purple-300 hover:bg-purple-400 text-gray-800 font-medium py-3 rounded-lg transition"
          >
            Continue and finish setup
          </button>
        </div>

        <p className="text-center text-xs text-gray-500 mt-4">
          ⏱️ This will only take 2 minutes to complete
        </p>
      </div>
    </FormProvider>
  );
}