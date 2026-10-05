"use client";

import { useId, useState } from "react";

type Status = "test mode" | "submitted" | "partially live" | "live" | "rejected";

const stages = ["Brand", "Campaign", "Review"] as const;

const existingRows: { sender: string; name: string; status: Status }[] = [
  { sender: "RCS", name: "Loyalty agent", status: "live" },
  { sender: "Toll-free", name: "(833) 555-0142", status: "partially live" },
  { sender: "RCS", name: "Reservations agent", status: "test mode" },
  { sender: "10DLC", name: "Appointment reminders", status: "rejected" },
];

const statusStyle: Record<Status, string> = {
  "test mode": "bg-raised text-muted",
  submitted: "bg-accent-soft text-accent",
  "partially live": "bg-warn-soft text-warn",
  live: "bg-ok-soft text-ok",
  rejected: "bg-warn-soft text-warn",
};

function validateWebsite(v: string): string | null {
  if (!v.trim()) return "Add the website customers would recognize.";
  const ok = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/.*)?$/i.test(v.trim());
  return ok ? null : "That doesn't look like a web address. Try something like poblanos.example";
}

export function IntakeForm() {
  const [stage, setStage] = useState(0);
  const [brand, setBrand] = useState("Poblano's Mexican Grill");
  const [website, setWebsite] = useState("poblanos.example");
  const [touched, setTouched] = useState(false);
  const [email, setEmail] = useState("hola@poblanos.example");
  const [useCase, setUseCase] = useState("Order-ready alerts and weekly specials for customers who opted in at checkout.");
  const [tipOpen, setTipOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const uid = useId();
  const websiteError = validateWebsite(website);
  const showError = touched && websiteError;
  const stageValid = stage === 0 ? !websiteError && brand.trim().length > 0 : stage === 1 ? email.includes("@") && useCase.trim().length > 0 : true;

  if (submitted) {
    const rows = [{ sender: "RCS", name: `${brand} agent`, status: "submitted" as Status }, ...existingRows];
    return (
      <div className="grid gap-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[13.5px] font-semibold text-ink">Your senders</span>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setStage(0);
            }}
            className="text-[12.5px] font-semibold text-accent hover:underline"
          >
            Start another request
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="label border-b border-rule">
                <th className="py-2 pr-3 font-semibold">Type</th>
                <th className="py-2 pr-3 font-semibold">Sender</th>
                <th className="py-2 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={`${r.sender}-${r.name}`} className={`border-b border-rule last:border-0 ${i === 0 ? "bg-accent-soft/40" : ""}`}>
                  <td className="py-2.5 pr-3 text-muted">{r.sender}</td>
                  <td className="py-2.5 pr-3 font-medium text-ink">{r.name}</td>
                  <td className="py-2.5">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[11.5px] font-semibold ${statusStyle[r.status]}`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[12.5px] text-muted">
          Statuses are coarse on purpose. Stage-level detail arrives as each upstream integration lands.
        </p>
      </div>
    );
  }

  return (
    <form
      className="grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (stage < 2) {
          if (stage === 0) setTouched(true);
          if (stageValid) setStage(stage + 1);
        } else {
          setSubmitted(true);
        }
      }}
    >
      {/* progress tracker */}
      <ol className="grid grid-cols-3 gap-2" aria-label="Progress">
        {stages.map((s, i) => {
          const done = i < stage;
          const current = i === stage;
          return (
            <li key={s} className="grid gap-1.5" aria-current={current ? "step" : undefined}>
              <span
                className={`block h-1.5 rounded-full ${done || current ? "bg-accent" : "bg-raised"} ${current ? "opacity-100" : done ? "opacity-70" : ""}`}
              />
              <span className={`text-[12px] ${current ? "font-semibold text-ink" : "text-muted"}`}>
                {i + 1}. {s}
              </span>
            </li>
          );
        })}
      </ol>

      {stage === 0 && (
        <div className="grid gap-3">
          <Field id={`${uid}-brand`} label="Brand name">
            <input
              id={`${uid}-brand`}
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="bubble-sm w-full border border-rule bg-bg px-3 py-2 text-[14px] text-ink"
            />
          </Field>
          <Field id={`${uid}-site`} label="Website" hint="We use it to prefill details and carriers use it to verify you.">
            <input
              id={`${uid}-site`}
              value={website}
              inputMode="url"
              onChange={(e) => setWebsite(e.target.value)}
              onBlur={() => setTouched(true)}
              aria-invalid={showError ? true : undefined}
              aria-describedby={showError ? `${uid}-site-err` : undefined}
              className={`bubble-sm w-full border bg-bg px-3 py-2 text-[14px] text-ink ${showError ? "border-warn" : "border-rule"}`}
            />
            {showError && (
              <p id={`${uid}-site-err`} role="alert" className="text-[12.5px] text-warn">
                {websiteError}
              </p>
            )}
          </Field>
        </div>
      )}

      {stage === 1 && (
        <div className="grid gap-3">
          <Field id={`${uid}-email`} label="Contact email">
            <input
              id={`${uid}-email`}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bubble-sm w-full border border-rule bg-bg px-3 py-2 text-[14px] text-ink"
            />
          </Field>
          <div className="grid gap-1.5">
            <div className="relative flex items-center gap-1.5">
              <label htmlFor={`${uid}-use`} className="text-[13px] font-semibold text-ink">
                Use case
              </label>
              <button
                type="button"
                aria-label="What is a use case?"
                aria-describedby={tipOpen ? `${uid}-tip` : undefined}
                onMouseEnter={() => setTipOpen(true)}
                onMouseLeave={() => setTipOpen(false)}
                onFocus={() => setTipOpen(true)}
                onBlur={() => setTipOpen(false)}
                className="grid h-4.5 w-4.5 place-items-center rounded-full border border-rule text-[10.5px] font-bold text-muted hover:border-accent hover:text-accent"
              >
                ?
              </button>
              {tipOpen && (
                <span
                  id={`${uid}-tip`}
                  role="tooltip"
                  className="bubble absolute top-full left-0 z-10 mt-1.5 max-w-[34ch] border border-rule bg-surface px-3 py-2 text-[12.5px] text-body shadow-[var(--shadow)]"
                >
                  Carriers read this to decide whether your messages are wanted. Describe what a customer receives and how they opted in, not the product.
                </span>
              )}
            </div>
            <textarea
              id={`${uid}-use`}
              rows={3}
              value={useCase}
              onChange={(e) => setUseCase(e.target.value)}
              className="bubble-sm w-full resize-none border border-rule bg-bg px-3 py-2 text-[14px] text-ink"
            />
          </div>
        </div>
      )}

      {stage === 2 && (
        <dl className="grid gap-2 text-[13.5px]">
          {[
            ["Brand name", brand],
            ["Website", website],
            ["Contact email", email],
            ["Use case", useCase],
          ].map(([k, v]) => (
            <div key={k} className="grid grid-cols-[110px_1fr] gap-3 border-b border-rule pb-2 last:border-0">
              <dt className="text-muted">{k}</dt>
              <dd className="text-ink">{v}</dd>
            </div>
          ))}
          <p className="text-[12.5px] text-muted">
            We send this to each carrier and the verification vendor for you. Approval usually takes a few days.
          </p>
        </dl>
      )}

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setStage(Math.max(0, stage - 1))}
          disabled={stage === 0}
          className="text-[13px] font-semibold text-muted disabled:opacity-40"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={!stageValid && stage !== 0}
          className="rounded-full bg-accent px-4 py-2 text-[13.5px] font-semibold text-white disabled:opacity-50"
        >
          {stage < 2 ? "Continue" : "Submit for review"}
        </button>
      </div>
    </form>
  );
}

function Field({ id, label, hint, children }: { id: string; label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-[13px] font-semibold text-ink">
        {label}
      </label>
      {children}
      {hint && <p className="text-[12px] text-muted">{hint}</p>}
    </div>
  );
}
