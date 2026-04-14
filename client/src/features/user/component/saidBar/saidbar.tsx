import { SaidBarItem } from "./saidBarItem"
import { loginItem, logoutItem, saidBarContent, type Role, type SidebarContentType } from "../../../../components/config/saidBarContent"
import logo from "../../../../assets/logo.png"
import { useState } from "react";
import { cn } from "../../../../lib/utils/cn";
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from "../../../../redux/appStore";
import { authApi } from "../../../../services/api/auth";
import { toast } from "react-toastify";
import { handleApiError } from "../../../../lib/utils/handleApiError";
import { logout } from "../../../../redux/userSlice/userSlice";
import { useNavigate } from "react-router-dom";
import { publicFrontendRoutes } from "../../../../constants/frontendRoutes/publicFrontendRoutes";
import { ScrollArea } from "../../../../components/ui/scrollArea";
import { SearchModal } from "../../../models/user/Logic/searchLogic";
import { NotificationModal } from "../../../models/notification/notification";

export const SaidBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const currentUser = useSelector((store: RootState) => store.user.currentUser)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const role = currentUser?.role as Role | undefined
  const isAuthenticated = currentUser?.isAuthenticated ?? false;
  const [showNotifications, setShowNotifications] = useState(false)


  function cansee(content: SidebarContentType, isAuthenticated: boolean, role: Role | undefined) {
    if (content.showWhenAuthenticatedOnly && !isAuthenticated) return false
    if (content.roles && content.roles.length > 0) {
      if (!role) return false
      return content.roles.includes(role)
    }
    if (role === "admin") return false;
    return true
  }

  const visibleItem = saidBarContent.filter((ele) => cansee(ele, isAuthenticated, role))

  async function handleLogout() {
    try {
      const res = await authApi.logout()
      toast.success(res.data?.message)
      navigate(publicFrontendRoutes.landing, { replace: true })
    } catch (err) {
      handleApiError(err)
    } finally {
      dispatch(logout())
    }
  }

  function handleItemClick(content: SidebarContentType) {
    if (content.label === "Search") {
      setIsSearchOpen(true);
    }
      if (content.label === "Notification") {
    setShowNotifications(true)   
  }
  }

  return (
    <>
      <div
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className={cn(
          "fixed left-0 top-0 h-screen z-50 transition-all duration-300 flex flex-col overflow-hidden",
          isExpanded ? "w-60" : "w-16",
          currentUser.role === 'admin' ? 'bg-[#2C5F6F] text-white' : 'bg-white text-gray-700 border-r border-gray-100'
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-3 pt-3 pb-5 shrink-0">
          <img src={logo} alt="logo" width={40} height={40} className="shrink-0" />
          <h2 className={cn(
            "text-3xl font-normal font-family-irish text-[#5C3D2E] whitespace-nowrap transition-all duration-300",
            isExpanded ? "opacity-100" : "opacity-0 w-0"
          )}>
            myaro
          </h2>
        </div>

        {/* Nav items */}
        <ScrollArea className="flex-1 pr-1">
          <nav className="space-y-1 px-2">
            {visibleItem.map((content) => (
              <SaidBarItem
                key={content.label}
                label={content.label}
                icon={content.icon}
                path={content.path}
                isExpanded={isExpanded}
    onClick={content.isButton ? () => handleItemClick(content) : undefined}
              />
            ))}
          </nav>
        </ScrollArea>

        {/* Login / Logout */}
        <div className="px-2 pb-4 shrink-0">
          {!isAuthenticated ? (
            <SaidBarItem label={loginItem.label} icon={loginItem.icon} path={loginItem.path} isExpanded={isExpanded} variant={loginItem.variant as "primary"} />
          ) : (
            <SaidBarItem label={logoutItem.label} icon={logoutItem.icon} isExpanded={isExpanded} onClick={handleLogout} variant={logoutItem.variant as 'danger'} />
          )}
        </div>
      </div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
       <NotificationModal
  isOpen={showNotifications}
  onClose={() => setShowNotifications(false)}
  isSidebarExpanded={isExpanded}   
/>
    </>
  )
}