import { Stats } from "@/components/case/CaseLayout";

/* Slide 8: every number in one place. Counts carry their as-of month. */

const growth = [
  { at: "May 2026", n: 3 },
  { at: "Jul 2026", n: 48 },
  { at: "Sep 2026", n: 156 },
  { at: "Oct 2026", n: 172 },
];
const max = Math.max(...growth.map((g) => g.n));

const firsts = [
  "Public sign-up at Vibes",
  "Self-serve product at Vibes",
  "Self-serve automated provisioning",
  "Provisioning API",
  "New Vibes product in roughly a decade",
];

export function Outcomes() {
  return (
    <div className="grid gap-4">
      <Stats
        items={[
          { value: "500+", label: "RCS agents provisioned through RCS Studio" },
          { value: "100%", label: "of RCS agents now go through RCS Studio" },
          { value: "14 days", label: "median from submission to a live agent" },
          { value: "37%", label: "of agents submitted via the API, as of Oct 2026" },
        ]}
      />

      <div className="grid gap-4 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="bubble border border-rule bg-surface p-4">
          <div className="flex items-baseline justify-between gap-3">
            <div className="label">Agents through the new launch flow</div>
            <div className="num text-[12px] text-muted">cumulative</div>
          </div>
          <div className="mt-4 grid h-36 grid-cols-4 items-end gap-3" role="img" aria-label="Agents through the launch flow: 3 in May 2026, 48 by July, 156 by September, 172 in October">
            {growth.map((g, i) => (
              <div key={g.at} className="flex h-full flex-col justify-end gap-1.5">
                <div className="num text-center text-[13px] font-semibold text-ink">{g.n}</div>
                <div
                  className={`w-full rounded-t-[6px] ${i === growth.length - 1 ? "bg-accent" : "bg-accent/35"}`}
                  style={{ height: `${Math.max(4, (g.n / max) * 100)}%` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-1.5 grid grid-cols-4 gap-3">
            {growth.map((g) => (
              <div key={g.at} className="num text-center text-[11.5px] text-muted">
                {g.at}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3">
          <Stats
            items={[
              { value: "~2 min", label: "from sign-up to an agent in Test Mode" },
              { value: "96%", label: "of launch-flow submissions made without Vibes staff" },
            ]}
          />
          <Stats
            items={[
              { value: "88%", label: "of provisioning accounts moved in within weeks" },
              { value: "100×", label: "RCS message growth on Vibes in twelve months" },
            ]}
          />
        </div>
      </div>

      <div className="bubble border border-rule bg-surface p-4">
        <div className="label mb-2">Firsts</div>
        <ul className="flex flex-wrap gap-2">
          {firsts.map((f) => (
            <li key={f} className="rounded-full border border-accent bg-accent-soft px-3 py-1 text-[12.5px] font-medium text-accent">
              1st · {f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
