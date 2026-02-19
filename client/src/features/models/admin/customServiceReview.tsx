import { Button } from "../../../components/ui/button";
import type { ReviewSubmissionModalProps } from "../../types/customServiceType";

export const ReviewSubmissionModal: React.FC<ReviewSubmissionModalProps> = ({
  data,
  onReject,
  onAccept,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900">Review Submission</h2>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Beautician */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Beautician</label>
            <p className="text-sm font-medium text-gray-900">{data.beautician}</p>
          </div>

          {/* Submitted Date */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Submitted</label>
            <p className="text-sm font-medium text-gray-900">{data.submittedDate}</p>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* Category */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Category</label>
            <p className="text-sm font-medium text-gray-900">{data.category}</p>
          </div>

          {/* Service Name */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Service Name</label>
            <p className="text-sm font-medium text-gray-900">{data.serviceName}</p>
          </div>

          {/* Info Message */}
          {data.isNewCategory && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-xs text-blue-700 text-center">
                This will create a new category and add the service to the system
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="destructive"
              className="flex-1 bg-red-600 hover:bg-red-700"
              onClick={onReject}
            >
              Reject
            </Button>
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              onClick={onAccept}
            >
              Accept
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};