"use client";

import { useState } from "react";
import { BadgeCheck, BuildingComplex, Check, Copy, Megaphone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/*
 * Slide 6: a code-sample widget for the Provisioning API. Resources across the top left, languages
 * top right, the resource's endpoints in the row below. Payloads mirror the hero prototype's forms.
 * Endpoints, SDK, and payloads are illustrative.
 */

type Lang = "curl" | "node" | "python";
const LANGS: { id: Lang; label: string }[] = [
  { id: "curl", label: "cURL" },
  { id: "node", label: "Node.js" },
  { id: "python", label: "Python" },
];

type Endpoint = {
  method: "POST" | "GET";
  path: string;
  /** sdk call, e.g. brands.create */
  sdk: string;
  /** request body (POST) or id (GET) */
  body?: Record<string, string>;
  id?: string;
  response: Record<string, string | boolean>;
};

type Resource = { id: string; label: string; Icon: LucideIcon; endpoints: Endpoint[] };

const BASE = "https://api.rcs-studio.example";

const resources: Resource[] = [
  {
    id: "brands",
    label: "Brands",
    Icon: BuildingComplex,
    endpoints: [
      {
        method: "POST",
        path: "/v1/brands",
        sdk: "brands.create",
        body: { legal_name: "Nolan's Restaurant LLC", website: "nolansrestaurant.example", contact_email: "sam@nolansrestaurant.example" },
        response: { id: "brd_7f3a", status: "in_review" },
      },
      {
        method: "GET",
        path: "/v1/brands/{id}",
        sdk: "brands.get",
        id: "brd_7f3a",
        response: { id: "brd_7f3a", legal_name: "Nolan's Restaurant LLC", status: "approved", verified_at: "2026-03-04T15:12:00Z" },
      },
    ],
  },
  {
    id: "agents",
    label: "Agents",
    Icon: BadgeCheck,
    endpoints: [
      {
        method: "POST",
        path: "/v1/agents",
        sdk: "agents.create",
        body: {
          brand_id: "brd_7f3a",
          display_name: "Nolan's Restaurant",
          logo_url: "https://cdn.nolansrestaurant.example/logo.png",
          brand_color: "#1F4FE0",
          description: "Weekly specials and order updates from Nolan's Restaurant",
        },
        response: { id: "agt_2c91", status: "in_review", test_mode: true },
      },
      {
        method: "GET",
        path: "/v1/agents/{id}",
        sdk: "agents.get",
        id: "agt_2c91",
        response: { id: "agt_2c91", display_name: "Nolan's Restaurant", status: "in_review", launch_stage: "agent_verification", test_mode: true },
      },
    ],
  },
  {
    id: "campaigns",
    label: "Campaigns",
    Icon: Megaphone,
    endpoints: [
      {
        method: "POST",
        path: "/v1/campaigns",
        sdk: "campaigns.create",
        body: {
          agent_id: "agt_2c91",
          use_case: "promotions_and_offers",
          sample_message: "Hi Sam, it's Nolan's Restaurant. Check out these sweet new deals this week! Reply STOP to opt out.",
          opt_in_method: "checkbox_at_checkout",
          expected_volume: "up_to_10000_per_month",
        },
        response: { id: "cmp_e04d", status: "pending_agent_verification" },
      },
      {
        method: "GET",
        path: "/v1/campaigns/{id}",
        sdk: "campaigns.get",
        id: "cmp_e04d",
        response: { id: "cmp_e04d", agent_id: "agt_2c91", use_case: "promotions_and_offers", status: "approved" },
      },
    ],
  },
];

const json = (o: object, indent = 0) =>
  JSON.stringify(o, null, 2)
    .split("\n")
    .map((l, i) => (i === 0 ? l : " ".repeat(indent) + l))
    .join("\n");

function urlOf(e: Endpoint) {
  return BASE + e.path.replace("{id}", e.id ?? "{id}");
}

function code(e: Endpoint, lang: Lang): string {
  if (lang === "curl") {
    const lines = [`curl -X ${e.method} ${urlOf(e)} \\`, `  -H "Authorization: Bearer $RCS_STUDIO_API_KEY"`];
    if (e.body) {
      lines[1] += " \\";
      lines.push(`  -H "Content-Type: application/json" \\`, `  -d '${json(e.body, 2)}'`);
    }
    return lines.join("\n");
  }
  const [ns, fn] = e.sdk.split(".");
  const status = String(e.response.status);
  if (lang === "node") {
    const arg = e.body ? json(e.body) : `"${e.id}"`;
    return [
      `import { RcsStudio } from "@vibes/rcs-studio";`,
      ``,
      `const studio = new RcsStudio({ apiKey: process.env.RCS_STUDIO_API_KEY });`,
      ``,
      `const ${ns.slice(0, -1)} = await studio.${ns}.${fn}(${arg});`,
      `console.log(${ns.slice(0, -1)}.status); // "${status}"`,
    ].join("\n");
  }
  const arg = e.body
    ? "\n" +
      Object.entries(e.body)
        .map(([k, v]) => `    ${k}=${JSON.stringify(v)},`)
        .join("\n") +
      "\n"
    : `"${e.id}"`;
  return [
    `from rcs_studio import RcsStudio`,
    ``,
    `studio = RcsStudio(api_key=os.environ["RCS_STUDIO_API_KEY"])`,
    ``,
    `${ns.slice(0, -1)} = studio.${ns}.${fn}(${arg})`,
    `print(${ns.slice(0, -1)}.status)  # "${status}"`,
  ].join("\n");
}

const KEYWORDS = /^(import|from|const|new|await|export|return|async|def|print|curl|POST|GET|true|false)$/;

/* the editor is dark in both site themes, like a code sample */
const T = {
  panel: "#363c58",
  header: "#3d4463",
  rule: "rgba(255,255,255,0.09)",
  text: "#e1e5f2",
  muted: "#9ba3c2",
  string: "#aee6a8",
  keyword: "#f4a4c4",
  tab: "#ffffff",
};

/** a tiny highlighter: strings, comments, keywords */
function highlight(line: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /("[^"]*"|'[^']*'|\/\/.*$|#.*$|[A-Za-z_$][\w$]*|\s+|.)/g;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(line))) {
    const t = m[0];
    let color: string | undefined;
    if (t.startsWith('"') || (t.startsWith("'") && t.length > 1)) color = T.string;
    else if (t.startsWith("//") || (t.startsWith("#") && t.length > 1 && !/^#[0-9A-F]{6}$/i.test(t))) color = T.muted;
    else if (KEYWORDS.test(t)) color = T.keyword;
    out.push(
      color ? (
        <span key={k++} style={{ color }}>
          {t}
        </span>
      ) : (
        t
      ),
    );
  }
  return out;
}

function CopyIcon({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      aria-label={done ? "Copied" : "Copy code"}
      title={done ? "Copied" : "Copy code"}
      onClick={() => {
        navigator.clipboard?.writeText(text).then(() => {
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        });
      }}
      className="grid h-8 w-8 place-items-center rounded-[8px] transition-colors hover:bg-white/10"
      style={{ color: T.muted }}
    >
      {done ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
    </button>
  );
}

export function ProvisioningApiExplorer() {
  const [ri, setRi] = useState(0);
  const [ei, setEi] = useState(0);
  const [lang, setLang] = useState<Lang>("curl");
  const r = resources[ri];
  const e = r.endpoints[Math.min(ei, r.endpoints.length - 1)];
  const request = code(e, lang);
  const statusLine = `${e.method === "POST" ? "201 Created" : "200 OK"}`;
  const tabOn = { background: T.tab, color: T.panel };
  const tabOff = { color: T.muted };
  return (
    <div>
      <div className="label mb-3">Provisioning API</div>
      <div className="bubble overflow-hidden" style={{ background: T.panel, color: T.text }}>
        {/* row 1: resources left, languages right */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5" style={{ background: T.header, borderBottom: `1px solid ${T.rule}` }}>
          <div role="tablist" aria-label="Resource" className="flex gap-1">
            {resources.map((res, k) => {
              const on = k === ri;
              return (
                <button
                  key={res.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => {
                    setRi(k);
                    setEi(0);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-[9px] px-3 py-1.5 text-[13px] font-semibold transition-colors hover:text-white"
                  style={on ? tabOn : tabOff}
                >
                  <res.Icon size={14} aria-hidden="true" />
                  {res.label}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-1">
            <div role="tablist" aria-label="Language" className="flex gap-1">
              {LANGS.map((l) => {
                const on = l.id === lang;
                return (
                  <button
                    key={l.id}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => setLang(l.id)}
                    className="rounded-[9px] px-3 py-1.5 text-[13px] font-semibold transition-colors hover:text-white"
                    style={on ? tabOn : tabOff}
                  >
                    {l.label}
                  </button>
                );
              })}
            </div>
            <CopyIcon text={request} />
          </div>
        </div>

        {/* row 2: the resource's endpoints */}
        <div role="tablist" aria-label="Endpoint" className="flex flex-wrap items-center gap-1 px-3 py-2" style={{ borderBottom: `1px solid ${T.rule}` }}>
          {r.endpoints.map((ep, k) => {
            const on = ep === e;
            return (
              <button
                key={ep.method + ep.path}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setEi(k)}
                className="inline-flex items-center gap-2 rounded-[8px] px-2.5 py-1.5 font-mono text-[12.5px] transition-colors hover:text-white"
                style={on ? { background: "rgba(255,255,255,0.1)", color: T.text } : { color: T.muted }}
              >
                <span className="text-[11px] font-bold" style={{ color: ep.method === "POST" ? T.keyword : T.string }}>
                  {ep.method}
                </span>
                {ep.path}
              </button>
            );
          })}
        </div>

        {/* request */}
        <pre className="grid overflow-x-auto py-4 font-mono text-[12.5px] leading-[1.75]">
          {request.split("\n").map((l, i) => (
            <div key={i} className="grid grid-cols-[2.75rem_1fr] pr-4">
              <span aria-hidden="true" className="num select-none pr-3 text-right" style={{ color: T.muted }}>
                {i + 1}
              </span>
              <code>{highlight(l)}</code>
            </div>
          ))}
        </pre>

        {/* response */}
        <div className="flex items-start gap-2 overflow-x-auto px-4 py-3 font-mono text-[12px]" style={{ borderTop: `1px solid ${T.rule}`, color: T.muted }}>
          <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: T.string }} />
          <span className="shrink-0" style={{ color: T.string }}>
            {statusLine}
          </span>
          <code className="whitespace-nowrap">{highlight(JSON.stringify(e.response).replace(/,"/g, ', "').replace(/":/g, '": ').replace(/^\{/, "{ ").replace(/\}$/, " }"))}</code>
        </div>
      </div>
      <p className="mt-2 text-[11.5px] text-muted">Illustrative endpoints, SDK, and payloads.</p>
    </div>
  );
}
