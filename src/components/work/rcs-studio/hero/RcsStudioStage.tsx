"use client";

import { HeroStage } from "@/components/case/HeroStage";
import { RcsStudioHero, rcsStudioStills } from "./RcsStudioHero";

export function RcsStudioStage() {
  return (
    <HeroStage
      label="RCS Studio, recreated with mock data"
      interactive={<RcsStudioHero />}
      autoplay={<RcsStudioHero autoplay />}
      stills={rcsStudioStills}
    />
  );
}
