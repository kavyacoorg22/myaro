import { PaymentStatus } from "../../../constants/types/payment";

const paymentStatusConfig: Record<string, { label: string; className: string }> = {
  [PaymentStatus.PAID]:            { label: "On Hold",          className: "bg-amber-100 text-amber-700 border border-amber-200" },
  [PaymentStatus.RELEASED]:        { label: "Released",         className: "bg-emerald-100 text-emerald-700 border border-emerald-200" },
  [PaymentStatus.READY_TO_RELEASE]:{ label: "Ready to Release", className: "bg-blue-100 text-blue-700 border border-blue-200" },
  [PaymentStatus.REFUNDED]:        { label: "Refunded",         className: "bg-purple-100 text-purple-700 border border-purple-200" },
  [PaymentStatus.REFUND_REQUESTED]:{ label: "Refund Requested", className: "bg-orange-100 text-orange-700 border border-orange-200" },
  [PaymentStatus.PENDING]:         { label: "Pending",          className: "bg-gray-100 text-gray-600 border border-gray-200" },
  [PaymentStatus.FAILED]:          { label: "Failed",           className: "bg-red-100 text-red-700 border border-red-200" },
};
 
export const PaymentStatusBadge = ({ status }: { status: string }) => {
  const config = paymentStatusConfig[status] ?? { label: status, className: "bg-gray-100 text-gray-600" };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
};

export const TruncatedId = ({ id }: { id: string }) => (
  <span title={id} className="font-mono text-xs text-gray-500 truncate block max-w-[130px]">
    {id}
  </span>
);