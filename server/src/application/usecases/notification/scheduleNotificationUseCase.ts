import { Notification } from "../../../domain/entities/notification";
import { INotificationRepository } from "../../../domain/repositoryInterface/User/INotificationRepository";
import { IScheduleNotificationUseCase } from "../../interface/notification/IScheduleNotificationUseCase";
import { ScheduleNotificatonInput } from "../../interfaceType/notificationType";

export class ScheduleNotificationUseCase implements IScheduleNotificationUseCase{
  constructor(private _notificationRepo:INotificationRepository){}
  async execute(input: ScheduleNotificatonInput): Promise<Notification> {

      const result= await this._notificationRepo.create({
      ...input,
      isRead:    false,
      isDeleted: false,
      isSent:    false,        
    })
          console.log('[ScheduleNotif] Saved:', result.id, 'scheduledFor:', result.scheduledFor);
   return result

  }
 }
