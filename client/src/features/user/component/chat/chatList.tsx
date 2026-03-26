import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { SaidBar } from "../saidBar/saidbar";
import { ChatApi } from "../../../../services/api/chat";
import { ChatWindow } from "./chatWindow";
import type { IChatListDto } from "../../../../types/dtos/chat";
import type { RootState } from "../../../../redux/appStore";
import { useLocation, useParams } from "react-router";
import socket from "../../../../services/socket/socket";
import { SOCKET_EVENTS } from "../../../../constants/socketConstants";
import { Contact } from "./contact";

export default function ChatList() {
  const userId = useSelector((s: RootState) => s.user.currentUser.userId);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [cursor, setCursor]             = useState<string | null>(null);
  const [hasMore, setHasMore]           = useState(true);
  const [loading, setLoading]           = useState(false);
  const [chats, setChats]               = useState<IChatListDto[]>([]);
  const [onlineUsers, setOnlineUsers]   = useState<Set<string>>(new Set());
  const [typingChats, setTypingChats]   = useState<Set<string>>(new Set());

  const { id } = useParams();
  const location = useLocation();
  const participantFromState = location.state?.participant;

  // ── fetch chats ────────────────────────────────────────────────────────────
  const fetchChats = async (cursorParam: string | null = null, reset = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await ChatApi.getUserChats(cursorParam, 20);
      if (!res.data.data) return;
      const { chats: newChats, nextCursor, hasMore: more } = res.data.data;
      setChats((prev) => (reset ? newChats : [...prev, ...newChats]));
      setCursor(nextCursor);
      setHasMore(more);
    } finally {
      setLoading(false);
    }
  };

  // ── initial load ───────────────────────────────────────────────────────────
  useEffect(() => {
    fetchChats(null, false);
  }, []);

  // ── refetch + set active when URL id changes ───────────────────────────────
  useEffect(() => {
    if (id) {
      setChats([]);
      setCursor(null);
      setHasMore(true);
      setActiveChatId(id);
      fetchChats(null, true);
    }
  }, [id]);

  // ── online / offline ───────────────────────────────────────────────────────
  useEffect(() => {
    const handleOnline  = ({ userId }: { userId: string }) => {
      setOnlineUsers((prev) => new Set(prev).add(userId));
    };
    const handleOffline = ({ userId }: { userId: string }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    };

    socket.on(SOCKET_EVENTS.USER_ONLINE,  handleOnline);
    socket.on(SOCKET_EVENTS.USER_OFFLINE, handleOffline);
    return () => {
      socket.off(SOCKET_EVENTS.USER_ONLINE,  handleOnline);
      socket.off(SOCKET_EVENTS.USER_OFFLINE, handleOffline);
    };
  }, []);

  // ── typing ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const handleTypingStart = ({ chatId }: { chatId: string }) => {
      setTypingChats((prev) => new Set(prev).add(chatId));
    };
    const handleTypingStop  = ({ chatId }: { chatId: string }) => {
      setTypingChats((prev) => {
        const next = new Set(prev);
        next.delete(chatId);
        return next;
      });
    };

    socket.on(SOCKET_EVENTS.TYPING_START, handleTypingStart);
    socket.on(SOCKET_EVENTS.TYPING_STOP,  handleTypingStop);
    return () => {
      socket.off(SOCKET_EVENTS.TYPING_START, handleTypingStart);
      socket.off(SOCKET_EVENTS.TYPING_STOP,  handleTypingStop);
    };
  }, []);

  // ── clear unread badge when messages are seen ──────────────────────────────
  useEffect(() => {
    const handleSeen = ({ chatId }: { chatId: string }) => {
      setChats((prev) =>
        prev.map((c) => (c.chatId === chatId ? { ...c, unreadCount: 0 } : c)),
      );
    };

    socket.on(SOCKET_EVENTS.MESSAGE_SEEN, handleSeen);
    return () => {
      socket.off(SOCKET_EVENTS.MESSAGE_SEEN, handleSeen);
    };
  }, []);

  // ── update last message preview on new message ─────────────────────────────
  useEffect(() => {
    const handleNewMessage = ({
      chatId,
      message,
      senderId,
    }: {
      chatId:   string;
      message:  string;
      senderId: string;
    }) => {
      setChats((prev) =>
        prev.map((c) => {
          if (c.chatId !== chatId) return c;
          return {
            ...c,
            lastMessage: message,
            // only increment unread if the message is from the other person
            // and this chat is not currently active
            unreadCount:
              senderId !== userId && chatId !== activeChatId
                ? c.unreadCount + 1
                : c.unreadCount,
          };
        }),
      );
    };

    socket.on(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage);
    return () => {
      socket.off(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage);
    };
  }, [userId, activeChatId]);

  const activeChat = chats.find((c) => c.chatId === activeChatId);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <SaidBar />
      <div className="flex flex-1 ml-16 overflow-hidden">

        {/* ── Sidebar ── */}
        <aside className="w-72 bg-white flex flex-col shadow-sm">
          <div className="px-4 pt-5 pb-3">
            <p className="text-sm font-bold mb-3">Messages</p>
            <input
              placeholder="Search messages..."
              className="w-full text-sm px-4 py-2 rounded-full bg-gray-100 outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* ── Contact list with scroll pagination ── */}
          <div
            className="flex-1 overflow-y-auto"
            onScroll={(e) => {
              if (
                e.currentTarget.scrollHeight - e.currentTarget.scrollTop <=
                  e.currentTarget.clientHeight + 50 &&
                hasMore &&
                !loading
              ) {
                fetchChats(cursor);
              }
            }}
          >
            {chats.length === 0 ? (
              <div className="text-center text-gray-400 mt-4 text-sm">
                No messages yet
              </div>
            ) : (
              chats.map((chat) => (
                <Contact
                  key={chat.chatId}
                  chatId={chat.chatId}
                  name={chat.participant.fullName}
                  profileImg={chat.participant.profileImg}
                  sub={chat.lastMessage}
                  unreadCount={chat.unreadCount}
                  active={chat.chatId === activeChatId}
                  isOnline={onlineUsers.has(chat.participant.id)}
                  isTyping={typingChats.has(chat.chatId)}
                  onClick={() => setActiveChatId(chat.chatId)}
                />
              ))
            )}
          </div>
        </aside>

        {/* ── Chat window ── */}
        <main className="flex-1 flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
          {activeChatId && userId ? (
            <ChatWindow
              chatId={activeChatId}
              userId={userId}
              participant={activeChat?.participant ?? participantFromState ?? null}
            />
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center text-gray-400">
              <div className="text-4xl mb-2">💬</div>
              <p className="text-sm font-medium">No conversations yet</p>
              <p className="text-xs mt-1">Start chatting</p>
            </div>
          )}
        </main>
        
      </div>
    </div>
  );
}