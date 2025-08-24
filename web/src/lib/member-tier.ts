import { Award, Crown, Diamond, Star, Zap, User } from "lucide-react";

export type Tier = "register" | "silver" | "titan" | "gold" | "platinum" | "million_miler";

export const MemberTier: Record<
  Tier,
  {
    label: string;
    gradient: string; // tailwind gradient classes
    text: string; // primary text color
    subtext: string; // secondary text color
    accentDot: string; // bg color for the lotus dot
    logoFrom: string; // gradient for lotus petals
    logoTo: string;
    outline: string; // subtle border
    shadow: string; // shadow color
    rfid: string; // rfid icon color
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
    requirements: {miles: number, flights: number}
  }
> = {
  register: {
    label: "Register",
    gradient: "from-gray-50 to-gray-100",
    text: "text-gray-800",
    subtext: "text-gray-600",
    accentDot: "bg-gray-400",
    logoFrom: "from-gray-300",
    logoTo: "to-gray-200",
    outline: "ring-1 ring-gray-200",
    shadow: "shadow-gray-200/50",
    rfid: "text-gray-400",
    icon: User,
    requirements: {miles: 0, flights: 0}
  },
  silver: {
    label: "Silver",
    gradient: "from-slate-100 to-slate-300",
    text: "text-slate-800",
    subtext: "text-slate-600",
    accentDot: "bg-slate-500",
    logoFrom: "from-slate-400",
    logoTo: "to-slate-300",
    outline: "ring-1 ring-slate-200",
    shadow: "shadow-slate-300/50",
    rfid: "text-slate-500",
    icon: Star,
    requirements: {miles: 1, flights: 4}
  },
  titan: {
    label: "Titan",
    gradient: "from-indigo-100 to-indigo-300",
    text: "text-indigo-900",
    subtext: "text-indigo-700",
    accentDot: "bg-indigo-600",
    logoFrom: "from-indigo-400",
    logoTo: "to-indigo-300",
    outline: "ring-1 ring-indigo-200",
    shadow: "shadow-indigo-300/50",
    rfid: "text-indigo-600",
    icon: Zap,
    requirements: {miles: 15000, flights: 6}
  },
  gold: {
    label: "Gold",
    gradient: "from-amber-50 to-amber-300",
    text: "text-stone-900",
    subtext: "text-stone-700",
    accentDot: "bg-amber-600",
    logoFrom: "from-amber-400",
    logoTo: "to-amber-300",
    outline: "ring-1 ring-amber-200",
    shadow: "shadow-amber-300/50",
    rfid: "text-amber-600",
    icon: Award,
    requirements: {miles: 30000, flights: 8}
  },
  platinum: {
    label: "Platinum",
    gradient: "from-zinc-100 to-white",
    text: "text-zinc-900",
    subtext: "text-zinc-600",
    accentDot: "bg-zinc-500",
    logoFrom: "from-zinc-400",
    logoTo: "to-zinc-200",
    outline: "ring-1 ring-zinc-200",
    shadow: "shadow-zinc-300/50",
    rfid: "text-zinc-500",
    icon: Crown,
    requirements: {miles: 50000, flights: 12}
  },
  million_miler: {
    label: "Million Miler",
    gradient: "from-fuchsia-900 to-rose-900",
    text: "text-white",
    subtext: "text-white/80",
    accentDot: "bg-rose-200",
    logoFrom: "from-rose-300",
    logoTo: "to-rose-200",
    outline: "ring-1 ring-white/15",
    shadow: "shadow-fuchsia-900/40",
    rfid: "text-white/80",
    icon: Diamond,
    requirements: {miles: 1000000, flights: 100}
  },
};

