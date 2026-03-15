import {  NextFunction, Request, Response, Router } from "express"
import { authenticateAdmin, authenticateAll, authenticateBeautician, authenticateUser, beauticianController, categoryController, changePasswordController, postController, profileController, searchHistoryController, serviceController } from "../../../infrastructure/config/di";
import {  uploadSingle } from "../middleware/multer";
import { validateImageUpload } from "../validator/validateImageUpload";
import { validateChangePassword } from "../middleware/validateUserInput";
import { validateCreatePostInput, validateSignedUrlRequest } from "../middleware/validateBeauticianINput";
const router=Router()

router.get('/profile/me',authenticateUser,profileController.ownProfile)
router.get('/profile/:id',authenticateUser,profileController.ownProfile)
router.patch('/profile/profile-image',authenticateUser,uploadSingle('profileImg'),validateImageUpload, profileController.changeProfileImage)
router.get('/search',authenticateUser,beauticianController.searchBeautician)
router.post('/search/history/:id',authenticateUser,searchHistoryController.addSearchHistory)
router.get('/search/history',authenticateUser,searchHistoryController.recentSearch)
router.delete('/search/history/:id',authenticateUser,searchHistoryController.removeSearchHistory)
router.delete('/search/history',authenticateUser,searchHistoryController.clearSearchHistory)
//categry and service
router.get('/category/:categoryId/services',authenticateAll,serviceController.getServices)
router.get('/category',authenticateAll,categoryController.getCategory)
router.patch('/change-password',authenticateUser,validateChangePassword,(req:Request,res:Response,next:NextFunction)=>{changePasswordController.handle(req,res,next)})
//feed
router.post( '/posts', authenticateBeautician,validateCreatePostInput, postController.createPost
);
router.get('/posts/feed',postController.getHomefeed)
router.get('/posts/tips-rent',postController.getTipsRentfeed)
router.get('/posts/search',postController.getPostSearchResult)
router.post('/posts/upload',authenticateBeautician,  validateSignedUrlRequest,postController.getSignedUploadUrl)
export default router
