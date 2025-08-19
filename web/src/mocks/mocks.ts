import type { MileageTransaction } from "@/types/mileage-ledgers.ts";
import type { MileageAccrualRequest } from "@/types/mileage-accrual-request.ts";

export const BOOKING_CLASSES = [
  // Economy
  "Y", "M", "B",   // Economy Flex
  "S", "H", "K", "L", // Economy Classic
  "Q", "N", "R", "T", "E", // Economy Lite
  "A", "G", "P",   // Economy Super Lite

  // Premium Economy
  "W",       // Premium Economy Flex
  "Z", "U",  // Premium Economy Classic

  // Business
  "J", "C",  // Business Flex
  "D", "I"   // Business Classic
];

// Array các địa điểm
export const LOCATIONS = [
  { code: "HAN", name: "Hanoi", country: "Vietnam" },
  { code: "SGN", name: "Ho Chi Minh City", country: "Vietnam" },
  { code: "DAD", name: "Da Nang", country: "Vietnam" },
  { code: "CXR", name: "Nha Trang (Cam Ranh)", country: "Vietnam" },
  { code: "PQC", name: "Phu Quoc", country: "Vietnam" },
  { code: "HPH", name: "Hai Phong", country: "Vietnam" },
  { code: "HUI", name: "Hue", country: "Vietnam" },
  { code: "DLI", name: "Da Lat", country: "Vietnam" },
  { code: "VCA", name: "Can Tho", country: "Vietnam" },
  { code: "VCL", name: "Chu Lai", country: "Vietnam" },
  { code: "THD", name: "Thanh Hoa", country: "Vietnam" },
  { code: "VII", name: "Vinh", country: "Vietnam" },
  { code: "VDH", name: "Dong Hoi", country: "Vietnam" },
  { code: "VCS", name: "Con Dao", country: "Vietnam" },

  { code: "BKK", name: "Bangkok (Suvarnabhumi)", country: "Thailand" },
  { code: "SIN", name: "Singapore", country: "Singapore" },
  { code: "KUL", name: "Kuala Lumpur (KUL)", country: "Malaysia" },
  { code: "HKG", name: "Hong Kong", country: "China (HK SAR)" },
  { code: "TPE", name: "Taipei (TPE)", country: "Taiwan" },
  { code: "ICN", name: "Seoul (ICN)", country: "South Korea" },
  { code: "NRT", name: "Tokyo (Narita)", country: "Japan" },
  { code: "KIX", name: "Osaka (Kansai)", country: "Japan" },
  { code: "PVG", name: "Shanghai (Pudong)", country: "China" },
  { code: "CAN", name: "Guangzhou (CAN)", country: "China" },
  { code: "PEK", name: "Beijing (PEK)", country: "China" },
  { code: "PKX", name: "Beijing (PKX, Daxing)", country: "China" },

  { code: "SYD", name: "Sydney", country: "Australia" },
  { code: "MEL", name: "Melbourne", country: "Australia" },
  { code: "PER", name: "Perth", country: "Australia" },

  { code: "CDG", name: "Paris (CDG)", country: "France" },
  { code: "FRA", name: "Frankfurt", country: "Germany" },
  { code: "LHR", name: "London (Heathrow)", country: "United Kingdom" },
];

export const MILEAGE_ACCRUAL_REQUESTS: MileageAccrualRequest[] = [
  {
    id: 175558930123456789n,
    member_id: 175558930987654321n,
    status: "approved",
    from_code: "SFO",
    to_code: "NRT",
    departure_date: "2025-07-12",
    distance_miles: 5124,
    qualifying_miles: 5124,
    bonus_miles: 2562,
    reviewed_at: new Date("2025-07-20T14:32:00Z"),
    submitted_date: new Date("2025-07-13T09:15:00Z"),
  },
  {
    id: 175559120223456789n,
    member_id: 175559120654321987n,
    status: "inprogress",
    from_code: "LHR",
    to_code: "JFK",
    departure_date: "2025-08-01",
    distance_miles: 3451,
    qualifying_miles: 3451,
    bonus_miles: 0,
    reviewed_at: new Date("2025-08-05T12:00:00Z"),
    submitted_date: new Date("2025-08-02T10:30:00Z"),
  },
  {
    id: 175559450323456789n,
    member_id: 175559450112233445n,
    status: "rejected",
    from_code: "SIN",
    to_code: "SYD",
    departure_date: "2025-06-18",
    distance_miles: 3907,
    qualifying_miles: 0,
    bonus_miles: 0,
    reviewed_at: new Date("2025-06-25T08:00:00Z"),
    rejected_reason: "Ticket purchased from non-partner airline",
    submitted_date: new Date("2025-06-19T14:22:00Z"),
  },
  {
    id: 175559780423456789n,
    member_id: 175559780998877665n,
    status: "approved",
    from_code: "CDG",
    to_code: "DXB",
    departure_date: "2025-05-09",
    distance_miles: 3258,
    qualifying_miles: 3258,
    bonus_miles: 1629,
    reviewed_at: new Date("2025-05-15T16:45:00Z"),
    submitted_date: new Date("2025-05-10T11:00:00Z"),
  },
  {
    id: 175560110523456789n,
    member_id: 175560110443322110n,
    status: "approved",
    from_code: "HKG",
    to_code: "LAX",
    departure_date: "2025-04-02",
    distance_miles: 7260,
    qualifying_miles: 7260,
    bonus_miles: 1452,
    reviewed_at: new Date("2025-04-10T13:10:00Z"),
    submitted_date: new Date("2025-04-03T08:40:00Z"),
  },
];

export const MILEAGE_TRANSACTIONS: MileageTransaction[] = [
  {
    id: 8792349823749234n,
    member_id: 9238475629384756n,
    qualifying_miles_delta: 5230,
    bonus_miles_delta: -1046, // ~20% promo bonus
    accrual_request_id: 7238492374982374n,
    created_at: new Date("2025-08-01T10:23:00Z"),
  },
  {
    id: 8792349823749235n,
    member_id: 9238475629384756n,
    qualifying_miles_delta: -812,
    bonus_miles_delta: 0, // short haul, no bonus
    accrual_request_id: 7238492374982375n,
    created_at: new Date("2025-08-03T15:45:00Z"),
  },
  {
    id: 8792349823749236n,
    member_id: 8123498756234875n,
    qualifying_miles_delta: 9680, // long haul
    bonus_miles_delta: 2904, // ~30% promo
    accrual_request_id: 7238492374982376n,
    created_at: new Date("2025-08-07T08:10:00Z"),
  },
  {
    id: 8792349823749237n,
    member_id: 8123498756234875n,
    qualifying_miles_delta: -1520,
    bonus_miles_delta: 152, // ~10% elite bonus
    accrual_request_id: 7238492374982377n,
    created_at: new Date("2025-08-12T12:00:00Z"),
  },
  {
    id: 8792349823749238n,
    member_id: 7001234987562398n,
    qualifying_miles_delta: 3420,
    bonus_miles_delta: 0,
    accrual_request_id: 7238492374982378n,
    created_at: new Date("2025-08-15T18:30:00Z"),
  },
];

