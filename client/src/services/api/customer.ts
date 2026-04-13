
import { publicApiRoutes } from "../../constants/apiRoutes/publicApiRoute"
import type { IGetUserRefundSummeryOutPut } from "../../types/api/customer"
import api, { axiosWrapper } from "../axiosWrapper"


export const CustomerApi={
  getWallet:async()=>{
    return await axiosWrapper<IGetUserRefundSummeryOutPut>(api.get(publicApiRoutes.getWallet))
  },
 
}

