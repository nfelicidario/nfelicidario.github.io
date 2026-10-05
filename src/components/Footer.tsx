export function Footer() {
  return (
    <footer className="container-x mt-24">
      <div className="mx-auto flex max-w-6xl flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-t border-rule py-8 text-[14px] text-muted">
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          <li>
            <a className="hover:text-ink" href="mailto:nafelicidario@gmail.com">
              Email
            </a>
          </li>
          <li>
            <a
              className="hover:text-ink"
              href="https://www.linkedin.com/in/nolan-felicidario"
              rel="me noopener"
              target="_blank"
            >
              LinkedIn
            </a>
          </li>
          <li>
            <a
              className="hover:text-ink"
              href="https://github.com/nfelicidario/nfelicidario.github.io"
              rel="me noopener"
              target="_blank"
            >
              View source
            </a>
          </li>
        </ul>
        <p className="text-[13px] text-muted">
          Built with Next.js and Claude Code. Chicago, {new Date().getFullYear()}.
        </p>
      </div>
    </footer>
  );
}
