"use client";

import { useSyncExternalStore } from "react";
import { MoonIcon, SunIcon } from "@phosphor-icons/react";

type Mode = "light" | "dark";

const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  const query = window.matchMedia("(prefers-color-scheme: dark)");
  query.addEventListener("change", onChange);
  return () => {
    listeners.delete(onChange);
    query.removeEventListener("change", onChange);
  };
}

function getSnapshot(): Mode {
  const chosen = document.documentElement.dataset.theme;
  if (chosen === "light" || chosen === "dark") return chosen;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** Hydration snapshot. The inline script in the layout applies the real theme. */
function getServerSnapshot(): Mode {
  return "light";
}

export function ThemeToggle() {
  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const next: Mode = mode === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("ebidensya-theme", next);
    listeners.forEach((notify) => notify());
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={mode === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className="grid size-9 place-items-center rounded-[8px] border border-line text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink active:translate-y-px"
    >
      {mode === "dark" ? (
        <SunIcon size={17} weight="regular" />
      ) : (
        <MoonIcon size={17} weight="regular" />
      )}
    </button>
  );
}
