import { useNavigate } from "react-router-dom";
import { useChat } from "./useChat";
import { ChatHeader } from "./chatHeader";
import { MessageList } from "./messageList";
import { MessageInput } from "../messageInput";
import type { ChatWindowProps } from "../../../../types/chat";
import { useState } from "react";
import BookingModal from "../../../../models/booking/bookingModal";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../../redux/appStore";

export const ChatWindow = ({
  chatId,
  userId,
  participant,
}: ChatWindowProps) => {
  const navigate = useNavigate();
  const [showBooking, setShowBooking] = useState(false);
    const currentUserRole = useSelector((state: RootState) => state.user.currentUser.role); 

  const {
    messages,
    loading,
    hasMore,
    isOnline,
    isTyping,
    lastSeen,
    handleSend,
    handleTyping,
    loadMore,
    staleBookingIds
  } = useChat(chatId, userId, participant);

  const isBeautician = participant?.role === "beautician";
  const hasHomeService = participant?.serviceModes?.includes("HOME");
    const currentUserIsBeautician = currentUserRole === "beautician"
      const showBookingButton = isBeautician && hasHomeService && !currentUserIsBeautician;

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      <ChatHeader
        participant={participant}
        isOnline={isOnline}
        isTyping={isTyping}
        lastSeen={lastSeen}
      />

      <MessageList
        chatId={chatId} 
        messages={messages}
        userId={userId}
        participant={participant}
        lastSeen={lastSeen}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={loadMore}
         staleBookingIds={staleBookingIds}
      />

      <MessageInput
        onSend={handleSend}
        onTyping={handleTyping}
        showBooking={showBookingButton}
        onBook={() => setShowBooking(true)}
      />

      {showBooking && (
        <BookingModal
          isOpen={showBooking}
          onClose={() => setShowBooking(false)}
          beauticianId={participant?.id!}
          beauticianName={participant?.fullName!}
          chatId={chatId}
          userId={userId}
        />
      )}
    </div>
  );
};