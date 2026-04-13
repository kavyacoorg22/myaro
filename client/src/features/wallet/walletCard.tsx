import { useEffect, useState } from "react"
import { TransactionItem } from "./tarnsactionItem"
import { TransactionDetailModal } from "./transactionDetailModal"
import { SaidBar } from "../user/component/saidBar/saidbar"
import { Wallet } from "lucide-react"

interface Transaction {
  id: string
  bookingId: string
  date: string
  amount: number
  time: string
}

const WalletCard = () => {
  const [selected, setSelected] = useState<Transaction | null>(null)
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    // walletApi.getWallet().then(res => {
    //   setBalance(res.data.balance)
    //   setTransactions(res.data.transactions)
    // })
  }, [])

  return (
    <div className="flex h-screen bg-gray-50">
      <SaidBar />

      {/* Main content — offset for sidebar */}
      <div className="flex-1 ml-64 p-8 overflow-y-auto">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">Wallet</h1>
          <p className="text-sm text-gray-400 mt-1">Your refund balance and transaction history</p>
        </div>

        <div className="max-w-2xl space-y-6">

          {/* Balance card */}
          <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm font-medium text-orange-100">Refund Wallet</p>
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-4xl font-semibold tracking-tight">₹ {balance}</p>
            <p className="text-sm text-orange-100 mt-1">Available Balance</p>
          </div>

          {/* Info banner */}
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
            <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shrink-0" />
            <p className="text-sm text-blue-600">
              Refunds from cancelled bookings are automatically credited to your wallet.
            </p>
          </div>

          {/* Activity section */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-700">Activity</h2>
              <span className="text-xs text-gray-400">{transactions.length} transactions</span>
            </div>

            {transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <Wallet className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-500">No transactions yet</p>
                <p className="text-xs text-gray-400 mt-1">Refunds will appear here</p>
              </div>
            ) : (
              <div className="space-y-2">
                {transactions.map(t => (
                  <TransactionItem
                    key={t.id}
                    {...t}
                    onClick={() => setSelected(t)}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {selected && (
        <TransactionDetailModal
          transaction={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}

export default WalletCard