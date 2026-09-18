"use client";
import Link from "next/link";
import { ArrowLeft, Compass, Lock } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function PrivacyPage() {
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

      {/* Main Header Section */}
      <div className="mb-12 max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl text-white shadow-lg shadow-emerald-200/50">
            <Lock size={32} />
          </div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white">Privacy Policy</h1>
        </div>
        <p className="text-xl text-slate-600 max-w-2xl dark:text-slate-400">
          Your trust is our most valuable asset. We are committed to protecting your personal information.
        </p>
      </div>
      
      {/* Content Card */}
      <div className="bg-white/80 backdrop-blur-sm p-10 md:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-10 w-full max-w-7xl mx-auto relative z-10 dark:bg-slate-900/70 dark:border-slate-800">
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4 dark:text-white">Information We Collect</h2>
          <p className="text-lg text-slate-500 leading-relaxed max-w-3xl dark:text-slate-400">
            We collect information you provide directly to us, such as your profile details, career interests, and assessment responses. 
            This data is used solely to provide and improve our personalized career guidance services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4 dark:text-white">Data Security</h2>
          <p className="text-lg text-slate-500 leading-relaxed max-w-3xl dark:text-slate-400">
            We implement industry-standard encryption and security protocols to ensure that your data is protected against 
            authorized access, alteration, or disclosure. We believe in transparency and keeping your professional journey secure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4 dark:text-white">Data Usage</h2>
          <p className="text-lg text-slate-500 leading-relaxed max-w-3xl dark:text-slate-400">
            Your data is never sold to third-party advertisers. It is strictly used to optimize your experience, 
            generate your CV, and provide the technical blueprints necessary for your success.
          </p>
        </section>

        <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
          <p className="text-sm text-slate-400 dark:text-slate-500">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </main>
  );
}