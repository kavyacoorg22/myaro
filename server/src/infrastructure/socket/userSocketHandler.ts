  // this allows server to deliver messages even when no chat is open
import { Socket } from "socket.io";
import { SOCKET_EVENTS as EV } from "../../application/events/socketEvents";
import { UserOnlineStatusUseCase } from "../../application/usecases/chat/userOnlineStatusUSeCase";

interface UserUseCases {
  userOnlineStatusUC: UserOnlineStatusUseCase;
}
const toMessage = (err: unknown): string =>
  err instanceof Error ? err.message : String(err);


export function registerUserHandlers(socket: Socket, useCases: UserUseCases): void {

  socket.on(EV.JOIN_USER_ROOM, ({ userId }: { userId: string }) => {
    try {
      if (!userId) throw new Error("userId is required");
      socket.join(`user:${userId}`);
      socket.data.userId = userId;
      console.log(`${userId} → room user:${userId}`);
    } catch (err) {
      socket.emit(EV.ERROR, { message: toMessage(err) });
    }
  });

  socket.on(EV.USER_ONLINE, ({ userId, chatId }: { userId: string; chatId: string }) => {
    socket.data.chatId = chatId;
    useCases.userOnlineStatusUC.userOnline({ socketId: socket.id, userId, chatId });
  });

  socket.on("disconnect", () => {
    const { userId, chatId } = socket.data;
    console.log(`Disconnected: ${socket.id} userId:${userId} chatId:${chatId}`);
    if (userId) {
      useCases.userOnlineStatusUC.userOffline({
        socketId: socket.id,
        userId,
        chatId: chatId ?? userId, 
      });
    }
  });
}