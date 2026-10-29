"use client";

import { useContext } from "react";
import { CartContext } from "@/context/CartContext";
import type { CartContextValue } from "@/context/CartContext";

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
