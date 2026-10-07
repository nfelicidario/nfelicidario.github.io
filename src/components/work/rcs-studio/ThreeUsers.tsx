const users = [
  {
    group: "Customer",
    name: "Marketing operations",
    line: "Needs an agent provisioned for a campaign. Has never written code.",
    glyph: "M",
    highlight: true,
  },
  {
    group: "Customer",
    name: "Technical builders",
    line: "The original audience. Wants the flow builder once an agent exists.",
    glyph: "T",
    highlight: true,
  },
  {
    group: "Internal",
    name: "Our operations team",
    line: "Does the provisioning work behind the scenes. Their story is the next case study.",
    glyph: "O",
    highlight: false,
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
          <div className="label mt-3">{u.group}</div>
          <div className="mt-0.5 text-[14.5px] font-semibold text-ink">{u.name}</div>
          <p className="mt-1 text-[13px] leading-snug text-body">{u.line}</p>
        </div>
      ))}
    </div>
  );
}
