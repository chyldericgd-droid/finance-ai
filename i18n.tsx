import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Locale = "fr" | "en";

type Dict = Record<string, string>;

const fr: Dict = {
  "app.name": "Finance-AI",
  "tab.dashboard": "Accueil",
  "tab.transactions": "Opérations",
  "tab.insights": "Insights",
  "tab.rewards": "Récompenses",
  "tab.settings": "Réglages",
  "kpi.income": "Revenus",
  "kpi.burn": "Dépenses",
  "kpi.net": "Solde net",
  "kpi.savings_rate": "Taux d'épargne",
  "kpi.runway": "Destiny Counter",
  "kpi.runway.growth": "Croissance",
  "kpi.runway.months": "{n} mois de runway",
  "kpi.runway.critical": "Moins de 2 mois — agir",
  "section.overview": "Vue d'ensemble",
  "section.cashflow": "Flux mensuel",
  "section.categories": "Par catégorie",
  "section.recent": "Récent",
  "section.alerts": "Alertes intelligentes",
  "section.assistant": "Assistant Finance-AI",
  "assistant.placeholder": "Pose ta question financière…",
  "assistant.send": "Envoyer",
  "assistant.offline": "Mode local — réponses simplifiées sans connexion.",
  "network.offline": "Hors-ligne",
  "settings.language": "Langue",
  "settings.theme": "Thème",
  "settings.theme.system": "Système",
  "settings.theme.light": "Clair",
  "settings.theme.dark": "Sombre",
  "settings.notifications": "Notifications",
  "settings.notifications.desc": "Alertes critiques uniquement.",
  "settings.export": "Exporter mes données",
  "settings.account": "Compte",
  "settings.signout": "Se déconnecter",
  "rewards.title": "Tes badges",
  "rewards.empty": "Continue à suivre tes finances pour débloquer des récompenses.",
  "common.loading": "Chargement…",
  "common.month": "ce mois",
};

const en: Dict = {
  "app.name": "Finance-AI",
  "tab.dashboard": "Home",
  "tab.transactions": "Transactions",
  "tab.insights": "Insights",
  "tab.rewards": "Rewards",
  "tab.settings": "Settings",
  "kpi.income": "Income",
  "kpi.burn": "Spending",
  "kpi.net": "Net balance",
  "kpi.savings_rate": "Savings rate",
  "kpi.runway": "Destiny Counter",
  "kpi.runway.growth": "Growing",
  "kpi.runway.months": "{n} months of runway",
  "kpi.runway.critical": "Under 2 months — act now",
  "section.overview": "Overview",
  "section.cashflow": "Monthly flow",
  "section.categories": "By category",
  "section.recent": "Recent",
  "section.alerts": "Smart alerts",
  "section.assistant": "Finance-AI Assistant",
  "assistant.placeholder": "Ask anything about your finances…",
  "assistant.send": "Send",
  "assistant.offline": "Local mode — simplified replies without connection.",
  "network.offline": "Offline",
  "settings.language": "Language",
  "settings.theme": "Theme",
  "settings.theme.system": "System",
  "settings.theme.light": "Light",
  "settings.theme.dark": "Dark",
  "settings.notifications": "Notifications",
  "settings.notifications.desc": "Critical alerts only.",
  "settings.export": "Export my data",
  "settings.account": "Account",
  "settings.signout": "Sign out",
  "rewards.title": "Your badges",
  "rewards.empty": "Keep tracking your finances to unlock rewards.",
  "common.loading": "Loading…",
  "common.month": "this month",
};

const dicts: Record<Locale, Dict> = { fr, en };

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: keyof typeof fr, vars?: Record<string, string | number>) => string;
};

const I18nContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "fa.locale";

function detect(): Locale {
  if (typeof window === "undefined") return "fr";
  const saved = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
  if (saved === "fr" || saved === "en") return saved;
  return navigator.language?.toLowerCase().startsWith("en") ? "en" : "fr";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fr");

  useEffect(() => {
    const initial = detect();
    setLocaleState(initial);
    document.documentElement.lang = initial;
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, l);
      document.documentElement.lang = l;
    }
  };

  const t: Ctx["t"] = (key, vars) => {
    let s = dicts[locale][key as string] ?? dicts.en[key as string] ?? String(key);
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        s = s.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
      }
    }
    return s;
  };

  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be inside I18nProvider");
  return ctx;
}
