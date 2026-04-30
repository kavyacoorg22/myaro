import { useState } from "react";

export const MessageInput = ({
  onSend,
  onBook,
  onTyping,
  showBooking = false,
}: {
  onSend: (text: string) => void;
  onBook?: () => void;
  onTyping?: () => void;
  showBooking?: boolean;
}) => {
  const [val, setVal] = useState("");

  const handleSend = () => {
    if (!val.trim()) return;
    onSend(val.trim());
    setVal("");
  };

  return (
    <div className="flex items-center gap-2 px-3 py-2 border-t border-gray-100 bg-white">
      {showBooking && onBook && (
        <button onClick={onBook} title="Book home service"
          className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white hover:bg-orange-600 active:scale-95 transition-all shrink-0">
          🏠
        </button>
      )}
      <input
        className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-full px-4 py-2 outline-none focus:border-indigo-400"
        placeholder="message"
        value={val}
        onChange={(e) => {
          setVal(e.target.value);
          onTyping?.(); 
        }}
        onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
      />
      <button onClick={handleSend}
        className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm hover:bg-indigo-600 active:scale-95 transition-all shrink-0">
        ↑
      </button>
      
    </div>
    
  );
};