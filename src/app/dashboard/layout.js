"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import Link from "next/link";
import { Compass, LogOut, FileText, BarChart3, Briefcase } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

// useSearchParams() requires a Suspense boundary during static generation,
// so the hook-using logic lives in an inner component wrapped below.
export default function DashboardLayout({ children }) {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent shadow-sm" />
      </div>
    }>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </Suspense>
  );
}

function DashboardLayoutInner({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const activeTab = searchParams.get("tab") || "guidance";

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent shadow-sm" />
      </div>
    );
  }

  const isGuidanceActive = pathname === "/dashboard" && activeTab === "guidance";
  const isCvBuilderActive = pathname === "/dashboard" && activeTab === "cv-builder";
  const isAtsCheckerActive = pathname === "/dashboard/ats-checker";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased dark:bg-slate-950 dark:text-slate-100">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes custom-typing { from { width: 0 } to { width: 100% } }
        @keyframes custom-blink { from, to { border-color: transparent } 50% { border-color: #059669 } }
        .animate-typewriter-line {
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          border-right: 2px solid #059669;
          animation: custom-typing 3.5s steps(40, end), custom-blink 0.75s step-end infinite;
        }
      `}} />

      {/* Top Application Bar */}
      <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md px-4 sm:px-6 py-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="shrink-0 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 p-2 text-white shadow-md shadow-emerald-500/20">
              <Compass size={20} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 truncate dark:text-white">CareerPath Workspace</span>
              <p className="hidden sm:block text-[11px] text-slate-500 font-medium max-w-fit animate-typewriter-line dark:text-slate-400">
                Architecting professional vectors systematically.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <div className="flex items-center gap-2.5 bg-slate-100 border border-slate-200 rounded-full pl-2 pr-3 py-1 dark:bg-slate-800 dark:border-slate-700">
              {session?.user?.image && (
                <img src={session.user.image} alt="Avatar" className="h-6 w-6 rounded-full border border-slate-300 dark:border-slate-600" />
              )}
              <span className="hidden sm:inline text-xs font-semibold text-slate-700 dark:text-slate-200 max-w-[10rem] truncate">{session?.user?.name || "User Identity"}</span>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 sm:px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-red-600 hover:border-red-200 transition-all shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-red-400"
            >
              <LogOut size={13} /> <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

{/* Main Layout Body */}
<main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
  <div className="mb-6 sm:mb-8 flex gap-1 sm:gap-2 border-b border-slate-200 pb-px overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 [scrollbar-width:thin] dark:border-slate-800">
    
    {/* 1. Guidance Tab */}
    <Link
      href="/dashboard?tab=guidance"
      className={`shrink-0 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap px-3 sm:px-4 pb-3 text-xs sm:text-sm font-semibold transition-all relative ${
        isGuidanceActive ? "text-emerald-600 font-bold dark:text-emerald-400" : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
      }`}
    >
      <Compass size={16} className="shrink-0" /> <span>1. AI Career Guidance</span>
      {isGuidanceActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full dark:bg-emerald-400" />}
    </Link>
    
    {/* 2. CV Workspace Tab */}
    <Link
      href="/dashboard?tab=cv-builder"
      className={`shrink-0 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap px-3 sm:px-4 pb-3 text-xs sm:text-sm font-semibold transition-all relative ${
        isCvBuilderActive ? "text-emerald-600 font-bold dark:text-emerald-400" : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
      }`}
    >
      <FileText size={16} className="shrink-0" /> <span>2. CV Workspace</span>
      {isCvBuilderActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full dark:bg-emerald-400" />}
    </Link>

    {/* 3. Interview Tab */}
    <Link
      href="/dashboard?tab=interview"
      className={`shrink-0 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap px-3 sm:px-4 pb-3 text-xs sm:text-sm font-semibold transition-all relative ${
        activeTab === "interview" ? "text-emerald-600 font-bold dark:text-emerald-400" : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
      }`}
    >
      <Briefcase size={16} className="shrink-0" /> <span>3. Mock Interview</span>
      {activeTab === "interview" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full dark:bg-emerald-400" />}
    </Link>

    {/* 4. ATS Optimization Sandbox */}
    <Link
      href="/dashboard/ats-checker"
      className={`shrink-0 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap px-3 sm:px-4 pb-3 text-xs sm:text-sm font-semibold transition-all relative ${
        isAtsCheckerActive ? "text-emerald-600 font-bold dark:text-emerald-400" : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
      }`}
    >
      <BarChart3 size={16} className="shrink-0" /> <span>4. ATS Optimization</span>
      {isAtsCheckerActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full dark:bg-emerald-400" />}
    </Link>
  </div>

  {children}
</main>
    </div>
  );
}
