import type { ChatParticipant } from "../../../../types/chat";

const timeAgo = (date: Date): string => {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60)    return "just now";
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString();
};

interface ChatHeaderProps {
  participant: ChatParticipant | null;
  isOnline:   boolean;
  isTyping:   boolean;
  lastSeen:   Date | null;
}

export const ChatHeader = ({ participant, isOnline, isTyping, lastSeen }: ChatHeaderProps) => (
  <header className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 bg-white shrink-0">
    <div className="relative shrink-0">
      {participant?.profileImg ? (
        <img
          src={participant.profileImg}
          alt={participant.fullName}
          className="w-9 h-9 rounded-full object-cover"
        />
      ) : (
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold text-sm">
          {participant?.fullName?.[0]?.toUpperCase() ?? "?"}
        </div>
      )}
      {isOnline && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full ring-2 ring-white" />
      )}
    </div>

    <div className="flex-1">
      <p className="text-sm font-semibold">{participant?.fullName ?? ""}</p>

      {isTyping ? (
        <p className="text-[11px] text-indigo-400 flex items-center gap-1">
          <span className="inline-flex gap-0.5">
            {[0, 150, 300].map((delay) => (
              <span
                key={delay}
                className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce"
                style={{ animationDelay: `${delay}ms` }}
              />
            ))}
          </span>
          typing...
        </p>
      ) : isOnline ? (
        <p className="text-[11px] text-green-500 font-medium">Online</p>
      ) : lastSeen ? (
        <p className="text-[11px] text-gray-400">Seen {timeAgo(lastSeen)}</p>
      ) : (
        <p className="text-[11px] text-gray-400">{participant?.userName ?? ""}</p>
      )}
    </div>
  </header>
);