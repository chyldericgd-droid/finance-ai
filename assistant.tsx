import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, useRef, useEffect } from "react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui-card";
import { useI18n } from "@/lib/i18n";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { useTxStore, computeKpisFrom } from "@/lib/store";
import { chatAI } from "@/lib/ai.functions";
import { Sparkles, Send, WifiOff } from "lucide-react";

export const Route = createFileRoute("/assistant")({
  head: () => ({ meta: [{ title: "Finance-AI — Assistant" }] }),
  component: AssistantPage,
});

type Msg = { role: "user" | "assistant"; content: string };

function offlineReply(prompt: string, k: ReturnType<typeof computeKpisFrom>, locale: "fr" | "en"): string {
  const fr = locale === "fr";
  const p = prompt.toLowerCase();
  const rate = Math.round(k.savingsRate * 100);
  if (p.includes("épargne") || p.includes("saving")) {
    return fr
      ? `Ton taux d'épargne ce mois est de ${rate}%. ${rate >= 20 ? "Continue, tu es au-dessus de la cible 20%." : "Vise au moins 20% en réduisant 1 catégorie loisir cette semaine."}`
      : `Your savings rate is ${rate}%. ${rate >= 20 ? "Above the 20% target — keep going." : "Aim for 20% by trimming one leisure category this week."}`;
  }
  if (p.includes("budget") || p.includes("dépense") || p.includes("spend")) {
    return fr
      ? `Tu as dépensé ${k.spend.toFixed(0)}€ pour ${k.income.toFixed(0)}€ de revenus. Solde net: ${k.net.toFixed(0)}€. Réduire une dépense récurrente de 30€/mois améliorera ton taux d'épargne de ~1pt.`
      : `You spent €${k.spend.toFixed(0)} against €${k.income.toFixed(0)} income. Net €${k.net.toFixed(0)}. Cutting one recurring €30/mo boosts savings ~1pt.`;
  }
  if (p.includes("runway") || p.includes("destiny")) {
    return fr
      ? k.runway.kind === "growth"
        ? "Tu es en croissance: revenus ≥ dépenses. Continue d'investir l'excédent."
        : `Runway estimé: ${Math.floor(k.runway.months ?? 0)} mois. Augmente le coussin en réduisant une dépense fixe.`
      : k.runway.kind === "growth"
      ? "You're growing: income ≥ spend. Invest the surplus."
      : `Estimated runway: ${Math.floor(k.runway.months ?? 0)} months. Cut one fixed cost to extend it.`;
  }
  return fr
    ? `Mode hors-ligne: je réponds avec tes données locales. Solde net ce mois: ${k.net.toFixed(0)}€, épargne ${rate}%. Repose ta question avec un mot-clé (épargne, budget, runway).`
    : `Offline mode: I answer from your local data. Net €${k.net.toFixed(0)}, savings ${rate}%. Try a keyword (savings, budget, runway).`;
}

function AssistantPage() {
  const { t, locale } = useI18n();
  const online = useOnlineStatus();
  const { tx, cash } = useTxStore();
  const k = computeKpisFrom(tx, cash);
  const ask = useServerFn(chatAI);

  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    if (!online) {
      const reply = offlineReply(text, k, locale);
      setMessages([...next, { role: "assistant", content: reply }]);
      setLoading(false);
      return;
    }

    try {
      const res = await ask({
        data: {
          messages: next.map((m) => ({ role: m.role, content: m.content })),
          locale,
          snapshot: {
            income: k.income, spend: k.spend, net: k.net,
            savingsRate: k.savingsRate, cash: k.cash,
          },
        },
      });
      const reply = res.ok
        ? res.text
        : res.error === "rate_limited"
        ? (locale === "fr" ? "Trop de requêtes, réessaie dans un instant." : "Rate limit, retry in a moment.")
        : res.error === "credits_exhausted"
        ? (locale === "fr" ? "Crédits IA épuisés, ajoute du crédit dans ton workspace." : "AI credits exhausted.")
        : offlineReply(text, k, locale);
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch {
      setMessages([...next, { role: "assistant", content: offlineReply(text, k, locale) }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = locale === "fr"
    ? ["Comment améliorer mon épargne ?", "Analyse mes dépenses du mois", "Quel est mon runway ?"]
    : ["How to improve my savings?", "Analyse this month's spending", "What is my runway?"];

  return (
    <AppShell>
      <PageHeader
        title={t("section.assistant")}
        subtitle={online ? (locale === "fr" ? "IA connectée" : "AI online") : t("assistant.offline")}
      />

      <div ref={scrollRef} className="space-y-2 pb-32">
        {messages.length === 0 && (
          <Card>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
              <Sparkles className="h-4 w-4" style={{ color: "var(--color-primary)" }} />
              {locale === "fr" ? "Pose-moi une question" : "Ask me anything"}
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setInput(s)}
                  className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-foreground hover:bg-muted"
                >
                  {s}
                </button>
              ))}
            </div>
          </Card>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className="max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed"
              style={{
                background: m.role === "user" ? "var(--color-primary)" : "var(--color-card)",
                color: m.role === "user" ? "var(--color-primary-foreground)" : "var(--color-foreground)",
                boxShadow: m.role === "user" ? "none" : "var(--shadow-card)",
              }}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-card px-3.5 py-2.5 text-sm text-muted-foreground" style={{ boxShadow: "var(--shadow-card)" }}>
              <span className="inline-flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current" style={{ animationDelay: "0ms" }} />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current" style={{ animationDelay: "120ms" }} />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current" style={{ animationDelay: "240ms" }} />
              </span>
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={send}
        className="fixed inset-x-0 bottom-[68px] z-40 mx-auto max-w-2xl px-3 pb-2 safe-bottom"
      >
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface p-1.5" style={{ boxShadow: "var(--shadow-elevated)" }}>
          {!online && <WifiOff className="ml-2 h-4 w-4 text-muted-foreground" />}
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("assistant.placeholder")}
            className="flex-1 bg-transparent px-2 py-2 text-sm outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-primary-foreground disabled:opacity-40"
            style={{ background: "var(--color-primary)" }}
            aria-label={t("assistant.send")}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </AppShell>
  );
}
