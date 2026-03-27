import type { PostCardData } from "../../types/mediaType";

const isVideoUrl = (url: string) => /\.(mp4|webm|mov)(\?|$)/i.test(url);

export const PostGridCard = ({ post, onClick }: { post: PostCardData; onClick: () => void }) => {
  const firstMedia = Array.isArray(post.mediaUrl) ? post.mediaUrl[0] : post.mediaUrl;
  const isVideo = post.mediaType === "video" || isVideoUrl(firstMedia ?? "");
  const hasMultiple = Array.isArray(post.mediaUrl) && post.mediaUrl.length > 1;

  return (
    <button onClick={onClick} className="relative aspect-square overflow-hidden group bg-gray-100 focus:outline-none">
      {isVideo ? (
        <video src={firstMedia} muted playsInline className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]" />
      ) : (
        <img src={firstMedia} alt="" loading="lazy" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]" />
      )}

      {/* Hover overlay — likes + comments */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-5">
        {!!post.likesCount && (
          <span className="flex items-center gap-1.5 text-white text-sm font-medium">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
            </svg>
            {post.likesCount}
          </span>
        )}
      </div>

      {/* Video duration badge — bottom left */}
      {isVideo && (
        <div className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-full flex items-center gap-1">
          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          0:00
        </div>
      )}

      {/* Multi-image badge — top right */}
      {hasMultiple && !isVideo && (
        <div className="absolute top-1.5 right-1.5 text-white">
          <svg className="w-4 h-4 drop-shadow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="7" y="7" width="14" height="14" rx="2"/><path d="M3 7h1M3 12h1M7 3v1M12 3v1"/>
          </svg>
        </div>
      )}
    </button>
  );
};