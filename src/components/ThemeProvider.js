"use client";
import { createContext, useContext, useEffect, useState, useSyncExternalStore } from "react";

const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
});

const listeners = new Set();
function subscribe(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerSnapshot() {
  return "light";
}

export function ThemeProvider({ children }) {
  const clientTheme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  
  const [overrideTheme, setOverrideTheme] = useState(null);

  const theme = overrideTheme ?? clientTheme;

  useEffect(() => {
    if (overrideTheme === null) return;

    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    try {
      localStorage.setItem("theme", theme);
    } catch (e) {
    }

    listeners.forEach((listener) => listener());
  }, [theme, overrideTheme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const setTheme = (nextTheme) => {
    const value = typeof nextTheme === "function" ? nextTheme(theme) : nextTheme;
    setOverrideTheme(value);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}