import { Notification } from "../../../domain/entities/notification";
import { ScheduleNotificatonInput } from "../../interfaceType/notificationType";

export interface IScheduleNotificationUseCase{
execute(input:ScheduleNotificatonInput): Promise<Notification>
}