import { Film, Link2, Play, Presentation } from "lucide-react";

/* Slide 5: kickoff, video walkthrough, then the prototype URL as the ongoing reference. Mock, abstract. */

export function Walkthrough() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="bubble-sm border border-rule bg-bg p-4">
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="grid h-7 w-7 place-items-center rounded-full bg-accent-soft text-accent"><Presentation size={13} /></span>
            <span className="text-[13.5px] font-semibold text-ink">Kickoff</span>
          </div>
          <p className="mt-2 text-[12.5px] leading-snug text-muted">Live, with the developers. The why, the flow, the open questions.</p>
        </div>
        <div className="bubble-sm border border-rule bg-bg p-4">
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="grid h-7 w-7 place-items-center rounded-full bg-accent-soft text-accent"><Film size={13} /></span>
            <span className="text-[13.5px] font-semibold text-ink">Video walkthrough</span>
          </div>
          <div className="mt-2 grid aspect-video place-items-center rounded-[8px] border border-rule bg-raised" aria-hidden="true">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-bg"><Play size={13} /></span>
          </div>
          <p className="mt-2 text-[12.5px] leading-snug text-muted">Recorded once, for anyone who missed it and as the reference later.</p>
        </div>
        <div className="bubble-sm border border-accent bg-surface p-4 sm:col-span-2">
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="grid h-7 w-7 place-items-center rounded-full bg-accent text-bg"><Link2 size={13} /></span>
            <span className="text-[13.5px] font-semibold text-ink">The prototype URL</span>
            <span className="label ml-auto rounded-full bg-accent-soft px-2 py-0.5 text-accent">the reference</span>
          </div>
          <div className="mt-2 flex items-center gap-2 rounded-[8px] border border-rule bg-bg px-3 py-1.5 font-mono text-[11.5px] text-muted">
            <span className="h-2 w-2 rounded-full bg-ok" aria-hidden="true" />
            proto-submissions.uat.example
          </div>
          <p className="mt-2 text-[12.5px] leading-snug text-muted">It stays interactive and runs on real constraints: the closest thing to the shipped experience, closer than any Figma file.</p>
        </div>
      </div>
      <div className="bubble-sm overflow-hidden border border-rule bg-bg">
        <div className="label border-b border-rule px-4 py-2.5">What the reference is</div>
        <table className="w-full text-[12.5px]">
          <thead>
            <tr className="label text-muted">
              <th className="px-4 py-2 text-left font-semibold">Question</th>
              <th className="px-2 py-2 text-left font-semibold">Figma file</th>
              <th className="px-4 py-2 text-left font-semibold">Prototype</th>
            </tr>
          </thead>
          <tbody className="text-body">
            {[
              ["Can I click it?", "Partly", "Yes"],
              ["Real constraints?", "No", "Yes"],
              ["Matches what ships?", "Roughly", "It is the start of it"],
              ["Where's the latest?", "Which page?", "One URL"],
              ["Can AI read it?", "No", "Yes, it's code"],
            ].map(([q, a, b]) => (
              <tr key={q} className="border-t border-rule">
                <td className="px-4 py-2 text-ink">{q}</td>
                <td className="px-2 py-2 text-muted">{a}</td>
                <td className="px-4 py-2 font-semibold text-accent">{b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
