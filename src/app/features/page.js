"use client";
import Link from "next/link";
import { ArrowLeft, Compass, Sparkles } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function FeaturesPage() {
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

      {/* Main Hero Section */}
      <div className="mb-12 max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl text-white shadow-lg shadow-emerald-200/50">
            <Sparkles size={32} />
          </div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white">Platform Features</h1>
        </div>
        <p className="text-xl text-slate-600 max-w-2xl dark:text-slate-400">
          Built for professionals who demand absolute clarity in their career trajectory.
        </p>
      </div>
      
      {/* Features Grid: Stretches with screen width */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto relative z-10">
        {[
          { title: "Dynamic Interest Assessment", desc: "Our AI-driven evaluation identifies your core competencies and passion points, mapping them against high-growth industry sectors." },
          { title: "Smart CV Builder", desc: "Automate your resume creation with our industry-vetted templates designed to pass ATS screening every single time." },
          { title: "Technical Blueprints", desc: "Receive curated, step-by-step learning paths for tech stacks that are currently in high demand." },
          { title: "Live Workspace Canvas", desc: "A unified dashboard where you can track your skill progression, milestone completions, and career goals in one view." }
        ].map((f, i) => (
          <div key={i} className="p-8 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-3xl shadow-sm hover:border-emerald-300/60 hover:shadow-md transition-all duration-300 hover:-translate-y-1 dark:bg-slate-900/70 dark:border-slate-800">
            <h3 className="text-xl font-bold mb-3 text-emerald-600">{f.title}</h3>
            <p className="text-slate-500 leading-relaxed text-sm dark:text-slate-400">{f.desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
}