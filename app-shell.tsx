import type { ReactNode } from "react";
import { TabBar } from "./tab-bar";
import { NetworkIndicator } from "./network-indicator";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen pb-[88px]">
      <NetworkIndicator />
      <main className="mx-auto w-full max-w-2xl px-4 pt-6 safe-top">{children}</main>
      <TabBar />
    </div>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="mb-5 animate-fade-in-up">
      <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-foreground">{title}</h1>
      {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
    </header>
  );
}
