import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui-card";
import { useI18n } from "@/lib/i18n";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { badges } from "@/lib/mock-data";
import { Trophy, Lock } from "lucide-react";

export const Route = createFileRoute("/rewards")({
  head: () => ({ meta: [{ title: "Finance-AI — Récompenses" }] }),
  component: RewardsPage,
});

function RewardsPage() {
  const { t } = useI18n();
  const online = useOnlineStatus();
  return (
    <AppShell>
      <PageHeader title={t("tab.rewards")} subtitle={t("rewards.title")} />
      <div className="grid grid-cols-2 gap-3">
        {badges.map((b) => (
          <Card key={b.id} className="flex flex-col items-start gap-2">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                b.unlocked && online ? "animate-fade-in-up" : ""
              }`}
              style={{
                background: b.unlocked ? "var(--color-primary)" : "var(--color-muted)",
                color: b.unlocked ? "var(--color-primary-foreground)" : "var(--color-muted-foreground)",
              }}
            >
              {b.unlocked ? <Trophy className="h-5 w-5" /> : <Lock className="h-4 w-4" />}
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">{b.title}</div>
              <div className="text-xs text-muted-foreground">{b.desc}</div>
            </div>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
