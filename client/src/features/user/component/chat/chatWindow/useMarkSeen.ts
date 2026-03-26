import { useEffect } from "react";
import type { MessageDto } from "../../../../../types/dtos/chat";
import { emitMarkSeen } from "../../../../../services/socket/socketService";

export const useMarkSeen = (
  chatId: string,
  userId: string,
  messages: MessageDto[],
) => {
  useEffect(() => {
    if (!userId || !messages.length) return;
    if (!document.hasFocus()) return;

    const unseenFromOther = messages.find(
      (m) => m.senderId !== userId && !m.seen,
    );
    if (unseenFromOther) {
      emitMarkSeen(chatId, userId, unseenFromOther.senderId);
    }
  }, [messages, chatId, userId]);
};