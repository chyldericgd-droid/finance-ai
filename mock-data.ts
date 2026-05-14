// Mock financial data for Phase 1. Replaced by real DB in Phase 2.

export type Tx = {
  id: string;
  date: string;
  label: string;
  category: string;
  amount: number; // positive income, negative expense
};

export const cash = 8420;

export const transactions: Tx[] = [
  { id: "1", date: "2026-05-13", label: "Salaire", category: "income", amount: 3200 },
  { id: "2", date: "2026-05-13", label: "Loyer", category: "housing", amount: -1100 },
  { id: "3", date: "2026-05-12", label: "Courses Lidl", category: "groceries", amount: -68.4 },
  { id: "4", date: "2026-05-11", label: "Spotify", category: "subs", amount: -9.99 },
  { id: "5", date: "2026-05-10", label: "Restaurant", category: "leisure", amount: -42 },
  { id: "6", date: "2026-05-09", label: "Uber", category: "transport", amount: -14.5 },
  { id: "7", date: "2026-05-08", label: "Freelance", category: "income", amount: 480 },
  { id: "8", date: "2026-05-07", label: "Pharmacie", category: "health", amount: -22.1 },
  { id: "9", date: "2026-05-06", label: "Cinéma", category: "leisure", amount: -28 },
  { id: "10", date: "2026-05-05", label: "Essence", category: "transport", amount: -55 },
];

export const monthlyFlow = [
  { m: "Déc", income: 3400, spend: 2800 },
  { m: "Jan", income: 3200, spend: 2950 },
  { m: "Fév", income: 3500, spend: 3100 },
  { m: "Mar", income: 3300, spend: 2700 },
  { m: "Avr", income: 3680, spend: 3050 },
  { m: "Mai", income: 3680, spend: 1340 },
];

export const categoryBreakdown = [
  { name: "Logement", value: 1100 },
  { name: "Courses", value: 320 },
  { name: "Loisirs", value: 240 },
  { name: "Transport", value: 180 },
  { name: "Santé", value: 90 },
  { name: "Abos", value: 45 },
];

export type Alert = {
  id: string;
  severity: "info" | "warn" | "high";
  title: string;
  body: string;
};

export const alerts: Alert[] = [
  { id: "a1", severity: "warn", title: "Loisirs +32% ce mois", body: "Tu as dépensé 240€ en loisirs vs 182€ le mois dernier." },
  { id: "a2", severity: "info", title: "Bonne dynamique d'épargne", body: "Tu épargnes 36% de tes revenus ce mois." },
  { id: "a3", severity: "high", title: "Abonnement Spotify renouvelé 3x", body: "Vérifie ton compte — facturation anormale détectée." },
];

export type Badge = {
  id: string;
  title: string;
  desc: string;
  unlocked: boolean;
};

export const badges: Badge[] = [
  { id: "b1", title: "Premier pas", desc: "Première transaction enregistrée", unlocked: true },
  { id: "b2", title: "Épargne 20%", desc: "Atteins 20% de taux d'épargne", unlocked: true },
  { id: "b3", title: "Semaine sereine", desc: "7 jours sans dépense impulsive", unlocked: false },
  { id: "b4", title: "Runway 6 mois", desc: "Atteins 6 mois de runway", unlocked: false },
];

export function computeKpis() {
  const income = transactions.filter((t) => t.amount > 0).reduce((a, b) => a + b.amount, 0);
  const spend = transactions.filter((t) => t.amount < 0).reduce((a, b) => a + Math.abs(b.amount), 0);
  const net = income - spend;
  const savingsRate = income > 0 ? net / income : 0;
  // Destiny Counter — corrected logic
  let runway: { kind: "growth" | "months" | "critical"; months?: number };
  if (income >= spend) runway = { kind: "growth" };
  else {
    const months = cash / (spend - income);
    runway = months < 2 ? { kind: "critical", months } : { kind: "months", months };
  }
  return { income, spend, net, savingsRate, runway, cash };
}
