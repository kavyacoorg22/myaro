import z from "zod";

export const bookingSchema = z.object({
  selectedServices: z
    .array(z.string())
    .min(1, "Please select at least one service"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[+]?[\d\s\-()]{7,15}$/, "Enter a valid phone number"),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address is too long"),
  date: z.string().min(1, "Please select a date"),
  timeSlot: z.string().min(1, "Please select a time slot"),
  notes: z.string().max(500, "Notes too long").optional(),
});
 
export type BookingFormValues = z.infer<typeof bookingSchema>;