import type { Metadata } from "next";

import { AppShell } from "@/components/app/AppShell";
import { listCases, reviewQueue, siteData } from "@/lib/data";

export const metadata: Metadata = {
  title: "Case files",
  description: "Demo workspace for the Ebidensya evidence organiser.",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      cases={listCases()}
      reviewCount={reviewQueue().length}
      notice={siteData.demoNotice}
    >
      {children}
    </AppShell>
  );
}
