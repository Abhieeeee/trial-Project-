import { useEffect, useRef } from "react";

export function useFocusTrap<T extends HTMLElement = HTMLDivElement>(isActive: boolean) {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const element = containerRef.current;
    const focusableElements = element.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Auto focus first element
    if (firstElement) {
      setTimeout(() => firstElement.focus(), 50);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isActive]);

  return containerRef;
}
