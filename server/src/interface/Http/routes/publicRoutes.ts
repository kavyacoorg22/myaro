import {  Router } from "express"
import { authenticateUser, beauticianController, profileController, searchHistoryController } from "../../../infrastructure/config/di";
import {  uploadSingle } from "../middleware/multer";
import { validateImageUpload } from "../validator/validateImageUpload";
const router=Router()

router.get('/profile/me',authenticateUser,profileController.ownProfile)
router.get('/profile/:id',authenticateUser,profileController.ownProfile)
router.patch('/profile/profile-image',authenticateUser,uploadSingle('profileImg'),validateImageUpload, profileController.changeProfileImage)
router.get('/search',authenticateUser,beauticianController.searchBeautician)
router.post('/search/history/:id',authenticateUser,searchHistoryController.addSearchHistory)
router.get('/search/history',authenticateUser,searchHistoryController.recentSearch)
router.delete('/search/history/:id',authenticateUser,searchHistoryController.removeSearchHistory)
router.delete('/search/history',authenticateUser,searchHistoryController.clearSearchHistory)

export default router
