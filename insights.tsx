import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui-card";
import { useI18n } from "@/lib/i18n";
import { monthlyFlow } from "@/lib/mock-data";
import { useTxStore } from "@/lib/store";
import { useMemo } from "react";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/insights")({
  head: () => ({ meta: [{ title: "Finance-AI — Insights" }] }),
  component: InsightsPage,
});

const PIE_COLORS = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)", "var(--color-primary)"];

function InsightsPage() {
  const { t } = useI18n();
  const { tx } = useTxStore();
  const categoryBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of tx) {
      if (t.amount >= 0) continue;
      map.set(t.category, (map.get(t.category) ?? 0) + Math.abs(t.amount));
    }
    return [...map.entries()]
      .map(([name, value]) => ({ name, value: Math.round(value) }))
      .sort((a, b) => b.value - a.value);
  }, [tx]);
  return (
    <AppShell>
      <PageHeader title={t("tab.insights")} />

      <h2 className="mb-2 px-1 text-sm font-semibold text-foreground">{t("section.cashflow")}</h2>
      <Card className="p-3">
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyFlow} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <XAxis dataKey="m" stroke="var(--color-muted-foreground)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis stroke="var(--color-muted-foreground)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
              <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="income" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="spend" fill="var(--color-warning)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <h2 className="mb-2 mt-5 px-1 text-sm font-semibold text-foreground">{t("section.categories")}</h2>
      <Card className="p-3">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={categoryBreakdown} dataKey="value" nameKey="name" innerRadius={48} outerRadius={84} paddingAngle={2}>
                {categoryBreakdown.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
          {categoryBreakdown.map((c, i) => (
            <li key={c.name} className="flex items-center gap-2 text-muted-foreground">
              <span className="h-2 w-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
              <span className="truncate text-foreground">{c.name}</span>
              <span className="ml-auto tabular-nums">{c.value}€</span>
            </li>
          ))}
        </ul>
      </Card>
    </AppShell>
  );
}
