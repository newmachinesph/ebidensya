"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { segment: "", label: "Overview" },
  { segment: "evidence", label: "Evidence" },
  { segment: "timeline", label: "Timeline" },
  { segment: "chronology", label: "Chronology" },
  { segment: "exhibits", label: "Exhibits" },
  { segment: "witnesses", label: "Witnesses" },
  { segment: "analysis", label: "Conflicts and gaps" },
  { segment: "proof-matrix", label: "Proof matrix" },
  { segment: "binder", label: "Trial binder" },
  { segment: "hearing", label: "Hearing" },
];

export function CaseNav({ caseId, hasHearing }: { caseId: string; hasHearing: boolean }) {
  const pathname = usePathname();
  const base = `/app/cases/${caseId}`;
  const tabs = hasHearing ? TABS : TABS.filter((tab) => tab.segment !== "hearing");

  return (
    <nav aria-label="Case sections" className="scroll-x -mx-4 sm:-mx-1">
      <ul className="flex min-w-max gap-1 border-b border-line px-4 sm:px-1">
        {tabs.map((tab) => {
          const href = tab.segment ? `${base}/${tab.segment}` : base;
          const active = tab.segment
            ? pathname.startsWith(href)
            : pathname === base;
          return (
            <li key={tab.segment || "overview"}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`-mb-px inline-block border-b-2 px-3 py-3 text-[13px] whitespace-nowrap transition-colors sm:py-2.5 ${
                  active
                    ? "border-accent font-medium text-ink"
                    : "border-transparent text-ink-2 hover:text-ink"
                }`}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
