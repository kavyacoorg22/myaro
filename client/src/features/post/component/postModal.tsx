import { useEffect, useState } from "react";
import type { BeauticianPostData } from "../../types/post";

export const PostModal = ({ post, onClose }: { post: BeauticianPostData; onClose: () => void }) => {
  const mediaList: string[] = post.media;
  const [mediaIndex, setMediaIndex] = useState(0);
  const current = mediaList[mediaIndex];
  const isVideo =
    post.postType === "reel" ||
    (typeof current === "string" && /\.(mp4|webm|mov)(\?|$)/i.test(current));
 
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setMediaIndex((i) => Math.min(i + 1, mediaList.length - 1));
      if (e.key === "ArrowLeft") setMediaIndex((i) => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, mediaList.length]);
 
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl overflow-hidden shadow-2xl max-w-3xl w-full mx-4 flex flex-col md:flex-row"
        style={{ maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Media panel */}
        <div
          className="relative bg-black flex-shrink-0 w-full md:w-[420px] flex items-center justify-center"
          style={{ minHeight: 320 }}
        >
          {isVideo ? (
            <video src={current} controls autoPlay className="w-full h-full object-contain" style={{ maxHeight: 520 }} />
          ) : (
            <img src={current} alt="Post" className="w-full h-full object-contain" style={{ maxHeight: 520 }} />
          )}
 
          {mediaList.length > 1 && (
            <>
              <button
                onClick={() => setMediaIndex((i) => Math.max(i - 1, 0))}
                disabled={mediaIndex === 0}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center disabled:opacity-20 hover:bg-black/70 transition-colors text-lg"
              >‹</button>
              <button
                onClick={() => setMediaIndex((i) => Math.min(i + 1, mediaList.length - 1))}
                disabled={mediaIndex === mediaList.length - 1}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center disabled:opacity-20 hover:bg-black/70 transition-colors text-lg"
              >›</button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {mediaList.map((_, i) => (
                  <button key={i} onClick={() => setMediaIndex(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${i === mediaIndex ? "bg-white scale-125" : "bg-white/50"}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
 
        {/* Info panel */}
        <div className="flex flex-col p-5 flex-1 overflow-y-auto">
          <button onClick={onClose} className="self-end text-gray-400 hover:text-gray-600 transition-colors mb-3 text-xl leading-none">✕</button>
 
          {post.description && (
            <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{post.description}</p>
          )}
 
          {post.location?.formattedString && (
            <div className="flex items-center gap-1 mt-3 text-xs text-gray-400">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {post.location.formattedString}
            </div>
          )}
 
          {!!post.likesCount && (
            <div className="flex items-center gap-1 mt-3 text-xs text-gray-400">
              <svg className="w-3.5 h-3.5 text-rose-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd" />
              </svg>
              {post.likesCount} likes
            </div>
          )}
 
          <p className="text-gray-400 text-xs mt-auto pt-4">{post.timeAgo}</p>
        </div>
      </div>
    </div>
  );
};