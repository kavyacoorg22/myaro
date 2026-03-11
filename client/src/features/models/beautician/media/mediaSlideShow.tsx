import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";


export const MediaSlideshow: React.FC<{ items: { src: string; fileType: "image" | "video" }[] }> = ({ items }) => {
  const [current, setCurrent] = useState(0);

  if (items.length === 0) return null;

  const prev = () => setCurrent((i) => (i - 1 + items.length) % items.length);
  const next = () => setCurrent((i) => (i + 1) % items.length);
  const item = items[current];

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {item.fileType === "image" ? (
        <img src={item.src} alt={`slide-${current}`} className="w-full h-full object-cover" />
      ) : (
        <video src={item.src} className="w-full h-full object-cover" autoPlay muted loop />
      )}

      {/* Arrows — only if multiple items */}
      {items.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-1 hover:bg-black/70 transition"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-1 hover:bg-black/70 transition"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-1.5 h-1.5 rounded-full transition ${i === current ? "bg-white" : "bg-white/40"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};