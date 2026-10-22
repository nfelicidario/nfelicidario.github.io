
/* Slide 1: the four bets the company made (TheBet), and the timeline that led to the project (BetsTimeline). */

const bets: { text: string; example?: string }[] = [
  { text: "RCS will replace SMS" },
  { text: "Every brand will have an RCS agent" },
  { text: "The industry will need a builder to create RCS experiences" },
  { text: "Developers will lead the building of flows", example: "ex: Shopify marketplace" },
];

type Moment = { at: string; what: string; next?: boolean };

const moments: Moment[] = [
  { at: "Oct 2024", what: "Apple enables RCS for business messaging" },
  { at: "Nov 2024", what: "Vibes bets on RCS" },
  { at: "Jan 2025", what: "Hackathon kicks off flow builder project" },
  { at: "Aug 2025", what: "Nolan joins the team" },
  { at: "Next", what: "Make the flow builder usable", next: true },
];

function Dot({ next }: { next?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`block h-3 w-3 rounded-full border-2 ${next ? "border-accent bg-bg" : "border-bg bg-ink"}`}
    />
  );
}

export function BetsTimeline() {
  const n = moments.length;
  const step = 100 / n;
  const center = (i: number) => `${step * i + step / 2}%`;
  const lastSolid = n - 2;
  return (
    <>
      {/* wide: horizontal */}
      <div className="hidden sm:block">
        <div className="relative h-3">
          <span
            aria-hidden="true"
            className="absolute top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-rule"
            style={{ left: center(0), width: `calc(${center(lastSolid)} - ${center(0)})` }}
          />
          <span
            aria-hidden="true"
            className="absolute top-1/2 border-t-2 border-dashed border-accent"
            style={{ left: center(lastSolid), width: `calc(${center(n - 1)} - ${center(lastSolid)})` }}
          />
          {moments.map((m, i) => (
            <span key={m.what} className="absolute top-0 -translate-x-1/2" style={{ left: center(i) }}>
              <Dot next={m.next} />
            </span>
          ))}
        </div>
        <ol className="mt-2.5 grid text-center text-[12.5px] leading-tight" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
          {moments.map((m) => (
            <li key={m.what} className="px-1">
              <span className={`num block font-semibold ${m.next ? "text-accent" : "text-ink"}`}>{m.at}</span>
              <span className={`mt-0.5 block ${m.next ? "text-accent" : "text-muted"}`}>{m.what}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* narrow: vertical */}
      <ol className="grid sm:hidden">
        {moments.map((m, i) => (
          <li
            key={m.what}
            className={`relative ml-[5px] border-l-2 pb-4 pl-5 text-[13px] leading-tight last:border-transparent last:pb-0 ${
              i === lastSolid ? "border-dashed border-accent" : "border-rule"
            }`}
          >
            <span className="absolute -top-0.5" style={{ left: -7 }}>
              <Dot next={m.next} />
            </span>
            <span className={`num font-semibold ${m.next ? "text-accent" : "text-ink"}`}>{m.at}</span>
            <span className={`ml-2 ${m.next ? "text-accent" : "text-muted"}`}>{m.what}</span>
          </li>
        ))}
      </ol>
    </>
  );
}

export function TheBet() {
  return (
    <div>
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {bets.map((b, i) => (
          <li key={b.text} className="bubble-sm flex items-center gap-3 border border-rule bg-bg p-4">
            <span className="num grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent-soft text-[12px] font-semibold text-accent">
              {i + 1}
            </span>
            <p className="text-[15px] font-semibold leading-snug text-ink">
              {b.text}
              {b.example && <span className="mt-1 block text-[13px] font-normal text-muted">{b.example}</span>}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
