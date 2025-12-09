


import { useSelector } from "react-redux"
import { SaidBar } from "../component/saidBar/saidbar"
import type { RootState } from "../../../redux/appStore"
import { Search, MapPin, RefreshCw } from "lucide-react"
import { useState } from "react"
import { useUserLocation } from "../../../hooks/useUserLocation"
import { UserRole } from "../../../constants/types/User"

export const Landing = () => {
  const currentUser = useSelector((store: RootState) => store.user.currentUser)
  const [searchQuery, setSearchQuery] = useState("")
  const { location, refetchLocation } = useUserLocation()
  
  const locationText = location.city 
    ? `${location.city}${location.state ? ', ' + location.state : ''}`
    : location.isLoading 
    ? 'Detecting location...' 
    : 'Location unavailable'
  
  return (
    <div className="flex h-screen">
      <SaidBar />
      
      <div className="flex-1 bg-gray-50 ml-70">
        <div className="flex flex-col  border-gray-200">
        
          <div className="flex items-center justify-between p-4">
    
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

          
            {currentUser.userName!==UserRole.ADMIN && currentUser.isAuthenticated && (
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

      
          {/* <div className="px-4 pb-3 flex items-center gap-2">
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
          </div> */}
        </div>
        
        <div className="p-6">
  
        </div>
      </div>
    </div>
  )
}