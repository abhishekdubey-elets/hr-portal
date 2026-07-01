"use client";
import { useEffect, useState } from "react";

/**
 * Returns false on the server and during the first client render, then true
 * after mount. Use it to gate reads of persisted (localStorage-backed) store
 * state so the initial client render matches the server HTML and React does
 * not throw a hydration mismatch.
 */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
