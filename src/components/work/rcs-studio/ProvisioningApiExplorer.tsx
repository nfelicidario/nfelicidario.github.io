"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { ReactNode } from "react";

/* Slide 6: an IDE-style explorer for the Provisioning API. Endpoints, SDK, and payloads are illustrative. */

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
  args: string | null;
  response: string;
};

const BASE = "https://api.rcs-studio.example";

const endpoints: Endpoint[] = [
  {
    method: "POST",
    path: "/v1/brands",
    sdk: "brands.create",
    args: `{ "name": "Acme Coffee", "website": "acmecoffee.com" }`,
    response: `{ "id": "brd_7f3a", "name": "Acme Coffee", "status": "in_review" }`,
  },
  {
    method: "GET",
    path: "/v1/brands/{id}",
    sdk: "brands.get",
    args: `"brd_7f3a"`,
    response: `{ "id": "brd_7f3a", "status": "approved", "verified_at": "2026-03-04T15:12:00Z" }`,
  },
  {
    method: "POST",
    path: "/v1/agents",
    sdk: "agents.create",
    args: `{ "brand_id": "brd_7f3a", "display_name": "Acme Coffee" }`,
    response: `{ "id": "agt_2c91", "brand_id": "brd_7f3a", "status": "in_review" }`,
  },
  {
    method: "GET",
    path: "/v1/agents/{id}",
    sdk: "agents.get",
    args: `"agt_2c91"`,
    response: `{ "id": "agt_2c91", "status": "in_review", "launch_stage": "agent_verification", "next": "campaign_review" }`,
  },
  {
    method: "POST",
    path: "/v1/campaigns",
    sdk: "campaigns.create",
    args: `{ "agent_id": "agt_2c91", "use_case": "promotions" }`,
    response: `{ "id": "cmp_e04d", "agent_id": "agt_2c91", "status": "pending" }`,
  },
  {
    method: "GET",
    path: "/v1/agents/{id}/launch",
    sdk: "agents.launch",
    args: `"agt_2c91"`,
    response: `{ "stages": ["submitted", "brand_verified", "agent_verified", "campaign_approved", "live"], "current": "agent_verified" }`,
  },
];

function code(e: Endpoint, lang: Lang): string {
  const path = e.path.replace("{id}", e.args && e.args.startsWith('"') ? e.args.slice(1, -1) : "{id}");
  const body = e.method === "POST" ? e.args : null;
  if (lang === "curl") {
    return [
      `curl -X ${e.method} ${BASE}${path} \\`,
      `  -H "Authorization: Bearer $RCS_STUDIO_API_KEY" \\`,
      ...(body ? [`  -H "Content-Type: application/json" \\`, `  -d '${body}'`] : []),
    ]
      .join("\n")
      .replace(/ \\$/, "");
  }
  const [ns, fn] = e.sdk.split(".");
  if (lang === "node") {
    return [
      `import { RcsStudio } from "@vibes/rcs-studio";`,
      ``,
      `const studio = new RcsStudio({ apiKey: process.env.RCS_STUDIO_API_KEY });`,
      ``,
      `const result = await studio.${ns}.${fn}(${e.args ?? ""});`,
      `console.log(result.status); // "${JSON.parse(e.response).status ?? "ok"}"`,
    ].join("\n");
  }
  const pyArgs = e.args ? e.args.replace(/"(\w+)":/g, "$1=").replace(/^\{ | \}$/g, "") : "";
  return [
    `from rcs_studio import RcsStudio`,
    ``,
    `studio = RcsStudio(api_key=os.environ["RCS_STUDIO_API_KEY"])`,
    ``,
    `result = studio.${ns}.${fn}(${pyArgs})`,
    `print(result.status)  # "${JSON.parse(e.response).status ?? "ok"}"`,
  ].join("\n");
}

const KEYWORDS = /^(import|from|const|new|await|export|return|async|def|print|curl)$/;

/** a tiny highlighter: strings, comments, keywords, numbers */
function highlight(line: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /("[^"]*"|'[^']*'|\/\/.*$|#.*$|\b\d+\b|[A-Za-z_$][\w$]*|\s+|.)/g;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(line))) {
    const t = m[0];
    let cls = "";
    if (t.startsWith('"') || t.startsWith("'")) cls = "text-[var(--ok)]";
    else if (t.startsWith("//") || t.startsWith("#")) cls = "text-muted";
    else if (KEYWORDS.test(t)) cls = "text-accent";
    else if (/^\d+$/.test(t)) cls = "text-[var(--warn)]";
    out.push(
      cls ? (
        <span key={k++} className={cls}>
          {t}
        </span>
      ) : (
        t
      ),
    );
  }
  return out;
}

function Editor({ text, label }: { text: string; label?: string }) {
  const lines = text.split("\n");
  return (
    <div className="relative">
      {label && <div className="label mb-1.5">{label}</div>}
      <pre className="grid overflow-x-auto rounded-[10px] border border-rule bg-surface py-3 font-mono text-[12.5px] leading-[1.7] text-ink">
        {lines.map((l, i) => (
          <div key={i} className="grid grid-cols-[2.5rem_1fr] pr-4">
            <span aria-hidden="true" className="num select-none pr-3 text-right text-muted/70">
              {i + 1}
            </span>
            <code>{highlight(l)}</code>
          </div>
        ))}
      </pre>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(text).then(() => {
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        });
      }}
      className="inline-flex items-center gap-1.5 rounded-full border border-rule bg-surface px-3 py-1.5 text-[12px] font-medium text-ink transition-colors hover:border-accent hover:text-accent"
    >
      {done ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
      {done ? "Copied" : "Copy code"}
    </button>
  );
}

export function ProvisioningApiExplorer() {
  const [ei, setEi] = useState(0);
  const [lang, setLang] = useState<Lang>("node");
  const e = endpoints[ei];
  const request = code(e, lang);
  const response = JSON.stringify(JSON.parse(e.response), null, 2);
  return (
    <div>
      <div className="label mb-3">Provisioning API</div>
      <div className="bubble overflow-hidden border border-rule bg-bg">
        {/* header row 1: endpoints */}
        <div role="tablist" aria-label="Endpoints" className="flex gap-1 overflow-x-auto border-b border-rule px-2 pt-2">
          {endpoints.map((ep, k) => {
            const on = k === ei;
            return (
              <button
                key={ep.method + ep.path}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setEi(k)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-t-[8px] border-b-2 px-3 py-2 font-mono text-[12px] transition-colors ${
                  on ? "border-accent bg-surface text-ink" : "border-transparent text-muted hover:text-ink"
                }`}
              >
                <span className={`rounded-full px-1.5 text-[9.5px] font-bold ${ep.method === "POST" ? "bg-accent text-bg" : "bg-raised text-ink"}`}>
                  {ep.method}
                </span>
                {ep.path}
              </button>
            );
          })}
        </div>
        {/* header row 2: languages */}
        <div role="tablist" aria-label="Language" className="flex gap-1 border-b border-rule bg-surface px-3 py-2">
          {LANGS.map((l) => {
            const on = l.id === lang;
            return (
              <button
                key={l.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setLang(l.id)}
                className={`rounded-full border px-2.5 py-1 text-[12px] font-medium transition-colors ${
                  on ? "border-accent bg-accent-soft text-accent" : "border-transparent text-muted hover:text-ink"
                }`}
              >
                {l.label}
              </button>
            );
          })}
        </div>
        <div className="grid gap-4 p-4">
          <Editor text={request} />
          <Editor text={response} label={`Response · ${e.method === "POST" ? "201" : "200"}`} />
          <div>
            <CopyButton text={request} />
          </div>
        </div>
      </div>
      <p className="mt-2 text-[11.5px] text-muted">Illustrative endpoints, SDK, and payloads.</p>
    </div>
  );
}
