import { SaidBar } from "../component/saidBar/saidbar"
import { Search } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { PostFeed } from "../component/media/postFeed"
import type { PostCardProps } from "../../types/mediaType"
import { publicAPi } from "../../../services/api/public"

export const TipsAndTricksPage = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [posts, setPosts] = useState<PostCardProps["post"][]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const cursorTipsRef = useRef<string | null>(null);
  const cursorRentRef = useRef<string | null>(null);
  const hasFetchedRef = useRef(false);
  const isLoadingRef = useRef(false);
  const hasMoreRef = useRef(true);

  const fetchPosts = useCallback(async () => {
    if (isLoadingRef.current || !hasMoreRef.current) return;

    isLoadingRef.current = true;
    setIsLoading(true);

    try {
      const res = await publicAPi.getTipsRentFeed(cursorTipsRef.current, cursorRentRef.current);
      const { posts: newPosts, nextCursorTips, nextCursorRent } = res.data;

      setPosts(prev => [...prev, ...newPosts.map((p: any) => ({
        id: p.id,
        user: {
          id: p.beauticianId,
          userName: p.userName,
          profileImg: p.profileImg,
        },
        location: p.location,
        mediaUrl: p.media,
        description: p.description,
        likesCount: p.likesCount,
        isLiked:p.isLiked,
        timeAgo: p.timeAgo,
        overlayLabel: p.postType === 'tips' ? 'Tips & Tricks' : 'For Rent',
      }))]);

      cursorTipsRef.current = nextCursorTips;
      cursorRentRef.current = nextCursorRent;
      hasMoreRef.current = nextCursorTips !== null || nextCursorRent !== null;
      setHasMore(nextCursorTips !== null || nextCursorRent !== null);
    } catch (err) {
      console.error(err);
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    fetchPosts();
  }, []);

  return (
    <div className="flex h-screen">
      <SaidBar />
      <div className="flex-1 bg-gray-50">
        <div className="flex flex-col border-gray-200 sticky top-0 z-10 bg-gray-50">
          <div className="flex items-center justify-between p-4 pl-72">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search based on location"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-start flex-1 overflow-hidden pr-58">
          <PostFeed
            posts={posts}
            height="calc(100vh - 130px)"
            onFollow={(userId) => console.log("follow", userId)}
            onLike={(postId, liked) => console.log("like", postId, liked)}
            onLoadMore={fetchPosts}
            hasMore={hasMore}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}