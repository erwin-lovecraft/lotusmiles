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

export type MileageAccrualRequestForm = z.infer<typeof MileageAccrualRequestSchema>;

export type MileageAccrualRequest = {
  id: bigint;
  member_id: bigint;
  status: string;
  from_code: string;
  to_code: string;
  departure_date: string;
  distance_miles: number;
  qualifying_miles: number;
  bonus_miles: number;
  reviewed_at: Date;
  rejected_reason?: string;
  submitted_date: Date;
}
