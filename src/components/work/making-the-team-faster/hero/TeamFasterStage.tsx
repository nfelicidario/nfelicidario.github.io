"use client";

import { HeroStage } from "@/components/case/HeroStage";
import { TeamFasterHero, teamFasterStills } from "./TeamFasterHero";

export function TeamFasterStage() {
  return (
    <HeroStage
      label="A way of working, abstracted"
      interactive={<TeamFasterHero />}
      autoplay={<TeamFasterHero autoplay />}
      gif={{ src: "/work/making-the-team-faster/hero.gif", alt: "A project moves through the planning flow, ships from a prototype branch, and the practice spreads" }}
      stills={teamFasterStills}
    />
  );
}
