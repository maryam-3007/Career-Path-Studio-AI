"use client";
import Link from "next/link";
import Image from "next/image"; 
import { Compass, FileText, ArrowRight, CheckCircle2, Sparkles, Target } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-emerald-500/10 selection:text-emerald-700 overflow-x-hidden relative antialiased dark:bg-slate-950 dark:text-slate-100">
      
      {/* CSS Keyframes for Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float-slow { 0%, 100% { transform: translateY(0px) scale(1); } 50% { transform: translateY(-15px) scale(1.05); } }
        @keyframes draw-underline { from { width: 0%; opacity: 0; } to { width: 100%; opacity: 1; } }
        @keyframes fade-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-float { animation: float-slow 7s ease-in-out infinite; }
        .animate-underline { animation: draw-underline 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; animation-delay: 0.8s; }
        .animate-fade-up { animation: fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />

      <div className="absolute top-[-10%] left-[-10%] -z-10 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-emerald-400/10 to-teal-400/5 blur-[100px] animate-float pointer-events-none" />
      <div className="absolute top-[30%] right-[-5%] -z-10 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-teal-400/10 to-emerald-400/5 blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/70 backdrop-blur-md px-6 py-4 shadow-sm dark:border-slate-800/80 dark:bg-slate-950/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3 group">
            <div className="rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 p-2.5 text-white shadow-md">
              <Compass size={22} />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">CareerPath <span className="text-emerald-600 dark:text-emerald-400">Studio</span></span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login" className="rounded-xl bg-white px-5 py-2 text-sm font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-800">
              Sign In
            </Link>
          </div>
        </div>
      </nav>

{/* Hero */}
<header className="mx-auto max-w-7xl px-6 pt-28 pb-20 text-center">
  
  {/* Badge */}
  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/50 px-4 py-1.5 text-xs font-semibold text-emerald-600 mb-8 backdrop-blur-sm opacity-0 animate-fade-up">
    <Sparkles size={12} className="animate-spin" /> Powered by Dynamic Assessment Matching
  </div>
  
  <h1 className="text-5xl font-black tracking-tight text-slate-900 sm:text-7xl mb-8 relative opacity-0 animate-fade-up [animation-delay:0.2s] [animation-fill-mode:forwards] dark:text-white">
    Navigate Your Career with{" "}
    <span className="relative inline-block text-slate-900 dark:text-white">
      Absolute Clarity
      <span className="absolute bottom-1 left-0 h-[8px] bg-gradient-to-r from-emerald-400 via-teal-400 to-transparent -z-10 rounded-full w-0 opacity-0 animate-underline" />
    </span>
  </h1>
  
  <p className="mx-auto max-w-2xl text-lg text-slate-500 mb-16 opacity-0 animate-fade-up [animation-delay:0.4s] [animation-fill-mode:forwards] dark:text-slate-400">
    Take a personalized dynamic interest evaluation, unlock tailored technical blueprints, 
    and compile an industry-vetted CV optimized for real-world workflows.
  </p>

  <div className="opacity-0 animate-fade-up [animation-delay:0.6s] [animation-fill-mode:forwards]">
    <Link href="/login" className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-4.5 text-base font-bold text-white shadow-lg transition-all hover:scale-[1.02]">
      Get Started Free <ArrowRight size={18} />
    </Link>
  </div>
</header>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 py-12 opacity-0 animate-fade-up [animation-delay:0.4s] [animation-fill-mode:forwards]">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:border-emerald-300 transition-all hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-500/40">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-all dark:bg-emerald-500/10 dark:text-emerald-400">
              <Target size={22} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Smart Career Guidance</h3>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed dark:text-slate-400">Map out your enthusiasm—coding, strategy, or design—and get instant roadmaps for modern tech ecosystems.</p>
          </div>
          
          <div className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:border-teal-300 transition-all hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-500/40">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600 mb-4 group-hover:bg-teal-600 group-hover:text-white transition-all dark:bg-teal-500/10 dark:text-teal-400">
              <FileText size={22} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Live Workspace Canvas</h3>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed dark:text-slate-400">Construct your milestones in a split-pane system. Watch changes reflect instantly on a calibrated PDF wrapper.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
<footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
  <div className="mx-auto max-w-7xl px-6 py-16">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
      <div className="col-span-2 md:col-span-1">
        <div className="flex items-center gap-2 mb-4">
          <div className="rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 p-2 text-white">
            <Compass size={18} />
          </div>
          <span className="text-lg font-bold text-slate-900 dark:text-white">CareerPath Studio</span>
        </div>
        <p className="text-sm text-slate-500 leading-relaxed dark:text-slate-400">
          Empowering professionals to navigate their future with AI-driven insights and precision tooling.
        </p>
      </div>

      <div>
        <h4 className="font-bold text-slate-900 mb-4 dark:text-white">About</h4>
        <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
          <li><Link href="/features" className="hover:text-emerald-600 transition-colors dark:hover:text-emerald-400">Features</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="font-bold text-slate-900 mb-4 dark:text-white">Resources</h4>
        <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
          <li><Link href="/faq" className="hover:text-emerald-600 transition-colors dark:hover:text-emerald-400">Support</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="font-bold text-slate-900 mb-4 dark:text-white">Legal</h4>
        <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
          <li><Link href="/privacy" className="hover:text-emerald-600 transition-colors dark:hover:text-emerald-400">Privacy Policy</Link></li>
          <li><Link href="/terms" className="hover:text-emerald-600 transition-colors dark:hover:text-emerald-400">Terms of Service</Link></li>
        </ul>
      </div>
    </div>

    <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-center items-center gap-4 dark:border-slate-800">
      <p className="text-xs text-slate-400 dark:text-slate-500">
        © {new Date().getFullYear()} CareerPath Studio Inc. All rights reserved.
      </p>
    </div>
  </div>
</footer>
    </div>
  );
}