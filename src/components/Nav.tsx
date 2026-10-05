import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "/", label: "Work" },
  { href: "/how-i-work/", label: "How I work" },
  { href: "/about/", label: "About" },
];

export function Nav() {
  return (
    <header className="container-x">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-6xl items-center justify-between py-5"
      >
        <Link
          href="/"
          className="font-display text-[17px] font-bold tracking-[-0.01em] text-ink"
        >
          Nolan Felicidario
        </Link>
        <ul className="flex items-center gap-1">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="bubble-sm px-3 py-1.5 text-[14px] text-muted transition-colors hover:bg-raised hover:text-ink"
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <ThemeToggle />
          </li>
        </ul>
      </nav>
    </header>
  );
}
