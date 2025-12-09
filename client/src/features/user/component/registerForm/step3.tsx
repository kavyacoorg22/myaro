import { useStep3Logic } from "../../../../hooks/useStep3Logic";
import type { Step3Data } from "../../../../lib/validations/user/validateBeauticianRegiter";
import { Step3UI } from "./step3UI"

export function Step3Component({ 
  onNext, 
  onBack 
}: { 
  onNext: (data: Step3Data) => void; 
  onBack: () => void;
}) {
  const logic = useStep3Logic(onNext);
  
  return (
    <Step3UI
      {...logic}
      onBack={onBack}
    />
  );
}