import { Link, useLocation } from "@tanstack/react-router";
import { Home, ArrowLeftRight, LineChart, Trophy, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n";

type Item = { to: string; icon: LucideIcon; key: "tab.dashboard" | "tab.transactions" | "tab.insights" | "tab.rewards" | "tab.settings" };

const items: Item[] = [
  { to: "/", icon: Home, key: "tab.dashboard" },
  { to: "/transactions", icon: ArrowLeftRight, key: "tab.transactions" },
  { to: "/insights", icon: LineChart, key: "tab.insights" },
  { to: "/rewards", icon: Trophy, key: "tab.rewards" },
  { to: "/settings", icon: Settings, key: "tab.settings" },
];

export function TabBar() {
  const { t } = useI18n();
  const { pathname } = useLocation();
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/85 backdrop-blur-xl safe-bottom"
      style={{ boxShadow: "var(--shadow-tabbar)" }}
    >
      <ul className="mx-auto flex max-w-2xl items-stretch justify-around px-2 pt-1.5">
        {items.map((it) => {
          const active = pathname === it.to;
          const Icon = it.icon;
          return (
            <li key={it.to} className="flex-1">
              <Link
                to={it.to}
                className="flex flex-col items-center gap-0.5 rounded-xl px-1 py-1.5 text-[10.5px] font-medium transition-colors"
                style={{ color: active ? "var(--color-primary)" : "var(--color-muted-foreground)" }}
              >
                <Icon className="h-[22px] w-[22px]" strokeWidth={active ? 2.4 : 1.8} />
                <span>{t(it.key)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
