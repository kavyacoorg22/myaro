import { Router } from "express";
import { adminController, adminUserManagementController, authenticateAdmin, refreshTokenController, categoryController, serviceController } from "../../../infrastructure/config/di";
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
router.get('/category/:categoryId/services',authenticateAdmin,serviceController.getServices)


export  default router