"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { projects } from "@/content/projects";
import { SlideProgress, TocPills, useActiveSection } from "./case/CaseNav";

const links = [
  { href: "/", label: "Work" },
  { href: "/how-i-work/", label: "How I work" },
  { href: "/about/", label: "About" },
];

/**
 * The site header. On a case page it sticks to the top and
 * carries a breadcrumb back to Work and the page's sections, with the slide counter while the
 * reader is in the full story. Below lg the sections drop to a second row. Once the reader scrolls,
 * the wordmark folds into the N mark from the favicon and unfolds again at the top.
 */
const SCROLLED_AT = 40;

/** The favicon's N, drawn in the theme colours so it follows dark mode. */
function NMark({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`relative grid h-7 w-7 place-items-center ${className}`}>
      <svg viewBox="0 0 64 64" className="absolute inset-0 h-full w-full fill-accent">
        <path d="M8 20a12 12 0 0 1 12-12h24a12 12 0 0 1 12 12v24a12 12 0 0 1-12 12H14a6 6 0 0 1-6-6z" />
      </svg>
      <span className="relative font-display text-[15px] font-extrabold leading-none text-bg">N</span>
    </span>
  );
}

/**
 * The brand link. On a case page it morphs between the full wordmark and the N mark as the page
 * scrolls: both sit in the same row and trade widths, the mark scaling in as the name folds away.
 */
function Brand({ compact }: { compact: boolean }) {
  const ease = "transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none";
  return (
    <Link href="/" aria-label="Nolan Felicidario, home" className="flex items-center text-ink">
      <span className={`grid ${ease} ${compact ? "grid-cols-[1fr]" : "grid-cols-[0fr]"}`}>
        <span className="overflow-hidden">
          <NMark className={`origin-left ${ease} ${compact ? "scale-100 opacity-100" : "scale-50 opacity-0"}`} />
        </span>
      </span>
      <span className={`grid ${ease} ${compact ? "grid-cols-[0fr] opacity-0" : "grid-cols-[1fr] opacity-100"}`}>
        <span
          className={`overflow-hidden whitespace-nowrap font-display text-[17px] font-bold tracking-[-0.01em] ${ease} ${
            compact ? "-translate-x-2" : "translate-x-0"
          }`}
        >
          Nolan Felicidario
        </span>
      </span>
    </Link>
  );
}
export function Nav() {
  const pathname = usePathname();
  const slug = pathname?.match(/^\/work\/([^/]+)\/?$/)?.[1];
  const project = slug ? projects.find((p) => p.slug === slug) : undefined;
  const caseMode = !!project;
  const active = useActiveSection();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!caseMode) return;
    const onScroll = () => setScrolled(window.scrollY > SCROLLED_AT);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [caseMode]);

  return (
    <header className={`container-x ${caseMode ? "sticky top-0 z-40 border-b border-rule bg-bg/85 backdrop-blur" : ""}`}>
      <nav aria-label="Primary" className="mx-auto max-w-6xl">
        <div className={`flex items-center justify-between gap-4 ${caseMode ? "py-3" : "py-5"}`}>
          {caseMode && project ? (
            <ol className="flex min-w-0 items-center gap-1.5 text-[14px]" aria-label="Breadcrumb">
              <li className="shrink-0">
                <Brand compact={scrolled} />
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
              <SlideProgress active={active} />
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
