import { User } from "../../domain/entities/User";
import { ICustomerViewProfileDTO } from "../dtos/customer";


export function toCustomerProfileDto(user:User):ICustomerViewProfileDTO{
    return{
      userName:user.userName,
      fullName:user.fullName,
      profileImg:user.profileImg
    }
}