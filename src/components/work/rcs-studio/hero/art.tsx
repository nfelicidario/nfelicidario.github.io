"use client";

import { useEffect, useSyncExternalStore, type ComponentType, type CSSProperties, type ReactNode } from "react";
import type { ArtKey } from "./script";

/**
 * The card art for the RCS Studio hero: five small vector illustrations drawn as one set, so
 * the deal cards, the upsell, and the order confirmation read like one photo shoot.
 *
 * The duotone system is a fixed warm neutral palette. It does not read the phone's brand
 * color, so the art looks the same whatever color the viewer picks:
 *  - key: a muted ochre, for the subject's main mass (a patty, a jug, a carton)
 *  - deep: a warm umber, for lids, stems, straws, and other small accents
 *  - tint: a warm sand, for buns, cups, and bags
 *  - pale: a fainter warm gray, for ground shadows and secondary shapes
 *  - light: an off-white, for cream, cheese, highlights, and the receipt
 *  - ground: a warm off-white
 * Only circles, ellipses, rounded rectangles, and a few soft paths; no text inside the art.
 *
 * Every illustration shares one viewBox, `ART_W` x `ART_H` (320 x 112, the short card media
 * height at the wide 92% cards), and is drawn to `preserveAspectRatio="xMidYMid slice"`, so it
 * fills the media area of any card width. Subjects stay inside the center 245 px, which is what
 * the narrower 72% carousel cards show.
 *
 * `CardMedia` renders the illustration, or a photo in its place once the photo at `photo`
 * is known to exist: the file is probed with an Image() once per session and swapped in only
 * when it loads, so a missing file costs one failed request and shows the drawing.
 */

export const ART_W = 320;
export const ART_H = 112;

const TONES = {
  "--art-key": "#c2944f",
  "--art-deep": "#6e5436",
  "--art-tint": "#e6d3b3",
  "--art-pale": "#ebe4d8",
  "--art-light": "#fffdf8",
  "--art-ground": "#f6f1e8",
} as CSSProperties;

function Frame({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox={`0 0 ${ART_W} ${ART_H}`}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      style={{ display: "block", ...TONES }}
    >
      <rect width={ART_W} height={ART_H} fill="var(--art-ground)" />
      {children}
    </svg>
  );
}

/** the soft ground shadow every subject sits on */
function Shadow({ cx, rx }: { cx: number; rx: number }) {
  return <ellipse cx={cx} cy={99} rx={rx} ry={5} fill="var(--art-pale)" />;
}

function Burger({ x }: { x: number }) {
  return (
    <g>
      <rect x={x - 32} y={74} width={64} height={15} rx={7} fill="var(--art-tint)" />
      <rect x={x - 35} y={64} width={70} height={12} rx={5} fill="var(--art-key)" />
      <rect x={x - 31} y={59} width={62} height={8} rx={3} fill="var(--art-light)" />
      <path d={`M${x - 35} 61a35 27 0 0 1 70 0z`} fill="var(--art-tint)" />
      <circle cx={x - 13} cy={47} r={2.4} fill="var(--art-light)" />
      <circle cx={x} cy={42} r={2.4} fill="var(--art-light)" />
      <circle cx={x + 13} cy={47} r={2.4} fill="var(--art-light)" />
    </g>
  );
}

/** two-for-one burgers: a matching pair, side by side */
export function BurgersArt() {
  return (
    <Frame>
      <Shadow cx={160} rx={96} />
      <Burger x={118} />
      <Burger x={202} />
    </Frame>
  );
}

/** family bundle: a carry bag, a jug of lemonade, and two cups */
export function FamilyBundleArt() {
  return (
    <Frame>
      <Shadow cx={160} rx={110} />
      {/* bag */}
      <rect x={60} y={38} width={80} height={58} rx={8} fill="var(--art-tint)" />
      <rect x={60} y={38} width={80} height={12} rx={4} fill="var(--art-key)" />
      <path d="M82 38a18 14 0 0 1 36 0" fill="none" stroke="var(--art-key)" strokeWidth={5} strokeLinecap="round" />
      <rect x={72} y={60} width={56} height={6} rx={3} fill="var(--art-light)" opacity={0.8} />
      {/* jug */}
      <rect x={160} y={44} width={40} height={52} rx={8} fill="var(--art-key)" />
      <rect x={156} y={38} width={48} height={9} rx={4} fill="var(--art-deep)" />
      <path d="M200 58h8a10 10 0 0 1 0 20h-8" fill="none" stroke="var(--art-deep)" strokeWidth={6} strokeLinecap="round" />
      <rect x={168} y={54} width={8} height={32} rx={4} fill="var(--art-light)" opacity={0.45} />
      {/* cups */}
      <rect x={222} y={62} width={24} height={34} rx={5} fill="var(--art-tint)" />
      <rect x={219} y={58} width={30} height={7} rx={3} fill="var(--art-key)" />
      <rect x={233} y={46} width={4} height={16} rx={2} fill="var(--art-deep)" />
      <rect x={254} y={62} width={24} height={34} rx={5} fill="var(--art-tint)" />
      <rect x={251} y={58} width={30} height={7} rx={3} fill="var(--art-key)" />
      <rect x={265} y={46} width={4} height={16} rx={2} fill="var(--art-deep)" />
    </Frame>
  );
}

/** pumpkin spice shake: a tall cup with whipped cream, a straw, and a small pumpkin */
export function PumpkinShakeArt() {
  return (
    <Frame>
      <Shadow cx={170} rx={84} />
      {/* leaves */}
      <ellipse cx={92} cy={76} rx={18} ry={9} fill="var(--art-pale)" transform="rotate(-28 92 76)" />
      <ellipse cx={74} cy={90} rx={14} ry={7} fill="var(--art-tint)" transform="rotate(18 74 90)" />
      {/* cup */}
      <path d="M126 46l8 48q0 5 5 5h42q5 0 5-5l8-48z" fill="var(--art-tint)" />
      <path d="M130 64h60l-2 14h-56z" fill="var(--art-key)" />
      {/* cream */}
      <circle cx={140} cy={50} r={14} fill="var(--art-light)" />
      <circle cx={180} cy={50} r={14} fill="var(--art-light)" />
      <circle cx={160} cy={40} r={24} fill="var(--art-light)" />
      <circle cx={150} cy={38} r={2.2} fill="var(--art-key)" />
      <circle cx={166} cy={30} r={2.2} fill="var(--art-key)" />
      <circle cx={172} cy={46} r={2.2} fill="var(--art-key)" />
      <circle cx={156} cy={52} r={2.2} fill="var(--art-key)" />
      {/* straw */}
      <rect x={172} y={2} width={7} height={38} rx={3.5} fill="var(--art-deep)" transform="rotate(12 175 21)" />
      {/* pumpkin */}
      <ellipse cx={234} cy={82} rx={13} ry={16} fill="var(--art-key)" />
      <ellipse cx={258} cy={82} rx={13} ry={16} fill="var(--art-key)" />
      <ellipse cx={246} cy={81} rx={16} ry={18} fill="var(--art-key)" />
      <ellipse cx={246} cy={81} rx={6} ry={17} fill="var(--art-light)" opacity={0.22} />
      <rect x={243} y={56} width={6} height={12} rx={2} fill="var(--art-deep)" />
    </Frame>
  );
}

/** make it a meal: a lidded drink and a carton of fries */
export function MealArt() {
  return (
    <Frame>
      <Shadow cx={172} rx={92} />
      {/* drink */}
      <path d="M100 44l6 50q0 5 5 5h40q5 0 5-5l6-50z" fill="var(--art-tint)" />
      <path d="M104 62h54l-2 14h-50z" fill="var(--art-key)" />
      <rect x={96} y={36} width={70} height={10} rx={4} fill="var(--art-key)" />
      <rect x={106} y={26} width={50} height={12} rx={5} fill="var(--art-deep)" />
      <rect x={138} y={2} width={7} height={34} rx={3.5} fill="var(--art-deep)" transform="rotate(-10 141 19)" />
      {/* fries */}
      <rect x={196} y={28} width={10} height={44} rx={4} fill="var(--art-tint)" transform="rotate(-10 201 50)" />
      <rect x={210} y={20} width={10} height={50} rx={4} fill="var(--art-tint)" transform="rotate(-4 215 45)" />
      <rect x={224} y={18} width={10} height={52} rx={4} fill="var(--art-tint)" />
      <rect x={238} y={22} width={10} height={48} rx={4} fill="var(--art-tint)" transform="rotate(5 243 46)" />
      <rect x={252} y={30} width={10} height={42} rx={4} fill="var(--art-tint)" transform="rotate(11 257 51)" />
      <path d="M186 58l8 41h70l8-41z" fill="var(--art-key)" />
      <path d="M186 58q43 14 86 0l-2 10q-41 12-82 0z" fill="var(--art-deep)" />
      <rect x={214} y={74} width={30} height={6} rx={3} fill="var(--art-light)" opacity={0.75} />
    </Frame>
  );
}

/** order confirmed: a takeout bag, a receipt, and a check */
export function ConfirmedArt() {
  return (
    <Frame>
      <Shadow cx={166} rx={84} />
      {/* bag */}
      <rect x={104} y={36} width={92} height={60} rx={8} fill="var(--art-tint)" />
      <rect x={104} y={36} width={92} height={12} rx={4} fill="var(--art-key)" />
      <path d="M128 36a22 16 0 0 1 44 0" fill="none" stroke="var(--art-key)" strokeWidth={5} strokeLinecap="round" />
      <rect x={118} y={62} width={40} height={6} rx={3} fill="var(--art-light)" opacity={0.8} />
      {/* receipt */}
      <g transform="rotate(8 206 56)">
        <rect x={178} y={20} width={56} height={72} rx={6} fill="var(--art-light)" />
        <rect x={188} y={32} width={36} height={5} rx={2.5} fill="var(--art-key)" opacity={0.55} />
        <rect x={188} y={44} width={36} height={5} rx={2.5} fill="var(--art-key)" opacity={0.55} />
        <rect x={188} y={56} width={36} height={5} rx={2.5} fill="var(--art-key)" opacity={0.55} />
        <rect x={188} y={70} width={22} height={5} rx={2.5} fill="var(--art-key)" opacity={0.55} />
      </g>
      {/* check */}
      <circle cx={240} cy={80} r={18} fill="var(--art-key)" />
      <path d="M231 80l6 6 12-12" fill="none" stroke="var(--art-light)" strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" />
    </Frame>
  );
}

/** the illustrations by the key the script uses */
export const ART: Record<ArtKey, ComponentType> = {
  burgers: BurgersArt,
  family: FamilyBundleArt,
  shake: PumpkinShakeArt,
  meal: MealArt,
  confirmed: ConfirmedArt,
};

/* ----------------------------------------------------------- photos */

/** which photo paths exist: true once loaded, false once failed, absent while unknown */
const photos = new Map<string, boolean>();
const pending = new Set<string>();
const listeners = new Set<() => void>();

function probe(src: string) {
  if (photos.has(src) || pending.has(src)) return;
  pending.add(src);
  const img = new Image();
  const settle = (ok: boolean) => () => {
    pending.delete(src);
    photos.set(src, ok);
    listeners.forEach((l) => l());
  };
  img.onload = settle(true);
  img.onerror = settle(false);
  img.src = src;
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

/** true once the photo at `src` has loaded; false on the server, while unknown, and when missing */
function usePhoto(src?: string): boolean {
  const ok = useSyncExternalStore(
    subscribe,
    () => (src ? photos.get(src) === true : false),
    () => false,
  );
  useEffect(() => {
    if (src) probe(src);
  }, [src]);
  return ok;
}

/** a card's media: the drawing for `art`, or the photo at `photo` once it is known to exist */
export function CardMedia({ art, photo }: { art: ArtKey; photo?: string }) {
  const hasPhoto = usePhoto(photo);
  const Art = ART[art];
  if (photo && hasPhoto) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={photo} alt="" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} />;
  }
  return <Art />;
}
