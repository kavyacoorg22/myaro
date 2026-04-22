import React, { useEffect, useRef, useState, useCallback } from "react";
import { X, UserMinus } from "lucide-react";
import type { IFollowingListDto } from "../../types/dtos/follow";
import { FollowApi } from "../../services/api/follow";
import { handleApiError } from "../../lib/utils/handleApiError";
import { useNavigate } from "react-router";
import { publicFrontendRoutes } from "../../constants/frontendRoutes/publicFrontendRoutes";


interface FollowingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCountChange?: (newCount: number) => void;
}

export const FollowingModal: React.FC<FollowingModalProps> = ({
  isOpen,
  onClose,
  onCountChange,
}) => {
  const [list, setList] = useState<IFollowingListDto[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [unfollowingId, setUnfollowingId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

const navigate = useNavigate();

  const fetchList = useCallback(async (cursor?: string) => {
    try {
      cursor ? setLoadingMore(true) : setLoading(true);
      const res = await FollowApi.getFollowingList(cursor);
const data = res.data?.data?.data ?? [];   
const next = res.data?.data?.nextCursor ?? null;
setList((prev) => (cursor ? [...prev, ...data] : data));
setNextCursor(next);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setList([]);
      setNextCursor(null);
      fetchList();
    }
  }, [isOpen, fetchList]);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextCursor && !loadingMore) {
          fetchList(nextCursor);
        }
      },
      { threshold: 0.5 }
    );
    if (bottomRef.current) observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [nextCursor, loadingMore, fetchList]);

  const handleUnfollow = async (beauticianId: string) => {
    try {
      setUnfollowingId(beauticianId);
      await FollowApi.unfollowBeautician(beauticianId);
      setList((prev) => prev.filter((item) => item.id !== beauticianId));
      onCountChange?.(list.length - 1);
    } catch (err) {
      handleApiError(err);
    } finally {
      setUnfollowingId(null);
    }
  };
   const handleProfileClick = (id: string) => {
  onClose();
  navigate(publicFrontendRoutes.profileByid.replace(":id", id));
};
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 flex flex-col overflow-hidden"
        style={{ maxHeight: "75vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-[15px] font-semibold text-gray-900 tracking-tight">
            Following
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div ref={scrollRef} className="overflow-y-auto flex-1">
          {loading ? (
            <div className="flex flex-col gap-3 p-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-11 h-11 rounded-full bg-gray-200 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                    <div className="h-2.5 bg-gray-100 rounded w-1/4" />
                  </div>
                  <div className="h-8 w-20 bg-gray-100 rounded-lg" />
                </div>
              ))}
            </div>
          ) : list.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
              <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center mb-3">
                <UserMinus className="w-6 h-6 text-rose-300" />
              </div>
              <p className="text-[14px] font-medium text-gray-700">
                Not following anyone yet
              </p>
              <p className="text-[12px] text-gray-400 mt-1">
                Beauticians you follow will appear here
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {list.map((item) => (
                <div
  key={item.id}
  onClick={() => handleProfileClick(item.id)}
  className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors cursor-pointer"  
>
                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-full overflow-hidden bg-rose-100 shrink-0 border border-gray-100">
                    {item.profileImg ? (
                      <img
                        src={item.profileImg}
                        alt={item.userName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-rose-600 font-bold text-lg">
                        {item.fullName?.charAt(0)?.toUpperCase() ??
                          item.userName?.charAt(0)?.toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-gray-900 truncate">
                      {item.userName}
                    </p>
                    <p className="text-[12px] text-gray-400 truncate">
                      {item.fullName}
                    </p>
                  </div>

                  {/* Unfollow button */}
                  <button
                    onClick={(e) => {    e.stopPropagation(); handleUnfollow(item.id)}}
                    disabled={unfollowingId === item.id}
                    className={`px-3.5 py-1.5 rounded-lg text-[12px] font-semibold border transition-all shrink-0 ${
                      unfollowingId === item.id
                        ? "opacity-50 cursor-not-allowed bg-gray-50 text-gray-400 border-gray-200"
                        : "text-rose-700 border-rose-200 bg-rose-50 hover:bg-rose-100 active:scale-95"
                    }`}
                  >
                    {unfollowingId === item.id ? "..." : "Following"}
                  </button>
                </div>
              ))}

              {/* Infinite scroll sentinel */}
              <div ref={bottomRef} className="h-1" />
              {loadingMore && (
                <div className="flex justify-center py-4">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-bounce"
                        style={{ animationDelay: `${i * 150}ms` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};