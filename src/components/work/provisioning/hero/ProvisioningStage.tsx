"use client";

import { HeroStage } from "@/components/case/HeroStage";
import { ProvisioningHero } from "./ProvisioningHero";
import { provisioningStills } from "./stills";

export function ProvisioningStage() {
  return (
    <HeroStage
      label="Provisioning, abstracted with mock data"
      interactive={<ProvisioningHero />}
      autoplay={<ProvisioningHero autoplay />}
      stills={provisioningStills}
    />
  );
}
