import { MongoUserRepository } from "../repositories/UserRepository";
import { RegisterUserController } from "../../interface/Http/controllers/auth/registerController";
import { RegisterUserUseCase } from "../../application/usecases/auth/registerUserUseCase";
import { PreSignupController } from "../../interface/Http/controllers/auth/preSignupController";
import { PreSignupUseCase } from "../../application/usecases/auth/preSignupUseCase";
import { CreateOtpUseCase } from "../../application/usecases/auth/createOtpUseCase";
import { ResendOtpUseCase } from "../../application/usecases/auth/resendOtpUseCase";
import { VerifyOtpUseCase } from "../../application/usecases/auth/verifyOtpUsecase";
import { OtpController } from "../../interface/Http/controllers/auth/otpController";
import { CompleteSignupUseCase } from "../../application/usecases/auth/completeSignupUseCase";
import { CompleteSignupController } from "../../interface/Http/controllers/auth/completeSignupController";
import { UserLoginUseCase } from "../../application/usecases/auth/userLoginUseCase";
import { JwtTokenService, } from "../service/tokenService";
import { BcryptAuthService } from "../service/authService";
import { Logincontroller } from "../../interface/Http/controllers/auth/loginController";
import { LogoutUseCase } from "../../application/usecases/auth/logoutUseCase";
import { RedisTokenBlacklistService } from "../service/blackListTokenService";
import { LogoutController } from "../../interface/Http/controllers/auth/logoutController";
import { authMiddleware, optionalAuthMiddleware } from "../../interface/Http/middleware/authMiddleware";
import { OwnProfileUseCase } from "../../application/usecases/public/ownProfileUseCase";
import { ProfileController } from "../../interface/Http/controllers/public/profileController";
import { RefreshTokenController } from "../../interface/Http/controllers/auth/refreshTokenController";
import { RefreshTokenUseCase } from "../../application/usecases/auth/refershTokenUseCase";
import { AuthAccountRepository } from "../repositories/UserAuthAccountRepository";
import { mongoBeauticianRepository } from "../repositories/beautician/Beauticianrepository";
import { BeauticianRegistrationUseCase } from "../../application/usecases/beautician/beauticianregistrationUseCase";
import { BeauticianController } from "../../interface/Http/controllers/beautician/beauticianController";
import { NodemailerOtpService } from "../service/sendEmail";
import { ForgotPasswordUseCase } from "../../application/usecases/auth/forgotPasswordUseCase";
import { ResetPasswordUseCase } from "../../application/usecases/auth/resetPasswordUseCase";
import { ResetPasswordController } from "../../interface/Http/controllers/auth/ResetPasswordController";
import { MongoAdminRepository } from "../repositories/admin/AdminRepository";
import { AdminLoginUseCase } from "../../application/usecases/admin/loginUseCase";
import { AdminAuthController } from "../../interface/Http/controllers/admin/authController";
import { GetAllUserUseCase } from "../../application/usecases/admin/management/getAllUserUseCase";
import { AdminUserManagementController } from "../../interface/Http/controllers/admin/adminUserController";
import { ToggleUserStatusUseCase } from "../../application/usecases/admin/management/toggleUserUseCase";
import { S3Storage } from "../fileStorage/s3Storage";
import { BeauticianVerificationStatusUseCase } from "../../application/usecases/beautician/beauticianverificationStatusUseCase";
import { GetAllBeauticianUseCase } from "../../application/usecases/admin/management/getAllBeauticianUseCase";
import { ViewBeauticianDetailUseCase } from "../../application/usecases/admin/management/viewBeauticianUseCase";
import { ApproveBeauticianUseCase } from "../../application/usecases/admin/management/approveBeauticianUseCase";
import { RejectBeauticianUseCase } from "../../application/usecases/admin/management/rejectBeauticianUseCase";
import { BeauticianUpdateRegistartionUseCase } from "../../application/usecases/beautician/beauticianregistationUpdateUsecase";
import { GoogleLoginUseCase } from "../../application/usecases/auth/googleLoginUseCase";
import { GoogleAuthService } from "../service/googleAuthService";
import { GoogleLoginController } from "../../interface/Http/controllers/auth/googleLoginController";
import { FileUploadService } from "../service/fileUploadService";
import { BeauticianViewEditProfileUseCase } from "../../application/usecases/beautician/beauticianViewProfileUsecase";
import { ProfileImageChangeUseCase } from "../../application/usecases/public/profileImageChangeUseCase";
import { BeauticianEditProfileUseCase } from "../../application/usecases/beautician/beauticianUpdateProfileUseCase";
import { SearchResultUseCase } from "../../application/usecases/public/searchresultUseCase";
import { AddSerchHistoryUseCase } from "../../application/usecases/public/AddSearchHistoryUseCase";
import { SearchHistoryController } from "../../interface/Http/controllers/public/searchHistoryController";
import { SearchHistoryRepository } from "../repositories/public/SearchHistoryRepository";
import { RecentSearchesUseCase } from "../../application/usecases/public/recentSearchUseCase";
import { RemoveSearchHistoryUseCase } from "../../application/usecases/public/RemoveSeachHistoryUseCase";
import { ClearSearchHistoryUseCase } from "../../application/usecases/public/ClearSearchHistoryUseCase";
import { OtpService } from "../service/otpService";
import { AddCategoryUseCase } from "../../application/usecases/admin/management/services/addCategoryUseCase";
import { UpdateCategoryUseCase } from "../../application/usecases/admin/management/services/updateCategoryUseCase";
import { toggleActiveStatusUseCase } from "../../application/usecases/admin/management/services/toggleActiveStatusUseCase";

import { AddServiceUseCase } from "../../application/usecases/admin/management/services/addServiceUseCase";
import { UpdateServiceUseCase } from "../../application/usecases/admin/management/services/updateServiceUseCase";
import { GetServiceUseCase } from "../../application/usecases/admin/management/services/getServiceUseCase";
import {  AddCustomServiceCategoryUseCase } from "../../application/usecases/admin/management/services/addCustomService";
import { ServiceRepository } from "../repositories/service/serviceRepository";
import { CategoryRepository } from "../repositories/service/CategoryRepository";
import { CustomServiceRepository } from "../repositories/service/customServiceRepository";
import { BeauticianServiceRepository } from "../repositories/service/BeauticianServiceRepository";
import { GetBeauticianServiceSelectionUseCase } from "../../application/usecases/admin/management/services/GetBeauticianServiceSelectionUseCase";
import { BeauticianServiceController } from "../../interface/Http/controllers/service/beauticianServiceController";
import { UpsertBeauticianService } from "../../application/usecases/admin/management/services/upsertBeauticianService";
import { ServiceController } from "../../interface/Http/controllers/service/serviceController";
import { CategoryController } from "../../interface/Http/controllers/service/categoryController";
import { CustomServiceController } from "../../interface/Http/controllers/service/customServiceController";
import { GetBeauticianServicesListUseCase } from "../../application/usecases/admin/management/services/getServiceList";
import { UploadPamphletUseCase } from "../../application/usecases/admin/management/services/uploadPamphletUseCase";
import { DeletePamphletImageUseCase } from "../../application/usecases/admin/management/services/deletePamphlet";
import { GetPamphletUseCase } from "../../application/usecases/admin/management/services/getPamphlet";
import { GetAllCustomServiceUSeCase } from "../../application/usecases/admin/management/services/getAllCustomServiceUseCase";
import { GetCustomServiceDetailUseCase } from "../../application/usecases/admin/management/services/getCustomServiceDetailUseCase";
import { ApproveCustomServiceUseCase } from "../../application/usecases/admin/management/services/approveCustomService";
import { RejectCustomServiceUseCase } from "../../application/usecases/admin/management/services/rejectCustomServiceUseCase";
import { ScheduleRepository } from "../repositories/beautician/scheduleRepository";
import { AddAvailabilityUseCase } from "../../application/usecases/beautician/schedule/addAvailabilityUseCase";
import { DeleteAvailibilitySlotUseCase } from "../../application/usecases/beautician/schedule/deleteAvailablitySlotUseCase";
import { GetAvailabilityUseCase} from "../../application/usecases/beautician/schedule/getAvailableUSeCase";
import { ScheduleController } from "../../interface/Http/controllers/beautician/scheduleController";
import { ServiceAreaRepository } from "../repositories/beautician/serviceAreaRepository";
import { AddServiceAreaUseCase } from "../../application/usecases/beautician/location/addServiceAreaUsecase";
import { getServiceAreaUseCase } from "../../application/usecases/beautician/location/getServiceAreaUseCase";
import { GetCategoryUseCase } from "../../application/usecases/admin/management/services/getCategoryUseCase";
import { ChangePasswordController } from "../../interface/Http/controllers/auth/changePasswordController";
import { ChangePasswordUseCase } from "../../application/usecases/auth/changePasswordUseCase";
import { CustomerViewProfileUseCase } from "../../application/usecases/customer/viewEditProfileUseCase";
import { CustomerEditProfileUseCase } from "../../application/usecases/customer/editProfileUseCase";
import { RecurringRepository } from "../repositories/beautician/recuringRepostory";
import { RecurringExceptionRepository } from "../repositories/beautician/recurringExceptionRepository";
import { AddRecurringAvailabilityUseCase } from "../../application/usecases/beautician/schedule/addRecurringScheduleusecase";
import { DeleteRecurringAvailabilityUseCase } from "../../application/usecases/beautician/schedule/deleteRecurringAvailabilitySlotUSeCase";
import { AddRecurringLeaveUseCase } from "../../application/usecases/beautician/schedule/addRecurringLeaveUseCase";
import { CreatePostUseCase } from "../../application/usecases/beautician/post/createPostUseCase";
import { PostRepository } from "../repositories/beautician/postRepository";
import { PostController } from "../../interface/Http/controllers/public/postController";
import { GetHomeFeedUseCase } from "../../application/usecases/beautician/post/gethomeFeedUseCase";
import { GetTipsRentFeedUseCase } from "../../application/usecases/beautician/post/getTipsRentFeedUseCase";
import { GetBeauticianPostUseCase } from "../../application/usecases/beautician/post/getBeauticianPostUseCase";
import { SearchPostUseCase } from "../../application/usecases/beautician/post/searchPostUseCase";
import { GetSignedUploadUrlsUseCase } from "../../application/usecases/beautician/post/getSignedUploadUrlUseCase";
import { GetMonthlyAvailabilityUseCase } from "../../application/usecases/beautician/schedule/getMonthlyAvailabilityUseCase";
import { ChatRepository } from "../repositories/user/chatRepository";
import { MessageRepository } from "../repositories/user/messageRepositoty";
import { SocketIOEmitter } from "../service/socketIOEmitter";
import { JoinChatRoomRoomUseCase } from "../../application/usecases/chat/joinChatRoomUseCase";
import { SendMessageUseCase } from "../../application/usecases/chat/sendMessageUseCase";
import { TypingIndicatorUseCase } from "../../application/usecases/chat/typingIndicatorUseCase";
import { MarkSeenUseCase } from "../../application/usecases/chat/markSeenUseCase";
import { ChatController } from "../../interface/Http/controllers/public/chatController";
import { GetMessagesByChatUseCase } from "../../application/usecases/chat/getMessagesByChatUseCase";
import { CreateChatUseCase } from "../../application/usecases/chat/createChatUseCase";
import { GetChatByParticipants } from "../../application/usecases/chat/getChatByParticipantsUseCase";
import { GetUserChatsUseCase } from "../../application/usecases/chat/getUserChatsUseCase";
import { CreateBookingUseCase } from "../../application/usecases/booking/createBookingUseCase";
import { BookingRepository } from "../repositories/user/bookingRepository";
import { BookingHistoryRepository } from "../repositories/user/bookingHistory";
import { UpdateBookingStatusUseCase } from "../../application/usecases/booking/updateBookingStatusUseCase";
import { GetBeauticianBookingsUSeCase } from "../../application/usecases/booking/getBeauticianBookingsUSeCase";
import { GetBookingByIdUSeCase } from "../../application/usecases/booking/getBookingByIdUseCase";
import { BookingController } from "../../interface/Http/controllers/public/bookingController";
import { LikeRepository } from "../repositories/user/likeRepository";
import { CommentRepository } from "../repositories/user/commetRepository";
import { AddLikeUseCase } from "../../application/usecases/public/like/addLikeUseCase";
import { RemoveLikeUseCase } from "../../application/usecases/public/like/removeLikeUseCase";
import { AddCommentUseCase } from "../../application/usecases/public/comment/addComment";
import { DeleteCommentUseCase } from "../../application/usecases/public/comment/deleteComment";
import { GetHomeServiceUseCase } from "../../application/usecases/public/comment/getHomeServiceCommentUseCase";
import { GetPostCommentUSeCase } from "../../application/usecases/public/comment/getPostCommentUseCase";
import { LikeCommetController } from "../../interface/Http/controllers/public/likeCommentController";
import { CreateOrderUsecase } from "../../application/usecases/payment/createOrderUseCase";
import { PaymentRepository } from "../repositories/user/paymentRepository";
import { RazorPayService } from "../service/razorPayService";
import { PaymentController } from "../../interface/Http/controllers/public/paymentController";
import { VerifyPaymentUsecase } from "../../application/usecases/payment/verifyPaymentUseCase";
import { LockSlotUseCase } from "../../application/usecases/booking/lockSlotUseCase";
import { LockSlotService } from "../service/lockSlotService";
import { BlockBookedSlotUseCase } from "../../application/usecases/beautician/schedule/blockBookedSlotUSeCase";
import { RequestRefundUseCase } from "../../application/usecases/booking/requestRefundUseCase";
import { BookingValidatorService } from "../../application/services/bookingValidatorService";
import { BookingHistoryService } from "../../application/services/bookingHistoryService";
import { ChatMessageService } from "../../application/services/chatMessageService";
import { PaymentLookupService } from "../../application/services/paymentLookupService";
import { BeauticianApproveRefundUseCase } from "../../application/usecases/booking/approveRefundUseCase";
import { RefundRepository } from "../repositories/user/refundRepository";
import { DisputeRefundUseCase } from "../../application/usecases/booking/disputerefundUseCase";
import { CancelBookingUseCase } from "../../application/usecases/booking/cancelBookingUseCase";
import { ProcessRefundUseCase } from "../../application/usecases/admin/management/booking/processRefundUseCase";
import { NotificationDispatchService } from "../../application/services/notificationDispatchService";
import { NotificationRepository } from "../repositories/user/notificationrepository";
import { RazorpayStatusResolverService } from "../../application/services/razorpayStatusResolverService";
import { ReleasePayoutUseCase } from "../../application/usecases/admin/management/booking/releasePayoutUsecase";
import { PayoutRepository } from "../repositories/admin/payoutRepository";
import { GetAllBookingUseCase } from "../../application/usecases/admin/management/booking/getAllBookingsUseCase";
import { GetAllDisputesUseCase } from "../../application/usecases/admin/management/booking/getAllDisputeUSeCase";
import { GetAllRefundsUseCase } from "../../application/usecases/admin/management/booking/getAllRefundUseCase";
import { GetBookingDetailUseCase } from "../../application/usecases/admin/management/booking/getBookingDetailUseCase";
import { GetDisputeDetailsUseCase } from "../../application/usecases/admin/management/booking/getDisputeDetailsUseCase";
import { GetRefundDetailUseCase } from "../../application/usecases/admin/management/booking/getrefundDetailUSeCase";
import { GetUserRefundSummeryUseCase } from "../../application/usecases/customer/getUserRefundSummeryUseCase";
import { GetUserNotificationsUseCase } from "../../application/usecases/notification/IGetNotificationUseCase";
import { NotificationController } from "../../interface/Http/controllers/public/notification";
import { MarkAllNotificationsReadUseCase } from "../../application/usecases/notification/markAllNotificationRead";
import { GetRepliesUseCase } from "../../application/usecases/public/comment/getReplyCommentUseCase";
import { GetRevenueUC } from "../../application/usecases/admin/dashboard/getRevenueUseCase";
import { GetDashboardOverviewUC } from "../../application/usecases/admin/dashboard/getOverViewOfDashBoardUseCase";
import { GetBookingTrendUC } from "../../application/usecases/admin/dashboard/getBookingTrendUseCase";
import { DashboardController } from "../../interface/Http/controllers/admin/dashBoardController";
import { GetUserGrowthUseCae } from "../../application/usecases/admin/dashboard/getUserGrowthUseCase";
import { ScheduleNotificationUseCase } from "../../application/usecases/notification/scheduleNotificationUseCase";
import { NotificationCron} from "../cron/notificationCron";



//auth
const adminRepo=new MongoAdminRepository()
const userRepo=new MongoUserRepository();
const registerUseCase=new RegisterUserUseCase(userRepo)
const registerController=new RegisterUserController(registerUseCase)
const preSignupUseCase = new PreSignupUseCase(process.env.JWT_SECRET!,userRepo);
const preSignupController=new PreSignupController(preSignupUseCase)
const changePasswordUseCase=new ChangePasswordUseCase(userRepo)
export const changePasswordController=new ChangePasswordController(changePasswordUseCase)
//otp

const mailService=new NodemailerOtpService()
const otpService=new OtpService()
const createOtpUC = new CreateOtpUseCase(otpService,mailService);
const resendOtpUC = new ResendOtpUseCase(otpService,mailService);
const verifyOtpUC = new VerifyOtpUseCase(otpService);
const otpController = new OtpController(createOtpUC, resendOtpUC, verifyOtpUC);

const completeSignupUC = new CompleteSignupUseCase(verifyOtpUC, registerUseCase);
const completeSignupController = new CompleteSignupController(completeSignupUC);

const loginUseCase=new UserLoginUseCase(userRepo,new BcryptAuthService,new JwtTokenService)
const loginController=new Logincontroller(loginUseCase)

const logoutuseCase=new LogoutUseCase(new RedisTokenBlacklistService,new JwtTokenService)
const logoutController=new LogoutController(logoutuseCase)


 const forgotpasswordUC=new ForgotPasswordUseCase(userRepo)
 const resetPasswordUC=new ResetPasswordUseCase(userRepo,10)
 const resetPasswordController=new ResetPasswordController(forgotpasswordUC,resetPasswordUC)
const userAccountRepo=new AuthAccountRepository(userRepo,adminRepo)

const refreshTokenUsecase=new RefreshTokenUseCase(new JwtTokenService,userAccountRepo)
const refreshTokenController=new RefreshTokenController(refreshTokenUsecase,'refreshToken')

const googleLoginUseCase=new GoogleLoginUseCase(new JwtTokenService,userRepo, new GoogleAuthService)
const googleLoginController=new GoogleLoginController(googleLoginUseCase)


//cloudinary


const fileStorage = new S3Storage();
const fileUpload=new FileUploadService(fileStorage)
//middleware
export const authenticateCustomer=authMiddleware(new JwtTokenService,new RedisTokenBlacklistService,['customer'])
export const authenticateAdmin=authMiddleware(new JwtTokenService,new RedisTokenBlacklistService,['admin'])
export const authenticateBeautician=authMiddleware(new JwtTokenService,new RedisTokenBlacklistService,['beautician'])
export const authenticateUser=authMiddleware(new JwtTokenService,new RedisTokenBlacklistService,['customer','beautician'])
export const authenticateAll=authMiddleware(new JwtTokenService,new RedisTokenBlacklistService,['admin','customer','beautician'])
export const optionalAuth=optionalAuthMiddleware(new JwtTokenService,new RedisTokenBlacklistService)

//beautician repo
const beauticianRepo=new mongoBeauticianRepository()
export {registerController,preSignupController,otpController,completeSignupController,
  loginController,logoutController,refreshTokenController,resetPasswordController,googleLoginController};
//profile
const ownProfileUseCase=new OwnProfileUseCase(userRepo,beauticianRepo)
const profileImageChangeUseCase=new ProfileImageChangeUseCase(userRepo,fileUpload)
export const profileController=new ProfileController(ownProfileUseCase,profileImageChangeUseCase)


//beautician

const beauticianRegisterUC=new BeauticianRegistrationUseCase(beauticianRepo,fileUpload)
const beauticianVerificationStatusUC=new BeauticianVerificationStatusUseCase(beauticianRepo)
const beauticianUpdateRegistartionUC=new BeauticianUpdateRegistartionUseCase(beauticianRepo,userRepo)
const beauticianViewEditProfileUC=new BeauticianViewEditProfileUseCase(beauticianRepo,userRepo)
const beauticianEditProfileUC=new BeauticianEditProfileUseCase(beauticianRepo,userRepo)
const searchResultUC=new SearchResultUseCase(userRepo)
//location
const serviceAreaRepo=new ServiceAreaRepository()

const addServiceAreaUC=new AddServiceAreaUseCase(beauticianRepo,serviceAreaRepo)
const getServiceAreaUC=new getServiceAreaUseCase(serviceAreaRepo)
const customerViewEditProfile=new CustomerViewProfileUseCase(userRepo)
const customerEditProfileUseCase=new CustomerEditProfileUseCase(userRepo)
const beauticianController=new BeauticianController(beauticianRegisterUC,beauticianVerificationStatusUC,
  beauticianUpdateRegistartionUC,beauticianViewEditProfileUC,
  beauticianEditProfileUC,searchResultUC,getServiceAreaUC,addServiceAreaUC,customerViewEditProfile,customerEditProfileUseCase)

export  {beauticianController}


//admin


const adminLoginUseCase=new AdminLoginUseCase(adminRepo,new JwtTokenService,new BcryptAuthService )
const adminController=new AdminAuthController(adminLoginUseCase)

const userListUC=new GetAllUserUseCase(userRepo)
const toggleUserStatusUC=new ToggleUserStatusUseCase(userRepo,new RedisTokenBlacklistService,userRepo)
const getAllBeauticianUseCase=new GetAllBeauticianUseCase(beauticianRepo,userRepo)
const viewBeauticianDetailsUseCase=new ViewBeauticianDetailUseCase(beauticianRepo,userRepo)
const approveBeauticianUseCase=new ApproveBeauticianUseCase(beauticianRepo)
const rejectBeauticianUseCase=new RejectBeauticianUseCase(beauticianRepo)
const adminUserManagementController=new AdminUserManagementController(userListUC,toggleUserStatusUC,getAllBeauticianUseCase,viewBeauticianDetailsUseCase,approveBeauticianUseCase,rejectBeauticianUseCase)
export{adminController,adminUserManagementController}

//searchHistory
const searchHistoryRepo=new SearchHistoryRepository()
const addSearchHistoryUC=new AddSerchHistoryUseCase(searchHistoryRepo)
const recentSearchHistoryUC=new RecentSearchesUseCase(searchHistoryRepo,userRepo)
const removeSearchHistoryUC=new RemoveSearchHistoryUseCase(searchHistoryRepo)
const clearSearchHistoryUC=new   ClearSearchHistoryUseCase(searchHistoryRepo)
export const searchHistoryController=new SearchHistoryController(addSearchHistoryUC,recentSearchHistoryUC,removeSearchHistoryUC,clearSearchHistoryUC)


//category
const categoryRepo=new CategoryRepository()
const addCategoryUseCase=new AddCategoryUseCase(categoryRepo)
const updateCategoryUseCase=new UpdateCategoryUseCase(categoryRepo)
const toggleCategoryActiveStatusUseCase=new toggleActiveStatusUseCase(categoryRepo)
const getCategoryUC=new GetCategoryUseCase(categoryRepo)
const categoryController=new CategoryController(addCategoryUseCase,updateCategoryUseCase,toggleCategoryActiveStatusUseCase,getCategoryUC)
//serivice
const serviceRepo=new ServiceRepository()
const addServiceUC=new AddServiceUseCase(serviceRepo,categoryRepo)
const updateServiceUC=new UpdateServiceUseCase(serviceRepo)
const getServiceUC=new GetServiceUseCase(serviceRepo)
const toggleServiceActiveStatusUC=new toggleActiveStatusUseCase(serviceRepo)
const serviceController=new ServiceController(addServiceUC,updateServiceUC,getServiceUC,toggleServiceActiveStatusUC)
//custom service
const customServiceRepo=new CustomServiceRepository()
const beauticianServiceRepo=new BeauticianServiceRepository()
const addCustomServiceUC=new AddCustomServiceCategoryUseCase(customServiceRepo,categoryRepo,beauticianServiceRepo)
const getBeauticianSelectionUC=new GetBeauticianServiceSelectionUseCase(serviceRepo,categoryRepo,beauticianServiceRepo)
const getAllCustomServiceUC=new GetAllCustomServiceUSeCase(customServiceRepo,userRepo)
const getCustomServiceDetailUC=new GetCustomServiceDetailUseCase(customServiceRepo,userRepo)
const approveCustomServiceUC=new ApproveCustomServiceUseCase(customServiceRepo,serviceRepo,categoryRepo)
const rejectCustomServiceUC=new RejectCustomServiceUseCase(customServiceRepo)
const customServiceController=new CustomServiceController(addCustomServiceUC,getAllCustomServiceUC,getCustomServiceDetailUC,approveCustomServiceUC,rejectCustomServiceUC)
//beautician service
const upsertBeauticianService=new UpsertBeauticianService(beauticianServiceRepo,serviceRepo,categoryRepo)
const getBeauticianServiceList=new GetBeauticianServicesListUseCase(beauticianServiceRepo)
const uploadPampletUC=new UploadPamphletUseCase(beauticianRepo,fileUpload)
const deletePampletUC=new DeletePamphletImageUseCase(beauticianRepo,fileUpload)
const getPamphletUC=new GetPamphletUseCase(beauticianRepo)
const beauticianServiceController=new BeauticianServiceController(getBeauticianSelectionUC,upsertBeauticianService,getBeauticianServiceList,uploadPampletUC,deletePampletUC,getPamphletUC)
export {categoryController,serviceController,customServiceController,beauticianServiceController}

//slot availbility
const scheduleRepo=new ScheduleRepository()
const recurringRepo=new RecurringRepository()
const recurringExceptionRepo=new RecurringExceptionRepository()
const addAvailabilityUC=new AddAvailabilityUseCase(scheduleRepo)
const deleteAvailabilitySlotUC=new DeleteAvailibilitySlotUseCase(scheduleRepo)
const addRecurringAvailabilityUC=new AddRecurringAvailabilityUseCase(recurringRepo,userRepo)
const addRecurringLeaveUC=new AddRecurringLeaveUseCase(recurringRepo,userRepo)
const deleteRecurringAvailablitySlotUseCase=new DeleteRecurringAvailabilityUseCase(userRepo,recurringExceptionRepo,recurringRepo)
const getAvailabilityUC=new GetAvailabilityUseCase(scheduleRepo,recurringRepo,recurringExceptionRepo)
const getMonthlyAvailabilityUC=new GetMonthlyAvailabilityUseCase(getAvailabilityUC)
const scheduleController=new ScheduleController(addAvailabilityUC,deleteAvailabilitySlotUC,getAvailabilityUC,addRecurringAvailabilityUC,addRecurringLeaveUC,
  deleteRecurringAvailablitySlotUseCase,getMonthlyAvailabilityUC)
export {scheduleController}


//chat
export const socketEmitter=new SocketIOEmitter()

const chatRepository    = new ChatRepository();
const messageRepository = new MessageRepository();

export function buildChatUseCases() {
  return {
    joinChatRoomUseCase: new JoinChatRoomRoomUseCase(chatRepository, socketEmitter),
    sendMessageUseCase:  new SendMessageUseCase(messageRepository,chatRepository,socketEmitter),
    typingIndicatorUSeCase:new TypingIndicatorUseCase(socketEmitter),
    markSeenUseCase:new MarkSeenUseCase(chatRepository,messageRepository,socketEmitter)
  };
}
const getMessageByChatUC=new GetMessagesByChatUseCase(messageRepository,chatRepository)
const createChatUC=new CreateChatUseCase(chatRepository)
const getChatByParticipantsUC=new GetChatByParticipants(chatRepository)
const getUserChatsUC=new GetUserChatsUseCase(chatRepository,userRepo,messageRepository,beauticianRepo)
export const chatController=new ChatController(getMessageByChatUC,createChatUC,getChatByParticipantsUC,getUserChatsUC)

//booking
const notificationRepo=new NotificationRepository()
const bookingRepo=new BookingRepository()
const paymentrepo=new PaymentRepository()
const lockSlotService=new LockSlotService()
const lockSlotUseCase=new LockSlotUseCase(bookingRepo,lockSlotService)
const bookingHistoryRepo=new BookingHistoryRepository()
const scheduleNotificationUC=new ScheduleNotificationUseCase(notificationRepo)
const createBookingUseCase=new CreateBookingUseCase(bookingRepo,bookingHistoryRepo,messageRepository,chatRepository,socketEmitter,getAvailabilityUC,lockSlotService,scheduleNotificationUC)
const updateBookingStatusUC=new UpdateBookingStatusUseCase(bookingRepo,bookingHistoryRepo,messageRepository,chatRepository,socketEmitter,paymentrepo)
const getBeauticianBookingsUC=new GetBeauticianBookingsUSeCase(bookingRepo,userRepo)
const getBookingByIdUseCase=new GetBookingByIdUSeCase(bookingRepo,userRepo)
const blockBookedSlotUseCase=new BlockBookedSlotUseCase(scheduleRepo,recurringExceptionRepo,getAvailabilityUC)
//services
const payoutRepo=new PayoutRepository()
const refundRepo=new RefundRepository()
const razorPayService=new RazorPayService()
const bookingValidatorService=new BookingValidatorService(bookingRepo)
const bookinghistoryService=new BookingHistoryService(bookingHistoryRepo)
const chatMessageService=new ChatMessageService(messageRepository,chatRepository,socketEmitter)
const notificationDispatchService=new NotificationDispatchService(notificationRepo,socketEmitter)
const razorPayStatusResolverService=new RazorpayStatusResolverService()
const paymentLookupService=new PaymentLookupService(paymentrepo)
const requestRefundUseCase=new RequestRefundUseCase(bookingRepo,paymentrepo,socketEmitter,bookingValidatorService,bookinghistoryService,chatMessageService,paymentLookupService)
const approveRefundRequestUseCase=new BeauticianApproveRefundUseCase(bookingRepo,paymentrepo,socketEmitter,bookingValidatorService,bookinghistoryService,paymentLookupService,chatMessageService,refundRepo)
const disputeRefundUC=new DisputeRefundUseCase(bookingRepo,paymentrepo,socketEmitter,bookingValidatorService,bookinghistoryService,paymentLookupService,chatMessageService)
const cancelBookingUC=new CancelBookingUseCase(bookingValidatorService,paymentLookupService,bookinghistoryService,chatMessageService,socketEmitter,bookingRepo,paymentrepo,refundRepo,razorPayService)
const getAllBookingsForAdminUC=new GetAllBookingUseCase(bookingRepo,paymentrepo,userRepo)
const getAllDisputeUC=new GetAllDisputesUseCase(bookingRepo,userRepo)
const getAllRefundUC=new GetAllRefundsUseCase(refundRepo,paymentrepo,bookingRepo,userRepo)
const getBookingDetailUC=new GetBookingDetailUseCase(bookingRepo,paymentrepo,userRepo,bookingHistoryRepo)
const getDisputeDetailUC=new GetDisputeDetailsUseCase(bookingRepo,paymentrepo,userRepo,bookingHistoryRepo)
const getRefundDetailUC=new GetRefundDetailUseCase(refundRepo,paymentrepo,bookingRepo,userRepo,bookingHistoryRepo)
export const bookingController=new BookingController(getBeauticianBookingsUC,createBookingUseCase,updateBookingStatusUC,getBookingByIdUseCase,lockSlotUseCase,requestRefundUseCase,approveRefundRequestUseCase,disputeRefundUC,cancelBookingUC,getAllBookingsForAdminUC,getBookingDetailUC,getAllDisputeUC,getDisputeDetailUC,getAllRefundUC,getRefundDetailUC)
//like comment

const likeRepo=new LikeRepository()
const commentRepo=new CommentRepository()
//post

const postRepo=new PostRepository()
const createPostUseCase=new CreatePostUseCase(postRepo,userRepo,fileStorage)
const getHomefeedUC=new GetHomeFeedUseCase(postRepo,userRepo,likeRepo)
const getTipsRentFeedUC=new GetTipsRentFeedUseCase(postRepo,userRepo,likeRepo)
const getBeauticianPostUC=new GetBeauticianPostUseCase(postRepo,likeRepo)
const getPostSearchResult=new SearchPostUseCase(userRepo,postRepo)
const getSignedUrlUC=new GetSignedUploadUrlsUseCase(fileStorage)
const postController=new PostController(createPostUseCase,getHomefeedUC,getTipsRentFeedUC,getBeauticianPostUC,getPostSearchResult,getSignedUrlUC)

export {postController}

//like comment

const addLikeUC=new AddLikeUseCase(likeRepo,postRepo)
const removeLikeUC=new RemoveLikeUseCase(likeRepo,postRepo)
const addCommentUC=new AddCommentUseCase(commentRepo,postRepo,beauticianRepo)
const deleteCommentUC=new DeleteCommentUseCase(commentRepo,postRepo)
const getHomeServiceCommentUC=new GetHomeServiceUseCase(commentRepo,userRepo)
const getPostCommentUseCase=new GetPostCommentUSeCase(commentRepo,userRepo)
const getReplyCommentUC=new GetRepliesUseCase(commentRepo,userRepo)
export const likeCommentController=new LikeCommetController(addLikeUC,removeLikeUC,addCommentUC,deleteCommentUC,getHomeServiceCommentUC,getPostCommentUseCase,getReplyCommentUC)

//payment
const createOrderUC=new CreateOrderUsecase(paymentrepo,bookingRepo,razorPayService)

const verifyPaymentUC=new VerifyPaymentUsecase(paymentrepo,bookingRepo,razorPayService,blockBookedSlotUseCase,updateBookingStatusUC)
const processRefundUC=new ProcessRefundUseCase(bookingRepo,paymentrepo,refundRepo,razorPayService,bookingValidatorService,bookinghistoryService,paymentLookupService,notificationDispatchService,razorPayStatusResolverService)
const releasePayoutUC=new ReleasePayoutUseCase(bookingRepo,paymentrepo,payoutRepo,razorPayService,bookingValidatorService,bookinghistoryService,paymentLookupService,notificationDispatchService,razorPayStatusResolverService,beauticianRepo)
const getUserRefundSummeryUC=new GetUserRefundSummeryUseCase(refundRepo)
export const paymentController=new PaymentController(createOrderUC,verifyPaymentUC,processRefundUC,releasePayoutUC,getUserRefundSummeryUC)
// notification
const getNotificationUC=new GetUserNotificationsUseCase(notificationRepo)
const markAllNotificationReadUC=new MarkAllNotificationsReadUseCase(notificationRepo)
export const notificationController=new NotificationController(getNotificationUC,markAllNotificationReadUC)
//dashboard
const getUserGrowthUC=new GetUserGrowthUseCae(userRepo)
const  getRevenueUC=new GetRevenueUC(paymentrepo)
const getDashBoardOverView=new GetDashboardOverviewUC(userRepo,paymentrepo,beauticianRepo)
const getBookingTrendUC=new GetBookingTrendUC(bookingRepo)
export const dashboardController=new DashboardController(getDashBoardOverView,getUserGrowthUC,getBookingTrendUC,getRevenueUC)
//cron
const notificationCron=new NotificationCron(notificationRepo,socketEmitter)
notificationCron.start()