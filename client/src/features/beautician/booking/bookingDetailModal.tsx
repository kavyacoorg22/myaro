import React from "react";
import { Calendar, Clock, MapPin, X } from "lucide-react";
import type { BookingDto } from "../../../types/dtos/booking";
import { formatDate } from "../../../lib/utils/bookingDate";


interface Props {
  booking: BookingDto;
  onClose: () => void;
}

const BookingDetailsModal: React.FC<Props> = ({ booking, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 className="text-base font-semibold text-gray-800">view details</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        <div className="px-5 pb-5 space-y-4">
          {/* Services */}
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-50">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Services</p>
            </div>
            {booking.services.map((service) => (
              <div
                key={service.serviceId}
                className="flex items-center justify-between px-4 py-3 border-b border-gray-50 last:border-b-0"
              >
                <span className="text-sm text-gray-700">{service.name}</span>
                {service.price > 0 && (
                  <span className="text-sm font-medium text-gray-800">
                    {service.price}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="border border-gray-100 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1">Date</p>
              <div className="flex items-center gap-1.5">
                <Calendar size={13} className="text-pink-400" />
                <span className="text-xs font-medium text-gray-700">
                  {formatDate(booking.slot.date)}
                </span>
              </div>
            </div>
            <div className="border border-gray-100 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1">Time</p>
              <div className="flex items-center gap-1.5">
                <Clock size={13} className="text-pink-400" />
                <span className="text-xs font-medium text-gray-700">
                  {booking.slot.time}
                </span>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="border border-gray-100 rounded-xl px-4 py-3">
            <div className="flex items-start gap-2">
              <MapPin size={13} className="text-pink-400 mt-0.5 flex-shrink-0" />
              <span className="text-xs text-gray-600">{booking.address}</span>
            </div>
          </div>

          {/* Client Notes */}
          {booking.rejectionReason || true ? (
            <div className="border border-gray-100 rounded-xl px-4 py-3">
              <p className="text-xs font-medium text-gray-500 mb-1">Client Notes</p>
              <p className="text-xs text-pink-500">{booking.clientNote}</p>
            </div>
          ) : null}

          {/* Payment Details */}
          <div className="border border-gray-100 rounded-xl px-4 py-3 space-y-2">
            <p className="text-xs font-medium text-gray-500">Payment Details</p>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Method:</span>
              <span className="text-gray-700">Online</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Status</span>
              <span className="text-emerald-500 font-medium">Paid</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Total amount</span>
              <span className="text-gray-800 font-semibold">₹{booking.totalPrice}</span>
            </div>
          </div>

          {/* OK Button */}
          <button
            onClick={onClose}
            className="w-full py-3 bg-cyan-400 hover:bg-cyan-500 text-white text-sm font-medium rounded-xl transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;