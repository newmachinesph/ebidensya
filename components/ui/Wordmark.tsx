import Link from "next/link";

/** Monogram plus wordmark. Single geometric mark, no decorative illustration. */
export function Wordmark({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className="grid size-7 place-items-center rounded-[8px] bg-accent font-mono text-[13px] font-semibold text-accent-ink"
      >
        E
      </span>
      <span className="text-[15px] font-semibold tracking-tight">Ebidensya</span>
    </Link>
  );
}
