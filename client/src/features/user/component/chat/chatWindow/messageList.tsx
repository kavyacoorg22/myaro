import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { MessageDto } from "../../../../../types/dtos/chat";
import { Bubble } from "../bubble";
import type { ChatParticipant } from "../../../../types/chat";
import { BookingCard } from "../../booking/bookingCard";
import type { IGetBookingByIdDto } from "../../../../../types/dtos/booking";
import { BookingApi } from "../../../../../services/api/booking";

const timeAgo = (date: Date): string => {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60)    return "just now";
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString();
};

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

interface MessageListProps {
  chatId:      string;
  messages:    MessageDto[];
  userId:      string;
  participant: ChatParticipant | null;
  lastSeen:    Date | null;
  loading:     boolean;
  hasMore:     boolean;
  onLoadMore:  () => void;
}

export const MessageList = ({
  chatId,
  messages,
  userId,
  participant,
  lastSeen,
  loading,
  hasMore,
  onLoadMore,
}: MessageListProps) => {
  const navigate  = useNavigate();
  const bottomRef = useRef<HTMLDivElement>(null);

  const bookingCacheRef = useRef<Record<string, IGetBookingByIdDto>>({});
  const [bookingCache, setBookingCache] = useState<Record<string, IGetBookingByIdDto>>({});

  // ✅ Combined — reset cache on chatId change, then fetch for current messages
  useEffect(() => {
    // reset cache for new chat
    bookingCacheRef.current = {};
    setBookingCache({});

    if (messages.length === 0) return;

    const ids = [
      ...new Set(
        messages
          .filter((m) => m.type === "booking" && m.bookingId)
          .map((m) => m.bookingId!)
      ),
    ];

    ids.forEach((id) => {
      bookingCacheRef.current[id] = {} as IGetBookingByIdDto;
      BookingApi.getBookingByid(id)
        .then((res) => {
          const data = res.data?.data?.data;
          if (data) {
            bookingCacheRef.current[id] = data;
            setBookingCache((prev) => ({ ...prev, [id]: data }));
          }
        })
        .catch(console.error);
    });
  }, [chatId]); // ✅ only chatId — full reset when chat switches

  // ✅ Separate effect for new messages arriving (socket / load more)
  useEffect(() => {
    if (messages.length === 0) return;

    const ids = [
      ...new Set(
        messages
          .filter((m) => m.type === "booking" && m.bookingId)
          .map((m) => m.bookingId!)
      ),
    ];

    const missing = ids.filter((id) => !bookingCacheRef.current[id]);
    if (missing.length === 0) return;

    missing.forEach((id) => {
      bookingCacheRef.current[id] = {} as IGetBookingByIdDto;
      BookingApi.getBookingByid(id)
        .then((res) => {
          const data = res.data?.data?.data;
          if (data) {
            bookingCacheRef.current[id] = data;
            setBookingCache((prev) => ({ ...prev, [id]: data }));
          }
        })
        .catch(console.error);
    });
  }, [messages]); // ✅ picks up new socket messages with new bookingIds

  const isBeautician   = participant?.role === "beautician";
  const hasHomeService = participant?.serviceModes?.includes("HOME");

  const lastSentIndex = messages.reduce(
    (last, msg, i) => (msg.senderId === userId ? i : last),
    -1,
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, bookingCache]);

  return (
    <div
      className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-2"
      onScroll={(e) => {
        if (e.currentTarget.scrollTop === 0 && hasMore && !loading) {
          onLoadMore();
        }
      }}
    >
      {participant && (
        <div className="flex flex-col items-center gap-3 py-10 mb-2">
          {participant.profileImg ? (
            <img
              src={participant.profileImg}
              alt={participant.fullName}
              className="w-20 h-20 rounded-full object-cover ring-2 ring-indigo-100"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold text-2xl">
              {participant.fullName?.[0]?.toUpperCase() ?? "?"}
            </div>
          )}
          <p className="text-base font-semibold text-gray-800">{participant.fullName}</p>
          <p className="text-xs text-gray-400">{participant.userName}</p>
          <div className="flex gap-2 mt-1">
            <button
              onClick={() => navigate(`/profile/${participant.id}`)}
              className="px-4 py-1.5 text-xs font-medium border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition"
            >
              View Profile
            </button>
            {isBeautician && hasHomeService && (
              <button
                onClick={() => navigate(`/book/${participant.id}`)}
                className="px-4 py-1.5 text-xs font-medium bg-orange-500 text-white rounded-full hover:bg-orange-600 transition flex items-center gap-1.5"
              >
                🏠 Book home service
              </button>
            )}
          </div>
        </div>
      )}

      {loading && (
        <p className="text-center text-xs text-gray-400 py-1">Loading...</p>
      )}

      {messages.map((msg, index) => {
        const isSelf     = msg.senderId === userId;
        const isLastSent = isSelf && index === lastSentIndex;
        const isSeen     = lastSeen && new Date(msg.createdAt) <= lastSeen;

        return (
          <Bubble key={msg.id} isSelf={isSelf}>
            {msg.type === "booking" ? (
              bookingCache[msg.bookingId!] ? (
                <BookingCard
                  bookingId={msg.bookingId!}
                  status={msg.status}
                  initialBooking={bookingCache[msg.bookingId!]}
                />
              ) : (
                <div className="rounded-2xl border border-gray-200 p-3 w-56 bg-white">
                  <p className="text-xs text-gray-400 animate-pulse">Loading...</p>
                </div>
              )
            ) : (
              <div className="flex flex-col">
                <span
                  className={`px-4 py-2 rounded-2xl text-sm max-w-xs break-words ${
                    isSelf
                      ? "bg-indigo-500 text-white"
                      : "bg-white border border-gray-200 text-gray-800"
                  }`}
                >
                  {msg.message}
                </span>
                <span
                  className={`text-[10px] text-gray-400 mt-0.5 flex items-center gap-1 ${
                    isSelf ? "justify-end" : "justify-start"
                  }`}
                >
                  <span>{formatTime(msg.createdAt)}</span>
                  {isSelf && (
                    <span className={isSeen ? "text-indigo-400" : "text-gray-300"}>
                      {isSeen ? "✓✓" : "✓"}
                    </span>
                  )}
                  {isSelf && isLastSent && lastSeen && (
                    <span className="text-gray-400">{timeAgo(lastSeen)}</span>
                  )}
                </span>
              </div>
            )}
          </Bubble>
        );
      })}

      <div ref={bottomRef} />
    </div>
  );
};