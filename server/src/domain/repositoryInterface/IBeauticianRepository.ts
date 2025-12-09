import { IBeauticianDTO, IBeauticianProfileDTO, IBeauticianViewEditProfileDTO, ISearchBeauticianResultDto } from "../../application/dtos/beautician";
import { IBeauticianEditProfileInput, IBeauticianViewEditProfileOutput } from "../../application/interfaceType/beauticianType";
import { Beautician, ID } from "../entities/Beautician";
import { VerificationStatus, VerificationStatusFilter } from "../enum/beauticianEnum";
import { SortFilter } from "../enum/sortFilterEnum";

export type IRegisterDto = Omit<Beautician, "id" | "createdAt" | "updatedAt">;
export interface IVerificationUpdate {
  verificationStatus?: VerificationStatus; 
  verifiedBy?: string | null; 
  verifiedAt?: Date | null;
}

export interface IAddPaymentDetailsDto {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  upiId?: string;
}

export interface IBeauticianRepository{
  create(data:IRegisterDto):Promise<Beautician>
  findByUserId(userId:string):Promise<Beautician|null>
   findAll(params: {
          sort?: SortFilter;
          verificationStatus?: VerificationStatusFilter;
          skip: number;
          limit: number
      }): Promise<IBeauticianDTO[]>
       countAll(params?: {
            verificationStatus?:VerificationStatusFilter;
        }): Promise<number>

    findProfileByUserId(userId:string):Promise<IBeauticianProfileDTO|null>  
    updateVerificationByUserId(userId: string, update: IVerificationUpdate): Promise<Beautician | null>;  
    addPaymentDetails(userId: string, data: IAddPaymentDetailsDto): Promise<Beautician | null>;
    updateByUserId(userId: string, data: IRegisterDto): Promise<Beautician|null>;
    findProfileDeatilsById(userId:string):Promise<Beautician|null>
    updateProfileDetailById(userId:string,data:Partial<IBeauticianEditProfileInput>):Promise<boolean|null>
     
    
}