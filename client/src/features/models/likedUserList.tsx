import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { IGetLikedUserListDto } from "../../types/dtos/commetLike";
import { CommentLikeApi } from "../../services/api/commentLike";
import { publicFrontendRoutes } from "../../constants/frontendRoutes/publicFrontendRoutes";

interface LikeListModalProps {
  postId: string;
  onClose: () => void;
}

const LIMIT = 10;

const AVATAR_COLORS = [
  { bg: "#B5D4F4", text: "#0C447C" },
  { bg: "#9FE1CB", text: "#085041" },
  { bg: "#F4C0D1", text: "#72243E" },
  { bg: "#FAC775", text: "#633806" },
  { bg: "#CECBF6", text: "#3C3489" },
  { bg: "#F5C4B3", text: "#993C1D" },
];

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const getAvatarColor = (index: number) =>
  AVATAR_COLORS[index % AVATAR_COLORS.length];

interface UserRowProps {
  user: IGetLikedUserListDto;
  index: number;
  onClick: (id: string) => void;
}

const UserRow = ({ user, index, onClick }: UserRowProps) => {
  const { bg, text } = getAvatarColor(index);

  return (
    <button
      onClick={() => onClick(user.id)}
      className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors text-left"
    >
      <div className="flex-shrink-0">
        {user.profileImg ? (
          <img
            src={user.profileImg}
            alt={user.fullName}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium"
            style={{ background: bg, color: text }}
          >
            {getInitials(user.fullName)}
          </div>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {user.userName}
        </p>
        <p className="text-xs text-gray-500 truncate">{user.fullName}</p>
      </div>
    </button>
  );
};

export const LikeListModal = ({ postId, onClose }: LikeListModalProps) => {
  const navigate = useNavigate();

  const [users, setUsers] = useState<IGetLikedUserListDto[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const fetchUsers = useCallback(
    async (nextCursor: string | null) => {
      if (loading || !hasMore) return;

      setLoading(true);
      setError(null);

      const res = await CommentLikeApi.getUserLikeList(postId, LIMIT, nextCursor);
      if (!res.data.data) return;
      if (res.data.data) {
        setUsers((prev) => [...prev, ...res.data?.data]);
        setCursor(res.data.nextCursor);
        setHasMore(res.data.nextCursor !== null);
      } else {
        setError("Failed to load likes. Please try again.");
      }

      setLoading(false);
    },
    [postId, loading, hasMore]
  );

  useEffect(() => {
    fetchUsers(null);
  }, [postId]);

  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchUsers(cursor);
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(sentinelRef.current);

    return () => observerRef.current?.disconnect();
  }, [cursor, hasMore, fetchUsers]);

  const handleUserClick = (userId: string) => {
    navigate(publicFrontendRoutes.profileByid.replace(":id", userId));
    onClose();
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    // z-[200] ensures this renders above PostModal's z-50 (= z-index: 50)
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/45"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-sm mx-4 overflow-hidden shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-900">Likes</span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto max-h-80">
          {users.length === 0 && !loading && (
            <p className="text-center text-sm text-gray-400 py-8">No likes yet.</p>
          )}

          {users.map((user, i) => (
            <UserRow
              key={user.id}
              user={user}
              index={i}
              onClick={handleUserClick}
            />
          ))}

          <div ref={sentinelRef} />

          {loading && (
            <div className="flex justify-center py-4">
              <div className="w-5 h-5 rounded-full border-2 border-gray-200 border-t-gray-500 animate-spin" />
            </div>
          )}

          {error && (
            <p className="text-center text-xs text-red-500 py-3">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
};