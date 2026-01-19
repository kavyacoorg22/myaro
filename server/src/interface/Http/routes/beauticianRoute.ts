import express from 'express';
const router=express.Router();
import { authenticateBeautician, authenticateCustomer, authenticateUser, beauticianController, beauticianServiceController, customServiceController, scheduleController } from '../../../infrastructure/config/di'
import { uploadFields, uploadSingle } from '../middleware/multer';
import { validateBeauticianFiles } from '../validator/validateFileUpload';
import { validatePaymentDetails,validateBeauticianData, validateAddCustomServiceInput } from '../middleware/validateBeauticianINput';
import { validateAddAvailability } from '../validator/validateScheduleInput';


router.post('/register',authenticateCustomer,uploadFields(['portfolioImage', 'certificateImage', 'shopPhotos', 'shopLicence']),validateBeauticianFiles,validateBeauticianData,beauticianController.beauticianRegistration)
router.get('/status', authenticateCustomer, beauticianController.verifiedStatus);
router.patch('/register',authenticateCustomer,validatePaymentDetails,beauticianController.updateRegistration)
router.get('/profile',authenticateBeautician,beauticianController.viewEditProfile)
router.patch('/profile',authenticateBeautician,beauticianController.updateProfileData)
//service
router.get('/services/selection',authenticateBeautician,beauticianServiceController.getBeauticianServiceSelection)//get selected page
router.put('/services',authenticateBeautician,beauticianServiceController.upsertBeuticianService)//select system service
router.post('/services/custom',authenticateBeautician,validateAddCustomServiceInput,customServiceController.addCustomService)
router.get('/services',authenticateBeautician,beauticianServiceController.getBeauticianServiceList)
//pamphlet
router.patch('/pamphlet',authenticateBeautician,uploadSingle('pamphletImg'),beauticianServiceController.uploadpamphlet)
router.delete('/pamphlet',authenticateBeautician,beauticianServiceController.deletepamphlet)
router.get('/pamphlet',authenticateBeautician,beauticianServiceController.getPamphlet)
router.put('/schedules',authenticateBeautician,validateAddAvailability,scheduleController.addAvailability)
router.patch('/schedules',authenticateBeautician,scheduleController.deleteAvailability)
router.get('/schedules',authenticateBeautician,scheduleController.getAvailability)
//location
router.get('/location',authenticateBeautician,beauticianController.getServiceArea)
router.put('/location',authenticateBeautician,beauticianController.addServiceArea)
//user route
router.get('/pamphlet/:id',authenticateUser,beauticianServiceController.getPamphletForCustomer)
router.get('/services/:id',authenticateUser,beauticianServiceController.getBeauticianServiceListForCustomer)
router.get('/schedules/:id',authenticateUser,scheduleController.getAvailabilityForUser)
router.get('/location/:id',authenticateUser,beauticianController.getServiceArea)



export  default router