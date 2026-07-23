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
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const freeShippingThreshold = 200;

  // Initialize cart from localStorage or default catalog items
  useEffect(() => {
    try {
      const saved = localStorage.getItem("aura_street_cart");
      if (saved) {
        setItems(JSON.parse(saved));
      } else {
        // Initial sample cart items for immediate preview
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
    } catch {
      // Fallback
    }
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

      // Lookup in catalog if metadata is incomplete
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
    setIsOpen(true); // Auto-open quick cart drawer when item is added!
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

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.numericPrice * i.quantity, 0);

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
