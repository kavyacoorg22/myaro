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
import type { IGetAllRefundsDto } from "../../../types/dtos/admin";
import { adminApi } from "../../../services/api/admin";
import { SaidBar } from "../../user/component/saidBar/saidbar";
import RefundDetailModal from "../../models/admin/refundDetailModal";

type RefundStatusType = "pending" | "success" | "failed";

const statusConfig: Record<
  RefundStatusType,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-amber-100 text-amber-700 border border-amber-200",
  },
  success: {
    label: "Approved",
    className: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  },
  failed: {
    label: "Rejected",
    className: "bg-red-100 text-red-700 border border-red-200",
  },
};

const StatusBadge = ({ status }: { status: RefundStatusType }) => {
  const config = statusConfig[status] ?? {
    label: status,
    className: "bg-gray-100 text-gray-600",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
};

const TruncatedId = ({ id }: { id: string }) => (
  <span
    title={id}
    className="font-mono text-xs text-gray-600 truncate block max-w-[140px]"
  >
    {id}
  </span>
);

const LIMIT = 10;

const STATUS_FILTER_OPTIONS: { label: string; value: string }[] = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "success" },
  { label: "Rejected", value: "failed" },
];

const RefundRequestsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [refunds, setRefunds] = useState<IGetAllRefundsDto[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRefundId, setSelectedRefundId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>(""); // ✅ filter state

  const columns = [
    "Refund ID",
    "Booking ID",
    "Customer",
    "Amount",
    "Status",
    "Initiated By",
    "Action",
  ];

  useEffect(() => {
    const fetchRefunds = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await adminApi.getAllRefunds({
          page: currentPage,
          limit: LIMIT,
          status: statusFilter,
        });
        const payload = (res as any)?.data ?? res;
        setRefunds(payload?.data ?? []);
        setTotalPages(payload?.totalPages ?? 1);
      } catch {
        setError("Failed to load refunds. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchRefunds();
  }, [currentPage, statusFilter]);
  // ✅ Reset to page 1 when filter changes
  const handleFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SaidBar />

      <main className="flex-1 ml-64 p-8">
        {selectedRefundId && (
          <RefundDetailModal
            refundId={selectedRefundId}
            onClose={() => setSelectedRefundId(null)}
          />
        )}

        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Refund Requests
        </h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gray-100 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-700">
              Refund request
            </h2>

            {/* ✅ Status filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">
                Filter by status:
              </span>
              <div className="flex gap-1.5">
                {STATUS_FILTER_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleFilterChange(opt.value)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                      statusFilter === opt.value
                        ? "bg-indigo-500 text-white border-indigo-500"
                        : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-hidden">
            <Table className="table-fixed w-full">
              <TableHeader>
                <TableRow className="border-b border-gray-100">
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 w-[160px]">
                    Refund ID
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 w-[160px]">
                    Booking ID
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 w-[110px]">
                    Customer
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 w-[90px]">
                    Amount
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 w-[110px]">
                    Status
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 w-[130px]">
                    Initiated By
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
                ) : refunds.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="text-center py-16 text-sm text-gray-400"
                    >
                      No refund requests found.
                    </TableCell>
                  </TableRow>
                ) : (
                  refunds.map((refund, index) => (
                    <TableRow
                      key={refund.refundId}
                      className={`border-b border-gray-50 hover:bg-indigo-50/40 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/40"
                      }`}
                    >
                      <TableCell className="px-4 py-4 text-sm text-gray-700">
                        REF-{(currentPage - 1) * LIMIT + index + 1}
                      </TableCell>
                      <TableCell className="px-4 py-4 text-sm text-gray-700">
                        BK-{(currentPage - 1) * LIMIT + index + 1}
                      </TableCell>{" "}
                      <TableCell className="px-4 py-4 text-sm text-gray-700">
                        {refund.customerName}
                      </TableCell>
                      <TableCell className="px-4 py-4 text-sm font-semibold text-gray-800">
                        ₹{refund.amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <StatusBadge
                          status={refund.status as RefundStatusType}
                        />
                      </TableCell>
                      <TableCell className="px-4 py-4 text-sm text-gray-600 capitalize">
                        {refund.refundType}
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <button
                          onClick={() => setSelectedRefundId(refund.refundId)}
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

export default RefundRequestsPage;
