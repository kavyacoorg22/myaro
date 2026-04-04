import { useRef, useCallback, useState } from "react";
import { ScrollArea } from "../../../../components/ui/scrollArea";
import { PostCard } from "./postCard";
import type { PostFeedProps } from "../../../types/mediaType";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../redux/appStore";
import { PostModal } from "../../../post/component/postModal";

export const PostFeed: React.FC<PostFeedProps> = ({
  posts,
  onFollow,
  onLike,
  onLoadMore,
  hasMore,
  isLoading,
  height = "calc(100vh - 130px)",
}) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const currentUser = useSelector((store: RootState) => store.user.currentUser);

  // find selected post from posts array
  const selectedPost = posts.find(p => p.id === selectedPostId);

  const bottomRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore?.();
      }
    });
    if (node) observerRef.current.observe(node);
  }, [isLoading, hasMore, onLoadMore]);

  return (
    <>
      <ScrollArea style={{ height }} className="w-full">
        <div className="flex flex-col items-center gap-6 py-4 px-2">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onFollow={onFollow}
              onLike={onLike}
              onCommentClick={(postId:string) => setSelectedPostId(postId)} // ← add
            />
          ))}

          <div ref={bottomRef} className="w-full h-4" />

          {isLoading && (
            <div className="w-8 h-8 rounded-full border-4 border-purple-500 border-t-transparent animate-spin mb-4" />
          )}

          {!hasMore && posts.length > 0 && (
            <p className="text-sm text-gray-400 mb-4">You're all caught up!</p>
          )}
        </div>
      </ScrollArea>

      {/* ── PostModal ── */}
     {selectedPost && selectedPostId && (
  <PostModal
    post={{
      media: Array.isArray(selectedPost.mediaUrl)
        ? selectedPost.mediaUrl
        : selectedPost.mediaUrl ? [selectedPost.mediaUrl] : [],
      description: selectedPost.description,
      location: selectedPost.location,
      likesCount: selectedPost.likesCount,
      timeAgo: selectedPost.timeAgo,
    }}
    postId={selectedPostId}
     user={{                            
      userName: selectedPost.user.userName,
      profileImg: selectedPost.user.profileImg,
    }}
    currentUser={{                       
      userName: currentUser.userName ?? '',
      profileImg: currentUser.profileImg ?? undefined,
    }}
    onClose={() => setSelectedPostId(null)}
  />
)}
    </>
  );
};