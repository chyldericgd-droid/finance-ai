import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card, StatCard } from "@/components/ui-card";
import { useI18n } from "@/lib/i18n";
import { monthlyFlow, alerts } from "@/lib/mock-data";
import { useTxStore, computeKpisFrom } from "@/lib/store";
import { AddTransactionFAB } from "@/components/add-transaction";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AlertTriangle, Info, TrendingUp, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Finance-AI — Tableau de bord" },
      { name: "description", content: "Tes finances, claires et intelligentes." },
    ],
  }),
  component: Dashboard,
});

function fmt(n: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

function Dashboard() {
  const { t } = useI18n();
  const online = useOnlineStatus();
  const { tx, cash } = useTxStore();
  const k = computeKpisFrom(tx, cash);

  return (
    <AppShell>
      <PageHeader title={t("app.name")} subtitle={t("section.overview")} />

      <section className="grid grid-cols-2 gap-3">
        <StatCard label={t("kpi.income")} value={fmt(k.income)} tone="success" />
        <StatCard label={t("kpi.burn")} value={fmt(k.spend)} tone="destructive" />
        <StatCard label={t("kpi.net")} value={fmt(k.net)} tone={k.net >= 0 ? "success" : "destructive"} />
        <StatCard
          label={t("kpi.savings_rate")}
          value={`${Math.round(k.savingsRate * 100)}%`}
          tone={k.savingsRate >= 0.2 ? "success" : "warning"}
        />
      </section>

      <section className="mt-3">
        <Card>
          <div className="mb-1 flex items-center gap-2">
            <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{t("kpi.runway")}</span>
          </div>
          {k.runway.kind === "growth" && (
            <div className="flex items-center gap-2 text-[20px] font-semibold tracking-tight" style={{ color: "var(--color-success)" }}>
              <TrendingUp className="h-5 w-5" /> {t("kpi.runway.growth")}
            </div>
          )}
          {k.runway.kind === "months" && (
            <div className="text-[20px] font-semibold tracking-tight tabular-nums">
              {t("kpi.runway.months", { n: Math.floor(k.runway.months ?? 0) })}
            </div>
          )}
          {k.runway.kind === "critical" && (
            <div className="text-[20px] font-semibold tracking-tight" style={{ color: "var(--color-destructive)" }}>
              {t("kpi.runway.critical")}
            </div>
          )}
        </Card>
      </section>

      <section className="mt-5">
        <h2 className="mb-2 px-1 text-sm font-semibold text-foreground">{t("section.cashflow")}</h2>
        <Card className="p-3">
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyFlow} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-warning)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-warning)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="m" stroke="var(--color-muted-foreground)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="income" stroke="var(--color-primary)" strokeWidth={2} fill="url(#g1)" />
                <Area type="monotone" dataKey="spend" stroke="var(--color-warning)" strokeWidth={2} fill="url(#g2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      <section className="mt-5">
        <h2 className="mb-2 flex items-center gap-2 px-1 text-sm font-semibold text-foreground">
          <Sparkles className="h-4 w-4" style={{ color: "var(--color-primary)" }} />
          {t("section.assistant")}
        </h2>
        <Card>
          <p className="text-sm text-muted-foreground">
            {online
              ? "Pose une question — l'IA analyse tes flux pour te répondre."
              : t("assistant.offline")}
          </p>
          <Link
            to="/assistant"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            style={{ background: "var(--color-primary)" }}
          >
            <Sparkles className="h-4 w-4" />
            {t("assistant.placeholder")}
          </Link>
        </Card>
      </section>

      <section className="mt-5">
        <h2 className="mb-2 px-1 text-sm font-semibold text-foreground">{t("section.alerts")}</h2>
        <div className="space-y-2">
          {alerts.map((a) => {
            const Icon = a.severity === "high" ? AlertTriangle : a.severity === "warn" ? AlertTriangle : Info;
            const color =
              a.severity === "high"
                ? "var(--color-destructive)"
                : a.severity === "warn"
                ? "var(--color-warning)"
                : "var(--color-primary)";
            return (
              <Card key={a.id} className="flex items-start gap-3">
                <Icon className="mt-0.5 h-4 w-4 shrink-0" style={{ color }} />
                <div className="min-w-0">
                  <div className="text-sm font-medium text-foreground">{a.title}</div>
                  <div className="text-xs text-muted-foreground">{a.body}</div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="mt-5">
        <h2 className="mb-2 px-1 text-sm font-semibold text-foreground">{t("section.recent")}</h2>
        <Card className="divide-y divide-border p-0">
          {tx.slice(0, 5).map((tx) => (
            <div key={tx.id} className="flex items-center justify-between px-4 py-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-foreground">{tx.label}</div>
                <div className="text-xs text-muted-foreground">{tx.category}</div>
              </div>
              <div
                className="text-sm font-semibold tabular-nums"
                style={{ color: tx.amount > 0 ? "var(--color-success)" : "var(--color-foreground)" }}
              >
                {tx.amount > 0 ? "+" : ""}
                {fmt(tx.amount)}
              </div>
            </div>
          ))}
        </Card>
      </section>
      <AddTransactionFAB />
    </AppShell>
  );
}
