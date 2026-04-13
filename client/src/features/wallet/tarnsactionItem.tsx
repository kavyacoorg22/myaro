import { ArrowUp } from "lucide-react"

interface Props {
  id: string
  bookingId: string
  date: string
  amount: number
  onClick: () => void
}

export const TransactionItem = ({ bookingId, date, amount, onClick }: Props) => (
  <div
    onClick={onClick}
    className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50 transition"
  >
    <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center shrink-0">
      <ArrowUp className="w-4 h-4 text-green-600" />
    </div>
    <div className="flex-1">
      <p className="text-sm font-medium text-gray-800">Refund - {bookingId}</p>
      <p className="text-xs text-gray-400">{date}</p>
    </div>
    <p className="text-sm font-medium text-green-600">+₹{amount}</p>
  </div>
)