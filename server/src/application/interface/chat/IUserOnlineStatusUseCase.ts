import { IUserPresenceInput } from "../../interfaceType/chatType";


export interface IUserOnlineStatusUSeCase{
  userOnline(input:IUserPresenceInput):Promise<void>
    userOffline(input:IUserPresenceInput):Promise<void>
}