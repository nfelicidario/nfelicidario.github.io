import type { ReactNode } from "react";
import { ArrowDown, ArrowRight, BadgeCheck, Blocks, Lightbulb, Store, UserPlus } from "lucide-react";

function ShiftIllustration() {
  return (
    <svg
      viewBox="0 0 200 120"
      width={200}
      height={120}
      preserveAspectRatio="xMidYMid meet"
      className="h-full w-full"
      aria-hidden="true"
    >
      {/* SMS */}
      <text x={42} y={34} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted)">
        SMS
      </text>
      <rect x={10} y={40} width={64} height={24} rx={12} fill="var(--raised)" />
      <rect x={20} y={47} width={40} height={4} rx={2} fill="var(--muted)" opacity={0.5} />
      <rect x={20} y={54} width={26} height={4} rx={2} fill="var(--muted)" opacity={0.5} />
      <text x={42} y={78} textAnchor="middle" fontSize={9} fill="var(--muted)">
        Bare number
      </text>

      {/* arrow */}
      <line x1={80} y1={52} x2={106} y2={52} stroke="var(--rule)" strokeWidth={1.5} strokeDasharray="3 3" />
      <path d="M103 48.5 L108 52 L103 55.5" fill="none" stroke="var(--rule)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />

      {/* RCS card */}
      <text x={151} y={10} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--accent)">
        RCS
      </text>
      <rect x={112} y={14} width={78} height={92} rx={10} fill="var(--surface)" stroke="var(--rule)" />
      <circle cx={124} cy={26} r={6} fill="var(--accent-soft)" />
      <path d="M121.5 26 L123.4 27.9 L126.6 24.3" fill="none" stroke="var(--accent)" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
      <rect x={134} y={24} width={34} height={4} rx={2} fill="var(--ink)" opacity={0.7} />
      <rect x={118} y={36} width={66} height={26} rx={5} fill="var(--accent-soft)" />
      <rect x={118} y={67} width={56} height={3.5} rx={1.75} fill="var(--muted)" opacity={0.5} />
      <rect x={118} y={74} width={40} height={3.5} rx={1.75} fill="var(--muted)" opacity={0.5} />
      <rect x={118.5} y={84.5} width={31} height={15} rx={7.5} fill="none" stroke="var(--accent)" />
      <rect x={152.5} y={84.5} width={31} height={15} rx={7.5} fill="none" stroke="var(--accent)" />
      <text x={151} y={117} textAnchor="middle" fontSize={9} fill="var(--muted)">
        Verified brand
      </text>
    </svg>
  );
}

function BrandTile({ small = false, badge = false }: { small?: boolean; badge?: boolean }) {
  return (
    <span
      className={`relative grid place-items-center rounded-[8px] border border-rule bg-surface ${small ? "h-6 w-6" : "h-7 w-7"}`}
    >
      <Store size={13} className="text-muted" aria-hidden="true" />
      {badge && (
        <span className="absolute -right-1 -top-1 rounded-full bg-bg">
          <BadgeCheck size={11} className="text-accent" aria-hidden="true" />
        </span>
      )}
    </span>
  );
}

function AgentsIllustration() {
  return (
    <div className="grid grid-cols-4 place-content-center gap-2" aria-hidden="true">
      {Array.from({ length: 12 }, (_, i) => (
        <BrandTile key={i} badge />
      ))}
    </div>
  );
}

/* Geometry of the need illustration, in px of the 118px-tall inner area:
   chip column is 4 x 24px + 3 x 4px gaps = 108px, centered (top 5), so chip centers sit at 17, 45, 73, 101.
   right column is a 32px box + 3 x 18px pills + 3 x 4px gaps = 98px, centered (top 10), so the box center is 26. */
const CHIP_Y = [17, 45, 73, 101];
const BOX_Y = 26;

function NeedIllustration() {
  return (
    <div className="flex h-full w-full items-stretch px-3">
      <div className="flex flex-col justify-center gap-1" aria-hidden="true">
        {CHIP_Y.map((y) => (
          <BrandTile key={y} small />
        ))}
      </div>
      <div className="relative min-w-6 flex-1">
        <svg
          viewBox="0 0 100 118"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          {CHIP_Y.map((y) => (
            <path
              key={y}
              d={`M0 ${y} C 50 ${y}, 50 ${BOX_Y}, 100 ${BOX_Y}`}
              fill="none"
              stroke="var(--rule)"
              strokeWidth={1.5}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
      </div>
      <div className="flex flex-col justify-center gap-1">
        <div className="bubble-sm flex h-8 items-center gap-1.5 border border-accent bg-accent-soft/40 px-3 py-2">
          <Blocks size={16} className="text-accent" aria-hidden="true" />
          <span className="label text-accent">Builder</span>
        </div>
        {["Rich cards", "Carousels", "Suggested replies"].map((p) => (
          <span
            key={p}
            className="flex h-[18px] items-center self-start whitespace-nowrap rounded-full border border-rule bg-surface px-2 text-[11px] text-body"
          >
            {p}
          </span>
        ))}
      </div>
    </div>
  );
}

type Panel = { title: string; statement: string; illustration: ReactNode };

const panels: Panel[] = [
  { title: "The shift", statement: "Brands move from SMS to RCS on their own.", illustration: <ShiftIllustration /> },
  { title: "The agents", statement: "Every brand will soon have an RCS agent.", illustration: <AgentsIllustration /> },
  {
    title: "The need",
    statement: "All of them will need a builder for the rich features.",
    illustration: <NeedIllustration />,
  },
];

export function TheBet() {
  return (
    <div>
      <ol className="grid gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-stretch">
        {panels.map((p, i) => [
          <li key={p.title} className="bubble-sm flex flex-col border border-rule bg-bg p-4">
            <div className="mb-3 flex items-center gap-2">
              <span className="num grid h-5 w-5 place-items-center rounded-full bg-accent-soft text-[11px] text-accent">
                {i + 1}
              </span>
              <span className="label text-ink">{p.title}</span>
            </div>
            <div className="flex h-[120px] items-center justify-center overflow-hidden rounded-[10px] border border-rule bg-surface">
              {p.illustration}
            </div>
            <p className="mt-3 text-[14.5px] font-semibold leading-snug text-ink">{p.statement}</p>
          </li>,
          i < panels.length - 1 && (
            <li key={`${p.title}-so`} aria-hidden="true" className="flex flex-col items-center justify-center gap-1">
              <ArrowRight size={16} className="hidden text-muted sm:block" />
              <ArrowDown size={16} className="text-muted sm:hidden" />
              <span className="label text-muted">so</span>
            </li>
          ),
        ])}
      </ol>
      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-rule pt-4">
        <span className="bubble-sm inline-flex items-center gap-1.5 border border-dashed border-rule px-3 py-1.5 text-[13px] text-muted">
          <Lightbulb size={14} aria-hidden="true" />
          Hackathon project
        </span>
        <ArrowRight size={16} className="text-muted" aria-hidden="true" />
        <span className="bubble-sm inline-flex items-center gap-1.5 border border-accent bg-accent-soft/40 px-3 py-1.5 text-[13px] font-semibold text-ink">
          <UserPlus size={14} className="text-accent" aria-hidden="true" />
          RCS Studio, a self-serve product
        </span>
        <span className="ml-auto text-[12.5px] text-muted">Public sign-up, a first for Vibes</span>
      </div>
    </div>
  );
}
