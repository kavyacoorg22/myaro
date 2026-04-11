import { Router } from "express";
import { adminController, adminUserManagementController, authenticateAdmin, refreshTokenController, categoryController, serviceController, customServiceController, paymentController, bookingController } from "../../../infrastructure/config/di";
import { valiadteAdminAuthInput, ValidateAdminCategoryInput, ValidateAdminServiceInput, ValidateCategoryUpdateInput } from "../middleware/validateAdminInput";
const router =Router()

router.post('/login',valiadteAdminAuthInput,adminController.login)
router.get('/users',authenticateAdmin,adminUserManagementController.getAllUsers)
router.patch('/users/:id/status',authenticateAdmin,adminUserManagementController.toggleUserStatus)
router.get('/beautician',authenticateAdmin,adminUserManagementController.getAllBeautician)
router.get('/beautician/:id',authenticateAdmin,adminUserManagementController.getBeauticianProfile)
router.patch('/beautician/:id/approve',authenticateAdmin,adminUserManagementController.approveBeautician)
router.patch('/beautician/:id/reject',authenticateAdmin,adminUserManagementController.rejectBeautician)
router.post('/auth/refresh', refreshTokenController.handle);
//category
router.post('/category',authenticateAdmin,ValidateAdminCategoryInput,categoryController.addCategory)
router.patch('/category/:id',authenticateAdmin,ValidateCategoryUpdateInput,categoryController.updateCategory)
router.patch('/category/:id/status',authenticateAdmin,categoryController.toggleCategoryStatus)
//service
router.post('/service',authenticateAdmin,ValidateAdminServiceInput,serviceController.addService)
router.patch('/service/:id',authenticateAdmin,ValidateAdminServiceInput,serviceController.updateService)
router.patch('/service/:id/status',authenticateAdmin,serviceController.toggleServiceStatus)
//customservice
router.get('/custom-services',authenticateAdmin,customServiceController.getAllCustomServices)
router.get('/custom-services/:id',authenticateAdmin,customServiceController.getCustomServiceDetail)
router.patch('/custom-services/:id/status',authenticateAdmin,customServiceController.updateCustomServiceStatus)
//refund-dispute -transaction
router.post('/bookings/:bookingId/refund',authenticateAdmin,paymentController.processRefund)
router.post('/bookings/:bookingId/payout',authenticateAdmin,paymentController.releasePayout)

router.get('/bookings',authenticateAdmin,bookingController.getAllBookingsForAdmin)
router.get('/bookings/:bookingId',authenticateAdmin,bookingController.getBookingDetailForAdmin)
router.get('/disputes',authenticateAdmin,bookingController.getAllDisputeForAdmin)
router.get('/bookings/:bookingId/dispute',authenticateAdmin,bookingController.getDisputeDetailForAdmin)
router.get('/refunds',authenticateAdmin,bookingController.getAllRefunsForAdmin)
router.get('/refunds/:refundId',authenticateAdmin,bookingController.getRefundDetailForAdmin)
export  default router