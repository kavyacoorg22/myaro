import { publicApiRoutes } from "../../constants/apiRoutes/publicApiRoute"
import type { BackendResponse } from "../../types/api/api"
import type { IGetUserNotificationsOutput } from "../../types/api/notification"
import api, { axiosWrapper } from "../axiosWrapper"


export const NotificationApi={
  getNotification:async()=>{
    return await axiosWrapper<IGetUserNotificationsOutput>(api.get(publicApiRoutes.getNotification))
  },
   readAllNotification:async()=>{
    return await axiosWrapper<BackendResponse>(api.patch(publicApiRoutes.readAllNotification))
  },
 
}

