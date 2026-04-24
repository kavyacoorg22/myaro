import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CommentLikeApi } from "../../services/api/commentLike";

export const LikeListModal = ({
  postId,
  onClose,
}: {
  postId: string;
  onClose: () => void;
}) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const cursorRef = useRef<string | null>(null);

  const fetchUsers = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const res = await CommentLikeApi.getUserLikeList(postId, 10, cursorRef.current);
      if(!res.data.data) return
      const data = res.data?.data?.data ?? [];
      const next = res.data?.data.nextCursor ?? null;
      setUsers((prev) => [...prev, ...data]);
      cursorRef.current = next;
      hasMoreRef.current = next !== null;
      setHasMore(next !== null);
    } catch {
      // handle silently
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchUsers();
  }, [postId]);

  // Infinite scroll
  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) fetchUsers(); },
      { threshold: 0.1 }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, fetchUsers]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-sm mx-4 overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="text-sm font-semibold text-gray-900">Likes</span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
        </div>

        {/* List */}
        <div className="overflow-y-auto max-h-80">
          {users.length === 0 && !loading && (
            <p className="text-center text-sm text-gray-400 py-8">No likes yet.</p>
          )}
          {users.map((u, i) => (
            <button
              key={u.id ?? i}
              onClick={() => { navigate(`/profile/${u.id}`); onClose(); }}
              className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-rose-100 flex items-center justify-center">
                {u.profileImg
                  ? <img src={u.profileImg} alt={u.fullName} className="w-full h-full object-cover" />
                  : <span className="text-rose-500 text-sm font-semibold">{u.fullName?.charAt(0).toUpperCase()}</span>
                }
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{u.userName}</p>
                <p className="text-xs text-gray-500 truncate">{u.fullName}</p>
              </div>
            </button>
          ))}
          <div ref={sentinelRef} />
          {loading && (
            <div className="flex justify-center py-4">
              <div className="w-5 h-5 rounded-full border-2 border-gray-200 border-t-gray-500 animate-spin" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};