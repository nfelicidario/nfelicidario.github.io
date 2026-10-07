"use client";

import { HeroStage } from "@/components/case/HeroStage";
import { RcsStudioHero, rcsStudioStills } from "./RcsStudioHero";

export function RcsStudioStage() {
  return (
    <HeroStage
      label="RCS Studio, recreated with mock data"
      interactive={<RcsStudioHero />}
      autoplay={<RcsStudioHero autoplay />}
      gif={{ src: "/work/rcs-studio/hero.gif", alt: "An RCS conversation, then sign-up, provisioning, review, and a live agent, with mock data" }}
      stills={rcsStudioStills}
      frame={false}
    />
  );
}
