import Image from "next/image";

const base = "/work/stride";

function Tile({
  label,
  note,
  children,
  className = "",
}: {
  label: string;
  note?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bubble-sm flex flex-col overflow-hidden border border-rule bg-surface ${className}`}>
      {children}
      <div className="px-3 py-2">
        <div className="text-[13px] font-semibold text-ink">{label}</div>
        {note && <div className="text-[12px] text-muted">{note}</div>}
      </div>
    </div>
  );
}

function Crop({
  src,
  alt,
  width,
  height,
  aspect,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  aspect: string;
}) {
  return (
    <div className="relative w-full overflow-hidden border-b border-rule bg-raised" style={{ aspectRatio: aspect }}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="absolute inset-0 h-full w-full object-cover object-top"
      />
    </div>
  );
}

export function FoundingDesignerGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Tile label="Marketing site" note="Three redesigns, from Add to Slack to a buyer-facing pitch" className="sm:col-span-2">
        <div className="grid grid-cols-3 gap-px border-b border-rule bg-rule">
          {[1, 2, 3].map((n) => (
            <div key={n} className="relative aspect-[4/3] overflow-hidden bg-raised">
              <Image
                src={`${base}/website-iteration-${n}.png`}
                alt={`Stride marketing site, iteration ${n} of 3, top of the home page`}
                width={1560}
                height={1920}
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
              <span className="absolute left-2 top-2 rounded-full bg-surface/90 px-1.5 py-px text-[10.5px] font-semibold text-muted">
                v{n}
              </span>
            </div>
          ))}
        </div>
      </Tile>

      <Tile label="Sales deck, before" note="Ten slides about features">
        <Crop
          src={`${base}/salesDeck-before.png`}
          alt="The first Stride sales deck: ten slides laid out in a grid, titled What Stride, How It Works, and Let's Chat"
          width={2160}
          height={578}
          aspect="16 / 7"
        />
      </Tile>
      <Tile label="Sales deck, after" note="Thirty slides about the buyer's problem and the tracks">
        <Crop
          src={`${base}/salesDeck-after.png`}
          alt="The later Stride sales deck: thirty slides covering why employees quit, development journey tracks, plans, and return on investment"
          width={2160}
          height={1725}
          aspect="16 / 7"
        />
      </Tile>

      <Tile label="Brand system" note="Colors, type, icon set, illustration rules, logos">
        <Crop
          src={`${base}/branding.png`}
          alt="Stride brand guideline pages: color palette in yellow and blue, fonts, icon sheets, illustration style, and logo variants"
          width={2160}
          height={1725}
          aspect="16 / 9"
        />
      </Tile>
      <Tile label="User dashboard, redesigned" note="Goals tracker to a resource hub with favorites and messaging">
        <Crop
          src={`${base}/userDashboard-after.png`}
          alt="The redesigned Stride web dashboard: a Resources tab with featured guides on listening, favorites, popular resources, and resources on feedback"
          width={1510}
          height={1175}
          aspect="16 / 9"
        />
      </Tile>

      <div className="grid gap-3 sm:col-span-2 sm:grid-cols-4">
        {[
          ["Product videos", "Demos and walkthroughs for the site and for sales"],
          ["Email drips", "Onboarding and nurture sequences for users and prospects"],
          ["Social", "Posts and visuals, on brand without a brand team"],
          ["Seed round collateral", "Deck, visuals, a prototype, and a product video, $750K raised"],
        ].map(([t, d]) => (
          <div key={t} className="bubble-sm border border-dashed border-rule px-3 py-2.5">
            <div className="text-[13px] font-semibold text-ink">{t}</div>
            <div className="mt-0.5 text-[12px] text-muted">{d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
