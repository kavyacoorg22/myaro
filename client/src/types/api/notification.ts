import type { INotificationDto } from "../dtos/notification"
import type { BackendResponse } from "./api"

export interface IGetUserNotificationsOutputData {
  notifications: INotificationDto[]
  unreadCount: number
}

export type IGetUserNotificationsOutput=BackendResponse<IGetUserNotificationsOutputData>
