"use client";

import { HeroStage } from "@/components/case/HeroStage";
import { StrideHero, strideStills } from "./StrideHero";

export function StrideStage() {
  return (
    <HeroStage
      label="Development Journey Tracks, recreated with mock data"
      interactive={<StrideHero />}
      autoplay={<StrideHero autoplay />}
      stills={strideStills}
    />
  );
}
