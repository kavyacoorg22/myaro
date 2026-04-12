import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../components/ui/pagination";
import { adminApi } from "../../../services/api/admin";
import { SaidBar } from "../../user/component/saidBar/saidbar";
import { PaymentStatus } from "../../../constants/types/payment";
import { FILTER_OPTIONS, LIMIT, type BookingRow, type FilterValue } from "../../types/admin";
import { StatCard } from "../../shared/statCard";
import { TabFilterBar } from "../../shared/tabFilterBar";
import { PaymentStatusBadge, TruncatedId } from "./paymentStatusBadge";
import BookingPaymentDetailModal from "../../models/admin/paymentReleaseModal";

const PaymentManagementPage: React.FC = () => {
  const [currentPage, setCurrentPage]       = useState(1);
  const [bookings, setBookings]             = useState<BookingRow[]>([]);
  const [totalPages, setTotalPages]         = useState(1);
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState<string | null>(null);
  const [activeFilter, setActiveFilter]     = useState<FilterValue>("");
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null); // ← modal state
  const [summary, setSummary] = useState({ onHold: 0, released: 0, readyToRelease: 0 });

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.getAllBookings({
        page: currentPage,
        limit: LIMIT,
        paymentStatus: activeFilter || undefined,
      });
      const payload = res.data ?? res;
      const data: BookingRow[] = payload?.data?.data ?? [];
      setBookings(data);
      setTotalPages(payload?.data?.totalPages ?? 1);

      if (!activeFilter) {
        setSummary({
          onHold:         data.filter((b) => b.paymentStatus === PaymentStatus.PAID).length,
          released:       data.filter((b) => b.paymentStatus === PaymentStatus.RELEASED).length,
          readyToRelease: data.filter((b) => b.paymentStatus === PaymentStatus.READY_TO_RELEASE).length,
        });
      }
    } catch {
      setError("Failed to load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [currentPage, activeFilter]);

  const handleFilterChange = (value: FilterValue) => {
    setActiveFilter(value);
    setCurrentPage(1);
  };

  const columns = ["Booking ID", "Customer", "Beautician", "Booked Date", "Service Date", "Amount", "Payment Status", "Action"];

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SaidBar />

      {/* ── Booking Payment Detail Modal ── */}
      {selectedBookingId && (
        <BookingPaymentDetailModal
          bookingId={selectedBookingId}
          onClose={() => setSelectedBookingId(null)}
          onReleaseSuccess={() => {
            setSelectedBookingId(null);
            fetchBookings(); // refresh table after release
          }}
        />
      )}

      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Payment Management</h1>
          <p className="text-sm text-gray-500 mt-1">View and control all held payments from confirmed bookings.</p>
        </div>

        {/* Stat Cards */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <StatCard label="On Hold"          value={summary.onHold}         icon="⏳" />
          <StatCard label="Released"         value={summary.released}       icon="✅" />
          <StatCard label="Ready to Release" value={summary.readyToRelease} icon="🔓" />
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50 flex-wrap gap-3">
            <h2 className="text-base font-semibold text-gray-700">All Payments</h2>
            <TabFilterBar
              options={FILTER_OPTIONS}
              active={activeFilter}
              onChange={handleFilterChange}
            />
          </div>

          <div className="overflow-x-auto">
            <Table className="table-fixed w-full min-w-[800px]">
              <TableHeader>
                <TableRow className="border-b border-gray-100 bg-gray-50/60">
                  {[
                    ["Booking ID",    "w-[130px]"],
                    ["Customer",      "w-[110px]"],
                    ["Beautician",    "w-[110px]"],
                    ["Booked Date",   "w-[110px]"],
                    ["Service Date",  "w-[110px]"],
                    ["Amount",        "w-[90px]"],
                    ["Payment Status","w-[140px]"],
                    ["Action",        "w-[80px]"],
                  ].map(([label, w]) => (
                    <TableHead
                      key={label}
                      className={`text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 ${w}`}
                    >
                      {label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center py-16 text-sm text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
                        <span>Loading...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center py-16 text-sm text-red-400">
                      {error}
                    </TableCell>
                  </TableRow>
                ) : bookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center py-16 text-sm text-gray-400">
                      No bookings found.
                    </TableCell>
                  </TableRow>
                ) : (
                  bookings.map((booking, index) => (
                    <TableRow
                      key={booking.bookingId}
                      className={`border-b border-gray-50 hover:bg-blue-50/30 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                      }`}
                    >
                      <TableCell className="px-4 py-4"><TruncatedId id={booking.bookingId} /></TableCell>
                      <TableCell className="px-4 py-4 text-sm text-gray-700">{booking.customerName}</TableCell>
                      <TableCell className="px-4 py-4 text-sm text-gray-700">{booking.beauticianName}</TableCell>
                      <TableCell className="px-4 py-4 text-sm text-gray-600">{formatDate(booking.bookedDate)}</TableCell>
                      <TableCell className="px-4 py-4 text-sm text-gray-600">{formatDate(booking.serviceDate)}</TableCell>
                      <TableCell className="px-4 py-4 text-sm font-semibold text-gray-800">₹{booking.amount.toLocaleString()}</TableCell>
                      <TableCell className="px-4 py-4">
                        <PaymentStatusBadge status={booking.paymentStatus} />
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        {/* View button — only for paid (on hold) and ready_to_release */}
                        {(booking.paymentStatus === PaymentStatus.READY_TO_RELEASE ||
                          booking.paymentStatus === PaymentStatus.PAID) ? (
                          <button
                            onClick={() => setSelectedBookingId(booking.bookingId)}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-1.5 rounded-md transition-colors shadow-sm"
                          >
                            View
                          </button>
                        ) : (
                          <span className="text-gray-300 text-sm select-none">——</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => { e.preventDefault(); if (currentPage > 1) setCurrentPage((p) => p - 1); }}
                  className={currentPage === 1 ? "pointer-events-none opacity-40" : ""}
                />
              </PaginationItem>
              {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === page}
                    onClick={(e) => { e.preventDefault(); setCurrentPage(page); }}
                    className={
                      currentPage === page
                        ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) setCurrentPage((p) => p + 1); }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-40" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </main>
    </div>
  );
};

export default PaymentManagementPage;