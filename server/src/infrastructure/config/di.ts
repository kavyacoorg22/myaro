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
import { authMiddleware } from "../../interface/Http/middleware/authMiddleware";
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



//auth
const adminRepo=new MongoAdminRepository()
const userRepo=new MongoUserRepository();
const registerUseCase=new RegisterUserUseCase(userRepo)
const registerController=new RegisterUserController(registerUseCase)
const preSignupUseCase = new PreSignupUseCase(process.env.JWT_SECRET!,userRepo);
const preSignupController=new PreSignupController(preSignupUseCase)
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
const beauticianController=new BeauticianController(beauticianRegisterUC,beauticianVerificationStatusUC,
  beauticianUpdateRegistartionUC,beauticianViewEditProfileUC,beauticianEditProfileUC,searchResultUC)

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
const categoryController=new CategoryController(addCategoryUseCase,updateCategoryUseCase,toggleCategoryActiveStatusUseCase)
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