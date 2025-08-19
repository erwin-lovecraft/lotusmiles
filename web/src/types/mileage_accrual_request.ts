import { z } from "zod";

export const MileageAccrualRequestSchema = z.object({
  ticket_id: z.string(),
  pnr: z.string(),
  carrier: z.string(),
  booking_class: z.string(),
  from_code: z.string(),
  to_code: z.string(),
  departure_date: z.date(),
  ticket_image_url: z.url(),
  boarding_pass_image_url: z.url(),
})

export type MileageAccrualRequest = z.infer<typeof MileageAccrualRequestSchema>;
