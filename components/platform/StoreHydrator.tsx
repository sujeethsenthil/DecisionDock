"use client";

import { useEffect } from "react";
import { usePlatformStore } from "@/lib/store/platform";

// Triggers Zustand sessionStorage rehydration after first paint.
// Mounted once in the root layout so all pages benefit.
// With skipHydration:true in the store, this is the only rehydration trigger.
export function StoreHydrator() {
  useEffect(() => {
    usePlatformStore.persist.rehydrate();
  }, []);
  return null;
}
