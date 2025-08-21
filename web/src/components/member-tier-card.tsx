import lotusmiles from '@/assets/lotusmiles.png';
import { MemberTier, type Tier } from "@/lib/member-tier.ts";

export interface MemberTierCardProps {
  name: string,
  memberId: string,
  memberSince: Date,
  validThrough?: Date,
  issuer: string,
  tier: Tier,
}

export default function MemberTierCard(props: MemberTierCardProps) {
  const memberSince = formatCardDate(props.memberSince)
  const validThrough = props.validThrough ? formatCardDate(props.validThrough) : ""
  const tierTheme = MemberTier[props.tier];

  return (
    <Card name={props.name}
      memberId={props.memberId}
      memberSince={memberSince}
      validThrough={validThrough}
      issuer={props.issuer}
      theme={tierTheme}
    />
  )
}

function Card({
  name,
  memberId,
  memberSince,
  validThrough,
  issuer,
  theme,
  small,
}: {
  name: string;
  memberId: string;
  memberSince: string;
  validThrough: string;
  issuer: string;
  theme: {
    label: string;
    gradient: string;
    text: string;
    subtext: string;
    accentDot: string;
    logoFrom: string;
    logoTo: string;
    outline: string;
    shadow: string;
    rfid: string;
  };
  small?: boolean;
}) {
  return (
    <div
      className={[
        "group relative w-full overflow-hidden rounded-2xl transition-all",
        "bg-gradient-to-br",
        theme.gradient,
        theme.outline,
        small ? "h-48" : "h-64",
        "p-5 shadow-md hover:shadow-xl",
        theme.shadow,
      ].join(" ")}
      role="img"
      aria-label={`${theme.label} Lotusmiles membership card`}
    >
      {/* Top bar */}
      <div className="flex items-start justify-between">
        <div>
          <div className={["text-lg font-semibold tracking-tight uppercase", theme.text].join(" ")}>LOTUSMILES</div>
          <div className={["text-xs", theme.subtext].join(" ")}>{theme.label}</div>
        </div>
        <RfidIcon className={["h-5 w-5", theme.rfid].join(" ")} />
      </div>

      {/* Card number */}
      <div className="mt-4">
        <div className="inline-flex items-center gap-2 rounded-xl bg-white/85 px-3 py-2 text-slate-800 backdrop-blur">
          <span className="font-mono text-sm tracking-wide">{memberId}</span>
        </div>
      </div>

      {/* Name */}
      <div className={["mt-3 text-sm font-medium", theme.text].join(" ")}>{name}</div>

      {/* Footer */}
      <div className="absolute left-5 right-5 bottom-4 flex items-end justify-between">
        <div className="flex gap-8 text-[10px]">
          <div className={["", theme.subtext].join(" ")}>
            <div className="uppercase">Member Since</div>
            <div className={["mt-0.5 font-semibold", theme.text].join(" ")}>{memberSince}</div>
          </div>
          <div className={["", theme.subtext].join(" ")}>
            <div className="uppercase">Valid Through</div>
            <div className={["mt-0.5 font-semibold", theme.text].join(" ")}>{validThrough}</div>
          </div>
        </div>
        <div className="flex flex-col items-center text-xs">
          <img src={lotusmiles} alt="lotusmiles" className="w-24 h-auto" />
          <span className="opacity-70">{issuer}</span>
        </div>
      </div>
    </div>
  );
}

function RfidIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path
        d="M2 12a10 10 0 0 1 10-10v2A8 8 0 0 0 4 12a8 8 0 0 0 8 8v2A10 10 0 0 1 2 12Zm5 0a5 5 0 0 1 5-5v2a3 3 0 0 0-3 3 3 3 0 0 0 3 3v2a5 5 0 0 1-5-5Z" />
    </svg>
  );
}

function formatCardDate(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = String(date.getFullYear()).slice(-2); // Get last 2 digits
  return `${month}/${year}`;
}
