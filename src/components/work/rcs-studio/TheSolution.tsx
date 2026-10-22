import Link from "next/link";
import { ArrowDown, ArrowRight, CodeXml, Megaphone, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* Slide 3: the reframe (flow builder → provisioning platform) and the target users. */

type Tone = "on" | "outline" | "missing";

const tile: Record<Tone, string> = {
  on: "border-accent bg-accent text-bg",
  outline: "border-rule bg-surface text-ink",
  missing: "border-dashed border-rule bg-transparent text-muted",
};

function StepTile({ n, label, tone }: { n: number; label: string; tone: Tone }) {
  return (
    <div className={`flex min-w-0 flex-1 items-center gap-2 rounded-[10px] border px-3 py-2.5 ${tile[tone]}`}>
      <span
        className={`num grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-semibold ${
          tone === "on" ? "bg-bg/20 text-bg" : tone === "outline" ? "bg-accent-soft text-accent" : "border border-dashed border-rule text-muted"
        }`}
      >
        {n}
      </span>
      <span className="text-[13.5px] font-semibold">{label}</span>
    </div>
  );
}

function Track({ provision, build }: { provision: Tone; build: Tone }) {
  return (
    <div className="flex items-center gap-2">
      <StepTile n={1} label="Provision" tone={provision} />
      <span aria-hidden="true" className="h-px w-4 shrink-0 bg-rule" />
      <StepTile n={2} label="Build" tone={build} />
    </div>
  );
}

type User = { name: string; line: string; Icon: LucideIcon; builds: boolean; tag?: string };

const users: User[] = [
  { name: "Technical developers", line: "Want the flow builder once an agent exists.", Icon: CodeXml, builds: true, tag: "Original target user" },
  { name: "Marketing operations", line: "Need an agent for a campaign. Have never written code.", Icon: Megaphone, builds: false },
];

export function TheSolution() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-stretch">
        <div className="bubble-sm flex flex-col gap-4 border border-dashed border-rule bg-bg p-5">
          <div>
            <div className="label">Launched as</div>
            <div className="mt-1 text-[20px] font-bold leading-tight text-ink">A flow builder</div>
          </div>
          <Track provision="missing" build="on" />
        </div>
        <div aria-hidden="true" className="flex items-center justify-center text-muted">
          <ArrowRight size={18} className="hidden md:block" />
          <ArrowDown size={18} className="md:hidden" />
        </div>
        <div className="bubble-sm flex flex-col gap-4 border border-accent bg-accent-soft/40 p-5">
          <div>
            <div className="label text-accent">Repositioned as</div>
            <div className="mt-1 text-[20px] font-bold leading-tight text-ink">A provisioning platform</div>
          </div>
          <Track provision="on" build="outline" />
        </div>
      </div>

      <div className="label mt-2">Target users</div>
      <div className="grid gap-3 md:grid-cols-2">
        {users.map(({ name, line, Icon, builds, tag }) => (
          <div key={name} className="bubble-sm flex gap-3 border border-rule bg-bg p-4">
            <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-bg">
              <Icon size={16} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="text-[14.5px] font-semibold text-ink">{name}</span>
                {tag && (
                  <span className="rounded-full border border-rule bg-surface px-2 py-0.5 text-[11px] font-medium text-muted">{tag}</span>
                )}
              </div>
              <p className="mt-0.5 text-[13px] leading-snug text-body">{line}</p>
              <div className="mt-3 max-w-[280px]">
                <Track provision="on" build={builds ? "on" : "outline"} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bubble-sm flex flex-wrap items-center gap-3 border border-rule bg-bg p-4">
        <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-raised text-ink">
          <Users size={16} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="label">Behind both · internal</div>
          <div className="text-[14.5px] font-semibold text-ink">Our operations team</div>
          <p className="text-[13px] text-body">Did the provisioning work by hand, over weeks of email.</p>
        </div>
        <Link
          href="/work/provisioning/"
          className="ml-auto inline-flex items-center gap-1 rounded-full border border-rule px-3 py-1 text-[12.5px] text-body transition-colors hover:border-accent hover:text-accent"
        >
          Next case study
          <ArrowRight size={12} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
