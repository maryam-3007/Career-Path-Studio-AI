"use client";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Compass } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function TermsPage() {
  return (
    <main className="w-full min-h-screen bg-slate-50 px-6 py-12 text-slate-800 selection:bg-emerald-500/10 selection:text-emerald-700 overflow-x-hidden relative antialiased dark:bg-slate-950 dark:text-slate-100">
      
      {/* Background Decorative Blurs */}
      <div className="absolute top-[-10%] left-[-10%] -z-10 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-emerald-400/10 to-teal-400/5 blur-[100px] pointer-events-none dark:from-emerald-500/5 dark:to-teal-500/5" />
      <div className="absolute top-[30%] right-[-5%] -z-10 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-teal-400/10 to-emerald-400/5 blur-[120px] pointer-events-none dark:from-teal-500/5 dark:to-emerald-500/5" />

      {/* Header: Back Button & Brand */}
      <div className="flex items-center justify-between mb-12 max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-slate-500 font-medium hover:text-emerald-600 transition-colors dark:text-slate-400 dark:hover:text-emerald-400"
          >
            <ArrowLeft size={16} /> Back
          </Link>
          
          <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-700" /> 

          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-1.5 rounded-lg text-white shadow-sm">
              <Compass size={18} />
            </div>
            <span className="font-bold text-slate-900 tracking-tight text-lg dark:text-white">
              CareerPath <span className="text-emerald-600 dark:text-emerald-400">Studio</span>
            </span>
          </div>
        </div>
        <ThemeToggle />
      </div>

      {/* Main Title section */}
      <div className="flex items-center gap-4 mb-10 max-w-7xl mx-auto relative z-10">
        <div className="p-3 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl text-white shadow-lg shadow-emerald-200/50">
          <ShieldCheck size={32} />
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white">Terms of Service</h1>
      </div>

      {/* Content Card */}
      <div className="bg-white/80 backdrop-blur-sm p-10 rounded-3xl border border-slate-200 shadow-sm space-y-8 w-full max-w-7xl mx-auto relative z-10 dark:bg-slate-900/70 dark:border-slate-800">
        <p className="text-lg text-slate-600 leading-relaxed dark:text-slate-400">
          Welcome to <span className="font-bold text-slate-900 dark:text-white">CareerPath Studio</span>. By accessing our platform, you agree to comply with and be bound by the following terms and conditions.
        </p>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3 dark:text-white">1. Use of Service</h2>
          <p className="text-slate-500 leading-relaxed dark:text-slate-400">
            You agree to use our services only for lawful purposes. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3 dark:text-white">2. Intellectual Property</h2>
          <p className="text-slate-500 leading-relaxed dark:text-slate-400">
            All content, features, and functionality on CareerPath Studio—including but not limited to text, graphics, logos, and software—are the exclusive property of CareerPath Studio Inc. and are protected by international copyright and intellectual property laws.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3 dark:text-white">3. Termination</h2>
          <p className="text-slate-500 leading-relaxed dark:text-slate-400">
            We reserve the right to terminate or suspend your account at our sole discretion, without prior notice, if you violate these terms or engage in conduct we deem harmful to the platform or other users.
          </p>
        </section>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
          <p className="text-sm text-slate-400 dark:text-slate-500">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </main>
  );
}