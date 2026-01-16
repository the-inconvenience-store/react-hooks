"use client";

import { useEffect, useRef } from "react";
import { useIsMobile } from "./use-mobile";

interface UseAutoFocusOptions {
  /** Whether to re-focus when the tab/window regains visibility. Default: true */
  focusOnVisibilityChange?: boolean;
  /** Whether to disable auto-focus on mobile devices. Default: false */
  disableOnMobile?: boolean;
  /** Delay in ms before focusing. Default: 0 */
  delay?: number;
  /** Whether auto-focus is enabled. Default: true */
  enabled?: boolean;
}

/**
 * Hook to automatically focus an input element on mount and optionally
 * when the tab/window regains focus.
 *
 * @param options - Configuration options for auto-focus behavior
 * @returns A ref to attach to the input element
 */
export function useAutoFocus<T extends HTMLElement = HTMLInputElement>(
  options: UseAutoFocusOptions = {}
) {
  const {
    focusOnVisibilityChange = true,
    disableOnMobile = false,
    delay = 0,
    enabled = true,
  } = options;

  const ref = useRef<T>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Skip if disabled or on mobile when disableOnMobile is true
    if (!enabled || (disableOnMobile && isMobile)) {
      return;
    }

    const focus = () => {
      if (ref.current) {
        ref.current.focus();
      }
    };

    // Focus on mount (with optional delay)
    const timer = setTimeout(focus, delay);

    // Handle visibility change (tab/window focus)
    const handleVisibilityChange = () => {
      if (focusOnVisibilityChange && document.visibilityState === "visible") {
        focus();
      }
    };

    if (focusOnVisibilityChange) {
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }

    return () => {
      clearTimeout(timer);
      if (focusOnVisibilityChange) {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
      }
    };
  }, [enabled, focusOnVisibilityChange, disableOnMobile, isMobile, delay]);

  return ref;
}
