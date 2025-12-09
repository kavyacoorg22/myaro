import React, { useState } from 'react';
import { X, CheckCircle, XCircle, MapPin, Clock, Briefcase, File, Store } from 'lucide-react';
import type { IBeauticianProfileResponseData } from '../../../types/api/admin';
import type { ShopAddressVO } from '../../../types/api/beautician';
import { ValidationAlert } from '../validatationAlert';

interface BeauticianProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  beautician: IBeauticianProfileResponseData;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}


const ScrollArea: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <div className={`relative overflow-auto ${className || ''}`}>
    {children}
  </div>
);

// Image Viewer Modal
const ImageViewerModal: React.FC<{ 
  imageUrl: string; 
  onClose: () => void 
}> = ({ imageUrl, onClose }) => (
  <div 
    className="fixed inset-0 bg-black bg-opacity-90 z-[60] flex items-center justify-center p-4"
    onClick={onClose}
  >
    <button
      onClick={onClose}
      className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70"
    >
      <X className="w-6 h-6" />
    </button>
    <img 
      src={imageUrl} 
      alt="Full size" 
      className="max-w-full max-h-full object-contain"
      onClick={(e) => e.stopPropagation()}
    />
  </div>
);

// Main Modal Component
export const BeauticianProfileModal: React.FC<BeauticianProfileModalProps> = ({
  isOpen,
  onClose,
  beautician,
  verificationStatus,
  onApprove,
  onReject,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // ✅ ADD THIS STATE
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: 'approve' | 'reject';
    action: () => void;
  } | null>(null);

  if (!isOpen) return null;

  const isPending = verificationStatus === 'pending';

  const formatAddress = (address?: ShopAddressVO) => {
    if (!address) return null;
    const parts = [
      address.address,
      address.city,
      address.pincode,
    ].filter(Boolean);
    return parts.join(', ');
  };

  // ✅ ADD THESE HANDLER FUNCTIONS
  const handleApproveClick = () => {
    setConfirmDialog({
      isOpen: true,
      type: 'approve',
      action: () => onApprove?.(beautician.userId)
    });
  };

  const handleRejectClick = () => {
    setConfirmDialog({
      isOpen: true,
      type: 'reject',
      action: () => onReject?.(beautician.userId)
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Beautician Profile Verification</h2>
              <p className="text-sm text-purple-100 mt-1">
                {verificationStatus === 'pending' && 'Pending Review'}
                {verificationStatus === 'verified' && '✓ Verified'}
                {verificationStatus === 'rejected' && '✗ Rejected'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Scrollable Content */}
          <ScrollArea className="flex-1 px-6 py-4">
            <div className="space-y-6">
              {/* Profile Section */}
              <div className="flex items-start gap-4 pb-4 border-b">
                <img
                  src={beautician.profileImg }
                  alt={beautician.userName}
                  className="w-20 h-20 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity border-4 border-purple-100 shadow-md"
                  onClick={() => beautician.profileImg && setSelectedImage(beautician.profileImg)}
                />
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-gray-900">{beautician.userName}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-2">
                    <MapPin className="w-4 h-4" />
                    {beautician.city || 'Location not specified'}
                  </p>
                </div>
              </div>

              {/* Basic Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-purple-600" />
                  Basic Information
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">Experience:</span>
                    <span>{beautician.yearsOfExperience} years</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Store className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">Shop Status:</span>
                    <span>{beautician.hasShop ? 'Has Physical Shop' : 'No Physical Shop'}</span>
                  </div>
                  {beautician.shopName && (
                    <div className="flex items-center gap-3 text-gray-700">
                      <Briefcase className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">Shop Name:</span>
                      <span>{beautician.shopName}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* About */}
              {beautician.about && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">About</h4>
                  <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg">
                    {beautician.about}
                  </p>
                </div>
              )}

              {/* Shop Address */}
              {beautician.shopAddress && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-purple-600" />
                    Shop Address
                  </h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700">{formatAddress(beautician.shopAddress)}</p>
                  </div>
                </div>
              )}

              {/* Portfolio Images */}
              {beautician.portfolioImage && beautician.portfolioImage.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Portfolio Images ({beautician.portfolioImage.length})</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {beautician.portfolioImage.map((url, index) => (
                      <div 
                        key={index}
                        className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity border-2 border-gray-200 hover:border-purple-400"
                        onClick={() => setSelectedImage(url)}
                      >
                        <img
                          src={url}
                          alt={`Portfolio ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Shop Photos */}
              {beautician.shopPhotos && beautician.shopPhotos.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Shop Photos ({beautician.shopPhotos.length})</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {beautician.shopPhotos.map((url, index) => (
                      <div 
                        key={index}
                        className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity border-2 border-gray-200 hover:border-purple-400"
                        onClick={() => setSelectedImage(url)}
                      >
                        <img
                          src={url}
                          alt={`Shop ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certificate Images */}
              {beautician.certificateImage && beautician.certificateImage.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Certificates and Documents ({beautician.certificateImage.length})
                  </h4>
                  <div className="space-y-2">
                    {beautician.certificateImage.map((url, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer border border-gray-200 hover:border-purple-400 transition-colors"
                        onClick={() => setSelectedImage(url)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <File className="w-5 h-5 text-blue-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-700">Certificate {index + 1}</span>
                        </div>
                        <button className="text-purple-600 text-sm font-medium hover:underline">
                          View Document
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state if no documents */}
              {(!beautician.portfolioImage || beautician.portfolioImage.length === 0) && 
               (!beautician.shopPhotos || beautician.shopPhotos.length === 0) && 
               (!beautician.certificateImage || beautician.certificateImage.length === 0) && (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <File className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No documents uploaded yet</p>
                </div>
              )}

              {/* Admin Verification Status */}
              {isPending && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <span className="text-2xl">⚠️</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-yellow-800">
                        Awaiting Admin Verification
                      </p>
                      <p className="text-sm text-yellow-700 mt-1">
                        Please review all information and documents carefully before approving or rejecting this application.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Footer with Actions */}
          {isPending && onApprove && onReject && (
            <div className="border-t px-6 py-4 bg-gray-50 rounded-b-2xl flex gap-3">
              {/* ✅ CHANGE THESE BUTTONS */}
              <button
                onClick={handleApproveClick}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <CheckCircle className="w-5 h-5" />
                Approve Beautician
              </button>
              <button
                onClick={handleRejectClick}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <XCircle className="w-5 h-5" />
                Reject Application
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Image Viewer Modal */}
      {selectedImage && (
        <ImageViewerModal
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}

      {/* ✅ ADD THIS CONFIRMATION DIALOG */}
      {confirmDialog && (
        <ValidationAlert
          isOpen={confirmDialog.isOpen}
          onClose={() => setConfirmDialog(null)}
          onConfirm={confirmDialog.action}
          type={confirmDialog.type}
          message={confirmDialog.type === 'approve'
            ? 'Are you sure you want to approve this beautician? They will gain access to the platform.'
            : 'Are you sure you want to reject this application? This action cannot be undone.'
          }
        />
      )}
    </>
  );
};