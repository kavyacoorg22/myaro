import { useState } from "react";

export const MessageInput = ({ onSend }: { onSend: (text: string) => void }) => {
  const [val, setVal] = useState("");
  return (
    <div className="flex items-center gap-2 px-3 py-2 border-t border-gray-100 bg-white">
      <input
        className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-full px-4 py-2 outline-none focus:border-indigo-400"
        placeholder="message"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && val.trim()) {
            onSend(val.trim());
            setVal("");
          }
        }}
      />
      <button
        onClick={() => { if (val.trim()) { onSend(val.trim()); setVal(""); } }}
        className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm hover:bg-indigo-600 active:scale-95 transition-all"
      >
        ↑
      </button>
    </div>
  );
};
