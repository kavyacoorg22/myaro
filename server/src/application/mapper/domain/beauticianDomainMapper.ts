// import { Beautician } from "../../../domain/entities/Beautician";
// import { BeauticianDoc } from "../../../infrastructure/database/models/beautician/BeauticianModel";
// import { ISearchBeauticianResultDto } from "../../dtos/beautician";

// export function toBeauticianDomain(doc:BeauticianDoc):Beautician{
//     return {
//       id: doc._id.toString(),
//       userId: doc.userId.toString(),

//       yearsOfExperience: doc.yearsOfExperience,
//       about: doc.about,

//       hasShop: doc.hasShop,
//       shopName: doc.shopName,

//       shopAddress: doc.shopAddress
//         ? {
//             address: doc.shopAddress.address,
//             city: doc.shopAddress.city,
//             pincode: doc.shopAddress.pincode,
//           }
//         : undefined,

//       shopPhotos: doc.shopPhotos ?? [],
//       shopLicence: doc.shopLicence ?? [],
//       portfolioImage: doc.portfolioImage ?? [],
//       certificateImage: doc.certificateImage ?? [],

//       bankDetails: doc.bankDetails
//         ? {
//             accountHolderName: doc.bankDetails.accountHolderName,
//             accountNumber: doc.bankDetails.accountNumber,
//             ifscCode: doc.bankDetails.ifscCode,
//             bankName: doc.bankDetails.bankName,
//             upiId: doc.bankDetails.upiId,
//           }
//         : undefined,

//       verificationStatus: doc.verificationStatus,
//       verifiedBy: doc.verifiedBy?.toString(),
//       verifiedAt: doc.verifiedAt,

//       homeservicecount: doc.homeservicecount ?? 0,

//       createdAt: doc.createdAt,
//       updatedAt: doc.updatedAt,
//     };
//   }



// export function toBeauticianSearchDto(doc: any): ISearchBeauticianResultDto{
//   return {
//     beauticianId: doc._id?.toString() ?? '',
//     userName: doc.user?.userName ?? '',
//     fullName: doc.user?.fullName ?? '',
//     profileImg: doc.user?.profileImg ?? '',
//   };
// }