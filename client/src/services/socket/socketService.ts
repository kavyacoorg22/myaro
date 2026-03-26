import { SOCKET_EVENTS } from "../../constants/socketConstants";
import type { ISendMessageRequest } from "../../types/api/chat";
import socket from "./socket";


export const connectSocket = (userId: string): void => {
  socket.connect();
  socket.emit(SOCKET_EVENTS.JOIN_USER_ROOM, { userId });
    socket.emit(SOCKET_EVENTS.USER_ONLINE, { userId });
};

export const disconnectSocket = (): void => {
  socket.disconnect();
};

export const joinChat = (chatId: string, userId: string): void => {
  socket.emit(SOCKET_EVENTS.JOIN_CHAT, { chatId, userId });
};

export const leaveChat = (chatId: string): void => {
  socket.emit("leave_chat", { chatId });
};

export const sendMessage = (payload: ISendMessageRequest): void => {
  socket.emit(SOCKET_EVENTS.SEND_MESSAGE, {
    ...payload,
    type: payload.type ?? "text",
  });
};

export const emitUserOnline = (userId: string, chatId: string): void => {
  socket.emit(SOCKET_EVENTS.USER_ONLINE, { userId, chatId });
};

export const emitTypingStart = (chatId: string, userId: string): void => {
  socket.emit(SOCKET_EVENTS.TYPING_START, { chatId, userId });
};

export const emitTypingStop = (chatId: string, userId: string): void => {
  socket.emit(SOCKET_EVENTS.TYPING_STOP, { chatId, userId });
};

export const emitMarkSeen = (chatId: string, receiverId: string, senderId: string): void => {
  socket.emit(SOCKET_EVENTS.MARK_SEEN, { chatId, receiverId, senderId });
};