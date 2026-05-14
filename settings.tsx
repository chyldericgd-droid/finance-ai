import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui-card";
import { useI18n, type Locale } from "@/lib/i18n";
import { Bell, Download, Globe, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Finance-AI — Réglages" }] }),
  component: SettingsPage,
});

type Theme = "system" | "light" | "dark";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const dark =
    theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  root.classList.toggle("dark", dark);
}

function SettingsPage() {
  const { t, locale, setLocale } = useI18n();
  const [theme, setTheme] = useState<Theme>("system");
  const [notif, setNotif] = useState<NotificationPermission | "unsupported">("default");

  useEffect(() => {
    const saved = (localStorage.getItem("fa.theme") as Theme | null) ?? "system";
    setTheme(saved);
    applyTheme(saved);
    if (typeof Notification === "undefined") setNotif("unsupported");
    else setNotif(Notification.permission);
  }, []);

  const changeTheme = (t: Theme) => {
    setTheme(t);
    localStorage.setItem("fa.theme", t);
    applyTheme(t);
  };

  const requestNotif = async () => {
    if (typeof Notification === "undefined") return;
    const p = await Notification.requestPermission();
    setNotif(p);
  };

  return (
    <AppShell>
      <PageHeader title={t("tab.settings")} />

      <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {t("settings.language")}
      </h2>
      <Card className="p-0">
        <div className="flex items-center gap-3 px-4 py-3">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-1 gap-2">
            {(["fr", "en"] as Locale[]).map((l) => (
              <button
                key={l}
                onClick={() => setLocale(l)}
                className="flex-1 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors"
                style={{
                  background: locale === l ? "var(--color-primary)" : "transparent",
                  color: locale === l ? "var(--color-primary-foreground)" : "var(--color-foreground)",
                  borderColor: "var(--color-border)",
                }}
              >
                {l === "fr" ? "Français" : "English"}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <h2 className="mb-2 mt-5 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {t("settings.theme")}
      </h2>
      <Card className="p-0">
        <div className="grid grid-cols-3 gap-2 p-2">
          {(
            [
              { k: "system", label: t("settings.theme.system"), Icon: Globe },
              { k: "light", label: t("settings.theme.light"), Icon: Sun },
              { k: "dark", label: t("settings.theme.dark"), Icon: Moon },
            ] as const
          ).map(({ k, label, Icon }) => (
            <button
              key={k}
              onClick={() => changeTheme(k as Theme)}
              className="flex flex-col items-center gap-1 rounded-lg border px-2 py-2 text-xs font-medium transition-colors"
              style={{
                background: theme === k ? "var(--color-accent)" : "transparent",
                borderColor: "var(--color-border)",
                color: "var(--color-foreground)",
              }}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </Card>

      <h2 className="mb-2 mt-5 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {t("settings.notifications")}
      </h2>
      <Card>
        <div className="flex items-start gap-3">
          <Bell className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div className="flex-1">
            <div className="text-sm font-medium text-foreground">{t("settings.notifications")}</div>
            <div className="text-xs text-muted-foreground">{t("settings.notifications.desc")}</div>
            <div className="mt-2 text-xs">
              {notif === "unsupported" && (
                <span className="text-muted-foreground">Non supporté sur cet environnement</span>
              )}
              {notif === "granted" && <span style={{ color: "var(--color-success)" }}>Activées</span>}
              {(notif === "default" || notif === "denied") && (
                <button
                  onClick={requestNotif}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-primary-foreground"
                  style={{ background: "var(--color-primary)" }}
                >
                  Activer
                </button>
              )}
            </div>
          </div>
        </div>
      </Card>

      <h2 className="mb-2 mt-5 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {t("settings.account")}
      </h2>
      <Card className="p-0">
        <button className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-foreground hover:bg-muted/50">
          <Download className="h-4 w-4 text-muted-foreground" />
          {t("settings.export")}
        </button>
      </Card>

      <p className="mt-6 text-center text-[11px] text-muted-foreground">Finance-AI · v0.1 · PWA</p>
    </AppShell>
  );
}
