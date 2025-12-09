import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Step3Schema, type Step3Data } from "../lib/validations/user/validateBeauticianRegiter";

export function useStep3Logic(onNext: (data: Step3Data) => void) {
  const methods = useForm<Step3Data>({
    resolver: zodResolver(Step3Schema),
    mode: 'onSubmit',
    defaultValues: {
      accountHolderName: '',
      accountNumber: '',
      confirmAccountNumber: '',
      ifscCode: '',
      bankName: '',
      upiId: ''
    }
  });

  const handleSubmit = () => {
    methods.handleSubmit((data) => {
      console.log('Step 3 data:', data);
      onNext(data);
    })();
  };

  return {
    methods,
    handleSubmit
  };
}