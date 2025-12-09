import React from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import {type BeauticianStatusType,BeauticianStatus } from '../../../constants/types/beautician';


interface VerificationStatusBannerProps {
  status: BeauticianStatusType;
  onCompleteSetup?: () => void;
  onResubmit?: () => void;
}

export const VerificationStatusBanner: React.FC<VerificationStatusBannerProps> = ({
  status,
  onCompleteSetup,
  onResubmit,
}) => {
  // PENDING Status
  if (status === BeauticianStatus.PENDING) {
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-purple-200">
        <div className="p-6">
          {/* Icon */}
          <div className="flex justify-center mb-2">
            <div className="relative">
              <Clock className="w-16 h-16 text-purple-500" />
              <div className="absolute -bottom-1 -right-1 bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold">
                ⏰
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-4 flex items-center justify-center gap-2">
            Profile under review ⏳
          </h2>

          {/* Message */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
            <p className="text-gray-700 mb-2">Thanks for submitting your details!</p>
            <p className="text-gray-600 text-sm mb-4">
              We're verifying your information to ensure only trusted & genuine professionals join our platform.
            </p>
            <p className="text-gray-600 text-sm">
              You'll be notified once your profile is approved. After approval, you'll complete your payment setup and start receiving bookings! 💪
            </p>
          </div>

          {/* Footer */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg px-1 flex justify-center gap-2">
            <Clock className="w-5 h-5 text-yellow-600 " />
            <span className="text-yellow-800 text-sm text-center">Estimated review time: 12-24 hrs</span>
          </div>
        </div>
      </div>
    );
  }

  // verified Status
  if (status === BeauticianStatus.VERIFIED) {
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-green-200">
        <div className="p-6">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-4 flex items-center justify-center gap-2">
            Profile Approved! ✅
          </h2>

          {/* Message */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-green-700 mb-2 flex items-center justify-center gap-2">
              🎉 Congratulations! Your Myaro beautician profile is approved!
            </p>
            <p className="text-gray-600 text-sm">
              You're now ready to set up payments and start receiving bookings! 💰
            </p>
          </div>

          {/* Footer */}
          <div className="mt-6 space-y-3">
            <button
              onClick={onCompleteSetup}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Complete last step
            </button>
            <p className="text-gray-500 text-xs text-center flex items-center justify-center gap-1">
              <AlertCircle className="w-4 h-4" />
              This will only take 2 minutes to complete
            </p>
          </div>
        </div>
      </div>
    );
  }

  // REJECTED Status
  if (status === BeauticianStatus.REJECTED) {
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-red-200">
        <div className="p-6">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <XCircle className="w-16 h-16 text-red-500" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-4 flex items-center justify-center gap-2">
            Registration Rejected ❌
          </h2>

          {/* Message */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-700 mb-2">We're sorry, but your registration couldn't be approved.</p>
            <p className="text-gray-600 text-sm mb-4">
              This may be due to incomplete information, unverified credentials, or policy violations.
            </p>
            <p className="text-gray-600 text-sm">
              Please review your details and submit again with accurate information. 📝
            </p>
          </div>

          {/* Footer */}
          <div className="mt-6 space-y-3">
            <button
              onClick={onResubmit}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Upload Details Again
            </button>
            <p className="text-gray-500 text-xs text-center">
              Need help? Contact our support team
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};