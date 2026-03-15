import express from 'express';
const router=express.Router();
import { authenticateBeautician, authenticateCustomer, authenticateUser, beauticianController, beauticianServiceController, customServiceController, postController, scheduleController } from '../../../infrastructure/config/di'
import { uploadFields, uploadMediaArray, uploadSingle } from '../middleware/multer';
import { validateBeauticianFiles } from '../validator/validateFileUpload';
import { validatePaymentDetails,validateBeauticianData, validateAddCustomServiceInput, validateCreatePostInput } from '../middleware/validateBeauticianINput';
import { validateAddAvailability, validateRecurringSchedule } from '../validator/validateScheduleInput';
import { validatePamphletUpload } from '../validator/valiadtePampletUpload';

//user route
router.get('/pamphlet/:id',authenticateUser,beauticianServiceController.getPamphletForCustomer)
router.get('/schedules/:id',authenticateUser,scheduleController.getAvailabilityForUser)
router.get('/location/:id',authenticateUser,beauticianController.getServiceArea)

router.post('/register',authenticateCustomer,uploadFields(['portfolioImage', 'certificateImage', 'shopPhotos', 'shopLicence']),validateBeauticianFiles,validateBeauticianData,beauticianController.beauticianRegistration)
router.get('/status', authenticateCustomer, beauticianController.verifiedStatus);
router.patch('/register',authenticateCustomer,validatePaymentDetails,beauticianController.updateRegistration)
router.get('/profile',authenticateUser,beauticianController.viewEditProfile)
router.patch('/profile',authenticateUser,beauticianController.updateProfileData)
//service
router.get('/services/selection',authenticateBeautician,beauticianServiceController.getBeauticianServiceSelection)//get selected page
router.put('/services',authenticateBeautician,beauticianServiceController.upsertBeuticianService)//select system service
router.post('/services/custom',authenticateBeautician,validateAddCustomServiceInput,customServiceController.addCustomService)
router.get('/services',authenticateBeautician,beauticianServiceController.getBeauticianServiceList)
router.get('/services/:id',authenticateUser,beauticianServiceController.getBeauticianServiceListForCustomer)

//pamphlet
router.patch('/pamphlet',authenticateBeautician,uploadSingle('pamphletImg'),validatePamphletUpload,beauticianServiceController.uploadpamphlet)
router.delete('/pamphlet',authenticateBeautician,beauticianServiceController.deletepamphlet)
router.get('/pamhlet/:beauticianId',authenticateUser,beauticianServiceController.getPamphletForCustomer)
router.get('/pamphlet',authenticateBeautician,beauticianServiceController.getPamphlet)

//location
router.get('/location',authenticateBeautician,beauticianController.getServiceArea)
router.patch('/location',authenticateBeautician,beauticianController.addServiceArea)

//schedule
router.put('/schedules',authenticateBeautician,validateAddAvailability,scheduleController.addAvailability)
router.delete('/schedules/:id',authenticateBeautician,scheduleController.deleteAvailability)
router.get('/schedules',authenticateBeautician,scheduleController.getAvailability)
router.post('/schedules/recurring',authenticateBeautician,validateRecurringSchedule,scheduleController.addRecurringSchedule)
router.delete('/schedules/recurring/:id',authenticateBeautician,scheduleController.deleteRecurringAvailability)

//post


router.get('/post/:id',authenticateUser,postController.getBeauticianPost)
export  default router