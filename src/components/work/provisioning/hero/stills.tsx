import type { Still } from "@/components/case/HeroStage";
import { ProvisioningFrame } from "./ProvisioningHero";

/**
 * Static frames for the carousel tier. Built here, outside the "use client"
 * module, so a server component (the page) can pass the array straight through.
 */
export const provisioningStills: Still[] = [
  {
    render: <ProvisioningFrame step={0} />,
    caption: "Before: one emailed request fans out to ten portals, 8 hours of operations effort each.",
  },
  {
    render: <ProvisioningFrame step={1} />,
    caption: "The shift: the portals collapse into one admin surface with a queue. 90 minutes per request, 10 portals to 6.",
  },
  {
    render: <ProvisioningFrame step={2} />,
    caption: "The customer side: a guided intake with a stage tracker, inline validation and field help, then a status row.",
  },
  {
    render: <ProvisioningFrame step={3} phase="live" />,
    caption: "Operations effort per request: 8 h to 90 min, measured by the operations director.",
  },
];
