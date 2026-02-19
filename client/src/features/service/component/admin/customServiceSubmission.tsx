import React from 'react';
import type { CustomSubmissionsReviewProps } from '../../../types/customServiceType';
import { Tabs } from './submission';
import { SubmissionList } from './sumissionList';
import { PaginationControls } from './pagination';


const CustomSubmissionsReview: React.FC<CustomSubmissionsReviewProps> = ({
  submissions,
  totalPages,
  currentPage,
  activeTab,
  onTabChange,
  onPageChange,
  onReview,
  onApprove,
  onReject,
}) => {
  return (
    <div className="min-h-screen ml-60 bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Review Custom Submissions
          </h1>
          <p className="text-gray-600">
            Approve or reject custom services submitted by beauticians
          </p>
        </div>

        <Tabs activeTab={activeTab} onTabChange={onTabChange} />

        <SubmissionList
          submissions={submissions}
          onReview={onReview}
          onApprove={onApprove}
          onReject={onReject}
        />

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default CustomSubmissionsReview;