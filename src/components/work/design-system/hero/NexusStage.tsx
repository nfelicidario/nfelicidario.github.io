"use client";

import { HeroStage } from "@/components/case/HeroStage";
import { NexusHero, nexusStills } from "./NexusHero";

export function NexusStage() {
  return (
    <HeroStage
      label="Nexus, the promotion model, with mock pages"
      interactive={<NexusHero />}
      autoplay={<NexusHero autoplay />}
      stills={nexusStills}
      frame={false}
    />
  );
}
