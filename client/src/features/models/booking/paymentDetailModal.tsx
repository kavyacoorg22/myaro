import { useEffect, useRef, useState } from "react";
import type { IGetBookingByIdDto } from "../../../types/dtos/booking";
import { PaymentApi } from "../../../services/api/payment";

declare global {
  interface Window { Razorpay: any; }
}

interface PaymentDetailModalProps {
  booking:   IGetBookingByIdDto;
  loading:   boolean;
  onClose:   () => void;
  onConfirm: () => void;  
  onCancel:  () => void;
}

// Dynamically load Razorpay checkout script once
const loadRazorpayScript = (): Promise<boolean> =>
  new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) return resolve(true);
    const s   = document.createElement("script");
    s.id      = "razorpay-script";
    s.src     = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload  = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

export const PaymentDetailModal = ({
  booking,
  loading,
  onClose,
  onConfirm,
  onCancel,
}: PaymentDetailModalProps) => {
  const overlayRef            = useRef<HTMLDivElement>(null);
  const [paying, setPaying]   = useState(false);
  const [error,  setError]    = useState<string | null>(null);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const totalRupees = booking.services.reduce((sum, s) => sum + (s.price ?? 0), 0);

  // ── Full payment flow: Create Order → Checkout → Verify ──────────────────
  const handlePayClick = async () => {
    setError(null);
    setPaying(true);

    try {
      // ── Step 1: Load Razorpay SDK ─────────────────────────────────────────
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Could not load Razorpay. Check your connection.");

      // ── Step 2: Create order on YOUR backend ──────────────────────────────
      const orderRes  = await PaymentApi.createOrder(booking.id);
      const { razorpayOrderId, amount, currency } = orderRes.data.data;

      // ── Step 3: Open Razorpay checkout ────────────────────────────────────
      await new Promise<void>((resolve, reject) => {
        const options = {
          key:      import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount,
          currency,
          name:        "Myaro",
          description: booking.services.map((s) => s.name).join(", "),
          order_id:    razorpayOrderId,  

          prefill: {
            name:    booking.fullName  ?? "",
            contact: booking.phoneNumber ?? "",
          },

          theme: { color: "#4f46e5" },

          // ── Step 4: Razorpay calls this on success ─────────────────────────
          handler: async (response: {
            razorpay_payment_id: string;
            razorpay_order_id:   string;
            razorpay_signature:  string;
          }) => {
            try {
              // ── Step 5: Verify signature on YOUR backend ───────────────────
              const verifyRes = await PaymentApi.verifyPayment({
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
              });


              if (verifyRes.data.data.success) {
                onConfirm();
                resolve();
              } else {
                reject(new Error("Payment verification failed. Please contact support."));
              }
            } catch (err) {
              reject(new Error("Verification request failed. Please contact support."));
            }
          },

          modal: {
            ondismiss: () => {
              setPaying(false); 
            },
          },
        };

        const rzp = new window.Razorpay(options);

        rzp.on("payment.failed", (res: any) => {
          reject(new Error(res.error?.description ?? "Payment failed."));
        });

        rzp.open();
      });

    } catch (err: any) {
      setError(err.message ?? "Something went wrong.");
      setPaying(false);
    }
  };

  const isDisabled = loading || paying;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 font-sans">

        {/* Header */}
        <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-200 pb-3">
          Payment detail
        </h2>

        {/* User info */}
        <div className="space-y-1 mb-4 text-sm text-gray-700">
          {[
            ["Username", booking.fullName],
            ["Phone",    booking.phoneNumber],
            ["Address",  booking.address],
          ].map(([label, value]) => (
            <div key={label} className="flex gap-2">
              <span className="w-24 text-gray-500 shrink-0">{label}:</span>
              <span className="font-medium">{value ?? "—"}</span>
            </div>
          ))}
        </div>

        <hr className="border-gray-200 mb-4" />

        {/* Services */}
        <p className="text-xs font-semibold text-indigo-500 mb-2 tracking-wide uppercase">
          Services Requested
        </p>

        <div className="space-y-2 mb-3">
          {booking.services.map((service) => (
            <div key={service.serviceId ?? service.name} className="flex justify-between text-sm text-gray-700">
              <span>{service.name}</span>
              <span>{service.price ?? "—"}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between text-sm font-bold border-t border-gray-200 pt-2 mb-5">
          <span>Total amount</span>
          <span className="text-indigo-600">₹{totalRupees}</span>
        </div>

        {/* Note */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4">
          <p className="text-xs font-semibold text-amber-700 mb-1">Note</p>
          <p className="text-xs text-amber-700 leading-relaxed">
            You can cancel your booking up to 3 days before the appointment.
            After that, cancellation will not be possible.
          </p>
        </div>

        {/* Error */}
        {error && (
          <p className="text-xs text-rose-600 mb-3 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
            ⚠️ {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handlePayClick}
            disabled={isDisabled}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors duration-150"
          >
            {paying ? "Opening Razorpay…" : loading ? "Processing…" : "Pay & Confirm Appointment"}
          </button>
          <button
            onClick={onCancel}
            disabled={isDisabled}
            className="flex-1 bg-rose-700 hover:bg-rose-800 disabled:opacity-60 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors duration-150"
          >
            cancel
          </button>
        </div>
      </div>
    </div>
  );
};