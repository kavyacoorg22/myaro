import { BookingCard } from "../booking/bookingCard";
import { Bubble } from "./bubble";
import { MessageInput } from "./messageInput";
import type { BookingStatus } from "../../../types/booking";
import { useState } from "react";
import { Contact } from "./contact";

export default function ChatApp() {
  const [bookings, setBookings] = useState<BookingStatus[]>([
    "pending", "confirmed", "rejected", "rescheduled",
  ]);

  const update = (i: number, s: BookingStatus) =>
    setBookings((prev) => prev.map((b, idx) => (idx === i ? s : b)));

  const msgs = [
    { id: 0, isSelf: false, text: "Hi 👋" },
    { id: 1, isSelf: true, isBooking: true, bookingIdx: 0 },
    { id: 2, isSelf: false, isBooking: true, bookingIdx: 1 },
    { id: 3, isSelf: false, isBooking: true, bookingIdx: 2 },
    { id: 4, isSelf: false, isBooking: true, bookingIdx: 3 },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col py-4 px-2 gap-1">
        <p className="text-sm font-bold px-3 mb-2 text-gray-700">Ramcharan_02</p>
        <input
          className="mx-3 text-xs bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 outline-none mb-3"
          placeholder="search"
        />
        <p className="text-[10px] text-gray-400 px-3 uppercase tracking-wider mb-1">Messages</p>
        <Contact name="Ram" sub="you: hi 32 min" active />
        <Contact name="Priya" sub="okay got it!" />
        <Contact name="Ajay" sub="thanks 👍" />
      </aside>

      {/* Chat */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 bg-white">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold text-sm">R</div>
          <div>
            <p className="text-sm font-semibold">Ram</p>
            <p className="text-[11px] text-gray-400">Ramcharan_02</p>
          </div>
        </header>

        {/* Profile peek */}
        <div className="flex flex-col items-center py-5 border-b border-gray-100 bg-white">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white text-xl font-bold mb-1">R</div>
          <p className="text-sm font-semibold">Ram</p>
          <button className="mt-2 text-xs border border-gray-300 rounded-full px-4 py-1 hover:bg-gray-50 transition">view profile</button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-1">
          <p className="text-center text-[11px] text-gray-400 mb-2">10:55 AM</p>

          {msgs.map((m) => (
            <Bubble key={m.id} isSelf={m.isSelf}>
              {!m.isBooking ? (
                <span className={`px-3 py-2 rounded-2xl text-sm ${m.isSelf ? "bg-indigo-500 text-white" : "bg-white border border-gray-200"}`}>
                  {m.text}
                </span>
              ) : (
                <BookingCard
                  service="Home Service"
                  status={bookings[m.bookingIdx!]}
                  reason="Not available on that date"
                  onConfirm={() => update(m.bookingIdx!, "confirmed")}
                  onReject={() => update(m.bookingIdx!, "rejected")}
                  onComplete={() => update(m.bookingIdx!, "rescheduled")}
                  onCancel={() => update(m.bookingIdx!, "rejected")}
                  onReschedule={() => update(m.bookingIdx!, "pending")}
                />
              )}
            </Bubble>
          ))}
        </div>

        <MessageInput onSend={(t) => console.log(t)} />
      </main>
    </div>
  );
}