"use client";

import { useEffect, useState } from "react";

export type CurrencyCode = "EUR" | "USD" | "GBP" | "JPY";

export const currencies: Record<CurrencyCode, { symbol: string; rate: number; label: string }> = {
  EUR: { symbol: "€", rate: 1.0, label: "EN // EUR" },
  USD: { symbol: "$", rate: 1.08, label: "US // USD" },
  GBP: { symbol: "£", rate: 0.84, label: "UK // GBP" },
  JPY: { symbol: "¥", rate: 172.5, label: "JP // JPY" },
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
    const { symbol, rate } = currencies[currency];
    const converted = basePriceEur * rate;
    if (currency === "JPY") {
      return `${symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${symbol}${converted.toFixed(2)}`;
  };

  return { currency, setCurrency, formatPrice, currencies };
}
