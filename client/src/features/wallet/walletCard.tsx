import { useEffect, useRef, useState } from "react"
import { TransactionItem } from "./tarnsactionItem"
import { SaidBar } from "../user/component/saidBar/saidbar"
import { Wallet } from "lucide-react"
import { CustomerApi } from "../../services/api/customer"
import type { IGetUserRefundSummeryDto } from "../../types/dtos/customer"

const WalletCard = () => {
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState<IGetUserRefundSummeryDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const hasFetched = useRef(false)

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true

    const fetchWallet = async () => {
      try {
        const res = await CustomerApi.getWallet()
        setBalance(res.data.data?.totalBalance ?? 0)
        setTransactions(res.data.data?.refunds ?? [])
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWallet()
  }, [])

  return (
    <div className="flex h-screen bg-gray-50">
      <SaidBar />

      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">Wallet</h1>
          <p className="text-sm text-gray-400 mt-1">Your refund balance and transaction history</p>
        </div>

        <div className="max-w-2xl space-y-6">

          {/* ── Balance card ── */}
          {isLoading ? (
            <div className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="h-4 w-24 bg-white/30 rounded animate-pulse" />
                <div className="w-10 h-10 bg-white/20 rounded-full" />
              </div>
              <div className="h-10 w-32 bg-white/30 rounded animate-pulse mb-2" />
              <div className="h-3 w-20 bg-white/20 rounded animate-pulse" />
            </div>
          ) : (
            <div className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm font-medium text-orange-100">Refund Wallet</p>
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-4xl font-semibold tracking-tight">₹ {balance}</p>
              <p className="text-sm text-orange-100 mt-1">Available Balance</p>
            </div>
          )}

          {/* ── Info banner ── */}
          {!isLoading && (
            <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
              <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shrink-0" />
              <p className="text-sm text-blue-600">
                Refunds from cancelled bookings are automatically credited to your wallet.
              </p>
            </div>
          )}

          {/* ── Activity ── */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-700">Activity</h2>
              {!isLoading && (
                <span className="text-xs text-gray-400">{transactions.length} transactions</span>
              )}
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-3 p-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
                      <div className="h-2 w-20 bg-gray-100 rounded animate-pulse" />
                    </div>
                    <div className="h-3 w-12 bg-gray-100 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <Wallet className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-500">No refunds yet</p>
                <p className="text-xs text-gray-400 mt-1">
                  When a booking is cancelled, your refund will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {transactions.map(t => (
                  <TransactionItem key={t.id} transaction={t} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default WalletCard