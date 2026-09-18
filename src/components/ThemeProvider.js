"use client";
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  // Lazy-init directly from the DOM instead of setting state inside an
  // effect: the inline bootstrap script (in layout.js) already applied the
  // `dark` class to <html> before hydration, so we just read it once,
  // synchronously, during the first render. This avoids the "calling
  // setState synchronously within an effect" cascading-render warning.
  const [theme, setTheme] = useState(() => {
    if (typeof document === "undefined") return "light";
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  });

  // Keep the DOM class and localStorage in sync whenever theme changes
  // (including the very first render, which is fine here since it's just
  // re-applying the class/state that's already there).
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {
      // localStorage may be unavailable (private mode, etc.) — ignore.
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
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