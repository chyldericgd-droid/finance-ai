import { useEffect, useSyncExternalStore } from "react";
import type { Tx } from "./mock-data";
import { transactions as seed, cash as seedCash } from "./mock-data";

const KEY_TX = "fa.tx.v1";
const KEY_CASH = "fa.cash.v1";

type State = { tx: Tx[]; cash: number };

let state: State = { tx: seed, cash: seedCash };
const listeners = new Set<() => void>();

function load() {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(KEY_TX);
    const cashRaw = window.localStorage.getItem(KEY_CASH);
    if (raw) state.tx = JSON.parse(raw);
    if (cashRaw) state.cash = Number(cashRaw);
  } catch {}
}

function persist() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY_TX, JSON.stringify(state.tx));
  window.localStorage.setItem(KEY_CASH, String(state.cash));
}

function emit() {
  state = { ...state };
  persist();
  for (const l of listeners) l();
}

export const txStore = {
  add(tx: Omit<Tx, "id">) {
    state.tx = [{ ...tx, id: crypto.randomUUID() }, ...state.tx];
    emit();
  },
  remove(id: string) {
    state.tx = state.tx.filter((t) => t.id !== id);
    emit();
  },
  setCash(c: number) {
    state.cash = c;
    emit();
  },
  reset() {
    state = { tx: seed, cash: seedCash };
    emit();
  },
  get() {
    return state;
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

let loaded = false;
export function useTxStore() {
  useEffect(() => {
    if (!loaded) {
      load();
      loaded = true;
      for (const l of listeners) l();
    }
  }, []);
  return useSyncExternalStore(
    (cb) => txStore.subscribe(cb),
    () => state,
    () => state,
  );
}

export function computeKpisFrom(tx: Tx[], cash: number) {
  const income = tx.filter((t) => t.amount > 0).reduce((a, b) => a + b.amount, 0);
  const spend = tx.filter((t) => t.amount < 0).reduce((a, b) => a + Math.abs(b.amount), 0);
  const net = income - spend;
  const savingsRate = income > 0 ? net / income : 0;
  let runway: { kind: "growth" | "months" | "critical"; months?: number };
  if (income >= spend) runway = { kind: "growth" };
  else {
    const months = cash / (spend - income);
    runway = months < 2 ? { kind: "critical", months } : { kind: "months", months };
  }
  return { income, spend, net, savingsRate, runway, cash };
}
