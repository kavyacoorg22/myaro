export function ReviewModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="max-w-sm w-full bg-white rounded-lg shadow-lg p-6 text-center relative">
        <div className="w-24 h-24 bg-purple-200 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl">
          🎉
        </div>
        
        <h2 className="text-2xl font-bold mb-4">You're Almost There!</h2>
        
        <p className="text-gray-600 mb-2">
          We are reviewing your profile to keep our community safe & trusted
        </p>
        
        <p className="text-gray-600 mb-6">
          Once approved, you'll add your payment details and start getting bookings 💰 ✨
        </p>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700">
            ⏰ Review time: 12-24 hours
          </p>
        </div>
        
        <button 
          onClick={onClose}
          className="w-full bg-purple-300 hover:bg-purple-400 text-gray-800 font-medium py-3 rounded-lg transition"
        >
          OK
        </button>
      </div>
    </div>
  );
}