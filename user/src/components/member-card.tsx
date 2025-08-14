import React from "react";

interface MemberShipMetadata {
  name: string;
  bgColor: string;
  footerColor: string;
}

const membershipTiers: Record<string, MemberShipMetadata> = {
  register: {
    name: "Register",
    bgColor: "bg-gradient-to-br from-gray-100 to-gray-200",
    footerColor: "text-gray-800",
  },
  silver: {
    name: "Silver",
    bgColor: "bg-gradient-to-b from-sky-100 via-white to-white",
    footerColor: "bg-gradient-to-t from-sky-50/90 to-transparent",
  },
  gold: {
    name: "Gold",
    bgColor: "bg-gradient-to-b from-yellow-100 via-white to-amber",
    footerColor: "bg-gradient-to-t from-amber-100 to-transparent",
  },
  platinum: {
    name: "Platinum",
    bgColor: "bg-gradient-to-b from-purple-300 via-white to-indigo",
    footerColor: "bg-gradient-to-t from-indigo-100 to-transparent",
  },
  million_miles: {
    name: "Million Miles",
    bgColor: "bg-gradient-to-b from-rose-300 via-white to-pink",
    footerColor: "bg-gradient-to-t from-pink-100 to-transparent",
  }
};

export interface MemberCardProps {
  memberID: string;
  name: string;
  currentTier: string;
  memberSince: Date;
  validThrough: Date;
  expiringDate: Date;
}

function formatToMMYY(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = String(date.getFullYear()).slice(-2); // Get last 2 digits
  return `${month}/${year}`;
}

export default function MemberCard(props: MemberCardProps) {
  const currentTier = membershipTiers[props.currentTier];
  const memberSince= formatToMMYY(props.memberSince);
  const validThrough = formatToMMYY(props.validThrough);

  return (
    <div className="relative w-full aspect-[2/1] sm:aspect-[1.6/1] rounded-2xl overflow-hidden shadow-2xl border border-white/60 bg-white">
      {/* Background sky gradient */}
      {/*<div className="absolute inset-0 bg-gradient-to-b from-sky-100 via-white to-white" />*/}
      <div className={`absolute inset-0 ${currentTier.bgColor} `} />

      {/* Subtle mountain/ice footer gradient */}
      {/*<div className="absolute bottom-0 inset-x-0 h-16 sm:h-20 bg-gradient-to-t from-sky-50/90 to-transparent" />*/}
      <div className={`absolute bottom-0 inset-x-0 h-16 sm:h-20 ${currentTier.footerColor}`} />

      {/* Lotus decorative SVG on the right */}
      <div className="absolute right-0 bottom-0 h-full w-[64%] sm:w-[48%] pointer-events-none">
        <LotusArt className="absolute right-[-20%] bottom-[-18%] sm:right-[-6%] sm:bottom-[-6%] w-[70%] sm:w-[95%] opacity-40 sm:opacity-90" />
      </div>

      {/* Content */}
      <div className="relative h-full p-4 sm:p-6">
        {/* Top Row: Brand + SkyTeam */}
        <div className="flex items-start justify-between">
          <div className="select-none">
            <div className="leading-none tracking-wide">
              <span className="text-[22px] sm:text-[38px] font-semibold text-sky-700">LOTUS</span>
              <span className="text-[22px] sm:text-[38px] font-semibold ml-1 bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-cyan-600">MILES</span>
            </div>
            <div className="mt-1 text-[14px] sm:text-[26px] tracking-[0.35em] text-neutral-600 font-light">
              {props.currentTier}
            </div>
          </div>

          {/* SkyTeam badge */}
          <div className="flex items-center gap-2 text-sky-800">
            <div className="w-8 h-8 sm:w-12 sm:h-12 grid place-items-center rounded-full border border-sky-300/70 bg-white/70 backdrop-blur-sm">
              <SkyTeamMark className="w-5 h-5 sm:w-8 sm:h-8 opacity-80" />
            </div>
          </div>
        </div>

        {/* Middle block: Name strip & ID */}
        <div className="mt-4 sm:mt-6 grid grid-cols-1 gap-3 sm:grid-cols-[1.1fr_0.9fr] sm:gap-4 pr-0 sm:pr-[34%]">
          <div className="space-y-2 sm:space-y-3">
            <div className="bg-white/90 border border-neutral-200 rounded-md px-3 py-1.5 sm:py-2 text-neutral-900 font-medium text-[13px] sm:text-base shadow-sm truncate">
              {props.memberID}
            </div>

            <div className="text-neutral-800 font-mono tracking-wider text-[11px] sm:text-[13px]">
              {props.name}
            </div>
          </div>

          {/* Right column left empty on purpose for composition on desktop */}
          <div className="hidden sm:block" />
        </div>

        {/* Bottom meta: static on mobile, absolute on sm+ */}
        <div className="mt-3 flex flex-col sm:mt-0 sm:absolute sm:left-6 sm:right-6 sm:bottom-4 sm:flex-row sm:items-end justify-between gap-3">
          {/* Left: Since / Through + big expiry */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-8">
            <div className="space-y-1 order-2 sm:order-1">
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <Caption>MEMBER SINCE</Caption>
                  <div className="text-[12px] sm:text-[13px] text-neutral-900 font-semibold">{memberSince}</div>
                </div>
                <div>
                  <Caption>VALID THROUGH</Caption>
                  <div className="text-[12px] sm:text-[13px] text-neutral-900 font-semibold">{validThrough}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Airline wordmark */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <SmallLotus className="w-5 h-5 sm:w-6 sm:h-6" />
            <div className="text-[14px] sm:text-[16px] font-medium text-emerald-800">
              Apollo Team
            </div>
          </div>
        </div>
      </div>

      {/* thin inner border for card feel */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-black/5 pointer-events-none" />
    </div>
  );
}

function Caption({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={"text-[9px] sm:text-[10px] tracking-[0.18em] text-neutral-600/90" + (className ? ` ${className}` : "")}>{children}</div>
  );
}

function SkyTeamMark({ className = "" }: { className?: string }) {
  // Minimal swirl-like mark (not official) for layout fidelity only
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 32c8-7 22-7 30 0" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M18 40c8-7 20-7 28 0" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity=".7"/>
      <path d="M24 48c7-6 17-6 24 0" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity=".5"/>
    </svg>
  );
}

function SmallLotus({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} xmlns="http://www.w3.org/2000/svg">
      <g fill="currentColor">
        <path d="M32 36c-8 0-13 6-13 6s7 2 13 2 13-2 13-2-5-6-13-6z" fill="#16a34a"/>
      </g>
      <g fill="#ef5da8">
        <path d="M32 14c-5 6-6 12-5 16 3-2 5-3 5-3s2 1 5 3c1-4 0-10-5-16z"/>
        <path d="M17 26c1 6 6 9 9 10-1-3-1-5-1-5s-2-1-8-5z"/>
        <path d="M47 26c-6 4-8 5-8 5s0 2-1 5c3-1 8-4 9-10z"/>
      </g>
    </svg>
  );
}

function LotusArt({ className = "" }: { className?: string }) {
  // Decorative large lotus (simplified)
  return (
    <svg viewBox="0 0 600 420" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="petal" x1="0" x2="1">
          <stop offset="0%" stopColor="#ff7ab8"/>
          <stop offset="100%" stopColor="#ff5aa8"/>
        </linearGradient>
        <linearGradient id="center" x1="0" x2="1">
          <stop offset="0%" stopColor="#ffe08a"/>
          <stop offset="100%" stopColor="#ffc94d"/>
        </linearGradient>
      </defs>
      <g opacity="0.95">
        <ellipse cx="420" cy="350" rx="180" ry="32" fill="#000" opacity="0.06"/>
        <g transform="translate(300 200) scale(1.1)">
          <path d="M0-140c-44 50-52 105-40 140 24-18 40-24 40-24s16 6 40 24c12-35 4-90-40-140z" fill="url(#petal)"/>
          <path d="M-120-40c6 44 42 68 66 76-6-20-6-36-6-36s-16-6-60-40z" fill="url(#petal)"/>
          <path d="M120-40c-44 34-60 40-60 40s0 16-6 36c24-8 60-32 66-76z" fill="url(#petal)"/>
          <circle cx="0" cy="-10" r="20" fill="url(#center)"/>
        </g>
      </g>
    </svg>
  );
}
