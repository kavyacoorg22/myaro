import { FormProvider, useForm } from "react-hook-form";
import { Step1Schema, type Step1Data } from "../../../../lib/validations/user/validateBeauticianRegiter";
import { FormControl, FormField, FormMessage } from "../../../../components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../redux/appStore";

export const Step1Component: React.FC<{ onNext: (data: Step1Data) => void }> = ({ onNext }) => {
  const methods = useForm<Step1Data>({
    resolver:zodResolver(Step1Schema),
    defaultValues: {
      yearsOfExperience: 0,
      about: ''
    }
  });

  const currentUser=useSelector((store:RootState)=>store.user.currentUser)
  console.log(currentUser)

  const handleSubmit = () => {
    methods.handleSubmit((data) => {
      onNext(data);
    })();
  };

  return (
    <FormProvider {...methods}>
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-center mb-2">Register as Beautician - Step 1 of 3</h2>
          <p className="text-sm text-center text-gray-600 mb-1">Help us verify your beautician profile ✨</p>
          <p className="text-xs text-center text-gray-500">We only ask a few details to ensure genuine professionals on our platform.</p>
          <p className="text-xs text-center text-gray-500">Your information is private and secure 🔒</p>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          <div className="h-1 w-16 bg-purple-500 rounded"></div>
          <div className="h-1 w-16 bg-gray-300 rounded"></div>
          <div className="h-1 w-16 bg-gray-300 rounded"></div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-6 flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center text-xl">
            👤
          </div>
          <div>
            <p className="font-medium">{currentUser.userName}</p>
            <p className="text-sm text-gray-600">{currentUser.fullName}</p>
          </div>
        </div>

        <div className="mb-4">
          <FormField name="yearsOfExperience">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Years of experience
            </label>
            <FormControl>
              <input
                type="number"
                placeholder="Enter years of experience (e.g. 5 or 10)"
                className="peer"
                {...methods.register('yearsOfExperience', {valueAsNumber:true,
                  required: 'Years of experience is required'
                })}
              />
            </FormControl>
            <FormMessage error={methods.formState.errors.yearsOfExperience} />
          </FormField>
        </div>

        <div className="mb-4">
          <FormField name="about">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              About you
            </label>
            <p className="text-xs text-gray-500 mb-2">Tell us about your skills and background</p>
            <FormControl>
              <textarea
                placeholder="e.g: Bridal specialist with salon & home service experience"
                rows={5}
                className="peer resize-none"
                {...methods.register('about', {
                  required: 'About you is required'
                })}
              />
            </FormControl>
            <FormMessage error={methods.formState.errors.about} />
          </FormField>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-purple-300 hover:bg-purple-400 text-gray-800 font-medium py-3 rounded-lg mt-6 transition"
        >
          Continue
        </button>

        <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
          <span>You can edit this later</span>
          <span className="text-orange-500">Next: Upload photos & certificates</span>
        </div>
      </div>
    </FormProvider>
  );
};