import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema, type BookingFormValues } from "../../../lib/validations/user/valiadateBooking";
import { publicAPi } from "../../../services/api/public";
import { StepBadge } from "./stepBadge";
import { ServiceCard } from "./serviceCard";
import type { IGetBeauticianServicesListDto } from "../../../types/dtos/service";
import { TimeSlotPicker } from "./timeSlotPicker";
import { DurationPicker } from "./durationPicker";
import { getEndTimeLabel, hasConsecutiveBlock, mapBackendSlots, type TimeSlot } from "../../../lib/utils/BookingslotLable";
import { BookingApi } from "../../../services/api/booking";
import { handleApiError } from "../../../lib/utils/handleApiError";

export default function BookingModal({
  isOpen = true,
  onClose,
  beauticianId,
  beauticianName = "Beautician",
  chatId,
  userId,
    onSuccess,
}: {
  isOpen?: boolean;
  onClose?: () => void;
  beauticianId: string;
  beauticianName?: string;
  chatId: string;
  userId: string;
    onSuccess?: () => void;
}) {
  const [services, setServices]                   = useState<IGetBeauticianServicesListDto[]>([]);
  const [slots, setSlots]                         = useState<TimeSlot[]>([]);
  const [duration, setDuration]                   = useState<1 | 2 | 3>(1);
  const [servicesLoading, setServicesLoading]     = useState(false);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [isLeaveDay, setIsLeaveDay]               = useState(false);
  const [submitted, setSubmitted]                 = useState(false);
  const [lockTtl, setLockTtl]                     = useState<number | null>(null); // ✅ countdown
  const [slotError, setSlotError]                 = useState<string | null>(null); // ✅ slot error
  
  const methods = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      selectedServices: [],
      phone:    "",
      address:  "",
      date:     "",
      timeSlot: "",
      notes:    "",
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = methods;

  const selectedServices = watch("selectedServices");
  const watchedDate      = watch("date");
  const watchedSlot      = watch("timeSlot");

  // ── Countdown timer for Redis lock ─────────────────────────────────────────
  useEffect(() => {
    if (!lockTtl) return;
    if (lockTtl <= 0) {
      setValue("timeSlot", "");
      setLockTtl(null);
      setSlotError("⏰ Your slot reservation expired. Please select again.");
      return;
    }
    const timer = setTimeout(() => setLockTtl((prev) => (prev ?? 1) - 1), 1000);
    return () => clearTimeout(timer);
  }, [lockTtl]);

  // ── Fetch services ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!beauticianId) return;
    setServicesLoading(true);
    publicAPi.getServiceList("home", "all", beauticianId)
      .then((res) => {
        if (res.data?.data?.services) setServices(res.data.data.services);
      })
      .catch(console.error)
      .finally(() => setServicesLoading(false));
  }, [beauticianId]);

  // ── Fetch availability when date changes ────────────────────────────────────
  useEffect(() => {
    if (!watchedDate || !beauticianId) return;
    setAvailabilityLoading(true);
    setValue("timeSlot", "");
    setSlots([]);
    setIsLeaveDay(false);
    setSlotError(null);
    setLockTtl(null);

    publicAPi.getAvailbilitySchedule(beauticianId, watchedDate)
      .then((res) => {
        const data = res.data?.data;
        if (!data) { setSlots([]); return; }
        if (data.availability?.type === "leave" || data.availability?.slots?.length === 0) {
          setIsLeaveDay(true);
          setSlots([]);
        } else {
          setSlots(mapBackendSlots(data.availability?.slots ?? []));
        }
      })
      .catch(console.error)
      .finally(() => setAvailabilityLoading(false));
  }, [watchedDate, beauticianId]);

  // ── Reset timeSlot when duration changes ────────────────────────────────────
  useEffect(() => {
    setValue("timeSlot", "");
    setLockTtl(null);
    setSlotError(null);
  }, [duration]);

  // ── Lock slot on selection ──────────────────────────────────────────────────
  const handleSlotSelect = async (start: string) => {
    // Deselect
    if (start === watchedSlot) {
      setValue("timeSlot", "", { shouldValidate: true });
      setLockTtl(null);
      setSlotError(null);
      return;
    }

    setValue("timeSlot", start, { shouldValidate: true });
    setSlotError(null);

    const selectedSlotObj = slots.find((s) => s.start === start);
    if (!selectedSlotObj || !watchedDate) return;

    const endTime = getEndTimeLabel(selectedSlotObj.startHour, duration);

    try {
      const res = await BookingApi.lockSlot({
        beauticianId,
        date:      watchedDate,
        startTime: start,
        endTime,
      });
      setLockTtl(res.data?.data?.ttl ?? 300); // ✅ start countdown
    } catch (err: any) {
      setValue("timeSlot", "");
      setLockTtl(null);
      if (err?.status === 409) {
        setSlotError("⚠ This slot was just taken. Please pick another.");
        // Refresh slots
        const freshRes = await publicAPi.getAvailbilitySchedule(beauticianId, watchedDate);
        setSlots(mapBackendSlots(freshRes.data?.data?.availability?.slots ?? []));
      } else {
        setSlotError("Could not reserve slot. Please try again.");
      }
    }
  };

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const toggleService = (id: string) => {
    const current = selectedServices ?? [];
    setValue(
      "selectedServices",
      current.includes(id) ? current.filter((s) => s !== id) : [...current, id],
      { shouldValidate: true },
    );
  };

  const selectedServiceObjects = services.filter((s) =>
    (selectedServices ?? []).includes(s.id),
  );
  const total = selectedServiceObjects.reduce((sum, s) => sum + s.price, 0);
  const today = new Date().toISOString().split("T")[0];
  const selectedSlotObj = slots.find((s) => s.start === watchedSlot);
  const blockValid = selectedSlotObj
    ? hasConsecutiveBlock(slots, selectedSlotObj.startHour, duration)
    : false;

  // ── Submit ──────────────────────────────────────────────────────────────────
  const onSubmit = async (data: BookingFormValues) => {
    setSlotError(null);
    try {
      const selectedSlotObj = slots.find((s) => s.start === data.timeSlot);
      if (!selectedSlotObj) return;

      await BookingApi.createBooking({
        chatId,
        userId,
        beauticianId,
        services: selectedServiceObjects.map((s) => ({
          serviceId: s.id,
          name:      s.serviceName,
          price:     s.price,
        })),
        totalPrice:  total,
        address:     data.address,
        phoneNumber: data.phone,
       slot: {
  date: new Date(data.date),
  time: `${data.timeSlot} – ${getEndTimeLabel(selectedSlotObj.startHour, duration)}`,
       },
       clientNote:data.notes?.trim()||undefined
      });

      console.log(data.notes)

      setSubmitted(true); 
      setLockTtl(null);
        onSuccess?.();

    } catch (err: any) {
      if (err?.status === 409) {
        // ✅ Slot taken between lock and submit (race condition)
        setSlotError("⚠ This slot was just booked. Please select another time.");
        setValue("timeSlot", "");
        setLockTtl(null);
        // Refresh slots — modal stays open, other fields preserved
        const freshRes = await publicAPi.getAvailbilitySchedule(beauticianId, data.date);
        setSlots(mapBackendSlots(freshRes.data?.data?.availability?.slots ?? []));
        return;
      }
       handleApiError(err)

      setSlotError("Something went wrong. Please try again.");
    }
  };

  if (!isOpen) return null;

  // ── Success screen ───────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-1">Booking Requested!</h2>
          <p className="text-gray-500 text-sm mb-1">
            {beauticianName} will confirm your appointment
          </p>
          <p className="text-violet-600 font-semibold text-sm mb-6">
            {watchedDate} · {watchedSlot}
            {selectedSlotObj && duration > 1 && ` → ${getEndTimeLabel(selectedSlotObj.startHour, duration)}`}
          </p>
          <button
            onClick={() => { setSubmitted(false); onClose?.(); }}
            className="bg-violet-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-0 sm:px-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-gray-50 rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg flex flex-col max-h-[92dvh] overflow-hidden"
        >
          {/* ── Header ── */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 bg-white rounded-t-3xl sm:rounded-t-2xl border-b border-gray-100 shrink-0">
            <div>
              <h1 className="text-lg font-bold text-gray-900">Book Home Service</h1>
              <p className="text-xs text-gray-400 mt-0.5">with {beauticianName}</p>
            </div>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* ── Scrollable Body ── */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="px-5 py-5 space-y-5">

              {/* Step 1: Services */}
              <section className="bg-white rounded-2xl p-4 shadow-sm">
                <StepBadge n={1} label="Select Services" />
                {servicesLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-14 rounded-xl bg-gray-100 animate-pulse" />
                    ))}
                  </div>
                ) : services.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">No home services available</p>
                ) : (
                  <div className="space-y-2">
                    {services.map((s) => (
                      <ServiceCard
                        key={s.id}
                        service={s}
                        selected={(selectedServices ?? []).includes(s.id)}
                        onToggle={() => toggleService(s.id)}
                      />
                    ))}
                  </div>
                )}
                {errors.selectedServices && (
                  <p className="text-xs text-red-500 mt-2">{errors.selectedServices.message}</p>
                )}
              </section>

              {/* Step 2: Contact */}
              <section className="bg-white rounded-2xl p-4 shadow-sm">
                <StepBadge n={2} label="Contact Details" />
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Phone Number</label>
                    <input
                      {...register("phone")}
                      type="tel"
                      placeholder="+91 98765 43210"
                      className={`w-full border rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 transition
                        ${errors.phone ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-violet-300 focus:border-violet-400"}`}
                    />
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Address</label>
                    <textarea
                      {...register("address")}
                      placeholder="Enter your complete address"
                      rows={2}
                      className={`w-full border rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 transition resize-none
                        ${errors.address ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-violet-300 focus:border-violet-400"}`}
                    />
                    {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>}
                  </div>
                </div>
              </section>

              {/* Step 3: Schedule */}
              <section className="bg-white rounded-2xl p-4 shadow-sm">
                <StepBadge n={3} label="Schedule Appointment" />
                <div className="mb-4">
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Preferred Date</label>
                  <input
                    {...register("date")}
                    type="date"
                    min={today}
                    className={`w-full border rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 transition
                      ${errors.date ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-violet-300 focus:border-violet-400"}`}
                  />
                  {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date.message}</p>}
                </div>

                {watchedDate && !isLeaveDay && (
                  <DurationPicker value={duration} onChange={(d) => setDuration(d)} />
                )}

                {watchedDate ? (
                  availabilityLoading ? (
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-9 rounded-lg bg-gray-100 animate-pulse" />
                      ))}
                    </div>
                  ) : isLeaveDay ? (
                    <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-700 flex items-center gap-2">
                      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                      </svg>
                      {beauticianName} is not available on this date. Please pick another day.
                    </div>
                  ) : (
                    <>
                      <label className="text-xs font-medium text-gray-500 mb-2 block">Pick a Start Time</label>
                      <TimeSlotPicker
                        slots={slots}
                        selected={watchedSlot}
                        duration={duration}
                        onSelect={handleSlotSelect}  
                      />

                      {/* ✅ Slot error */}
                      {slotError && (
                        <p className="text-xs text-red-500 mt-2">{slotError}</p>
                      )}

                      {/* ✅ Lock countdown timer */}
                      {lockTtl !== null && watchedSlot && (
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-600">
                          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Slot reserved for{" "}
                          <strong>
                            {Math.floor(lockTtl / 60)}:{String(lockTtl % 60).padStart(2, "0")}
                          </strong>{" "}
                          mins
                        </div>
                      )}

                      {errors.timeSlot && (
                        <p className="text-xs text-red-500 mt-2">{errors.timeSlot.message}</p>
                      )}
                    </>
                  )
                ) : (
                  <div className="border-2 border-dashed border-gray-100 rounded-xl py-6 text-center">
                    <svg className="w-6 h-6 text-gray-300 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs text-gray-400">Select a date to see available slots</p>
                  </div>
                )}
              </section>

              {/* Step 4: Notes */}
              <section className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-semibold text-gray-500">Additional Notes</span>
                  <span className="text-xs text-gray-300">(optional)</span>
                </div>
                <textarea
                  {...register("notes")}
                  placeholder="Any special requests or instructions…"
                  rows={2}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-300 transition resize-none"
                />
                {errors.notes && <p className="text-xs text-red-500 mt-1">{errors.notes.message}</p>}
              </section>

              {/* Summary */}
              {selectedServiceObjects.length > 0 && (
                <section className="bg-violet-50 border border-violet-100 rounded-2xl p-4">
                  <p className="text-xs font-semibold text-violet-500 uppercase tracking-widest mb-3">Summary</p>
                  <div className="space-y-1.5">
                    {selectedServiceObjects.map((s) => (
                      <div key={s.id} className="flex justify-between text-sm">
                        <span className="text-gray-700">{s.serviceName}</span>
                        <span className="text-gray-700 font-medium">₹{s.price}</span>
                      </div>
                    ))}
                  </div>
                  {watchedSlot && selectedSlotObj && (
                    <div className="mt-3 pt-3 border-t border-violet-200 text-xs text-violet-600 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>
                        {watchedDate} · {watchedSlot} → {getEndTimeLabel(selectedSlotObj.startHour, duration)} ({duration}h)
                      </span>
                    </div>
                  )}
                  <div className="border-t border-violet-200 mt-3 pt-3 flex justify-between">
                    <span className="text-sm font-bold text-gray-800">Total</span>
                    <span className="text-sm font-bold text-violet-700">₹{total}</span>
                  </div>
                </section>
              )}
            </div>
          </div>

          {/* Footer CTA */}
          <div className="px-5 py-4 bg-white border-t border-gray-100 rounded-b-3xl sm:rounded-b-2xl shrink-0">
            {watchedSlot && !blockValid && (
              <p className="text-xs text-red-500 text-center mb-2">
                ⚠ The selected {duration}h block has unavailable slots. Pick a different start time.
              </p>
            )}
            <button
              type="submit"
              disabled={isSubmitting || (!!watchedSlot && !blockValid) || !watchedSlot}
              className={`w-full py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-200
                ${!isSubmitting && watchedSlot && blockValid
                  ? "bg-violet-600 text-white hover:bg-violet-700 shadow-lg shadow-violet-200 active:scale-[0.98]"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
            >
              {isSubmitting ? "Sending…" : "Send Booking Request"}
            </button>
          </div>
        </form>
      </div>
    </FormProvider>
  );
}