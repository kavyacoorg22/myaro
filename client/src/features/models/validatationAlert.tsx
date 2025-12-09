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
  onConfirm?: () => void;
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

  return (
   <AlertDialog open={isOpen} onOpenChange={onClose}>
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
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-6">
          {isConfirmType ? (
            // Two buttons for approve/reject
            <div className="flex gap-3 w-full sm:flex-row flex-col-reverse">
              <AlertDialogCancel
                onClick={onClose}
                className="flex-1 bg-gray-200 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors border-0"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  onConfirm?.();
                  onClose();
                }}
                className={`flex-1 ${currentConfig.buttonBg} text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-sm`}
              >
                OK
              </AlertDialogAction>
            </div>
          ) : (
            // Single button for error/warning/info
            <AlertDialogAction
              onClick={onClose}
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