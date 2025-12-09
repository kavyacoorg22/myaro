import { FormProvider, useForm } from "react-hook-form";
import { BankDetailsSchema, type BankDetailsType } from "../../../lib/validations/user/validateProfileData";
import type { IBankDeatilUpdateRequest } from "../../../types/api/beautician";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, FormField, FormLabel, FormMessage } from "../../../components/ui/form";
import { Eye, EyeOff } from "lucide-react";
import { useEffect } from "react";



interface  IBeauticianBankUIProps{
    bankData: IBankDeatilUpdateRequest,
    showAccountNumber: boolean;
    handleSaveBankDetails: (data: BankDetailsType) => void;
    setShowAccountNumber: (show: boolean) => void;
}

export const BeauticianEditBankDetailsUi=({
 bankData,
   showAccountNumber,
   handleSaveBankDetails,
   setShowAccountNumber,
}:IBeauticianBankUIProps)=>{

  const bankMethods=useForm<BankDetailsType>({
  resolver:zodResolver(BankDetailsSchema),
  defaultValues: {
      accountHolderName:  "",
      accountNumber:  "",
      confirmAccountNumber:  "",
      ifscCode:  "",
      bankName:  "",
      upiId:  "",
    },
})

useEffect(() => {
    if (bankData.accountHolderName) { 
      bankMethods.reset({
        accountHolderName: bankData.accountHolderName || "",
        accountNumber: bankData.accountNumber || "",
        ifscCode: bankData.ifscCode || "",
      bankName: bankData.bankName || "",
      upiId: bankData.upiId || "",
      });
    
    }
  }, [bankData, bankMethods]);
  const { register: registerBank, formState: { errors: bankErrors, isSubmitting: isSubmittingBank } } = bankMethods;

  return(
    <>
     <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-6">Bank Account Details</h2>

          <FormProvider {...bankMethods}>
            <form onSubmit={bankMethods.handleSubmit(handleSaveBankDetails)}>
              {/* Account Holder Name */}
              <FormField name="accountHolderName">
                <FormLabel>Account Holder Name</FormLabel>
                <FormControl error={bankErrors.accountHolderName}>
                  <input
                    type="text"
                    placeholder="Eg: Kavya MS"
                    {...registerBank("accountHolderName")}
                  />
                </FormControl>
                <FormMessage error={bankErrors.accountHolderName} />
              </FormField>

              {/* Account Number */}
              <div className="mt-4">
                <FormField name="accountNumber">
                  <FormLabel>Account Number</FormLabel>
                  <div className="relative">
                    <FormControl error={bankErrors.accountNumber}>
                      <input
                        type={showAccountNumber ? "text" : "password"}
                        {...registerBank("accountNumber")}
                        placeholder="Account Number"
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => setShowAccountNumber(!showAccountNumber)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showAccountNumber ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <FormMessage error={bankErrors.accountNumber} />
                </FormField>
              </div>

              {/* Confirm Account Number */}
              <div className="mt-4">
                <FormField name="confirmAccountNumber">
                  <FormLabel>Confirm Account Number</FormLabel>
                  <FormControl error={bankErrors.confirmAccountNumber}>
                    <input type="text" {...registerBank("confirmAccountNumber")}
                    placeholder="Confirm Account Number"
                    />
                  </FormControl>
                  <FormMessage error={bankErrors.confirmAccountNumber} />
                </FormField>
              </div>

              {/* IFSC Code */}
              <div className="mt-4">
                <FormField name="ifscCode">
                  <FormLabel>IFSC Code</FormLabel>
                  <FormControl error={bankErrors.ifscCode}>
                    <input
                      type="text"
                      placeholder="HDFC0001234"
                      className="uppercase"
                      {...registerBank("ifscCode", {
                        onChange: (e) => {
                          e.target.value = e.target.value.toUpperCase();
                        },
                      })}
                    />
                  </FormControl>
                  <FormMessage error={bankErrors.ifscCode} />
                </FormField>
              </div>

              {/* Bank Name */}
              <div className="mt-4">
                <FormField name="bankName">
                  <FormLabel>Bank Name</FormLabel>
                  <FormControl error={bankErrors.bankName}>
                    <input
                      type="text"
                      placeholder="HDFC Bank"
                      {...registerBank("bankName")}
                    />
                  </FormControl>
                  <FormMessage error={bankErrors.bankName} />
                </FormField>
              </div>

              {/* UPI ID */}
              <div className="mt-4">
                <FormField name="upiId">
                  <FormLabel>Optional: UPI ID</FormLabel>
                  <FormControl error={bankErrors.upiId}>
                    <input
                      type="text"
                      placeholder="kavya@paytm"
                      {...registerBank("upiId")}
                    />
                  </FormControl>
                  <FormMessage error={bankErrors.upiId} />
                </FormField>
              </div>

              <button
                type="submit"
                disabled={isSubmittingBank}
                className="w-full mt-6 bg-rose-500 text-white py-2 px-4 rounded-lg hover:bg-rose-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmittingBank ? "Saving..." : "Save Bank Details"}
              </button>
            </form>
          </FormProvider>
        </div>
        </div>
    </>
  )
}