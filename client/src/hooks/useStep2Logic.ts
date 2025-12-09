
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Step2Schema, type Step2Data } from "../lib/validations/user/validateBeauticianRegiter";
import { zodResolver } from "@hookform/resolvers/zod";

export function useStep2Logic(onNext: (data: Step2Data, files: {
  portfolioFiles: File[];
  certificateFiles: File[];
  shopPhotos?: File[];
  licenseFiles?: File[];
}) => void) {
  const methods = useForm<Step2Data>({
    resolver: zodResolver(Step2Schema),
    mode: 'onSubmit',
    defaultValues: {
      hasShop: false,
      uploads: {
        portfolio: [],
        certificates: []
      }
    }
  });

  const [hasShop, setHasShop] = useState<boolean | null>(null);
  const [portfolioFiles, setPortfolioFiles] = useState<File[]>([]);
  const [certificateFiles, setCertificateFiles] = useState<File[]>([]);
  const [shopPhotos, setShopPhotos] = useState<File[]>([]);
  const [licenseFiles, setLicenseFiles] = useState<File[]>([]);
  
  // Validation alert state
  const [validationAlert, setValidationAlert] = useState<{
    isOpen: boolean;
    message: string;
    type: 'error' | 'warning' | 'info';
  }>({
    isOpen: false,
    message: '',
    type: 'error'
  });

  const showValidationError = (message: string, type: 'error' | 'warning' | 'info' = 'error') => {
    setValidationAlert({ isOpen: true, message, type });
  };

  const closeValidationAlert = () => {
    setValidationAlert({ isOpen: false, message: '', type: 'error' });
  };

  const handlePortfolioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setPortfolioFiles(prev => [...prev, ...newFiles].slice(0, 10));
    }
  };

  const handleCertificateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setCertificateFiles(prev => [...prev, ...newFiles].slice(0, 5));
    }
  };

  const handleShopPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setShopPhotos(prev => [...prev, ...newFiles].slice(0, 5));
    }
  };

  const handleLicenseUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setLicenseFiles(prev => [...prev, ...newFiles].slice(0, 2));
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (hasShop === null) {
      showValidationError('Please select whether you have a shop or not', 'warning');
      return;
    }

    if (portfolioFiles.length < 3) {
      showValidationError(
        `Please upload at least 3 portfolio photos. You have uploaded ${portfolioFiles.length} photo${portfolioFiles.length !== 1 ? 's' : ''}. ${3 - portfolioFiles.length} more needed.`,
        'error'
      );
      return;
    }

    if (hasShop && shopPhotos.length < 3) {
      showValidationError(
        `Please upload at least 3 shop photos. You have uploaded ${shopPhotos.length} photo${shopPhotos.length !== 1 ? 's' : ''}. ${3 - shopPhotos.length} more needed.`,
        'error'
      );
      return;
    }

    // Validate shop details if hasShop is true
    if (hasShop) {
      const shopName = methods.getValues('shop.shopName');
      const address = methods.getValues('shop.address');
      const city = methods.getValues('shop.city');
      const pincode = methods.getValues('shop.pincode');

      if (!shopName?.trim()) {
        showValidationError('Please enter your shop name', 'warning');
        return;
      }
      if (!address?.trim()) {
        showValidationError('Please enter your shop address', 'warning');
        return;
      }
      if (!city?.trim()) {
        showValidationError('Please enter your city', 'warning');
        return;
      }
      if (!pincode?.trim()) {
        showValidationError('Please enter your pincode', 'warning');
        return;
      }
    }

    // Create placeholder URLs for Zod validation only
    const portfolioUrls = portfolioFiles.map((_, i) => `https://placeholder.com/${i}`);
    const certificateUrls = certificateFiles.map((_, i) => `https://placeholder.com/${i}`);

    if (hasShop) {
      const shopPhotoUrls = shopPhotos.map((_, i) => `https://placeholder.com/${i}`);
      const licenseUrls = licenseFiles.map((_, i) => `https://placeholder.com/${i}`);

      const shopName = methods.getValues('shop.shopName');
      const address = methods.getValues('shop.address');
      const city = methods.getValues('shop.city');
      const pincode = methods.getValues('shop.pincode');

      const data = {
        hasShop: true as const,
        uploads: {
          portfolio: portfolioUrls,
          certificates: certificateUrls.length > 0 ? certificateUrls : undefined
        },
        shop: {
          shopName: shopName || '',
          address: address || '',
          city: city || '',
          pincode: pincode || '',
          photos: shopPhotoUrls,
          license: licenseUrls.length > 0 ? licenseUrls : undefined
        }
      };

      const result = Step2Schema.safeParse(data);
      
      if (!result.success) {
        const firstError = result.error.issues[0];
        showValidationError(`${firstError.path.join('.')} - ${firstError.message}`, 'error');
        console.error('Validation errors:', result.error.issues);
        return;
      }

      // Pass validated data AND files to parent
      onNext(result.data, {
        portfolioFiles,
        certificateFiles,
        shopPhotos,
        licenseFiles
      });
    } else {
      const data = {
        hasShop: false as const,
        uploads: {
          portfolio: portfolioUrls,
          certificates: certificateUrls.length > 0 ? certificateUrls : undefined
        }
      };

      const result = Step2Schema.safeParse(data);
      
      if (!result.success) {
        const firstError = result.error.issues[0];
        showValidationError(`${firstError.path.join('.')} - ${firstError.message}`, 'error');
        console.error('Validation errors:', result.error.issues);
        return;
      }

      onNext(result.data, {
        portfolioFiles,
        certificateFiles
      });
    }
  };

  return {
    methods,
    hasShop,
    setHasShop,
    portfolioFiles,
    certificateFiles,
    shopPhotos,
    licenseFiles,
    handlePortfolioUpload,
    handleCertificateUpload,
    handleShopPhotoUpload,
    handleLicenseUpload,
    handleSubmit,
    validationAlert,
    closeValidationAlert
  };
}