"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * A media query, read the same way the language provider reads localStorage:
 * through `useSyncExternalStore`, with a server snapshot that is always `false`.
 *
 * That last part is the whole point. Framer's own `useReducedMotion` reads the
 * real media query *during* hydration, so branching a component's structure on
 * it makes the server HTML and the first client render disagree. Here the first
 * client render always matches the server, and the true value lands in a normal
 * post-hydration re-render — which is exactly the behaviour a section that
 * mounts or skips a `<video>` needs.
 *
 * The snapshot is a boolean primitive, so it is referentially stable by
 * construction and `getSnapshot` can never loop.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
