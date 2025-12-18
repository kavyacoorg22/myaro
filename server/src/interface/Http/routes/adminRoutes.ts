import { Router } from "express";
import { adminController, adminUserManagementController, authenticateAdmin, refreshTokenController } from "../../../infrastructure/config/di";
import { valiadteAdminAuthInput } from "../middleware/validateAdminInput";
const router =Router()

router.post('/login',valiadteAdminAuthInput,adminController.login)
router.get('/users',authenticateAdmin,adminUserManagementController.getAllUsers)
router.patch('/users/:id/status',authenticateAdmin,adminUserManagementController.toggleUserStatus)
router.get('/beautician',authenticateAdmin,adminUserManagementController.getAllBeautician)
router.get('/beautician/:id',authenticateAdmin,adminUserManagementController.getBeauticianProfile)
router.patch('/beautician/:id/approve',authenticateAdmin,adminUserManagementController.approveBeautician)
router.patch('/beautician/:id/reject',authenticateAdmin,adminUserManagementController.rejectBeautician)
router.post('/auth/refresh', refreshTokenController.handle);


export  default router