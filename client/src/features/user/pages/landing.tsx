import { useSelector } from "react-redux"
import { SaidBar } from "../component/saidBar/saidbar"
import type { RootState } from "../../../redux/appStore"
import { Search, MapPin, RefreshCw, X } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { useUserLocation } from "../../../hooks/useUserLocation"
import { UserRole } from "../../../constants/types/User"
import { PostFeed } from "../component/media/postFeed"
import type { PostCardProps } from "../../types/mediaType"
import { publicAPi } from "../../../services/api/public"

const DEBOUNCE_DELAY = 500;

function mapPost(p: any): PostCardProps["post"] {
  return {
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
    isLiked:p.isLiked
  };
}

export const Landing = () => {
  const currentUser = useSelector((store: RootState) => store.user.currentUser)
  console.log(currentUser)
  const [searchQuery, setSearchQuery] = useState("")
  const { location, refetchLocation } = useUserLocation()
  
  // Feed state
  const feedLoadingRef = useRef(false);
  const feedHasMoreRef = useRef(true);
  const feedCursorRef = useRef<string | null>(null);
  const hasFetchedRef = useRef(false);
  const [feedHasMore, setFeedHasMore] = useState(true);
  const [feedIsLoading, setFeedIsLoading] = useState(false);
  const [feedPosts, setFeedPosts] = useState<PostCardProps["post"][]>([]);

  // Search state
  const searchCursorRef = useRef<string | null>(null);
  const searchHasMoreRef = useRef(true);
  const searchLoadingRef = useRef(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [searchHasMore, setSearchHasMore] = useState(true);
  const [searchIsLoading, setSearchIsLoading] = useState(false);
  const [searchPosts, setSearchPosts] = useState<PostCardProps["post"][]>([]);
  const [isSearchMode, setIsSearchMode] = useState(false);

  // ─── Feed fetch ───────────────────────────────────────────────────
  const fetchFeedPosts = useCallback(async () => {
    if (feedLoadingRef.current || !feedHasMoreRef.current) return;
    feedLoadingRef.current = true;
    setFeedIsLoading(true);
    try {
      const res = await publicAPi.getHomeFeed(feedCursorRef.current);
      const { posts: newPosts, nextCursor } = res.data;
      setFeedPosts(prev => [...prev, ...newPosts.map(mapPost)]);
      feedCursorRef.current = nextCursor;
      feedHasMoreRef.current = nextCursor !== null;
      setFeedHasMore(nextCursor !== null);
    } catch (err) {
      console.error(err);
    } finally {
      feedLoadingRef.current = false;
      setFeedIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    fetchFeedPosts();
  }, []);

  // ─── Search fetch ─────────────────────────────────────────────────
  const fetchSearchPosts = useCallback(async (query: string, reset: boolean) => {
    if (searchLoadingRef.current) return;
    if (!reset && !searchHasMoreRef.current) return;

    searchLoadingRef.current = true;
    setSearchIsLoading(true);

    const cursor = reset ? null : searchCursorRef.current;

    try {
      const res = await publicAPi.getSearchPostResult(query,cursor);
      const { posts: newPosts, nextCursor } = res.data;

      const mapped = newPosts.map(mapPost);
      setSearchPosts(prev => reset ? mapped : [...prev, ...mapped]);

      searchCursorRef.current = nextCursor;
      searchHasMoreRef.current = nextCursor !== null;
      setSearchHasMore(nextCursor !== null);
    } catch (err) {
      console.error(err);
    } finally {
      searchLoadingRef.current = false;
      setSearchIsLoading(false);
    }
  }, []);

  // ─── Debounce search input ────────────────────────────────────────
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    if (!value.trim()) {
      setIsSearchMode(false);
      setSearchPosts([]);
      searchCursorRef.current = null;
      searchHasMoreRef.current = true;
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      setIsSearchMode(true);
      searchCursorRef.current = null;
      searchHasMoreRef.current = true;
      setSearchPosts([]);
      fetchSearchPosts(value.trim(), true);
    }, DEBOUNCE_DELAY);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsSearchMode(false);
    setSearchPosts([]);
    searchCursorRef.current = null;
    searchHasMoreRef.current = true;
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
  };

  // ─── Infinite scroll handlers ─────────────────────────────────────
  const handleLoadMore = isSearchMode
    ? () => fetchSearchPosts(searchQuery.trim(), false)
    : fetchFeedPosts;

  const locationText = location.city
    ? `${location.city}${location.state ? ', ' + location.state : ''}`
    : location.isLoading
    ? 'Detecting location...'
    : 'Location unavailable'
    
  return (
  
    <div className="flex h-screen">
      <SaidBar />
          {currentUser.role !== UserRole.ADMIN && (

      <div className="flex-1 bg-gray-50">
        <div className="flex flex-col border-gray-200 sticky top-0 z-10 bg-gray-50">

          <div className="flex items-center justify-between p-4 pl-72">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name or location..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchQuery && (
                  <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>

              {/* Search status indicator */}
              {isSearchMode && (
                <p className="text-xs text-gray-500 mt-1 pl-1">
                  {searchIsLoading && searchPosts.length === 0
                    ? "Searching..."
                    : searchPosts.length === 0
                    ? "No results found"
                    : `${searchPosts.length} result${searchPosts.length !== 1 ? "s" : ""} found`}
                </p>
              )}
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
                    <span className="text-sm font-semibold text-gray-800">{currentUser.userName}</span>
                    <span className="text-xs text-gray-500">{currentUser.fullName}</span>
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
            posts={isSearchMode ? searchPosts : feedPosts}
            height="calc(100vh - 130px)"
            onFollow={(userId) => console.log("follow", userId)}
            onLike={(postId, liked) => console.log("like", postId, liked)}
            onLoadMore={handleLoadMore}
            hasMore={isSearchMode ? searchHasMore : feedHasMore}
            isLoading={isSearchMode ? searchIsLoading : feedIsLoading}
          />
        </div>
      </div>)}
    </div>
  )
}