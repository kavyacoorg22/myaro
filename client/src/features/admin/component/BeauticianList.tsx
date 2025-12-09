import React from 'react';
import { BeauticianCard } from '../component/BeauticianCard'
import { type BeauticianStatusFilterType } from '../../../constants/types/beautician';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../../../components/ui/pagination';
import type { IBeauticianDTO } from '../../../types/api/admin';


interface BeauticianListProps {
  beauticians: IBeauticianDTO[];
  currentPage: number;
  totalPages: number;
  activeTab: BeauticianStatusFilterType;
  onStatusFilterChange: (status: BeauticianStatusFilterType) => void;
  onPageChange: (page: number) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onViewProfile: (id: string) => void;
}

export const BeauticianList: React.FC<BeauticianListProps> = ({
  beauticians,
  currentPage,
  totalPages,
  activeTab,
  onStatusFilterChange,
  onPageChange,
  onApprove,
  onReject,
  onViewProfile,
}) => {
  const tabs: { key: BeauticianStatusFilterType; label: string }[] = [
    { key: 'pending', label: 'Pending Beautician' },
    { key: 'verified', label: 'Verified' },
    { key: 'rejected', label: 'Rejected' },
    { key: 'all', label: 'All' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 ml-60">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Beautician list</h1>

        {/* Tabs */}
        <div className="bg-gray-200 rounded-lg p-1 mb-6 flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onStatusFilterChange(tab.key)}
              className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'bg-transparent text-gray-700 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Beautician Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {beauticians.map((beautician) => (
            <BeauticianCard
              key={beautician.userId}
              beautician={beautician}
              onApprove={onApprove}
              onReject={onReject}
              onViewProfile={onViewProfile}
            />
          ))}
        </div>

        {/* Empty State */}
        {beauticians.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No beauticians found in this category
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => onPageChange(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
};