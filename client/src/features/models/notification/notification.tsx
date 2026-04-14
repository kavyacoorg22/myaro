import { useEffect, useRef, useState } from "react"
import { X, Bell } from "lucide-react"
import { NotificationApi } from "../../../services/api/notification"
import type { INotificationDto } from "../../../types/dtos/notification"

interface GroupedNotifications {
  today: INotificationDto[]
  yesterday: INotificationDto[]
  earlier: INotificationDto[]
}

interface Props {
  isOpen: boolean
  onClose: () => void
  isSidebarExpanded: boolean
}

const ICON_CONFIG: Record<string, { bg: string; path: React.ReactNode }> = {
  refund: {
    bg: "#D1FAE5",
    path: <path d="M3 8l3.5 3.5L13 4" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
  },
  dispute: {
    bg: "#FEF3C7",
    path: (
      <>
        <circle cx="8" cy="8" r="5.5" stroke="#D97706" strokeWidth="1.4" fill="none" />
        <path d="M8 5.5V8.5" stroke="#D97706" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="8" cy="10.5" r="0.6" fill="#D97706" />
      </>
    ),
  },
  booking: {
    bg: "#EEF2FF",
    path: (
      <>
        <rect x="2.5" y="3.5" width="11" height="10" rx="1.5" stroke="#6366F1" strokeWidth="1.4" fill="none" />
        <path d="M5.5 2v3M10.5 2v3M2.5 7h11" stroke="#6366F1" strokeWidth="1.4" strokeLinecap="round" />
      </>
    ),
  },
  info: {
    bg: "#EFF6FF",
    path: (
      <>
        <circle cx="8" cy="8" r="5.5" stroke="#3B82F6" strokeWidth="1.4" fill="none" />
        <path d="M8 7v4" stroke="#3B82F6" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="8" cy="5.5" r="0.6" fill="#3B82F6" />
      </>
    ),
  },
  warning: {
    bg: "#FFF7ED",
    path: (
      <>
        <path d="M8 3L14 13H2L8 3z" stroke="#F97316" strokeWidth="1.4" strokeLinejoin="round" fill="none" />
        <path d="M8 7.5v2.5" stroke="#F97316" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="8" cy="11.5" r="0.5" fill="#F97316" />
      </>
    ),
  },
}

const CategoryIcon = ({ category }: { category: string }) => {
  const config = ICON_CONFIG[category] ?? ICON_CONFIG.info
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
      style={{ backgroundColor: config.bg }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16">{config.path}</svg>
    </div>
  )
}

function formatTime(date: Date) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  if (date >= today) return time
  if (date >= yesterday) return `Yesterday · ${time}`
  return date.toLocaleDateString([], { month: "short", day: "numeric" }) + ` · ${time}`
}

function groupByDate(notifications: INotificationDto[]): GroupedNotifications {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  const grouped: GroupedNotifications = { today: [], yesterday: [], earlier: [] }
  notifications.forEach((n) => {
    const d = new Date(n.createdAt)
    if (d >= today) grouped.today.push(n)
    else if (d >= yesterday) grouped.yesterday.push(n)
    else grouped.earlier.push(n)
  })
  return grouped
}

const NotificationItem = ({ notification, onClick }: { notification: INotificationDto; onClick: () => void }) => (
  <div
    onClick={onClick}
    className={`flex gap-3 px-4 py-3 cursor-pointer transition-colors border-l-2 ${
      notification.isRead
        ? "border-transparent hover:bg-gray-50"
        : "border-indigo-500 bg-indigo-50/60 hover:bg-indigo-50"
    }`}
  >
    <CategoryIcon category={notification.category} />
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-800 leading-snug">{notification.title}</p>
      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{notification.message}</p>
      <p className="text-xs text-gray-400 mt-1">{formatTime(new Date(notification.createdAt))}</p>
    </div>
    {!notification.isRead && (
      <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
    )}
  </div>
)

export const NotificationModal = ({ isOpen, onClose, isSidebarExpanded }: Props) => {
  const [grouped, setGrouped] = useState<GroupedNotifications>({ today: [], yesterday: [], earlier: [] })
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const load = async () => {
      setIsLoading(true)
      try {
        const res = await NotificationApi.getNotification()
        setGrouped(groupByDate(res.data.data?.notifications ?? []))
        setUnreadCount(res.data.data?.unreadCount ?? 0)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose()
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen, onClose])

  const handleMarkAllRead = async () => {
    try {
      await NotificationApi.readAllNotification()
      setUnreadCount(0)
      setGrouped((prev) => {
        const mark = (arr: INotificationDto[]) => arr.map((n) => ({ ...n, isRead: true }))
        return { today: mark(prev.today), yesterday: mark(prev.yesterday), earlier: mark(prev.earlier) }
      })
    } catch (err) {
      console.error(err)
    }
  }

  if (!isOpen) return null

  const sections: { key: keyof GroupedNotifications; label: string }[] = [
    { key: "today", label: "Today" },
    { key: "yesterday", label: "Yesterday" },
    { key: "earlier", label: "Earlier" },
  ]

  const hasAny = Object.values(grouped).flat().length > 0

  return (
    <div
      ref={panelRef}
      className={`fixed top-0 h-screen w-80 bg-white border-r border-gray-100 shadow-xl z-50 flex flex-col transition-all duration-300 ${
        isSidebarExpanded ? "left-60" : "left-16"
      }`}
    >
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-gray-800">Notifications</h2>
          {unreadCount > 0 && (
            <span className="text-xs bg-amber-50 text-amber-700 font-medium px-2 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button onClick={handleMarkAllRead} className="text-xs text-gray-400 hover:text-gray-600 transition">
              Mark all read
            </button>
          )}
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-400">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="space-y-1 p-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 py-2">
                <div className="w-9 h-9 rounded-full bg-gray-100 animate-pulse shrink-0" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
                  <div className="h-2.5 w-48 bg-gray-100 rounded animate-pulse" />
                  <div className="h-2 w-20 bg-gray-100 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : !hasAny ? (
          <div className="flex flex-col items-center justify-center h-full py-16 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <Bell className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-500">No notifications</p>
            <p className="text-xs text-gray-400 mt-1">You're all caught up</p>
          </div>
        ) : (
          sections.map(({ key, label }) => {
            const items = grouped[key]
            if (!items.length) return null
            return (
              <div key={key}>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 pt-4 pb-1">
                  {label}
                </p>
                {items.map((n) => (
                  <NotificationItem key={n.id} notification={n} onClick={() => {}} />
                ))}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}