"use client";

import { useState } from "react";

/* Slide 6: a small explorer for the Provisioning API. Endpoint names and payloads are illustrative, not the real contract. */

type Endpoint = {
  method: "POST" | "GET";
  path: string;
  summary: string;
  response: string;
};

const endpoints: Endpoint[] = [
  {
    method: "POST",
    path: "/v1/brands",
    summary: "Register the business that will be sending.",
    response: `{
  "id": "brd_7f3a",
  "name": "Acme Coffee",
  "status": "in_review"
}`,
  },
  {
    method: "GET",
    path: "/v1/brands/{id}",
    summary: "Brand verification status.",
    response: `{
  "id": "brd_7f3a",
  "status": "approved",
  "verified_at": "2026-03-04T15:12:00Z"
}`,
  },
  {
    method: "POST",
    path: "/v1/agents",
    summary: "Register an RCS agent under a verified brand.",
    response: `{
  "id": "agt_2c91",
  "brand_id": "brd_7f3a",
  "display_name": "Acme Coffee",
  "status": "in_review"
}`,
  },
  {
    method: "GET",
    path: "/v1/agents/{id}",
    summary: "Agent status and where it sits on the launch path.",
    response: `{
  "id": "agt_2c91",
  "status": "in_review",
  "launch_stage": "agent_verification",
  "next": "campaign_review"
}`,
  },
  {
    method: "POST",
    path: "/v1/campaigns",
    summary: "Submit the first campaign for review.",
    response: `{
  "id": "cmp_e04d",
  "agent_id": "agt_2c91",
  "status": "pending"
}`,
  },
  {
    method: "GET",
    path: "/v1/agents/{id}/launch",
    summary: "The full launch progression, stage by stage.",
    response: `{
  "stages": [
    { "name": "submitted",         "done": true },
    { "name": "brand_verified",    "done": true },
    { "name": "agent_verified",    "done": false },
    { "name": "campaign_approved", "done": false },
    { "name": "live",              "done": false }
  ]
}`,
  },
];

export function ProvisioningApiExplorer() {
  const [i, setI] = useState(0);
  const e = endpoints[i];
  return (
    <div>
      <div className="label mb-3">Provisioning API</div>
      <div className="grid gap-3 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <ul className="grid gap-1.5" role="tablist" aria-label="Endpoints">
          {endpoints.map((ep, k) => {
            const on = k === i;
            return (
              <li key={ep.path + ep.method}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setI(k)}
                  className={`flex w-full items-center gap-2.5 rounded-[8px] border px-3 py-2 text-left transition-colors ${
                    on ? "border-accent bg-accent-soft/50" : "border-rule bg-bg hover:border-accent"
                  }`}
                >
                  <span
                    className={`num w-11 shrink-0 rounded-full px-1.5 py-0.5 text-center font-mono text-[10px] font-bold ${
                      ep.method === "POST" ? "bg-accent text-bg" : "bg-raised text-ink"
                    }`}
                  >
                    {ep.method}
                  </span>
                  <span className={`truncate font-mono text-[12.5px] ${on ? "text-ink" : "text-body"}`}>{ep.path}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <div role="tabpanel" className="bubble-sm border border-rule bg-bg p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="num rounded-full bg-raised px-1.5 py-0.5 font-mono text-[10px] font-bold text-ink">{e.method}</span>
            <span className="font-mono text-[13px] font-semibold text-ink">{e.path}</span>
          </div>
          <p className="mt-1.5 text-[13px] text-body">{e.summary}</p>
          <div className="label mt-3 mb-1.5">Response</div>
          <pre className="overflow-x-auto rounded-[8px] border border-rule bg-surface p-3 font-mono text-[11.5px] leading-relaxed text-ink">
            {e.response}
          </pre>
        </div>
      </div>
      <p className="mt-2 text-[11.5px] text-muted">Illustrative endpoints and payloads.</p>
    </div>
  );
}
