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
      gif={{ src: "/work/provisioning/hero.gif", alt: "A request fanning out to ten portals collapses into one admin surface; a guided intake goes live" }}
      stills={provisioningStills}
    />
  );
}
