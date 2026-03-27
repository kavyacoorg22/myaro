import { useEffect, useRef, useState } from "react";
import type { BeauticianPostData } from "../../types/post";

interface ModalUser {
  userName: string;
  fullName?: string;
  profileImg?: string;
}

export const PostModal = ({
  post,
  user,
  onClose,
}: {
  post: BeauticianPostData;
  user: ModalUser;
  onClose: () => void;
}) => {
  const mediaList: string[] = post.media;
  const [mediaIndex, setMediaIndex] = useState(0);
  const [comment, setComment] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const current = mediaList[mediaIndex];
  const isVideo = typeof current === "string" && /\.(mp4|webm|mov)(\?|$)/i.test(current);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setMediaIndex((i) => Math.min(i + 1, mediaList.length - 1));
      if (e.key === "ArrowLeft") setMediaIndex((i) => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, mediaList.length]);

  const displayName = user.userName || user.fullName || "Unknown";
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
        style={{ width: "min(900px, 95vw)", maxHeight: "92vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Media panel ── */}
        <div
          className="relative bg-black flex-shrink-0 flex items-center justify-center"
          style={{ width: "min(520px, 55vw)", minHeight: 360 }}
        >
          {isVideo ? (
            <video
              src={current}
              controls
              autoPlay
              className="w-full h-full object-contain"
              style={{ maxHeight: "92vh" }}
            />
          ) : (
            <img
              src={current}
              alt="Post"
              className="w-full h-full object-contain"
              style={{ maxHeight: "92vh" }}
            />
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
                  <button
                    key={i}
                    onClick={() => setMediaIndex(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      i === mediaIndex ? "bg-white scale-125" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── Info panel ── */}
        <div className="flex flex-col flex-1 min-w-0" style={{ minHeight: 360 }}>

          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
            <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {user.profileImg ? (
                <img src={user.profileImg} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-rose-500 text-sm font-semibold">{initials}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
              {post.location?.formattedString && (
                <p className="text-xs text-gray-400 truncate">{post.location.formattedString}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none ml-2"
            >✕</button>
          </div>

          {/* Description + comments */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
            {post.description && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {user.profileImg ? (
                    <img src={user.profileImg} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-rose-500 text-xs font-semibold">{initials}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800">
                    <span className="font-semibold mr-1">{displayName}</span>
                    {post.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{post.timeAgo}</p>
                </div>
              </div>
            )}
          </div>

          {/* Likes */}
          {!!post.likesCount && (
            <div className="px-4 py-2 border-t border-gray-100 flex items-center gap-1.5">
              <svg className="w-4 h-4 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
              </svg>
              <span className="text-sm font-semibold text-gray-800">{post.likesCount} likes</span>
            </div>
          )}

          {/* Add comment */}
          <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-3">
            <input
              ref={inputRef}
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && comment.trim()) {
                  // TODO: call post comment API
                  setComment("");
                }
              }}
              placeholder="Add a comment..."
              className="flex-1 text-sm text-gray-800 placeholder-gray-400 bg-transparent outline-none"
            />
            <button
              disabled={!comment.trim()}
              onClick={() => {
                setComment("");
              }}
              className="text-sm font-semibold text-rose-500 disabled:opacity-30 hover:text-rose-600 transition-colors"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};