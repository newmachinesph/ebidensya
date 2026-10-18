"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowSquareOutIcon,
  FolderOpenIcon,
  GavelIcon,
  ListIcon,
  SquaresFourIcon,
  WarningCircleIcon,
  XIcon,
} from "@phosphor-icons/react";

import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Wordmark } from "@/components/ui/Wordmark";
import type { CaseSummary } from "@/lib/types";

const PRIMARY = [
  { href: "/app", label: "Overview", icon: SquaresFourIcon },
  { href: "/app/review", label: "Review queue", icon: WarningCircleIcon },
  { href: "/app/hearings", label: "Hearings", icon: GavelIcon },
];

function NavLists({
  cases,
  reviewCount,
  pathname,
  onNavigate,
}: {
  cases: CaseSummary[];
  reviewCount: number;
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="space-y-7">
      <ul className="space-y-0.5">
        {PRIMARY.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-11 items-center gap-2.5 rounded-[8px] px-3 py-2 text-sm transition-colors lg:min-h-0 lg:text-[13px] ${
                  active
                    ? "bg-accent-soft font-medium text-accent"
                    : "text-ink-2 hover:bg-surface-2 hover:text-ink"
                }`}
              >
                <Icon size={16} weight={active ? "fill" : "regular"} />
                {item.label}
                {item.href === "/app/review" && reviewCount > 0 && (
                  <span className="ml-auto font-mono text-[11px] tabular-nums text-review">
                    {reviewCount}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      <div>
        <h2 className="px-3 text-[11px] font-medium tracking-wide text-ink-3 uppercase">
          Active matters
        </h2>
        <ul className="mt-2 space-y-0.5">
          {cases.map((summary) => {
            const href = `/app/cases/${summary.id}`;
            const active = pathname.startsWith(href);
            return (
              <li key={summary.id}>
                <Link
                  href={href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-11 items-start gap-2.5 rounded-[8px] px-3 py-2.5 text-sm leading-snug transition-colors lg:min-h-0 lg:py-2 lg:text-[13px] ${
                    active
                      ? "bg-surface-2 font-medium text-ink"
                      : "text-ink-2 hover:bg-surface-2 hover:text-ink"
                  }`}
                >
                  <FolderOpenIcon size={16} className="mt-0.5 shrink-0" />
                  <span className="min-w-0">
                    <span className="block truncate">{summary.title}</span>
                    <span className="block truncate font-mono text-[11px] text-ink-3">
                      {summary.causeOfAction}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export function AppShell({
  cases,
  reviewCount,
  notice,
  children,
}: {
  cases: CaseSummary[];
  reviewCount: number;
  notice: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // ponytail: links close the sheet themselves, so no effect on pathname.
  const [navOpen, setNavOpen] = useState(false);
  const closeNav = () => setNavOpen(false);

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-40 border-b border-line bg-canvas/90 backdrop-blur-md">
        <div className="shell-wide flex h-14 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => setNavOpen((open) => !open)}
              aria-expanded={navOpen}
              aria-controls="app-nav-sheet"
              className="-ml-2 inline-flex size-11 items-center justify-center rounded-[8px] text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink lg:hidden"
            >
              {navOpen ? <XIcon size={19} /> : <ListIcon size={19} />}
              <span className="sr-only">{navOpen ? "Close case menu" : "Open case menu"}</span>
            </button>
            <Wordmark href="/app" />
            <span className="hidden rounded-full border border-line bg-surface-2 px-2.5 py-1 text-[11px] text-ink-3 md:inline">
              {notice}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-[8px] border border-line px-3 py-2 text-[13px] text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
            >
              Site
              <ArrowSquareOutIcon size={14} />
            </Link>
          </div>
        </div>

        {navOpen && (
          <nav
            id="app-nav-sheet"
            aria-label="Case navigation"
            className="max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-t border-line bg-canvas px-3 py-4 lg:hidden"
          >
            <NavLists
              cases={cases}
              reviewCount={reviewCount}
              pathname={pathname}
              onNavigate={closeNav}
            />
          </nav>
        )}
      </header>

      <div className="shell-wide flex flex-1 gap-8 py-5 sm:py-6">
        <nav aria-label="Case navigation" className="hidden w-60 shrink-0 lg:block">
          <div className="sticky top-20">
            <NavLists cases={cases} reviewCount={reviewCount} pathname={pathname} />
          </div>
        </nav>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
