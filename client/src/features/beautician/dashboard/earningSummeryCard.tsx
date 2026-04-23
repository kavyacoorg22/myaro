import { formatINR, formatLakh } from "../../../lib/utils/formatCurrency";
import type { EarningsSummaryDto } from "../../../types/dtos/beautician";

interface Props {
  earnings: EarningsSummaryDto;
}

export const EarningsSummaryCard: React.FC<Props> = ({ earnings }) => {
  const joinedDate = new Date(earnings.joinedSince).toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-gray-700">Total earnings</h3>
      <div>
        <p className="text-3xl font-bold text-gray-800">{formatLakh(earnings.totalEarnings)}</p>
        <p className="text-xs text-gray-400 mt-0.5">Since joined · {joinedDate}</p>
      </div>
      <div className="border-t border-gray-100 pt-3 flex flex-col gap-1.5">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Withdrawable</span>
          <span className="font-medium text-gray-800">{formatINR(earnings.withdrawableAmount)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Pending</span>
          <span className="font-medium text-amber-600">{formatINR(earnings.pendingAmount)}</span>
        </div>
      </div>
    </div>
  );
};