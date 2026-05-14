import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui-card";
import { useTxStore } from "@/lib/store";
import { txStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { AddTransactionFAB } from "@/components/add-transaction";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/transactions")({
  head: () => ({ meta: [{ title: "Finance-AI — Opérations" }] }),
  component: TransactionsPage,
});

function TransactionsPage() {
  const { t } = useI18n();
  const { tx } = useTxStore();
  const fmt = (n: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);
  return (
    <AppShell>
      <PageHeader title={t("tab.transactions")} subtitle={`${tx.length} opérations`} />
      <Card className="divide-y divide-border p-0">
        {tx.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            Aucune opération. Ajoute la première avec le bouton +.
          </div>
        )}
        {tx.map((t) => (
          <div key={t.id} className="group flex items-center justify-between px-4 py-3">
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-foreground">{t.label}</div>
              <div className="text-xs text-muted-foreground">
                {new Date(t.date).toLocaleDateString()} · {t.category}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="text-sm font-semibold tabular-nums"
                style={{ color: t.amount > 0 ? "var(--color-success)" : "var(--color-foreground)" }}
              >
                {t.amount > 0 ? "+" : ""}
                {fmt(t.amount)}
              </div>
              <button
                aria-label="Supprimer"
                onClick={() => txStore.remove(t.id)}
                className="rounded-md p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-destructive group-hover:opacity-100"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </Card>
      <AddTransactionFAB />
    </AppShell>
  );
}
