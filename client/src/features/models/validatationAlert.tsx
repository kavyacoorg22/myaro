import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "../../components/ui/alert-dialog";

interface ValidationAlertProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: (rejectionReason?: string) => void; // ← updated signature
  title?: string;
  message: string;
  type?: 'error' | 'warning' | 'info' | 'approve' | 'reject';
}

export function ValidationAlert({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'error'
}: ValidationAlertProps) {
  const [rejectionReason, setRejectionReason] = useState('');
  const [touched, setTouched] = useState(false);

  const config = {
    error: {
      icon: '❌',
      iconBg: 'bg-red-100',
      titleColor: 'text-red-900',
      descColor: 'text-red-700',
      buttonBg: 'bg-red-500 hover:bg-red-600',
      defaultTitle: 'Validation Error'
    },
    warning: {
      icon: '⚠️',
      iconBg: 'bg-orange-100',
      titleColor: 'text-orange-900',
      descColor: 'text-orange-700',
      buttonBg: 'bg-orange-500 hover:bg-orange-600',
      defaultTitle: 'Warning'
    },
    info: {
      icon: 'ℹ️',
      iconBg: 'bg-blue-100',
      titleColor: 'text-blue-900',
      descColor: 'text-blue-700',
      buttonBg: 'bg-blue-500 hover:bg-blue-600',
      defaultTitle: 'Information'
    },
    approve: {
      icon: '✅',
      iconBg: 'bg-green-100',
      titleColor: 'text-green-900',
      descColor: 'text-green-700',
      buttonBg: 'bg-green-500 hover:bg-green-600',
      defaultTitle: 'Approve Beautician?'
    },
    reject: {
      icon: '❌',
      iconBg: 'bg-red-100',
      titleColor: 'text-red-900',
      descColor: 'text-red-700',
      buttonBg: 'bg-red-500 hover:bg-red-600',
      defaultTitle: 'Reject Application?'
    }
  };

  const currentConfig = config[type];
  const isConfirmType = type === 'approve' || type === 'reject';
  const isReject = type === 'reject';

  const isReasonEmpty = rejectionReason.trim() === '';
  const showError = isReject && touched && isReasonEmpty;

  const handleConfirm = () => {
    if (isReject) {
      setTouched(true);
      if (isReasonEmpty) return; // block — don't close or call onConfirm
    }
    onConfirm?.(isReject ? rejectionReason.trim() : undefined);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setRejectionReason('');
    setTouched(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="max-w-md bg-white">
        <AlertDialogHeader>
          {/* Icon */}
          <div className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full ${currentConfig.iconBg}`}>
            <span className="text-4xl">{currentConfig.icon}</span>
          </div>

          {/* Title */}
          <AlertDialogTitle className={`text-center text-2xl font-bold ${currentConfig.titleColor} mb-3`}>
            {title || currentConfig.defaultTitle}
          </AlertDialogTitle>

          {/* Message */}
          <div className="text-center">
            <p className={`text-base ${currentConfig.descColor} leading-relaxed`}>
              {message}
            </p>
          </div>

          {/* Rejection Reason — only for reject type */}
          {isReject && (
            <div className="mt-4 text-left space-y-1">
              <label className="text-sm font-semibold text-gray-700">
                Reason for Rejection
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                onBlur={() => setTouched(true)}
                placeholder="Explain why this application is being rejected..."
                className={`w-full text-sm px-3 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 transition-colors ${
                  showError
                    ? 'border-red-400 focus:ring-red-300 bg-red-50 placeholder-red-300'
                    : 'border-gray-300 focus:ring-red-200 placeholder-gray-400'
                }`}
              />
              {showError && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                  Please provide a reason before rejecting.
                </p>
              )}
            </div>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-6">
          {isConfirmType ? (
            // Two buttons for approve / reject
            <div className="flex gap-3 w-full sm:flex-row flex-col-reverse">
              <AlertDialogCancel
                onClick={handleClose}
                className="flex-1 bg-gray-200 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors border-0"
              >
                Cancel
              </AlertDialogCancel>
              {/* Plain button so we can block the dialog from closing on validation failure */}
              <button
                type="button"
                onClick={handleConfirm}
                className={`flex-1 ${currentConfig.buttonBg} text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-sm`}
              >
                {isReject ? 'Reject' : 'Approve'}
              </button>
            </div>
          ) : (
            // Single button for error / warning / info
            <AlertDialogAction
              onClick={handleClose}
              className={`w-full ${currentConfig.buttonBg} text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-sm`}
            >
              Got it
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}