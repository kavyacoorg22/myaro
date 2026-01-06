
import { Beautician} from "../entities/Beautician";
import { VerificationStatus, VerificationStatusFilter } from "../enum/beauticianEnum";
import { SortFilter } from "../enum/sortFilterEnum";


export interface IVerificationUpdate {
  verificationStatus?: VerificationStatus; 
  verifiedBy?: string ; 
  verifiedAt?: Date ;
}


export interface IBeauticianRepository{
  create(data:Omit<Beautician, "id" | "createdAt" | "updatedAt">):Promise<Beautician>
  findByUserId(userId:string):Promise<Beautician|null>
   findAll(params: {
          sort?: SortFilter;
          verificationStatus?: VerificationStatusFilter;
          skip: number;
          limit: number
      }): Promise<Beautician[]>
       countAll(params?: {
            verificationStatus?:VerificationStatusFilter;
        }): Promise<number>

    updateVerificationByUserId(userId: string, update: Partial<Beautician>): Promise<Beautician | null>;  
    addPaymentDetails(userId: string, data: Partial<Beautician>): Promise<Beautician | null>;
    updateByUserId(userId: string, data: Omit<Beautician, "id" | "createdAt" | "updatedAt"|"homeserviceCount">): Promise<Beautician|null>;
    updateProfileDetailById(userId:string,data:Partial<Beautician>):Promise<boolean|null>
     
    
}