/** The CI step that replaced handoff: three nodes, then the environments it deploys to. Static. */
const nodes = [
  {
    kicker: "GitLab",
    title: "Open a merge request",
    body: "A draft is enough. The branch can be mock data and placeholder copy.",
  },
  {
    kicker: "CI job",
    title: "Trigger a deploy",
    body: "Manual job on the pipeline. Nothing merges; the branch is built as it stands.",
  },
  {
    kicker: "Shared environment",
    title: "A URL anyone can click through",
    body: "Product, design, and engineering look at the same working thing.",
  },
];

const envs = [
  ...Array.from({ length: 5 }, (_, i) => ({ id: `eng-${i + 1}`, who: "eng" as const })),
  ...Array.from({ length: 5 }, (_, i) => ({ id: `me-${i + 1}`, who: "me" as const })),
];

function Arrow() {
  return (
    <span
      aria-hidden="true"
      className="flex items-center justify-center text-muted md:rotate-0 rotate-90"
    >
      <svg width="28" height="16" viewBox="0 0 28 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M1 8h24M19 2l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function Pipeline() {
  return (
    <div className="grid gap-5">
      <ol className="grid items-stretch gap-1 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
        {nodes.map((n, i) => (
          <li key={n.title} className="contents">
            <div className="bubble-sm grid gap-1 border border-rule bg-raised p-3">
              <span className="label">{n.kicker}</span>
              <span className="text-[13.5px] font-semibold leading-snug text-ink">{n.title}</span>
              <span className="text-[12px] leading-snug text-body">{n.body}</span>
            </div>
            {i < nodes.length - 1 && <Arrow />}
          </li>
        ))}
      </ol>

      <div className="grid gap-2">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <span className="label">Environments</span>
          <span className="text-[11.5px] text-muted">ten shared environments, split between engineers and me</span>
        </div>
        <ul className="grid grid-cols-5 gap-1.5" aria-label="Ten shared environments">
          {envs.map((e) => (
            <li
              key={e.id}
              className={`bubble-sm flex min-h-[44px] flex-col justify-between border px-2 py-1.5 ${
                e.who === "me" ? "border-accent bg-accent-soft" : "border-rule bg-raised"
              }`}
            >
              <span className="flex items-center gap-1">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${e.who === "me" ? "bg-accent" : "bg-muted"}`}
                  aria-hidden="true"
                />
                <span className="num text-[10.5px] text-muted">{e.id}</span>
              </span>
              <span className={`text-[10.5px] ${e.who === "me" ? "text-accent" : "text-body"}`}>
                {e.who === "me" ? "design" : "engineering"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
