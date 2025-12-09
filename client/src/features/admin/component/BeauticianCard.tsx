import React from 'react';
import { Check, X, Clock, MapPin, Briefcase } from 'lucide-react';
import { type IBeauticianDTO } from '../../../types/api/admin';
import {
  Card,
  CardFooter,
} from '../../../components/ui/card';


interface BeauticianCardProps {
  beautician: IBeauticianDTO;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onViewProfile: (id: string) => void;
}

export const BeauticianCard: React.FC<BeauticianCardProps> = ({
  beautician,
  onViewProfile,
}) => {
  const getStatusBadge = () => {
    const status = beautician.verificationStatus.toLowerCase();
    const statusStyles: Record<string, string> = {
      pending: 'bg-orange-100 text-orange-600',
      verified: 'bg-green-100 text-green-600',
      rejected: 'bg-red-100 text-red-600',
    };

    const statusLabels: Record<string, string> = {
      pending: 'Pending',
      verified: 'Verified',
      rejected: 'Rejected',
    };

    return (
      <span
        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
          statusStyles[status] || 'bg-gray-100 text-gray-600'
        }`}
      >
        {statusLabels[status] || beautician.verificationStatus}
      </span>
    );
  };

  const isPending = beautician.verificationStatus.toLowerCase() === 'pending';

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow w-full">
      <div className="p-6">
        {/* Profile Section */}
        <div className="flex items-start gap-4 mb-4">
          <img
            src={beautician.profileImg || '/default-avatar.png'}
            alt={beautician.userName}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-purple-100 flex-shrink-0"
            onError={(e) => {
              e.currentTarget.src = '/default-avatar.png';
            }}
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-gray-900 mb-1 truncate">
              {beautician.userName}
            </h3>
            {getStatusBadge()}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-600 flex-shrink-0" />
            <span className="truncate">Experience: {beautician.yearsOfExperience} years</span>
          </div>
          {beautician.shopName && (
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-purple-600 flex-shrink-0" />
              <span className="truncate">{beautician.shopName}</span>
            </div>
          )}
          {beautician.city && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-600 flex-shrink-0" />
              <span className="truncate">{beautician.city}</span>
            </div>
          )}
        </div>
      </div>

      <CardFooter className="gap-2 bg-gray-50 flex-wrap">
        <button
          onClick={() => onViewProfile(beautician.userId)}
          className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
        >
          View profile
        </button>

       
      </CardFooter>
    </Card>
  );
};