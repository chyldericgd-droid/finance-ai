import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().min(1).max(4000),
});

const InputSchema = z.object({
  messages: z.array(MessageSchema).min(1).max(40),
  locale: z.enum(["fr", "en"]).default("fr"),
  snapshot: z
    .object({
      income: z.number(),
      spend: z.number(),
      net: z.number(),
      savingsRate: z.number(),
      cash: z.number(),
      topCategories: z.array(z.object({ name: z.string(), value: z.number() })).max(10).optional(),
    })
    .optional(),
});

export const chatAI = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) {
      return { ok: false as const, error: "AI key missing on server." };
    }

    const lang = data.locale === "fr" ? "français" : "English";
    const sys = [
      `Tu es Finance-AI, un coach financier personnel. Réponds en ${lang}, court (3-6 phrases max), concret, bienveillant, sans jargon.`,
      `Donne 1 conseil actionnable par réponse. Utilise les données fournies pour personnaliser.`,
      data.snapshot
        ? `Données utilisateur ce mois: revenus=${data.snapshot.income.toFixed(0)}€, dépenses=${data.snapshot.spend.toFixed(0)}€, solde net=${data.snapshot.net.toFixed(0)}€, taux d'épargne=${Math.round(data.snapshot.savingsRate * 100)}%, cash=${data.snapshot.cash.toFixed(0)}€.`
        : "",
    ].filter(Boolean).join("\n");

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [{ role: "system", content: sys }, ...data.messages],
        }),
      });

      if (res.status === 429) return { ok: false as const, error: "rate_limited" };
      if (res.status === 402) return { ok: false as const, error: "credits_exhausted" };
      if (!res.ok) {
        const t = await res.text();
        console.error("AI gateway error", res.status, t);
        return { ok: false as const, error: "gateway_error" };
      }
      const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
      const text = json.choices?.[0]?.message?.content?.trim() ?? "";
      return { ok: true as const, text };
    } catch (e) {
      console.error(e);
      return { ok: false as const, error: "network_error" };
    }
  });
