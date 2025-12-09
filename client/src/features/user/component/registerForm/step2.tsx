import { useStep2Logic } from "../../../../hooks/useStep2Logic";
import type { Step2Data } from "../../../../lib/validations/user/validateBeauticianRegiter";
import { Step2UI } from "./step2UI";

export function Step2Component({ 
  onNext, 
  onBack 
}: { 
  onNext: (data: Step2Data, files: {
    portfolioFiles: File[];
    certificateFiles: File[];
    shopPhotos?: File[];
    licenseFiles?: File[];
  }) => void; 
  onBack: () => void;
}) {
  const logic = useStep2Logic(onNext);
  
  return (
    <Step2UI
      {...logic}
      onBack={onBack}
    />
  );
}