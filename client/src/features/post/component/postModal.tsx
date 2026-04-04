import { useCallback, useEffect, useRef, useState } from "react";
import { CommentLikeApi } from "../../../services/api/commentLike";
import { handleApiError } from "../../../lib/utils/handleApiError";

interface ModalUser {
  userName: string;
  fullName?: string;
  profileImg?: string;
}

interface Comment {
  commentId: string;
  userName: string;
  fullName?: string;
  profileImg?: string;
  text: string;
  createdAt?: string;
}

export const PostModal = ({
  post,
  user,
  onClose,
  postId,
  currentUser,
}: {
  post: {
    media: string[];
    description?: string;
    location?: { formattedString?: string } | null;
    likesCount?: number;
    timeAgo?: string;
  };
  user?: ModalUser;
  onClose: () => void;
  postId: string;
  currentUser: ModalUser;
}) => {
  const mediaList: string[] = post.media ?? [];
  const [mediaIndex, setMediaIndex] = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [liked, setLiked] = useState(false);
  const [localLikes, setLocalLikes] = useState(post.likesCount ?? 0);

  const inputRef = useRef<HTMLInputElement>(null);
  const current = mediaList[mediaIndex];
  const isVideo =
    typeof current === "string" && /\.(mp4|webm|mov)(\?|$)/i.test(current);
  const displayName = user?.userName || user?.fullName || "Unknown";
  const initials = displayName.charAt(0).toUpperCase();

  // ── Fetch comments ─────────────────────────────────────────────
  const fetchComments = useCallback(
    async (nextCursor?: string | null, replace = false) => {
      if (loadingComments) return;
      setLoadingComments(true);
      try {
        const res = await CommentLikeApi.getPostComment(postId, 10, nextCursor);
        const { comments: newComments, nextCursor: next } = res.data?.data!;

        const mapped: Comment[] = newComments.map((c: any) => {
          console.log("comment raw:", c);
          return {
            commentId: c.commentId,
            userName: c.userName,
            fullName: c.fullName,
            profileImg: c.profileImg,
            text: c.text,
            createdAt: c.createdAt,
          };
        });

        setComments((prev) => (replace ? mapped : [...prev, ...mapped]));
        setCursor(next);
        setHasMore(!!next);
      } catch (err) {
        handleApiError(err);
      } finally {
        setLoadingComments(false);
      }
    },
    [postId]
  );

  useEffect(() => {
    fetchComments(null, true);
  }, [postId]);

  // ── Add comment ────────────────────────────────────────────────
  const handleAddComment = async () => {
    if (!comment.trim() || submitting) return;
    setSubmitting(true);
    try {
         await CommentLikeApi.addPostComment(comment.trim(), postId);

     setComment("");
        await fetchComments(null, true);
     
    } catch (err) {
      handleApiError(err);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete comment ─────────────────────────────────────────────
  const handleDeleteComment = async (postId:string,commentId: string, index: number) => {
    try {
      await CommentLikeApi.deletePostComment(postId,commentId);
      setComments((prev) => prev.filter((_, i) => i !== index));
    } catch (err) {
      handleApiError(err);
    }
  };

  // ── Like ───────────────────────────────────────────────────────
  const handleLike = async () => {
    try {
      if (liked) {
        await CommentLikeApi.removeLike(postId);
        setLocalLikes((p) => p - 1);
      } else {
        await CommentLikeApi.addLike(postId);
        setLocalLikes((p) => p + 1);
      }
      setLiked((p) => !p);
    } catch (err) {
      handleApiError(err);
    }
  };

  // ── Keyboard ───────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight")
        setMediaIndex((i) => Math.min(i + 1, mediaList.length - 1));
      if (e.key === "ArrowLeft")
        setMediaIndex((i) => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, mediaList.length]);

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
              >
                ‹
              </button>
              <button
                onClick={() =>
                  setMediaIndex((i) => Math.min(i + 1, mediaList.length - 1))
                }
                disabled={mediaIndex === mediaList.length - 1}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center disabled:opacity-20 hover:bg-black/70 transition-colors text-lg"
              >
                ›
              </button>
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
              {user?.profileImg ? (
                <img
                  src={user.profileImg}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-rose-500 text-sm font-semibold">
                  {initials}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {displayName}
              </p>
              {post.location?.formattedString && (
                <p className="text-xs text-gray-400 truncate">
                  {post.location.formattedString}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none ml-2"
            >
              ✕
            </button>
          </div>

          {/* Comments list */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
            {/* Description as first comment */}
            {post.description && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {user?.profileImg ? (
                    <img
                      src={user.profileImg}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-rose-500 text-xs font-semibold">
                      {initials}
                    </span>
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

            {/* Comments */}
            {comments.map((cm, i) => (
              // ✅ fixed: cm.commentId instead of cm.id
              <div key={cm.commentId ?? i} className="flex gap-3 group">
                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {cm.profileImg ? (
                    <img
                      src={cm.profileImg}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-rose-500 text-xs font-semibold">
                      {cm.userName?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800">
                    <span className="font-semibold mr-1">{cm.userName}</span>
                    {cm.text}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    {cm.createdAt && (
                      <p className="text-xs text-gray-400">{cm.createdAt}</p>
                    )}
                    {/* ✅ fixed: cm.commentId instead of cm.id */}
{(cm.userName === currentUser?.userName || user?.userName === currentUser?.userName) && cm.commentId && (
                      <button
                        onClick={() => handleDeleteComment(postId, cm.commentId!, i)}
                        className="text-xs text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Load more */}
            {hasMore && (
              <button
                onClick={() => fetchComments(cursor)}
                disabled={loadingComments}
                className="text-xs text-gray-400 hover:text-gray-600 w-full text-center py-2"
              >
                {loadingComments ? "Loading..." : "Load more comments"}
              </button>
            )}
          </div>

          {/* Likes + actions */}
          <div className="px-4 py-2 border-t border-gray-100 flex items-center gap-4">
            <button
              onClick={handleLike}
              className="flex items-center gap-1.5 group transition-transform active:scale-90"
            >
              <svg
                className={`w-5 h-5 transition-colors ${
                  liked ? "fill-rose-500 text-rose-500" : "text-gray-700"
                }`}
                fill={liked ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              {localLikes > 0 && (
                <span className="text-sm font-medium text-gray-700">
                  {localLikes}
                </span>
              )}
            </button>
            <button
              onClick={() => inputRef.current?.focus()}
              className="text-gray-700 hover:text-blue-400 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </button>
          </div>

          {/* Add comment */}
          <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-3">
            <input
              ref={inputRef}
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddComment();
              }}
              placeholder="Add a comment..."
              className="flex-1 text-sm text-gray-800 placeholder-gray-400 bg-transparent outline-none"
            />
            <button
              disabled={!comment.trim() || submitting}
              onClick={handleAddComment}
              className="text-sm font-semibold text-rose-500 disabled:opacity-30 hover:text-rose-600 transition-colors"
            >
              {submitting ? "..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};