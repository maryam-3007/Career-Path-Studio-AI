import "./globals.css";
// Self-hosted Poppins (via @fontsource) instead of next/font/google.
// This removes the build-time dependency on a live connection to Google
// Fonts (which breaks builds/dev servers on restricted or offline
// networks) and guarantees the *exact same* font files are available
// both on-screen and when the CV is captured for PDF export.
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import Script from "next/script";
import AuthProvider from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata = {
  title: "Career Guide & CV Builder",
  description: "Get personalized career guidance and build your professional CV.",
};

// Runs before React hydrates so the correct theme class is on <html>
// for the very first paint — this is what actually prevents the
// "flash of light mode" and the "dark mode resets on reload/new tab"
// bug: without it the class is only ever added client-side, after a
// user click, and is lost again on every full page load.
//
// This has to be a next/script `beforeInteractive` script rather than a
// plain <script> JSX tag: React 19 intentionally does not execute inline
// script content when it's produced by a client-side render pass (only
// when the browser parses it directly out of the initial HTML), so a raw
// <script dangerouslySetInnerHTML .../> can silently no-op and throws the
// "Scripts inside React components are never executed" warning. next/script
// with strategy="beforeInteractive" is Next's supported way to inject a
// script that must run before hydration.
const THEME_BOOTSTRAP_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var theme = stored === "dark" || stored === "light"
      ? stored
      : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="font-sans bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100 min-h-screen"
      >
        <Script
          id="theme-bootstrap"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }}
        />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}