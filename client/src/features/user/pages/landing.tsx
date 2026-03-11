import { useSelector } from "react-redux"
import { SaidBar } from "../component/saidBar/saidbar"
import type { RootState } from "../../../redux/appStore"
import { Search, MapPin, RefreshCw } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { useUserLocation } from "../../../hooks/useUserLocation"
import { UserRole } from "../../../constants/types/User"
import { PostFeed } from "../component/media/postFeed"
import type { PostCardProps } from "../../types/mediaType"
import { publicAPi } from "../../../services/api/public"

export const Landing = () => {
  const currentUser = useSelector((store: RootState) => store.user.currentUser)
  const [searchQuery, setSearchQuery] = useState("")
  const { location, refetchLocation } = useUserLocation()

  const isLoadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const cursorRef = useRef<string | null>(null);
  const hasFetchedRef = useRef(false);

  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState<PostCardProps["post"][]>([]);

  const fetchPosts = useCallback(async () => {
    if (isLoadingRef.current || !hasMoreRef.current) return;

    isLoadingRef.current = true;
    setIsLoading(true);

    try {
      const res = await publicAPi.getHomeFeed(cursorRef.current);
      const { posts: newPosts, nextCursor } = res.data;

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
        timeAgo: p.timeAgo,
      }))]);

      cursorRef.current = nextCursor;
      hasMoreRef.current = nextCursor !== null;
      setHasMore(nextCursor !== null);
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

  const locationText = location.city
    ? `${location.city}${location.state ? ', ' + location.state : ''}`
    : location.isLoading
    ? 'Detecting location...'
    : 'Location unavailable'

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

            {currentUser.userName !== UserRole.ADMIN && currentUser.isAuthenticated && (
              <div className="flex items-center gap-3 ml-4">
                <div className="flex items-center gap-3 bg-gray-50 rounded-full px-4 py-2 hover:bg-gray-100 transition cursor-pointer">
                  <img
                    src={currentUser.profileImg || 'https://via.placeholder.com/40'}
                    alt={currentUser.fullName || currentUser.userName || 'User'}
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800">
                      {currentUser.userName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {currentUser.fullName}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="px-4 pb-3 flex items-center gap-2 pl-72">
            <MapPin className="w-4 h-4 text-red-500" />
            <span className="text-sm text-gray-600">{locationText}</span>
            <button
              onClick={refetchLocation}
              disabled={location.isLoading}
              className="ml-2 p-1 hover:bg-gray-100 rounded-full transition"
              title="Refresh location"
            >
              <RefreshCw className={`w-4 h-4 text-gray-500 ${location.isLoading ? 'animate-spin' : ''}`} />
            </button>
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