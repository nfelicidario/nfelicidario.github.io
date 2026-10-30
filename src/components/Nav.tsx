"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { projects } from "@/content/projects";
import { SlideProgress, TocPills, useActiveSection } from "./case/CaseNav";
import { useTocVariant } from "./case/tocStore";

const links = [
  { href: "/", label: "Work" },
  { href: "/how-i-work/", label: "How I work" },
  { href: "/about/", label: "About" },
];

/**
 * The site header. On a case page (default table-of-contents treatment) it sticks to the top and
 * carries a breadcrumb back to Work and the page's sections, with the slide counter while the
 * reader is in the full story. Below lg the sections drop to a second row.
 */
export function Nav() {
  const pathname = usePathname();
  const variant = useTocVariant();
  const slug = pathname?.match(/^\/work\/([^/]+)\/?$/)?.[1];
  const project = slug ? projects.find((p) => p.slug === slug) : undefined;
  const caseMode = !!project && variant === "navbar";
  const active = useActiveSection();

  return (
    <header className={`container-x ${caseMode ? "sticky top-0 z-40 border-b border-rule bg-bg/85 backdrop-blur" : ""}`}>
      <nav aria-label="Primary" className="mx-auto max-w-6xl">
        <div className={`flex items-center justify-between gap-4 ${caseMode ? "py-3" : "py-5"}`}>
          {caseMode && project ? (
            <ol className="flex min-w-0 items-center gap-1.5 text-[14px]" aria-label="Breadcrumb">
              <li className="shrink-0">
                <Link href="/" className="font-display text-[17px] font-bold tracking-[-0.01em] text-ink">
                  Nolan Felicidario
                </Link>
              </li>
              <li aria-hidden="true" className="text-rule">
                /
              </li>
              <li className="shrink-0">
                <Link href="/#work" className="text-muted transition-colors hover:text-ink">
                  Work
                </Link>
              </li>
              <li aria-hidden="true" className="text-rule">
                /
              </li>
              <li className="truncate font-medium text-ink" aria-current="page">
                {project.title}
              </li>
            </ol>
          ) : (
            <Link href="/" className="font-display text-[17px] font-bold tracking-[-0.01em] text-ink">
              Nolan Felicidario
            </Link>
          )}
          {caseMode && (
            <div className="hidden items-center gap-3 lg:flex">
              <TocPills active={active} />
              <SlideProgress active={active} name />
            </div>
          )}
          <ul className="flex shrink-0 items-center gap-1">
            {links
              .filter((l) => !(caseMode && l.href === "/"))
              .map((l) => (
                <li key={l.href} className={caseMode ? "hidden md:block" : ""}>
                  <Link href={l.href} className="rounded-full px-3 py-1.5 text-[14px] text-muted transition-colors hover:bg-raised hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            <li>
              <ThemeToggle />
            </li>
          </ul>
        </div>
        {caseMode && (
          <div className="flex items-center justify-between gap-3 pb-2 lg:hidden">
            <TocPills active={active} size="sm" />
            <SlideProgress active={active} />
          </div>
        )}
      </nav>
    </header>
  );
}
