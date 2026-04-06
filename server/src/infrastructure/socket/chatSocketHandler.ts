import { Socket } from "socket.io";
import { SOCKET_EVENTS as EV } from "../../application/events/socketEvents";
import { JoinChatRoomRoomUseCase } from "../../application/usecases/chat/joinChatRoomUseCase";
import { SendMessageUseCase } from "../../application/usecases/chat/sendMessageUseCase";
import { ISendMessageInput } from "../../application/interfaceType/chatType";
import { TypingIndicatorUseCase } from "../../application/usecases/chat/typingIndicatorUseCase";
import { MarkSeenUseCase } from "../../application/usecases/chat/markSeenUseCase";

interface ChatUseCases {
  joinChatRoomUseCase: JoinChatRoomRoomUseCase;
  sendMessageUseCase:SendMessageUseCase
  typingIndicatorUSeCase:TypingIndicatorUseCase,
  markSeenUseCase:MarkSeenUseCase
}

const toMessage = (err: unknown): string =>
  err instanceof Error ? err.message : String(err);

export function registerChatHandlers(socket: Socket, useCases: ChatUseCases): void {

  socket.on(EV.JOIN_CHAT, async ({ chatId, userId }: { chatId: string; userId: string }) => {
    try {
      await useCases.joinChatRoomUseCase.execute({
        socketId: socket.id,
        chatId,
        userId,
      });
        console.log("🟢 JOIN_CHAT received, room:", chatId);
      socket.data.chatId = chatId;
      socket.data.userId = userId;
        console.log("🟢 Socket rooms:", socket.rooms);
    } catch (err) {
      socket.emit(EV.ERROR, { message: toMessage(err) });
    }


  });

      socket.on(EV.SEND_MESSAGE,async(payload:ISendMessageInput)=>{
      try{
      await  useCases.sendMessageUseCase.execute(payload)
      }catch(err)
      {
        socket.emit(EV.ERROR,{message:toMessage(err)})
      }
    })
   
  socket.on(EV.TYPING_START, ({ chatId, userId }) => {
  useCases.typingIndicatorUSeCase.startTyping({ socketId: socket.id, chatId, userId });
});

socket.on(EV.TYPING_STOP, ({ chatId, userId }) => {
  useCases.typingIndicatorUSeCase.stopTyping({ socketId: socket.id, chatId, userId });
});
socket.on(EV.MARK_SEEN, async ({ chatId, receiverId, senderId }) => {
  try {
    await useCases.markSeenUseCase.execute({ chatId, receiverId, senderId });
  } catch (err) {
    socket.emit(EV.ERROR, { message: toMessage(err) });
  }
});
}
