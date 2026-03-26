import type { ContactProps } from "../../../types/chat";

// Add isTyping prop to ContactProps
export const Contact = ({ 
  chatId, name, profileImg, sub, unreadCount, 
  active, onClick, isOnline = false, isTyping = false 
}: ContactProps) => (
  <div onClick={onClick} className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all ${
    active ? "bg-indigo-50 border-l-2 border-l-indigo-400" : "hover:bg-gray-50 border-l-2 border-l-transparent"
  }`}>
    <div className="relative shrink-0">
      {profileImg ? (
        <img src={profileImg} className="w-11 h-11 rounded-full object-cover" />
      ) : (
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-semibold text-sm">
          {name?.[0]?.toUpperCase()}
        </div>
      )}
      {isOnline && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full ring-2 ring-white" />
      )}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between">
        <p className={`text-sm truncate ${active ? "font-semibold text-indigo-700" : "font-medium text-gray-800"}`}>
          {name}
        </p>
        {unreadCount > 0 && (
          <span className="ml-2 bg-indigo-500 text-white text-[10px] font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shrink-0">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </div>
      {/* ✅ show typing in sidebar */}
      {isTyping ? (
        <p className="text-xs text-indigo-400 italic">typing...</p>
      ) : (
        <p className={`text-xs truncate mt-0.5 ${active ? "text-indigo-400" : "text-gray-400"}`}>
          {sub || "No messages yet"}
        </p>
      )}
    </div>
  </div>
);