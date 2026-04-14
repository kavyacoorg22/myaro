export interface IMarkNotificationsReadUseCase {
 execute(userId: string): Promise<void>
}