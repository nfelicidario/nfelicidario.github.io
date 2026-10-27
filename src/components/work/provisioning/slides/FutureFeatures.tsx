import { GitPullRequestArrow, LayoutTemplate, LifeBuoy } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* Slide 9: what comes next for the admin. */

const items: { Icon: LucideIcon; title: string; text: string }[] = [
  { Icon: LayoutTemplate, title: "Advanced templates", text: "Every partner's form prefilled from the main submission, so copy and paste disappears" },
  { Icon: LifeBuoy, title: "Triage support", text: "Support cases land next to the account and its submissions, instead of in another inbox" },
  { Icon: GitPullRequestArrow, title: "Provisioning requests", text: "Customer requests and partner submissions as two first-class objects, for every sender type" },
];

export function FutureFeatures() {
  return (
    <ul className="grid gap-3 sm:grid-cols-3">
      {items.map(({ Icon, title, text }) => (
        <li key={title} className="bubble-sm border border-dashed border-rule bg-bg p-4">
          <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-full bg-accent-soft text-accent">
            <Icon size={15} />
          </span>
          <div className="mt-3 text-[15px] font-semibold leading-snug text-ink">{title}</div>
          <div className="mt-1 text-[13px] leading-snug text-body">{text}</div>
        </li>
      ))}
    </ul>
  );
}
