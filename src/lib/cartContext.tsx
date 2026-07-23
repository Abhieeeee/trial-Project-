"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { products as catalogProducts } from "@/lib/catalog";

export interface CartItem {
  id: string;
  name: string;
  price: string;
  numericPrice: number;
  category: string;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Partial<CartItem> & { id: string }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  freeShippingThreshold: number;
  
  // Promo Code Engine
  appliedCode: string | null;
  discountPercent: number;
  applyDiscount: (code: string) => { success: boolean; message: string };
  removeDiscount: () => void;
  discountAmount: number;
  finalTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  const freeShippingThreshold = 200;

  // Initialize cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("aura_street_cart");
      if (saved) {
        setItems(JSON.parse(saved));
      } else {
        const initial = catalogProducts.slice(0, 2).map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          numericPrice: p.numericPrice,
          category: p.category,
          image: p.image,
          quantity: 1,
        }));
        setItems(initial);
      }
    } catch {}
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem("aura_street_cart", JSON.stringify(items));
    } catch {}
  }, [items]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const addItem = (newItem: Partial<CartItem> & { id: string }) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === newItem.id);
      if (existing) {
        return prev.map((i) =>
          i.id === newItem.id ? { ...i, quantity: i.quantity + (newItem.quantity || 1) } : i
        );
      }

      const catalogMatch = catalogProducts.find((p) => p.id === newItem.id);
      const fullItem: CartItem = {
        id: newItem.id,
        name: newItem.name || catalogMatch?.name || "Cyber Techwear Apparel",
        price: newItem.price || catalogMatch?.price || "€160.00",
        numericPrice: newItem.numericPrice || catalogMatch?.numericPrice || 160,
        category: newItem.category || catalogMatch?.category || "Hoodies",
        image: newItem.image || catalogMatch?.image || "/hero-editorial.png",
        quantity: newItem.quantity || 1,
      };

      return [...prev, fullItem];
    });
    setIsOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) => {
          if (i.id === id) {
            const next = i.quantity + delta;
            return next > 0 ? { ...i, quantity: next } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCode(null);
    setDiscountPercent(0);
  };

  const applyDiscount = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === "AURA10") {
      setAppliedCode("AURA10");
      setDiscountPercent(10);
      return { success: true, message: "Code AURA10 applied: 10% Discount Unlocked!" };
    } else if (cleanCode === "NEPAL2026") {
      setAppliedCode("NEPAL2026");
      setDiscountPercent(15);
      return { success: true, message: "Code NEPAL2026 applied: 15% VIP Nepal Discount Unlocked!" };
    } else if (cleanCode === "FREESHIP") {
      setAppliedCode("FREESHIP");
      setDiscountPercent(5);
      return { success: true, message: "Code FREESHIP applied: Free Shipping & 5% Off!" };
    } else {
      return { success: false, message: "Invalid promo code. Try 'AURA10' or 'NEPAL2026'." };
    }
  };

  const removeDiscount = () => {
    setAppliedCode(null);
    setDiscountPercent(0);
  };

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.numericPrice * i.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        freeShippingThreshold,
        appliedCode,
        discountPercent,
        applyDiscount,
        removeDiscount,
        discountAmount,
        finalTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
