type FieldRow = { name: string; missing?: boolean };

const requestFields = ["Brand name", "Website", "Logo", "Contact", "Use case", "Sample messages"];

const submissions: { title: string; fields: FieldRow[] }[] = [
  {
    title: "Carrier console A",
    fields: [{ name: "Brand name" }, { name: "Logo" }, { name: "Use case" }, { name: "Traffic estimate", missing: true }],
  },
  {
    title: "Carrier console B",
    fields: [{ name: "Brand name" }, { name: "Website" }, { name: "Sample messages" }, { name: "Opt-in proof", missing: true }],
  },
  {
    title: "Verification vendor",
    fields: [{ name: "Brand name" }, { name: "Website" }, { name: "Contact" }, { name: "Business registration", missing: true }],
  },
];

export function RequestsVsSubmissions() {
  return (
    <div className="grid gap-4">
      <div className="grid items-stretch gap-3 md:grid-cols-[1fr_44px_1.2fr]">
        {/* one request */}
        <div className="bubble self-center border border-ink bg-surface p-4">
          <div className="label mb-1">1 customer request</div>
          <div className="text-[14px] font-semibold text-ink">Poblano&apos;s Mexican Grill</div>
          <ul className="mt-3 grid gap-1.5">
            {requestFields.map((f) => (
              <li key={f} className="bubble-sm flex items-center gap-2 bg-raised px-2.5 py-1.5 text-[12.5px] text-body">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ink" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* fan-out connector */}
        <svg viewBox="0 0 44 300" preserveAspectRatio="none" className="hidden h-full w-full md:block" aria-hidden="true">
          <path d="M 0 150 C 22 150, 22 50, 44 50" fill="none" className="stroke-accent" strokeWidth={2} vectorEffect="non-scaling-stroke" />
          <path d="M 0 150 L 44 150" fill="none" className="stroke-accent" strokeWidth={2} vectorEffect="non-scaling-stroke" />
          <path d="M 0 150 C 22 150, 22 250, 44 250" fill="none" className="stroke-accent" strokeWidth={2} vectorEffect="non-scaling-stroke" />
        </svg>

        {/* several submissions */}
        <div className="grid gap-3">
          {submissions.map((s) => (
            <div key={s.title} className="bubble-sm border border-accent bg-surface p-3">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[13px] font-semibold text-ink">{s.title}</span>
                <span className="label">template</span>
              </div>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {s.fields.map((f) => (
                  <li
                    key={f.name}
                    className={`rounded-full px-2 py-0.5 text-[11.5px] ${
                      f.missing ? "bg-accent-soft font-semibold text-accent ring-1 ring-accent" : "bg-raised text-muted"
                    }`}
                  >
                    {f.missing ? `+ ${f.name}` : f.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <ul className="flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-muted">
        <li className="flex items-center gap-1.5">
          <span aria-hidden="true" className="inline-block h-3 w-6 rounded-full bg-raised" />
          prefilled from the request
        </li>
        <li className="flex items-center gap-1.5">
          <span aria-hidden="true" className="inline-block h-3 w-6 rounded-full bg-accent-soft ring-1 ring-accent" />
          only what&apos;s missing, added by operations
        </li>
      </ul>
    </div>
  );
}
