"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { products as catalogProducts, type Product } from "@/lib/catalog";

export interface WishlistItem {
  id: string;
  name: string;
  price: string;
  numericPrice: number;
  category: string;
  image: string;
  slug: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  isOpen: boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
  toggleWishlist: (item: Partial<WishlistItem> & { id: string }) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  totalWishlist: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Initialize wishlist from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("aura_street_wishlist");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {}
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem("aura_street_wishlist", JSON.stringify(items));
    } catch {}
  }, [items]);

  const openWishlist = () => setIsOpen(true);
  const closeWishlist = () => setIsOpen(false);

  const isInWishlist = (id: string) => items.some((i) => i.id === id);

  const toggleWishlist = (item: Partial<WishlistItem> & { id: string }) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      if (exists) {
        return prev.filter((i) => i.id !== item.id);
      }

      const catalogMatch = catalogProducts.find((p) => p.id === item.id || p.slug === item.slug);
      const fullItem: WishlistItem = {
        id: item.id,
        name: item.name || catalogMatch?.name || "Cyber Fashion Piece",
        price: item.price || catalogMatch?.price || "€160.00",
        numericPrice: item.numericPrice || catalogMatch?.numericPrice || 160,
        category: item.category || catalogMatch?.category || "Hoodies",
        image: item.image || catalogMatch?.image || "/hero-editorial.png",
        slug: item.slug || catalogMatch?.slug || "hoodie",
      };

      return [...prev, fullItem];
    });
    setIsOpen(true); // Auto-open wishlist drawer on add!
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        isOpen,
        openWishlist,
        closeWishlist,
        toggleWishlist,
        removeItem,
        isInWishlist,
        totalWishlist: items.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
