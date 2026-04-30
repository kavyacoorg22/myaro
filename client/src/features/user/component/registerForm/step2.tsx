import { useState } from "react";
import { useStep2Logic } from "../../../../hooks/useStep2Logic";
import type { Step2Data } from "../../../../lib/validations/user/validateBeauticianRegiter";
import { Step2UI } from "./step2UI";
import { ServiceModes, type ServiceModesType } from "../../../../constants/types/beautician";
import type { IBeauticianReRegistrationPrefillDto } from "../../../../types/dtos/beautician";

export function Step2Component({ 
  onNext, 
  onBack,
  prefill // ✅ ADDED
}: { 
  onNext: (data: Step2Data, files: {
    portfolioFiles: File[];
    certificateFiles: File[];
    shopPhotos?: File[];
    licenseFiles?: File[];
  }, serviceModes: ServiceModesType[]) => void;
  onBack: () => void;
  prefill?: IBeauticianReRegistrationPrefillDto | null; // ✅ ADDED
}) {
  const [serviceModes, setServiceModes] = useState<ServiceModesType[]>(
    (prefill?.serviceModes as ServiceModesType[]) ?? [] // ✅ ADDED — prefill service modes
  );
  const [hasShop, setHasShop] = useState<boolean | null>(prefill?.hasShop ?? null);

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

  const logic = useStep2Logic(onNextWithModes, prefill); // ✅ ADDED prefill arg

  return (
    <Step2UI
      {...logic}
      onBack={onBack}
      serviceModes={serviceModes}
      setServiceModes={setServiceModes}
      prefill={prefill} // ✅ ADDED
    />
  );
}