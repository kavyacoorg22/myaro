import { useState } from "react";
import type { PostCardProps } from "../../../types/mediaType";
import { Bookmark, Heart, MessageCircle, MoreHorizontal, Play, Send, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { CommentLikeApi } from "../../../../services/api/commentLike";
import { handleApiError } from "../../../../lib/utils/handleApiError";
import { useNavigate } from "react-router-dom";
export const PostCard: React.FC<PostCardProps> = ({
  post,
  onFollow,
  onLike,
    onCommentClick, 
  className = "",
}) => {
  const [liked, setLiked] = useState(post.isLiked ?? false);
const [localLikes, setLocalLikes] = useState(post.likesCount ?? 0);
  const [saved, setSaved] = useState(false);
const navigate = useNavigate();
  const [followed, setFollowed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // normalize to array
  const mediaList: string[] = Array.isArray(post.mediaUrl)
    ? post.mediaUrl
    : post.mediaUrl ? [post.mediaUrl] : [];

  const total = mediaList.length;
  const currentMedia = mediaList[currentIndex] ?? '';
  const isVideo = (url: string) => /\.(mp4|webm|mov)$/i.test(url);
  const currentIsVideo = isVideo(currentMedia);

 const handleLike = async () => {
  const next = !liked;
  setLiked(next);
  setLocalLikes((prev) => (next ? prev + 1 : prev - 1));
  onLike?.(post.id, next);

  try {
    if (next) {
      await CommentLikeApi.addLike(post.id);
    } else {
      await CommentLikeApi.removeLike(post.id);
    }
  } catch (err) {
    // revert on error
    setLiked(!next);
    setLocalLikes((prev) => (!next ? prev + 1 : prev - 1));
    handleApiError(err);
  }
};

  const handleFollow = () => {
    setFollowed(true);
    onFollow?.(post.user.id);
  };

    const handleProfileClick = () => {
  navigate(`/profile/${post.user.id}`);
};

  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 w-full max-w-[470px] font-sans ${className}`}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <img
            onClick={handleProfileClick}
            src={post.user.profileImg ?? `https://ui-avatars.com/api/?name=${post.user.userName}`}
            alt={post.user.userName}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-rose-300 ring-offset-1 cursor-pointer"
          />
          <div className="flex flex-col leading-tight">
  <span onClick={handleProfileClick} className="text-sm font-semibold text-gray-900 flex items-center gap-1 cursor-pointer">
    {post.user.userName}
    {post.user.isVerified && (
      <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )}
  </span>

  <div className="flex items-center gap-1">
    {post.timeAgo && (
      <span className="text-xs text-gray-400 flex items-center gap-1">
        <span className="w-1 h-1 rounded-full bg-gray-300 inline-block" />
        {post.timeAgo}
      </span>
    )}
    {post.location && (
      <>
        <span className="text-xs text-gray-300">·</span>
        <span className="text-xs text-gray-400 flex items-center gap-0.5">
          <MapPin className="w-3 h-3" />
          {post.location.city}
        </span>
      </>
    )}
  </div>
</div>
        </div>
        <div className="flex items-center gap-2">
          {!followed ? (
            <button onClick={handleFollow} className="text-xs font-semibold text-blue-500 hover:text-blue-700 transition-colors">
              follow
            </button>
          ) : (
            <button className="text-xs font-medium text-gray-400 cursor-default">following</button>
          )}
          <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-50 transition">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Media Slideshow ── */}
      <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">

        {currentIsVideo ? (
          <video
            src={currentMedia}
            className="w-full h-full object-cover"
            controls
            playsInline
          />
        ) : (
          <img
            src={currentMedia}
            alt={post.description ?? "post"}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}

        {/* Prev button */}
        {total > 1 && currentIndex > 0 && (
          <button
            onClick={() => setCurrentIndex(i => i - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 rounded-full p-1 text-white hover:bg-black/60 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Next button */}
        {total > 1 && currentIndex < total - 1 && (
          <button
            onClick={() => setCurrentIndex(i => i + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 rounded-full p-1 text-white hover:bg-black/60 transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Dot indicators */}
        {total > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {mediaList.map((_, i) => (
              <div
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-1.5 h-1.5 rounded-full cursor-pointer transition-all ${
                  i === currentIndex ? "bg-white scale-125" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}

        {/* Counter top-right */}
        {total > 1 && (
          <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
            {currentIndex + 1}/{total}
          </div>
        )}
      </div>

      {/* ── Actions ── */}
      <div className="px-4 pt-3 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
          <button onClick={handleLike} className="flex items-center gap-1.5 group transition-transform active:scale-90">
<Heart className={`w-5 h-5 transition-colors ${liked ? "fill-rose-500 text-rose-500" : "text-gray-700 group-hover:text-rose-400"}`} />
      {localLikes > 0 && <span className="text-sm font-medium text-gray-700">{localLikes}</span>}
    </button>
              <button 
      onClick={() => onCommentClick?.(post.id)}  
      className="group transition-transform active:scale-90"
    >
      <MessageCircle className="w-5 h-5 text-gray-700 group-hover:text-blue-400 transition-colors" />
    </button>
            <button className="group transition-transform active:scale-90">
              <Send className="w-5 h-5 text-gray-700 group-hover:text-green-400 transition-colors" />
            </button>
          </div>
          <button onClick={() => setSaved((s) => !s)} className="transition-transform active:scale-90">
            <Bookmark className={`w-5 h-5 transition-colors ${saved ? "fill-gray-900 text-gray-900" : "text-gray-700 hover:text-gray-900"}`} />
          </button>
        </div>
        {post.description && (
          <div className="mt-2">
            <span className="text-sm font-semibold text-gray-900 mr-2">{post.user.userName}</span>
            <span className="text-sm text-gray-600">{post.description}</span>
          </div>
        )}
      </div>
    </div>
  );
};