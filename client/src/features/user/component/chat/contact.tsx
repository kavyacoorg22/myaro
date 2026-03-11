export const Contact = ({ name, sub, active }: { name: string; sub: string; active?: boolean }) => (
  <div className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition ${active ? "bg-indigo-50" : "hover:bg-gray-50"}`}>
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white text-xs font-bold">
      {name[0]}
    </div>
    <div>
      <p className="text-xs font-semibold text-gray-800">{name}</p>
      <p className="text-[10px] text-gray-400">{sub}</p>
    </div>
  </div>
);
