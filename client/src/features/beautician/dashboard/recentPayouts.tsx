import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { RecentPayoutDto } from "../../../types/dtos/beautician";
import { formatINR } from "../../../lib/utils/formatCurrency";

interface Props {
  payouts: RecentPayoutDto[];
}

const DOT_COLOR: Record<string, string> = {
  COMPLETED:  "bg-green-500",
  PENDING:    "bg-amber-400",
  PROCESSING: "bg-amber-400",
  FAILED:     "bg-red-400",
};

const AMOUNT_COLOR: Record<string, string> = {
  COMPLETED:  "text-green-600",
  PENDING:    "text-amber-600",
  PROCESSING: "text-amber-600",
  FAILED:     "text-red-500",
};

const STATUS_LABEL: Record<string, string> = {
  COMPLETED:  "Payout settled",
  PENDING:    "Payout pending",
  PROCESSING: "Payout processing",
  FAILED:     "Payout failed",
};

const PREVIEW_COUNT = 5;

export const RecentPayouts: React.FC<Props> = ({ payouts }) => {
  const [showAll, setShowAll] = useState(false);

  const displayed = showAll ? payouts : payouts.slice(0, PREVIEW_COUNT);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        Payout history
      </h3>

      {payouts.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">No payouts yet</p>
      ) : (
        <>
          <div className="flex flex-col divide-y divide-gray-100">
            {displayed.map((p) => (
              <div key={p.payoutId} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${DOT_COLOR[p.status] ?? "bg-gray-400"}`} />
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {STATUS_LABEL[p.status] ?? p.status}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(p.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <span className={`text-sm font-semibold ${AMOUNT_COLOR[p.status] ?? "text-gray-700"}`}>
                  {p.status === "COMPLETED" ? "+ " : ""}
                  {formatINR(p.amount)}
                </span>
              </div>
            ))}
          </div>

          {payouts.length > PREVIEW_COUNT && (
            <button
              onClick={() => setShowAll((prev) => !prev)}
              className="mt-3 w-full flex items-center justify-center gap-1.5 text-sm text-gray-500 border border-gray-200 rounded-lg py-2 hover:bg-gray-50 transition-colors"
            >
              {showAll ? (
                <><ChevronUp size={14} /> Show less</>
              ) : (
                <><ChevronDown size={14} /> View all {payouts.length} payouts</>
              )}
            </button>
          )}
        </>
      )}
    </div>
  );
};