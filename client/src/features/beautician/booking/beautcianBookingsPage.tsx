import React, { useEffect, useState, useCallback } from "react";
import { BookingStatus, type BookingStatusType } from "../../../constants/types/booking";
import type { IBookingListItem } from "../../../types/api/booking";
import { BookingApi } from "../../../services/api/booking";
import BookingCard from "./bookingCard";
import BookingPagination from "./pagination";
import { SaidBar } from "../../user/component/saidBar/saidbar";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/appStore";
import { UserRole } from "../../../constants/types/User";

type TabKey = "upcoming" | "completed" | "cancelled";

const TABS: { key: TabKey; label: string; status: BookingStatusType[] }[] = [
  { key: "upcoming",  label: "Upcoming",  status: [BookingStatus.CONFIRMED] },
  { key: "completed", label: "Completed", status: [BookingStatus.COMPLETED] },
  { key: "cancelled", label: "Canceled",  status: [BookingStatus.CANCELLED, BookingStatus.REJECTED] },
];

const LIMIT = 10;

function groupUpcoming(items: IBookingListItem[]) {
  const today: IBookingListItem[] = [];
  const tomorrow: IBookingListItem[] = [];
  const later: IBookingListItem[] = [];

  if (!Array.isArray(items)) return { today, tomorrow, later };

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  const tomorrowDate = new Date(todayDate);
  tomorrowDate.setDate(todayDate.getDate() + 1);

  for (const item of items) {
    const d = new Date(item.booking.slot.date);
    d.setHours(0, 0, 0, 0);
    if (d.getTime() === todayDate.getTime()) today.push(item);
    else if (d.getTime() === tomorrowDate.getTime()) tomorrow.push(item);
    else later.push(item);
  }

  return { today, tomorrow, later };
}

const BookingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("upcoming");
  const [items, setItems] = useState<IBookingListItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // FIX 2: Select role with a stable equality check to avoid unnecessary re-renders
  const role = useSelector(
    (store: RootState) => store.user.currentUser.role,
    (a, b) => a === b
  );

  const title    = role === UserRole.BEAUTICIAN ? "Home Service Bookings" : "My Bookings";
  const subtitle = role === UserRole.BEAUTICIAN ? "Manage your appointments" : "Track your appointments";

  const currentTab = TABS.find((t) => t.key === activeTab)!;

  const fetchBookings = useCallback(async () => {
    if (!role) return;

    setLoading(true);
    setError(null);
    try {
      const status = currentTab.status[0];
      const fetchFn =
        role === UserRole.BEAUTICIAN
          ? BookingApi.getBeauticianBookings
          : BookingApi.getCustomerBookings;

     

      const result = await fetchFn(status, page, LIMIT);
      if (result) {
        setItems(
          Array.isArray(result.data.data?.bookings)
            ? result.data.data.bookings
            : []
        );
        setTotalPages(result.data.data?.totalPages ?? 1);
      }
    } catch {
      setError("Failed to load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [activeTab, page, role]); // currentTab derived from activeTab — no need to add it separately

  // FIX 1: Only ONE useEffect — the duplicate has been removed
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleTabChange = (key: TabKey) => {
    setActiveTab(key);
    setPage(1);
  };

  const renderUpcoming = () => {
    const { today, tomorrow, later } = groupUpcoming(items);
    return (
      <div className="space-y-6">
        <Section title="Today"          items={today} />
        <Section title="Tomorrow"       items={tomorrow} />
        <Section title="Later Bookings" items={later} />
      </div>
    );
  };

  const renderList = (variant: "completed" | "cancelled") => (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-gray-800">
        {variant === "completed" ? "Completed bookings" : "Canceled bookings"}
      </h3>
      {items.length === 0 ? (
        <EmptyState variant={variant} />
      ) : (
        items.map((item) => (
          <BookingCard key={item.booking.id} item={item} variant={variant} />
        ))
      )}
    </div>
  );

  return (
    <div className="flex h-screen">
      <SaidBar />

      <div className="flex-1 bg-gray-50 overflow-y-auto">
        {/* Sticky header + tabs */}
        <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200 pl-72 pr-8 pt-6 pb-0">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>

          <div className="flex gap-6 mt-4">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`pb-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab.key
                    ? "text-violet-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="pl-72 pr-8 py-6 max-w-4xl">
          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <div className="text-center py-12 text-red-500 text-sm">{error}</div>
          ) : (
            <>
              {activeTab === "upcoming"  && renderUpcoming()}
              {activeTab === "completed" && renderList("completed")}
              {activeTab === "cancelled" && renderList("cancelled")}

              <BookingPagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string; items: IBookingListItem[] }> = ({
  title,
  items,
}) => (
  <div>
    <h3 className="text-base font-semibold text-gray-800 mb-3">{title}</h3>
    {items.length === 0 ? (
      <p className="text-sm text-gray-400 italic">No bookings</p>
    ) : (
      <div className="space-y-3">
        {items.map((item) => (
          <BookingCard key={item.booking.id} item={item} variant="upcoming" />
        ))}
      </div>
    )}
  </div>
);

const EmptyState: React.FC<{ variant: "completed" | "cancelled" }> = ({
  variant,
}) => (
  <div className="py-12 text-center text-sm text-gray-400">
    No {variant} bookings yet.
  </div>
);

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-4 animate-pulse">
    {[1, 2, 3].map((i) => (
      <div key={i} className="h-28 bg-gray-100 rounded-2xl" />
    ))}
  </div>
);

export default BookingsPage;