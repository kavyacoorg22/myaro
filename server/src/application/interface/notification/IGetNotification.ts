import { IGetUserNotificationsOutput } from "../../interfaceType/notificationType";

export interface  IGetUserNotificationsUseCase{
  execute(userId:string):Promise<IGetUserNotificationsOutput>
}