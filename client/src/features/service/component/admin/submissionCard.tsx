import React from 'react';
import type { Submission } from '../../../types/customServiceType';
import { Button } from '../../../../components/ui/button';


interface SubmissionCardProps {
  submission: Submission;
  onReview: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const SubmissionCard: React.FC<SubmissionCardProps> = ({
  submission,
  onReview,
  onApprove,
  onReject,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <img
            src={submission.profileImg}
            alt={submission.beauticianName}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900">{submission.beauticianName}</h3>
              <span className="text-sm text-gray-500">{new Date(submission.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}</span>
            </div>
            <div className="mt-3 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Category:</span>
                <span className="text-sm font-medium text-gray-900">
                  {submission.category.name}
                </span>
                {!submission.category.categoryId && (
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                    new category
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Service:</span>
                <span className="text-sm font-medium text-gray-900">
                  {submission.service.name}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {/* <Button
            onClick={() => onReview(submission.customServiceId)}
            variant="outline"
            className="border-purple-500 text-purple-500 hover:bg-purple-50"
          >
            Review
          </Button> */}
          <Button
            onClick={() => onApprove(submission.customServiceId)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Approve
          </Button>
          <Button
            onClick={() => onReject(submission.customServiceId)}
            variant="destructive"
            className="bg-red-600 hover:bg-red-700"
          >
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
};