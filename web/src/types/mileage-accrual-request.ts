import { z } from "zod";

// Function to create schema with translated error messages
export function createMileageAccrualRequestSchema(t: (key: string) => string) {
  return z.object({
    ticket_id: z.string().regex(/^\d{13}$/, t('errors.validation.ticketIdRequired')),
    pnr: z.string().regex(/^[A-Z0-9]{6}$/, t('errors.validation.pnrRequired')),
    carrier: z.string().min(2, t('errors.validation.carrierRequired')),
    booking_class: z.string().min(1, t('errors.validation.bookingClassRequired')),
    from_code: z.string().min(3, t('errors.validation.fromCodeRequired')),
    to_code: z.string().min(3, t('errors.validation.toCodeRequired')),
    departure_date: z.date(),
    ticket_image_url: z.url(t('errors.validation.invalidUrl')),
    boarding_pass_image_url: z.url(t('errors.validation.invalidUrl')),
  })
  .refine((data) => data.from_code !== data.to_code, {
    path: ["to_code"],
    message: t('errors.validation.fromToCodeDifferent'),
  });
}

// Default schema with English messages (for backward compatibility)
export const MileageAccrualRequestSchema = z.object({
  ticket_id: z.string().regex(/^\d{13}$/, "Ticket ID must be exactly 13 digits"),
  pnr: z.string().regex(/^[A-Z0-9]{6}$/, "PNR must be exactly 6 alphanumeric characters"),
  carrier: z.string().min(2, "Carrier is required"),
  booking_class: z.string().min(1, "Booking class is required"),
  from_code: z.string().min(3, "From code is required"),
  to_code: z.string().min(3, "To code is required"),
  departure_date: z.date(),
  ticket_image_url: z.url(),
  boarding_pass_image_url: z.url(),
})
.refine((data) => data.from_code !== data.to_code, {
  path: ["to_code"],
  message: "From and to code must be different",
})

export type MileageAccrualRequestForm = z.infer<typeof MileageAccrualRequestSchema>;

export type MileageAccrualRequest = {
  id: string;
  customer_id: string;
  status: string;
  ticket_id: string;
  pnr: string;
  carrier: string;
  booking_class: string;
  from_code: string;
  to_code: string;
  departure_date: string;
  ticket_image_url: string;
  boarding_pass_image_url: string;
  distance_miles: number;
  qualifying_accrual_rate: number;
  qualifying_miles: number;
  bonus_accrual_rate: number;
  bonus_miles: number;
  reviewer_id?: string;
  reviewed_at?: string;
  rejected_reason?: string;
  created_at: string;
  updated_at: string;
}
