"use client";

import { useEffect, useState } from "react";

export type CurrencyCode = "EUR" | "NPR" | "USD" | "GBP" | "JPY" | "INR" | "AUD" | "CAD";

export const currencies: Record<CurrencyCode, { symbol: string; rate: number; label: string; flag: string }> = {
  EUR: { symbol: "€", rate: 1.0, label: "EUR // € (Euro)", flag: "🇪🇺" },
  NPR: { symbol: "Rs. ", rate: 145.0, label: "NPR // रु (Nepal)", flag: "🇳🇵" },
  USD: { symbol: "$", rate: 1.08, label: "USD // $ (US Dollar)", flag: "🇺🇸" },
  GBP: { symbol: "£", rate: 0.84, label: "GBP // £ (British Pound)", flag: "🇬🇧" },
  JPY: { symbol: "¥", rate: 172.5, label: "JPY // ¥ (Japanese Yen)", flag: "🇯🇵" },
  INR: { symbol: "₹", rate: 90.5, label: "INR // ₹ (Indian Rupee)", flag: "🇮🇳" },
  AUD: { symbol: "A$", rate: 1.63, label: "AUD // A$ (Australian Dollar)", flag: "🇦🇺" },
  CAD: { symbol: "C$", rate: 1.48, label: "CAD // C$ (Canadian Dollar)", flag: "🇨🇦" },
};

let listeners: Array<(currency: CurrencyCode) => void> = [];

export function getCurrency(): CurrencyCode {
  if (typeof window === "undefined") return "EUR";
  return (localStorage.getItem("aura_currency") as CurrencyCode) || "EUR";
}

export function setCurrency(code: CurrencyCode) {
  if (typeof window !== "undefined") {
    localStorage.setItem("aura_currency", code);
    listeners.forEach((listener) => listener(code));
  }
}

export function useCurrency() {
  const [currency, setCurrencyState] = useState<CurrencyCode>("EUR");

  useEffect(() => {
    setCurrencyState(getCurrency());

    const handleChange = (code: CurrencyCode) => {
      setCurrencyState(code);
    };

    listeners.push(handleChange);
    return () => {
      listeners = listeners.filter((l) => l !== handleChange);
    };
  }, []);

  const formatPrice = (basePriceEur: number) => {
    const activeCurrency = currencies[currency] || currencies.EUR;
    const { symbol, rate } = activeCurrency;
    const converted = basePriceEur * rate;

    if (currency === "JPY" || currency === "NPR" || currency === "INR") {
      return `${symbol}${Math.round(converted).toLocaleString("en-US")}`;
    }
    return `${symbol}${converted.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return { currency, setCurrency, formatPrice, currencies };
}
