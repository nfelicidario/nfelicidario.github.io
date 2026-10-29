import { Stats } from "@/components/case/CaseLayout";

/* Slide 8: the numbers, in one place. Rounded, from internal notes; the per-sender bars are today's effort. */

const effort = [
  { sender: "Short Code", minutes: 230 },
  { sender: "RCS agent", minutes: 205 },
  { sender: "10DLC", minutes: 180 },
  { sender: "Toll-free", minutes: 140 },
];

export function AdminOutcomes() {
  const max = Math.max(...effort.map((e) => e.minutes));
  return (
    <div className="grid gap-4">
      <Stats
        items={[
          { value: "100%", label: "of RCS agent requests now arrive as structured data" },
          { value: "10 → 6", label: "interfaces per request, with 1 as the target" },
          { value: "~1 hr", label: "cut from every RCS agent's provisioning time, from about 4 hours" },
          { value: "2 → 4", label: "sender types on one shape: RCS live, toll-free in alpha, two more next" },
        ]}
      />
      <div className="bubble-sm border border-rule bg-bg p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div className="label">Operations time per sender today</div>
          <div className="text-[11.5px] text-muted">minutes per unit, every sender type the team provisions</div>
        </div>
        <ul className="mt-3 grid gap-2">
          {effort.map((e) => (
            <li key={e.sender} className="grid grid-cols-[88px_1fr_56px] items-center gap-3 text-[12.5px]">
              <span className="font-medium text-ink">{e.sender}</span>
              <span className="h-2.5 overflow-hidden rounded-full bg-raised">
                <span className={`block h-full rounded-full ${e.sender === "RCS agent" ? "bg-accent" : "bg-rule"}`} style={{ width: `${(e.minutes / max) * 100}%` }} />
              </span>
              <span className="num text-right text-muted">{e.minutes} min</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[11.5px] text-muted">RCS is the first sender type on the new flow. The projection, once submissions are templated: capacity per person nearly doubles.</p>
      </div>
      <Stats
        items={[
          { value: "1", label: "structured record per request, instead of an email thread" },
          { value: "0", label: "emails to the verification vendor, that step is now automated" },
          { value: "0", label: "copy and paste, once templates cover every partner" },
        ]}
      />
    </div>
  );
}
