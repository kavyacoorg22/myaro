import { X } from "lucide-react"


interface Transaction {
  amount: number
  bookingId: string
  date: string
  time: string
}

interface Props {
  transaction: Transaction | null
  onClose: () => void
}

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
    <span className="text-sm text-gray-400">{label}</span>
    <span className="text-sm font-medium text-gray-800">{value}</span>
  </div>
)

export const TransactionDetailModal = ({ transaction, onClose }: Props) => {
  if (!transaction) return null

  return (
    // ✅ Full screen overlay backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose} // click outside to close
    >
      {/* ✅ Stop click propagation so clicking modal doesn't close it */}
      <div
        className="bg-white rounded-2xl p-6 w-80 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-medium text-gray-800">Transaction Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            ✕
          </button>
        </div>

        <div className="text-center mb-8">
          <p className="text-4xl font-medium text-green-600">+₹{transaction.amount}</p>
          <p className="text-sm text-gray-400 mt-1">Amount Credited</p>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <Row label="Type" value="Refund" />
          <Row label="Related Booking" value={`#${transaction.bookingId}`} />
          <Row label="Date" value={transaction.date} />
          <Row label="Time" value={transaction.time} />
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 bg-blue-100 text-blue-700 rounded-xl text-sm font-medium hover:bg-blue-200 transition"
        >
          Close
        </button>
      </div>
    </div>
  )
}