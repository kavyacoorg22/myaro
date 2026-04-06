import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationEllipsis,
} from "../../../components/ui/pagination";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const BookingPagination: React.FC<Props> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  // Build page numbers with ellipsis
  const getPages = (): (number | "ellipsis")[] => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "ellipsis")[] = [1];
    if (currentPage > 3) pages.push("ellipsis");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("ellipsis");
    pages.push(totalPages);
    return pages;
  };

  return (
    <Pagination className="mt-6">
      <PaginationContent>
        {getPages().map((page, idx) =>
          page === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${idx}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={page === currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(page);
                }}
                href="#"
                className={
                  page === currentPage
                    ? "bg-violet-100 border-violet-300 text-violet-700 font-semibold"
                    : "hover:bg-gray-50"
                }
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(currentPage + 1);
              }}
              className="hover:bg-gray-50"
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default BookingPagination;