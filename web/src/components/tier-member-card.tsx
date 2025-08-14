export type Tier = "register" | "silver" | "gold" | "platinum" | "million_miler";

const themes: Record<
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
  }
> = {
  register: {
    label: "Register",
    gradient: "from-slate-100 to-slate-300",
    text: "text-slate-800",
    subtext: "text-slate-600",
    accentDot: "bg-slate-500",
    logoFrom: "from-slate-400",
    logoTo: "to-slate-300",
    outline: "ring-1 ring-slate-200",
    shadow: "shadow-slate-300/50",
    rfid: "text-slate-500",
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
  },
};

export interface MemberTierCardProps {
  name: string,
  memberId: string,
  memberSince: Date,
  validThrough: Date,
  issuer: string,
  tier: Tier,
}

export default function MemberTierCard(props: MemberTierCardProps) {
  const memberSince = formatCardDate(props.memberSince)
  const validThrough = formatCardDate(props.validThrough)
  const tierTheme = themes[props.tier];

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
        <RfidIcon className={["h-5 w-5", theme.rfid].join(" ")}/>
      </div>

      {/* Card number */}
      <div className="mt-4">
        <div className="inline-flex items-center gap-2 rounded-xl bg-white/85 px-3 py-2 text-slate-800 backdrop-blur">
          <span className="font-mono text-sm tracking-wide">{memberId}</span>
        </div>
      </div>

      {/* Name */}
      <div className={["mt-3 text-sm font-medium", theme.text].join(" ")}>{name}</div>

      {/* Lotus logo */}
      {/*<div className="absolute right-4 bottom-16 sm:bottom-10 opacity-90">*/}
      {/*  <Lotus theme={theme} size={small ? 72 : 96}/>*/}
      {/*</div>*/}

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
        <div className="flex items-center gap-2 text-xs">
          <span className="opacity-90">{issuer}</span>
        </div>
      </div>
    </div>
  );
}

function RfidIcon({className = ""}: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path
        d="M2 12a10 10 0 0 1 10-10v2A8 8 0 0 0 4 12a8 8 0 0 0 8 8v2A10 10 0 0 1 2 12Zm5 0a5 5 0 0 1 5-5v2a3 3 0 0 0-3 3 3 3 0 0 0 3 3v2a5 5 0 0 1-5-5Z"/>
    </svg>
  );
}

function formatCardDate(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = String(date.getFullYear()).slice(-2); // Get last 2 digits
  return `${month}/${year}`;
}
