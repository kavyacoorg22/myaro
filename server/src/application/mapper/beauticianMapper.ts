import { Beautician } from "../../domain/entities/Beautician";
import { ServiceArea } from "../../domain/entities/beauticianServiceAres";
import { SearchHistory } from "../../domain/entities/searchHistory";
import { User } from "../../domain/entities/User";
import { IBeauticianDTO, IBeauticianProfileDTO, IBeauticianViewEditProfileDTO, IGetServiceAreaDto, ISearchBeauticianResultDto, IUpdateRegistrationDTO, IVerificationStatusDto } from "../dtos/beautician";
import { IRecentSearchDto } from "../dtos/user";
import { IGetServiceAreaResponse } from "../interfaceType/beauticianType";


export function toVerificationStatusOutputDto(beautician:Beautician): IVerificationStatusDto {
    return {
       verificationStatus:beautician.verificationStatus
    };
};

export function toBeauticianDeatilDto(beautician:Beautician,user?:User):IBeauticianDTO{
  return{
    userId:beautician.userId,
    profileImg:user?.profileImg?? '',
    userName:user?.userName??'',
    verificationStatus:beautician.verificationStatus,
    yearsOfExperience:beautician.yearsOfExperience,
    shopName:beautician.shopName,
    city:beautician.shopAddress?.city

  }
}

export function toBeauticianProfileDto(beautician:Beautician,user:User): IBeauticianProfileDTO{
    return {
        userId: beautician.userId,
        profileImg: user.profileImg || '',
        userName: user.userName || '',
        yearsOfExperience: beautician.yearsOfExperience,
        shopName: beautician.shopName,
        city: beautician.shopAddress?.city,
        about: beautician.about,
        shopAddress: beautician.shopAddress,
        portfolioImage: beautician.portfolioImage || [],
        shopPhotos: beautician.shopPhotos || [],
        certificateImage: beautician.certificateImage || [],
        hasShop: beautician.hasShop,
    };
}

export function toUpdateRegistrationDto(updatedUser:User):IUpdateRegistrationDTO{
return {
  userId: updatedUser.id,
  role: updatedUser.role,
 isVerified: updatedUser.isVerified,
}
}

export function toBeauticianEditProfileDto(beautician:Beautician,user:User):IBeauticianViewEditProfileDTO{
  return{
   userName:user.userName,
   profileImg:user.profileImg,
   fullName:user.fullName,
   yearsOfExperience:beautician.yearsOfExperience,
   shopName:beautician.shopName,
     about:beautician.about,
    shopAddress:{
     address:beautician.shopAddress?.address??"",
     city:beautician.shopAddress?.city??""
    },
    accountHolderName:beautician.bankDetails?.accountHolderName,
    accountNumber:beautician.bankDetails?.accountNumber,
    ifscCode:beautician.bankDetails?.ifscCode,
    bankName:beautician.bankDetails?.bankName,
    upiId:beautician.bankDetails?.upiId

  }
}


export function toBeauticianSearchDto(doc:Partial<User>): ISearchBeauticianResultDto{
  console.log('beautician id',doc.id)
  
  return {
    
    beauticianId: doc.id ?? '',
    userName: doc.userName ?? '',
    fullName: doc.fullName ?? '',
    profileImg: doc.profileImg ?? '',
  };
}



export function toRecentSearchHistoryResultDtos(
  histories: SearchHistory[],
  beauticianMap: Map<string, User>
): IRecentSearchDto[] {
  return histories.map(history => {
    const user = beauticianMap.get(history.beauticianId);
    
    if (!user) {
      return null;
    }
    
    return {
      searchHistoryId: history.id ?? '',
      beauticianId: user.id ?? '',
      userName: user.userName ?? '',
      fullName: user.fullName ?? '',
      profileImg: user.profileImg ?? '',
    };
  }).filter((dto): dto is IRecentSearchDto => dto !== null); 
}

export function toGetServiceAreaDto(location:ServiceArea):IGetServiceAreaDto{
return{
  serviceLocation:location.serviceLocation??[],
  homeServiceLocation:location.homeServiceLocation??[]
}
}