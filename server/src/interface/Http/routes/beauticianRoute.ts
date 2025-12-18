import express from 'express';
const router=express.Router();
import { authenticateBeautician, authenticateCustomer, beauticianController } from '../../../infrastructure/config/di'
import { uploadFields } from '../middleware/multer';
import { validateBeauticianFiles } from '../validator/validateFileUpload';
import { validatePaymentDetails,validateBeauticianData } from '../middleware/validateBeauticianINput';


router.post('/register',authenticateCustomer,uploadFields(['portfolioImage', 'certificateImage', 'shopPhotos', 'shopLicence']),validateBeauticianFiles,validateBeauticianData,beauticianController.beauticianRegistration)
router.get('/status', authenticateCustomer, beauticianController.verifiedStatus);
router.patch('/register',authenticateCustomer,validatePaymentDetails,beauticianController.updateRegistration)
router.get('/profile',authenticateBeautician,beauticianController.viewEditProfile)
router.patch('/profile',authenticateBeautician,beauticianController.updateProfileData)
export  default router