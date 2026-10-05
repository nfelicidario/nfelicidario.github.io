type Flow = { heading: string; tone: "thesis" | "reality"; steps: string[] };

const flows: Flow[] = [
  {
    heading: "What we thought we were building",
    tone: "thesis",
    steps: ["Sign up", "Build a flow", "Send"],
  },
  {
    heading: "What customers needed first",
    tone: "reality",
    steps: ["Register brand and agent", "Verification and carrier approval", "Then build the flow"],
  },
];

export function ThesisVsReality() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {flows.map((f) => {
        const real = f.tone === "reality";
        return (
          <div
            key={f.heading}
            className={`bubble-sm border p-4 ${real ? "border-accent bg-accent-soft/40" : "border-dashed border-rule bg-bg"}`}
          >
            <div className={`label mb-3 ${real ? "text-accent" : ""}`}>{f.heading}</div>
            <ol className="grid gap-1.5">
              {f.steps.map((s, i) => (
                <li key={s} className="grid gap-1.5">
                  <div
                    className={`bubble-sm flex items-center gap-2.5 border px-3 py-2 text-[13.5px] ${
                      real ? "border-rule bg-surface text-ink" : "border-rule bg-surface text-muted line-through decoration-rule"
                    }`}
                  >
                    <span
                      className={`num grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] font-semibold ${
                        real ? "bg-accent text-white" : "bg-raised text-muted"
                      }`}
                    >
                      {i + 1}
                    </span>
                    {s}
                  </div>
                  {i < f.steps.length - 1 && (
                    <span aria-hidden="true" className="ml-[18px] block h-3 w-0 border-l border-dashed border-rule" />
                  )}
                </li>
              ))}
            </ol>
            <p className="mt-3 text-[12.5px] text-muted">
              {real ? "Weeks of email, no visibility, done by hand." : "Nobody arrived asking for this."}
            </p>
          </div>
        );
      })}
    </div>
  );
}
