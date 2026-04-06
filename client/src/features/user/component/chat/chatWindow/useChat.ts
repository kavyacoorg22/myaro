import { useEffect, useRef, useState, useCallback } from "react";
import { useJoinChat } from "../../../../../hooks/useJoinChat";
import { useMarkSeen } from "./useMarkSeen";
import type { MessageDto } from "../../../../../types/dtos/chat";
import { ChatApi } from "../../../../../services/api/chat";
import { emitMarkSeen, sendMessage } from "../../../../../services/socket/socketService";
import { SOCKET_EVENTS } from "../../../../../constants/socketConstants";
import socket from "../../../../../services/socket/socket";
import type { ChatParticipant } from "../../../../types/chat";

export const useChat = (chatId: string, userId: string, participant: ChatParticipant | null) => {
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [cursor, setCursor]     = useState<string | null>(null);
  const [hasMore, setHasMore]   = useState<boolean>(true);
  const [loading, setLoading]   = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [lastSeen, setLastSeen] = useState<Date | null>(null);

  const loadingRef       = useRef<boolean>(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useJoinChat(chatId, userId);
  useMarkSeen(chatId, userId, messages);

  // ── load messages ─────────────────────────────────────────────────────────
  const loadMessages = useCallback(
    async (cursorParam: string | null) => {
      if (loadingRef.current) return;
      loadingRef.current = true;
      setLoading(true);
      try {
        const res = await ChatApi.getMessagesByChat(chatId, 30, cursorParam ?? undefined);
        if (!res.data.data) return;
        const { messages: newMsgs, nextCursor, hasMore: more } = res.data.data;

        // ✅ if loading fresh (no cursor), replace messages entirely
        // if paginating (has cursor), prepend older messages
        setMessages((prev) => cursorParam ? [...newMsgs, ...prev] : newMsgs);
        setCursor(nextCursor);
        setHasMore(more);

        // derive lastSeen from messages we sent that the other person already read
        const latestSeenAt = newMsgs
          .filter((m) => m.senderId === userId && m.seen && m.seenAt)
          .map((m) => new Date(m.seenAt!))
          .sort((a, b) => b.getTime() - a.getTime())[0];

        if (latestSeenAt) {
          setLastSeen((prev) =>
            prev && prev >= latestSeenAt ? prev : latestSeenAt,
          );
        }
      } catch (err) {
        console.error("[useChat] loadMessages:", err);
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    },
    [chatId, userId],
  );

  // ── reset + reload when chatId changes ────────────────────────────────────
  // ✅ ONE effect only — reset everything and load fresh
  useEffect(() => {
    // reset all state for the new chat
    setMessages([]);
    setCursor(null);
    setHasMore(true);
    setIsOnline(false);
    setIsTyping(false);
    setLastSeen(null);
    loadingRef.current = false; // ✅ always reset the guard on chat switch

    loadMessages(null);
  }, [chatId]); // ✅ only chatId — loadMessages intentionally excluded

  // ── socket listeners ──────────────────────────────────────────────────────
  useEffect(() => {
    const handleNewMessage = (msg: MessageDto) => {
      if (msg.chatId !== chatId) return;
      setMessages((prev) => [...prev, msg]);
      if (document.hasFocus() && msg.senderId !== userId) {
        emitMarkSeen(chatId, userId, msg.senderId);
      }
    };

    const handleOnline  = ({ userId: uid }: { userId: string }) => {
      if (uid === participant?.id) setIsOnline(true);
    };
    const handleOffline = ({ userId: uid }: { userId: string }) => {
      if (uid === participant?.id) setIsOnline(false);
    };

    const handleTypingStart = ({ userId: uid }: { userId: string }) => {
      if (uid === participant?.id) setIsTyping(true);
    };
    const handleTypingStop  = ({ userId: uid }: { userId: string }) => {
      if (uid === participant?.id) setIsTyping(false);
    };

    const handleSeen = ({ chatId: cid, seenAt }: { chatId: string; seenAt: string }) => {
      if (cid === chatId) setLastSeen(new Date(seenAt));
    };

    socket.on(SOCKET_EVENTS.NEW_MESSAGE,  handleNewMessage);
    socket.on(SOCKET_EVENTS.USER_ONLINE,  handleOnline);
    socket.on(SOCKET_EVENTS.USER_OFFLINE, handleOffline);
    socket.on(SOCKET_EVENTS.TYPING_START, handleTypingStart);
    socket.on(SOCKET_EVENTS.TYPING_STOP,  handleTypingStop);
    socket.on(SOCKET_EVENTS.MESSAGE_SEEN, handleSeen);

    return () => {
      socket.off(SOCKET_EVENTS.NEW_MESSAGE,  handleNewMessage);
      socket.off(SOCKET_EVENTS.USER_ONLINE,  handleOnline);
      socket.off(SOCKET_EVENTS.USER_OFFLINE, handleOffline);
      socket.off(SOCKET_EVENTS.TYPING_START, handleTypingStart);
      socket.off(SOCKET_EVENTS.TYPING_STOP,  handleTypingStop);
      socket.off(SOCKET_EVENTS.MESSAGE_SEEN, handleSeen);
    };
  }, [chatId, participant?.id, userId]);

  // ── actions ───────────────────────────────────────────────────────────────
  const handleSend = (text: string) => {
    if (!participant || !text.trim()) return;
    sendMessage({
      chatId,
      senderId:   userId,
      receiverId: participant.id,
      message:    text.trim(),
      type:       "text",
    });
  };

  const handleTyping = () => {
    socket.emit(SOCKET_EVENTS.TYPING_START, { chatId, userId });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit(SOCKET_EVENTS.TYPING_STOP, { chatId, userId });
    }, 2000);
  };

  const loadMore = () => {
    if (hasMore && !loading) loadMessages(cursor);
  };

  // ✅ expose reload for external triggers (e.g. after booking created)
  const reload = useCallback(() => {
    loadingRef.current = false;
    setMessages([]);
    setCursor(null);
    setHasMore(true);
    loadMessages(null);
  }, [loadMessages]);

  return {
    messages,
    loading,
    hasMore,
    isOnline,
    isTyping,
    lastSeen,
    handleSend,
    handleTyping,
    loadMore,
    reload,
  };
};