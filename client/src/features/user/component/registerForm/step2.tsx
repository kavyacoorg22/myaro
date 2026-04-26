import { useState } from "react";
import { useStep2Logic } from "../../../../hooks/useStep2Logic";
import type { Step2Data } from "../../../../lib/validations/user/validateBeauticianRegiter";
import { Step2UI } from "./step2UI";
import { ServiceModes, type ServiceModesType } from "../../../../constants/types/beautician";

export function Step2Component({ 
  onNext, 
  onBack 
}: { 
  onNext: (data: Step2Data, files: {
    portfolioFiles: File[];
    certificateFiles: File[];
    shopPhotos?: File[];
    licenseFiles?: File[];
  }, serviceModes: ServiceModesType[]) => void;  // ← pass serviceModes up
  onBack: () => void;
}) {
  const [serviceModes, setServiceModes] = useState<ServiceModesType[]>([]);

  // Wrap onNext to inject serviceModes automatically
  const onNextWithModes = (
    data: Step2Data,
    files: {
      portfolioFiles: File[];
      certificateFiles: File[];
      shopPhotos?: File[];
      licenseFiles?: File[];
    }
  ) => {
     const finalModes = data.hasShop
    ? [...new Set([...serviceModes, ServiceModes.SHOP])] 
    : serviceModes.filter((m) => m !== ServiceModes.SHOP); 
    onNext(data, files, finalModes);
  };

  const logic = useStep2Logic(onNextWithModes);

  return (
    <Step2UI
      {...logic}
      onBack={onBack}
      serviceModes={serviceModes}
      setServiceModes={setServiceModes}
    />
  );
}