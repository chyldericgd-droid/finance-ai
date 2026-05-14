import { useState } from "react";
import { Plus, X, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { txStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";

const CATEGORIES = [
  "income", "housing", "groceries", "leisure", "transport", "health", "subs", "other",
];

export function AddTransactionFAB() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        aria-label="Ajouter"
        onClick={() => setOpen(true)}
        className="fixed bottom-[96px] right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full text-primary-foreground shadow-elevated transition-transform active:scale-95"
        style={{ background: "var(--color-primary)", boxShadow: "var(--shadow-elevated)" }}
      >
        <Plus className="h-6 w-6" strokeWidth={2.4} />
      </button>
      {open && <AddSheet onClose={() => setOpen(false)} />}
    </>
  );
}

function AddSheet({ onClose }: { onClose: () => void }) {
  const { t } = useI18n();
  const [type, setType] = useState<"expense" | "income">("expense");
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("groceries");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = parseFloat(amount.replace(",", "."));
    if (!label.trim() || !Number.isFinite(n) || n <= 0) return;
    txStore.add({
      date: new Date().toISOString().slice(0, 10),
      label: label.trim(),
      category: type === "income" ? "income" : category,
      amount: type === "income" ? Math.abs(n) : -Math.abs(n),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 animate-fade-in-up" onClick={onClose}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="w-full max-w-2xl rounded-t-3xl bg-surface p-5 pb-8 safe-bottom"
        style={{ boxShadow: "var(--shadow-elevated)" }}
      >
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-muted" />
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Nouvelle opération</h2>
          <button type="button" onClick={onClose} className="rounded-full p-1.5 text-muted-foreground hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setType("expense")}
            className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-colors"
            style={{
              background: type === "expense" ? "var(--color-destructive)" : "var(--color-muted)",
              color: type === "expense" ? "var(--color-destructive-foreground)" : "var(--color-foreground)",
            }}
          >
            <ArrowDownRight className="h-4 w-4" /> Dépense
          </button>
          <button
            type="button"
            onClick={() => setType("income")}
            className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-colors"
            style={{
              background: type === "income" ? "var(--color-success)" : "var(--color-muted)",
              color: type === "income" ? "var(--color-success-foreground)" : "var(--color-foreground)",
            }}
          >
            <ArrowUpRight className="h-4 w-4" /> Revenu
          </button>
        </div>

        <label className="mb-3 block">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">Libellé</span>
          <input
            autoFocus
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Courses, Salaire…"
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </label>

        <label className="mb-3 block">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">Montant (€)</span>
          <input
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0,00"
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-base font-semibold tabular-nums outline-none focus:ring-2 focus:ring-ring"
          />
        </label>

        {type === "expense" && (
          <label className="mb-4 block">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">Catégorie</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              {CATEGORIES.filter((c) => c !== "income").map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
        )}

        <button
          type="submit"
          className="w-full rounded-xl py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          style={{ background: "var(--color-primary)" }}
        >
          Ajouter
        </button>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">{t("assistant.offline").includes("Local") ? "Sauvegardé localement sur l'appareil." : "Saved locally on device."}</p>
      </form>
    </div>
  );
}
