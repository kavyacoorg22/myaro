import { useCallback, useEffect, useRef, useState } from "react";
import { BeauticianApi } from "../../../services/api/beautician";
import { publicAPi } from "../../../services/api/public";
import { handleApiError } from "../../../lib/utils/handleApiError";
import { EmptyPosts } from "../component/emptyPost";
import { PostModal } from "../component/postModal";
import type { PostCardData, PostType } from "../../types/mediaType";
import { PostSkeleton } from "../component/skelton";
import { PostGridCard } from "../component/postGridCard";
import type { BeauticianPostData, PostsTabProps } from "../../types/post";

const isVideoUrl = (url: string) => /\.(mp4|webm|mov)(\?|$)/i.test(url);

const toPostCardData = (dto: BeauticianPostData): PostCardData => ({
  id: dto.id,
  user: { id: "", userName: "", profileImg: undefined, isVerified: false },
  location: dto.location ?? null,
  mediaUrl: dto.media.length === 1 ? dto.media[0] : dto.media,
  mediaType: isVideoUrl(dto.media[0]) ? "video" : "image",
  thumbnailUrl: dto.media[0],
  description: dto.description,
  likesCount: dto.likesCount ?? 0,
  timeAgo: dto.timeAgo,
  isLiked:dto.isLiked
});

interface ModalUser {
  userName: string;
  fullName?: string;
  profileImg?: string;
}

export const PostsTab = ({
  beauticianUserId,
  postType = "post" as PostType,
  viewMode,
  user,
}: PostsTabProps & { user: ModalUser }) => {
  const [posts, setPosts] = useState<PostCardData[]>([]);
  const [rawPosts, setRawPosts] = useState<BeauticianPostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [selectedPost, setSelectedPost] = useState<BeauticianPostData | null>(null);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const isOwn = !beauticianUserId;

  const fetchPosts = useCallback(
    async (nextCursor?: string | null, replace = false) => {
      if (viewMode !== "own-beautician" && viewMode !== "view-beautician") return;
      try {
        replace ? setLoading(true) : setLoadingMore(true);
        const response = isOwn
          ? await BeauticianApi.getBeauticianPosts(postType, 12, nextCursor)
          : await publicAPi.getBeauticianPost(beauticianUserId!, postType, 12, nextCursor);

        const data = response?.data;
        const newDtos: BeauticianPostData[] = data?.posts ?? [];
        const nextCursorValue: string | null = data?.nextCursor ?? null;
        const mapped = newDtos.map(toPostCardData);

        setPosts((prev) => (replace ? mapped : [...prev, ...mapped]));
        setRawPosts((prev) => (replace ? newDtos : [...prev, ...newDtos]));
        setCursor(nextCursorValue);
        setHasMore(!!nextCursorValue);
      } catch (err) {
        handleApiError(err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [beauticianUserId, isOwn, postType, viewMode]
  );

  useEffect(() => {
    setPosts([]);
    setRawPosts([]);
    setCursor(null);
    setHasMore(true);
    fetchPosts(null, true);
  }, [fetchPosts]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          fetchPosts(cursor);
        }
      },
      { threshold: 0.1 }
    );
    if (sentinelRef.current) observerRef.current.observe(sentinelRef.current);
    return () => observerRef.current?.disconnect();
  }, [hasMore, loadingMore, loading, cursor, fetchPosts]);

  if (loading) return <PostSkeleton />;
  if (!loading && posts.length === 0) return <EmptyPosts />;

  return (
    <>
      <div className="w-full">
        <div className="grid grid-cols-3 gap-[2px] w-full">
          {posts.map((post, index) => (
            <PostGridCard
              key={post.id}
              post={post}
              onClick={() => setSelectedPost(rawPosts[index])}
            />
          ))}
        </div>
      </div>

      <div ref={sentinelRef} className="h-4" />

      {loadingMore && (
        <div className="flex justify-center py-6">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-rose-400 animate-bounce"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        </div>
      )}

      {selectedPost && (
        <PostModal
          post={selectedPost}
          user={user}
           postId={selectedPost.id}
          onClose={() => setSelectedPost(null)}
          currentUser={user}
        />
      )}
    </>
  );
};

export default PostsTab;