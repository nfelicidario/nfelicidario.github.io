"use client";

import { HeroStage } from "@/components/case/HeroStage";
import { VibesAdminHero, vibesAdminStills } from "./VibesAdminHero";

export function VibesAdminStage() {
  return (
    <HeroStage
      label="Vibes Admin, abstracted with mock data"
      interactive={<VibesAdminHero />}
      autoplay={<VibesAdminHero autoplay />}
      stills={vibesAdminStills}
      frame={false}
    />
  );
}
