"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Compass, ShieldCheck } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800 relative items-center justify-center p-6 overflow-hidden antialiased dark:bg-slate-950 dark:text-slate-100">
      
      {/* Background Mesh Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none -z-10 dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] dark:opacity-40" />

      {/* Ambient Gradient Glows (Ice Green Theme) */}
      <div className="absolute top-[-10%] left-[-10%] -z-10 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-emerald-400/20 to-teal-400/10 blur-[120px] pointer-events-none dark:from-emerald-500/10 dark:to-teal-500/5" />
      <div className="absolute bottom-[-10%] right-[-10%] -z-10 h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-emerald-500/10 to-teal-400/10 blur-[120px] pointer-events-none dark:from-emerald-500/5 dark:to-teal-500/5" />

      <div className="absolute top-8 right-8">
        <ThemeToggle />
      </div>

      {/* Back to Homepage */}
      <div className="absolute top-8 left-8">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-emerald-600 transition-colors group dark:text-slate-500 dark:hover:text-emerald-400"
        >
          <ArrowLeft size={30} className="transform group-hover:-translate-x-1 transition-transform duration-200" />
        </Link>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-md rounded-3xl border border-slate-200/60 bg-white/70 p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] backdrop-blur-2xl relative overflow-hidden dark:border-slate-800/60 dark:bg-slate-900/70">
        
        {/* Accent Bar */}
        <div className="absolute top-0 inset-x-0 h-[4px] bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-400" />
        
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20 mb-6">
            <Compass size={26} />
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Authorized Portal
          </h1>
          <p className="mt-3 text-sm text-slate-500 font-medium leading-relaxed max-w-[280px] mx-auto dark:text-slate-400">
            Securely access your workspace and synchronize your career data.
          </p>
        </div>

        {/* Auth Button */}
        <div className="mt-10">
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="group flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:bg-slate-50 hover:border-emerald-200 hover:text-emerald-700 active:scale-[0.98] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:border-emerald-500/40 dark:hover:text-emerald-400"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.58 14.96 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.6 2.8C6.01 6.96 8.76 5.04 12 5.04z" />
              <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.43h6.44c-.28 1.47-1.11 2.71-2.36 3.55l3.6 2.81c2.1-1.94 3.31-4.8 3.31-8.45z" />
              <path fill="#FBBC05" d="M5.1 14.7c-.25-.75-.39-1.55-.39-2.37s.14-1.62.39-2.37L1.5 7.16C.54 9.08 0 11.24 0 13.5s.54 4.42 1.5 6.34l3.6-2.14z" />
              <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.6-2.81c-1.1.74-2.51 1.18-4.36 1.18-3.24 0-5.99-1.92-6.97-4.76l-3.6 2.8C3.4 20.35 7.35 23 12 23z" />
            </svg>
            Continue with Google
          </button>
        </div>

        {/* Security Footer */}
        <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500">
          <ShieldCheck size={14} className="text-emerald-500" /> Encrypted Session
        </div>
      </div>
    </div>
  );
}