import {  NextFunction, Request, Response, Router } from "express"
import { authenticateAdmin, authenticateAll, authenticateBeautician, authenticateCustomer, authenticateUser, beauticianController, bookingController, categoryController, changePasswordController, chatController, likeCommentController, optionalAuth, paymentController, postController, profileController, searchHistoryController, serviceController } from "../../../infrastructure/config/di";
import {  uploadSingle } from "../middleware/multer";
import { validateImageUpload } from "../validator/validateImageUpload";
import { validateChangePassword, ValidateComment } from "../middleware/validateUserInput";
import { validateCreatePostInput, validateSignedUrlRequest } from "../middleware/validateBeauticianINput";
import { validateRequestRefund } from "../middleware/bookingValidation";
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
router.get('/posts/feed',optionalAuth, postController.getHomefeed)
router.get('/posts/tips-rent',optionalAuth, postController.getTipsRentfeed)
router.get('/posts/search',postController.getPostSearchResult)
router.post('/posts/upload',authenticateBeautician,  validateSignedUrlRequest,postController.getSignedUploadUrl)
//comment like
router.post('/posts/:postId/like',authenticateUser,likeCommentController.addLike)
router.delete('/posts/:postId/like',authenticateUser,likeCommentController.removeLike)
router.post('/posts/:postId/comment',authenticateUser,ValidateComment, likeCommentController.addComment)
router.get('/posts/:postId/comment',authenticateUser,likeCommentController.getPostComment)
router.delete('/posts/:postId/comment/:commentId',authenticateUser,likeCommentController.deleteComment)
//chat
router.post('/chats',authenticateUser,chatController.createChat)
router.get('/chats',authenticateUser,chatController.getUserChats)
router.get('/chat/with/:id',authenticateUser,chatController.getChatByParticipants)
router.get('/chat/:chatId/messages',authenticateUser,chatController.getMessageByChat)
//booking
router.post('/bookings/lock-slot', authenticateCustomer, bookingController.lockSlot);
router.get('/bookings/:bookingId',authenticateUser,bookingController.getBookingById)
router.post('/bookings',authenticateCustomer,bookingController.createBooking),
router.patch('/bookings/:bookingId/status',authenticateUser,bookingController.updateBookingStatus)

//payment
//create order
router.post('/bookings/:bookingId/payment',authenticateCustomer,paymentController.createOrder)
router.post('/payments/verify',authenticateCustomer,paymentController.verifyPayment)
//refund
router.post('/bookings/:bookingId/refund-request',authenticateCustomer, validateRequestRefund,bookingController.requestRefund)
router.post('/bookings/:bookingId/refund-approve',authenticateBeautician,bookingController.approveRefund)
router.post('/bookings/:bookingId/refund-dispute',authenticateBeautician,bookingController.disputeRefund)
router.post('/bookings/:bookingId/cancel',authenticateCustomer,bookingController.cancelBooking)
//wallet
router.get('/wallet',authenticateCustomer,paymentController.getUserRefundSummery)
export default router
