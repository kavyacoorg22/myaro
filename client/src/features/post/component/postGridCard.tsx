import type { PostCardData } from "../../types/mediaType";

export const PostGridCard = ({ post, onClick }: { post: PostCardData; onClick: () => void }) => {
  const thumb = post.thumbnailUrl ?? (Array.isArray(post.mediaUrl) ? post.mediaUrl[0] : post.mediaUrl);
  const isVideo = post.mediaType === "reel";
  const hasMultiple = Array.isArray(post.mediaUrl) && post.mediaUrl.length > 1;
 
  return (
    <button onClick={onClick} className="relative aspect-square overflow-hidden group bg-gray-100 focus:outline-none">
      {isVideo ? (
        <video src={thumb} muted playsInline
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
      ) : (
        <img src={thumb} alt="Post" loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
      <div className="absolute top-2 right-2 flex gap-1">
        {isVideo && (
          <span className="bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-full backdrop-blur-sm">▶</span>
        )}
        {hasMultiple && (
          <span className="bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-full backdrop-blur-sm">⧉</span>
        )}
      </div>
    </button>
  );
};