"use client";

import { HeroStage } from "@/components/case/HeroStage";
import { StrideHero, strideStills } from "./StrideHero";

export function StrideStage() {
  return (
    <HeroStage
      label="Development Journey Tracks, recreated with mock data"
      interactive={<StrideHero />}
      autoplay={<StrideHero autoplay />}
      gif={{ src: "/work/stride/hero.gif", alt: "A learner receives a Stride micro-learning in Slack, brings it to a coach, and the track advances" }}
      stills={strideStills}
    />
  );
}
