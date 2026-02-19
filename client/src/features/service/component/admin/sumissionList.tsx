import React from 'react';
import type { Submission } from '../../../types/customServiceType';
import { SubmissionCard } from './submissionCard';


interface SubmissionListProps {
  submissions: Submission[];
  onReview: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const SubmissionList: React.FC<SubmissionListProps> = ({
  submissions,
  onReview,
  onApprove,
  onReject,
}) => {
  return (
    <div className="mb-6">
      {submissions.map((submission) => (
        <SubmissionCard
          key={submission.customServiceId}
          submission={submission}
          onReview={onReview}
          onApprove={onApprove}
          onReject={onReject}
        />
      ))}
    </div>
  );
};