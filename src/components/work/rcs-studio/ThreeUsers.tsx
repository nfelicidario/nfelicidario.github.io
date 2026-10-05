const users = [
  {
    name: "Marketing operations",
    line: "Needed an agent provisioned and had never written code.",
    glyph: "M",
  },
  {
    name: "Technical builders",
    line: "The original audience. Wanted the flow builder once an agent existed.",
    glyph: "T",
  },
  {
    name: "Our own operations team",
    line: "Doing every provisioning step by hand over email. Nothing visual, nothing tracked.",
    glyph: "O",
    highlight: true,
  },
];

export function ThreeUsers() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {users.map((u) => (
        <div
          key={u.name}
          className={`bubble-sm border p-4 ${u.highlight ? "border-accent bg-accent-soft/40" : "border-rule bg-bg"}`}
        >
          <span
            aria-hidden="true"
            className={`grid h-9 w-9 place-items-center rounded-full text-[14px] font-bold ${
              u.highlight ? "bg-accent text-white" : "bg-raised text-ink"
            }`}
          >
            {u.glyph}
          </span>
          <div className="mt-3 text-[14.5px] font-semibold text-ink">{u.name}</div>
          <p className="mt-1 text-[13px] leading-snug text-body">{u.line}</p>
          {u.highlight && <div className="label mt-3 text-accent">Nobody had designed for them</div>}
        </div>
      ))}
    </div>
  );
}
