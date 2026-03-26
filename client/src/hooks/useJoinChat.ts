import { useEffect } from "react";
import { connectSocket, joinChat } from "../services/socket/socketService";
import socket from "../services/socket/socket";

export const useJoinChat = (chatId: string, userId: string) => {
  useEffect(() => {
    if (!chatId || !userId) return;

    const join = () => {
      joinChat(chatId, userId);
 
    };

    if (!socket.connected) {
      connectSocket(userId); 
      socket.once("connect", join);
    } else {
      join();
    }

    return () => {
      socket.off("connect", join);
    };
  }, [chatId, userId]);
};