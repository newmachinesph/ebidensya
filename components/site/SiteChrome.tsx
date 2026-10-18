import Link from "next/link";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";

import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Wordmark } from "@/components/ui/Wordmark";

const NAV = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur-md">
      <div className="shell flex h-16 items-center justify-between gap-4">
        <Wordmark />
        <nav aria-label="Main" className="flex items-center gap-1 sm:gap-2">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hidden rounded-[8px] px-2.5 py-2 text-[13px] text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink min-[420px]:inline-block sm:px-3 sm:text-sm"
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
          <Link
            href="/app"
            className="ml-1 inline-flex items-center gap-1.5 whitespace-nowrap rounded-[8px] bg-accent px-3 py-2 text-[13px] font-medium text-accent-ink transition-colors hover:bg-accent-hover active:translate-y-px sm:px-3.5 sm:text-sm"
          >
            <span className="sm:hidden">Demo</span>
            <span className="hidden sm:inline">Open the demo</span>
            <ArrowUpRightIcon size={14} weight="bold" />
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="shell grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <Wordmark />
          <p className="mt-4 text-sm leading-relaxed text-ink-2">
            Evidence intake and litigation preparation for Philippine law offices. The judgment stays
            with the lawyer.
          </p>
        </div>
        <div>
          <h2 className="text-[13px] font-medium text-ink">Product</h2>
          <ul className="mt-3 space-y-2 text-sm text-ink-2">
            <li>
              <Link href="/how-it-works" className="hover:text-ink">
                How it works
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:text-ink">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/app" className="hover:text-ink">
                Demo case file
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-[13px] font-medium text-ink">Office</h2>
          <ul className="mt-3 space-y-2 text-sm text-ink-2">
            <li>Ortigas Center, Pasig City</li>
            <li>
              <a href="mailto:tanong@ebidensya.ph" className="hover:text-ink">
                tanong@ebidensya.ph
              </a>
            </li>
            <li>+63 2 8000 0000</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="shell flex flex-col gap-2 py-5 text-xs text-ink-3 sm:flex-row sm:items-center sm:justify-between">
          <p>Ebidensya is a document tool. It does not provide legal advice.</p>
          <p>Sample case data throughout. Names and dockets are fictional.</p>
        </div>
      </div>
    </footer>
  );
}
