"use client";

import { HeroStage } from "@/components/case/HeroStage";
import { TeamFasterHero, teamFasterStills } from "./TeamFasterHero";

export function TeamFasterStage() {
  return (
    <HeroStage
      label="A way of working, abstracted"
      interactive={<TeamFasterHero />}
      autoplay={<TeamFasterHero autoplay />}
      stills={teamFasterStills}
    />
  );
}
