
import { ArrowDown } from "lucide-react"
import type { IGetUserRefundSummeryDto } from "../../types/dtos/customer"

interface Props {
  transaction: IGetUserRefundSummeryDto
}

export const TransactionItem = ({ transaction }: Props) => (
  <div className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl">
    <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center shrink-0">
      <ArrowDown className="w-4 h-4 text-green-600" />
    </div>
    <div className="flex-1">
      <p className="text-sm font-medium text-gray-800">Refund · {transaction.refundType}</p>
      <p className="text-xs text-gray-400">{transaction.processedAt || "Pending"}</p>
    </div>
    <p className="text-sm font-medium text-green-600">+₹{transaction.amount}</p>
  </div>
)