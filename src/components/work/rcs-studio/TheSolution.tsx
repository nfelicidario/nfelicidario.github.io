import { ArrowDown, ArrowRight, Blocks, CodeXml, Mail, ShieldCheck, UserRound, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* Slide 3: the product's shape before and after. Provisioning moves from email threads outside the
   product to step one inside it, for customers and for the operations team. */

function Row({ Icon, title, line, tone }: { Icon: LucideIcon; title: string; line: string; tone: "accent" | "plain" | "muted" }) {
  const box =
    tone === "accent" ? "border-accent bg-accent-soft/50" : tone === "plain" ? "border-rule bg-surface" : "border-dashed border-rule bg-transparent";
  const icon = tone === "accent" ? "bg-accent text-bg" : tone === "plain" ? "bg-raised text-ink" : "bg-transparent text-muted";
  return (
    <div className={`flex items-center gap-3 rounded-[10px] border px-3 py-2.5 ${box}`}>
      <span aria-hidden="true" className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${icon}`}>
        <Icon size={15} />
      </span>
      <div className="min-w-0">
        <div className={`text-[13.5px] font-semibold ${tone === "muted" ? "text-muted" : "text-ink"}`}>{title}</div>
        <div className="text-[12px] leading-snug text-muted">{line}</div>
      </div>
    </div>
  );
}

function Product({ label, children, accent }: { label: string; children: React.ReactNode; accent?: boolean }) {
  return (
    <div className={`rounded-[12px] border p-3 ${accent ? "border-accent bg-surface" : "border-rule bg-surface"}`}>
      <div className={`label mb-2 ${accent ? "text-accent" : ""}`}>{label}</div>
      <div className="grid gap-2">{children}</div>
    </div>
  );
}

export function TheSolution() {
  return (
    <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-stretch">
      {/* before */}
      <div className="bubble-sm flex flex-col gap-3 border border-dashed border-rule bg-bg p-4">
        <div>
          <div className="label">Before</div>
          <div className="mt-0.5 text-[18px] font-bold leading-tight text-ink">A flow builder, with provisioning outside it</div>
        </div>
        <Product label="RCS Studio">
          <Row Icon={Blocks} title="Flow builder" line="For technical developers. Nothing to send from until an agent exists." tone="plain" />
        </Product>
        <div className="grid gap-2">
          <div className="label text-muted">Outside the product, by hand</div>
          <Row Icon={Mail} title="Email threads" line="Customers send details. The operations team forwards them on." tone="muted" />
          <Row Icon={Users} title="Operations team" line="No tooling. Weeks per agent, and no room to scale." tone="muted" />
        </div>
      </div>

      <div aria-hidden="true" className="flex items-center justify-center text-muted">
        <ArrowRight size={18} className="hidden md:block" />
        <ArrowDown size={18} className="md:hidden" />
      </div>

      {/* after */}
      <div className="bubble-sm flex flex-col gap-3 border border-accent bg-accent-soft/30 p-4">
        <div>
          <div className="label text-accent">After</div>
          <div className="mt-0.5 text-[18px] font-bold leading-tight text-ink">A provisioning platform, with the builder as step two</div>
        </div>
        <Product label="RCS Studio" accent>
          <Row Icon={ShieldCheck} title="1 · Provision" line="Everyone starts here. Get an RCS agent live." tone="accent" />
          <div className="ml-4 grid gap-2 border-l-2 border-accent-soft pl-3">
            <Row Icon={UserRound} title="Customers" line="A guided form. Agent live on their own." tone="plain" />
            <Row Icon={Users} title="Operations team" line="One place to see and act on submissions." tone="plain" />
          </div>
          <Row Icon={CodeXml} title="2 · Build" line="The flow builder, for technical developers, the original target user." tone="plain" />
        </Product>
      </div>
    </div>
  );
}
