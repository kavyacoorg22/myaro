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
import DisputeDetailModal from "../../models/admin/disputeDetail";

const TruncatedId = ({ id }: { id: string }) => (
  <span
    title={id}
    className="font-mono text-xs text-gray-600 truncate block max-w-[140px]"
  >
    {id}
  </span>
);

const LIMIT = 10;

const DisputePage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null,
  );

  const columns = [
    "Dispute ID",
    "Booking ID",
    "Customer",
    "Beautician",
    "Action",
  ];

  useEffect(() => {
    const fetchDisputes = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await adminApi.getAllDisputes({
          page: currentPage,
          limit: LIMIT,
        });
        const payload = res.data;
        setDisputes(
          Array.isArray(payload?.data?.data) ? payload.data.data : [],
        );
        setTotalPages(payload?.data?.totalPages ?? 1);
      } catch {
        setError("Failed to load disputes. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchDisputes();
  }, [currentPage]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SaidBar />

      <main className="flex-1 ml-64 p-8">
        {selectedBookingId && (
          <DisputeDetailModal
            bookingId={selectedBookingId}
            onClose={() => setSelectedBookingId(null)}
          />
        )}

        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Active Disputes
        </h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
            <h2 className="text-base font-semibold text-gray-700">
              Active dispute
            </h2>
          </div>

          <div className="overflow-x-hidden">
            <Table className="table-fixed w-full">
              <TableHeader>
                <TableRow className="border-b border-gray-100">
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 w-[160px]">
                    Dispute ID
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 w-[160px]">
                    Booking ID
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 w-[110px]">
                    Customer
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 w-[110px]">
                    Beautician
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 w-[90px]">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="text-center py-16 text-sm text-gray-400"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
                        <span>Loading...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="text-center py-16 text-sm text-red-400"
                    >
                      {error}
                    </TableCell>
                  </TableRow>
                ) : disputes.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="text-center py-16 text-sm text-gray-400"
                    >
                      No active disputes found.
                    </TableCell>
                  </TableRow>
                ) : (
                  disputes.map((dispute, index) => (
                    <TableRow
                      key={dispute.bookingId ?? index}
                      className={`border-b border-gray-50 hover:bg-indigo-50/40 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/40"
                      }`}
                    >
                      <TableCell className="px-4 py-4 text-sm text-gray-700">
                        DIS-{(currentPage - 1) * LIMIT + index + 1}
                      </TableCell>
                      <TableCell className="px-4 py-4 text-sm text-gray-700">
                        BK-{(currentPage - 1) * LIMIT + index + 1}
                      </TableCell>
                      <TableCell className="px-4 py-4 text-sm text-gray-700">
                        {dispute.customerName}
                      </TableCell>
                      <TableCell className="px-4 py-4 text-sm text-gray-700">
                        {dispute.beauticianName}
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <button
                          onClick={() =>
                            setSelectedBookingId(dispute.bookingId)
                          }
                          className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-medium px-4 py-1.5 rounded-md transition-colors duration-150 shadow-sm"
                        >
                          View
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage((p) => p - 1);
                  }}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-40" : ""
                  }
                />
              </PaginationItem>
              {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === page}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(page);
                      }}
                      className={
                        currentPage === page
                          ? "bg-indigo-500 text-white border-indigo-500 hover:bg-indigo-600"
                          : "text-gray-600 hover:bg-gray-100"
                      }
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-40"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </main>
    </div>
  );
};

export default DisputePage;
