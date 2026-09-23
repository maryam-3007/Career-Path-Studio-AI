"use client";
import { useState, useRef } from "react";
import { 
  FileText, CheckCircle2, AlertTriangle, XCircle, 
  RefreshCw, FileUp, Briefcase, Sparkles, Code2, Check, X 
} from "lucide-react";

export default function AtsChecker() {
  const [file, setFile] = useState(null);
  const [role, setRole] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setReport(null);
      setError(null);
    }
  };

  const runAtsAnalysis = async () => {
    if (!file || isAnalyzing) return;
    setIsAnalyzing(true);
    setReport(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (role.trim()) formData.append("role", role.trim());

      const res = await fetch("/api/check-ats", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || "Failed to analyze this resume.");

      setReport(data);
    } catch (err) {
      setError(err.message || "Something went wrong analyzing this resume.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Enhanced Hero Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-8 text-white shadow-xl border border-slate-800">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-bold tracking-wide border border-emerald-500/20 mb-3">
            <Sparkles size={12} /> AI-Powered Analytics
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-2">ATS Compliance Optimizer</h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Verify structural criteria parameters, identify layout anomalies, and cross-reference targeted keyword token alignments instantly.
          </p>
        </div>
        <div className="absolute right-0 top-0 -mr-12 -mt-12 h-56 w-56 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Interactive Controller */}
        <div className="lg:col-span-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm backdrop-blur-sm sticky top-28 dark:bg-slate-900 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 dark:text-slate-500">Pipeline Blueprint</h3>

            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Target role (optional, e.g. Frontend Developer)"
              className="w-full mb-4 rounded-xl border border-slate-200 p-3 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
            />

            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`group border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                file ? 'border-emerald-500 bg-emerald-50/30 shadow-inner dark:bg-emerald-500/10' : 'border-slate-200 hover:border-emerald-400 hover:bg-slate-50 dark:border-slate-700 dark:hover:border-emerald-500/50 dark:hover:bg-slate-800'
              }`}
            >
              <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
              <div className="mx-auto w-12 h-12 bg-white border border-slate-200 shadow-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-105 transition-all text-slate-400 group-hover:text-emerald-600 dark:bg-slate-800 dark:border-slate-700 dark:group-hover:text-emerald-400">
                <FileUp size={18} />
              </div>
              <p className="text-sm font-bold text-slate-900 truncate px-2 dark:text-slate-100">{file ? file.name : "Select PDF Document"}</p>
              <p className="text-[10px] text-slate-400 mt-1 uppercase font-semibold tracking-wider dark:text-slate-500">Supports text PDFs up to 5MB</p>
            </div>

            {file && (
              <button
                onClick={runAtsAnalysis}
                disabled={isAnalyzing}
                className="mt-6 flex w-full items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-md shadow-emerald-500/10 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
              >
                {isAnalyzing ? (
                  <><RefreshCw className="animate-spin" size={15} /> Processing Matrix...</>
                ) : "Execute Deep Scan"}
              </button>
            )}

            {error && (
              <p className="mt-4 text-xs font-medium text-rose-600 dark:text-rose-400">{error}</p>
            )}
          </div>
        </div>

        {/* Right Adaptive Report Dashboard */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm min-h-[440px] overflow-hidden flex flex-col dark:bg-slate-900 dark:border-slate-800">
            
            {isAnalyzing && (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-white/80 animate-pulse dark:bg-slate-900/80">
                <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl mb-4 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <RefreshCw className="w-8 h-8 animate-spin" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">Deconstructing Syntax Trees</h4>
                <p className="text-xs text-slate-400 max-w-xs mt-1 font-mono dark:text-slate-500">Running token matching sequence rules maps...</p>
              </div>
            )}

            {!report && !isAnalyzing && (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400 dark:text-slate-500">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl mb-4 dark:bg-slate-800 dark:border-slate-700">
                  <FileText className="w-8 h-8 text-slate-300" />
                </div>
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Audit Reports Workspace Empty</h4>
                <p className="text-xs text-slate-400 max-w-xs mt-1 font-light">Inject a document blueprint block to evaluate layout compliance parameters.</p>
              </div>
            )}

            {report && !isAnalyzing && (
              <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-300">
                
                {/* Score Summary Metrics */}
                <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl shadow-inner relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 w-40 h-40 bg-white/[0.01] rounded-full pointer-events-none" />
                  <div className="relative flex items-center justify-center w-20 h-20 shrink-0 rounded-full bg-slate-800/80 border border-slate-700 shadow-xl">
                    <div className="text-center">
                      <span className="text-2xl font-black text-emerald-400 tracking-tight">{report.score}</span>
                      <span className="text-[9px] block font-bold text-slate-400 uppercase tracking-widest mt-0.5">Score</span>
                    </div>
                  </div>
                  <div className="space-y-1 text-center sm:text-left">
                    <div className="inline-block px-2.5 py-0.5 bg-emerald-500/20 border border-emerald-400/30 rounded-md text-[10px] font-black tracking-wider uppercase text-emerald-400">
                      {report.matchCategory} Match Profile
                    </div>
                    <h3 className="text-base font-bold">Executive Compliance Summary</h3>
                    <p className="text-xs text-slate-300 font-light leading-relaxed max-w-md">
                      {report.summary || "Analysis complete — review the breakdown below for details."}
                    </p>
                  </div>
                </div>

                {/* Metadata Details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-100 rounded-xl text-center dark:bg-slate-800 dark:border-slate-700">
                  {Object.entries(report?.metadata || {}).map(([key, value]) => (
                    <div key={key} className="space-y-0.5">
                      <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider block dark:text-slate-500">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Breakdown Group */}
                <div className="space-y-6">
                  <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-2 dark:text-slate-500">
                    <Briefcase size={14} /> Structural Metrics Review Channels
                  </h3>
                  <div className="space-y-4">
                    {report.breakdown?.map((section, sIdx) => (
                      <div key={sIdx} className="border border-slate-100 rounded-xl bg-slate-50/40 p-5 space-y-4 dark:border-slate-800 dark:bg-slate-800/30">
                        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 dark:border-slate-800">
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{section.title}</h4>
                            <p className="text-[11px] text-slate-400 mt-0.5 font-light dark:text-slate-500">{section.description}</p>
                          </div>
                          <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded-md border ${
                            section.status === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                            section.status === 'warning' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-rose-50 text-rose-600 border-rose-200'
                          }`}>
                            {section.status}
                          </span>
                        </div>
                        <div className="space-y-3">
                          {section.items?.map((item, iIdx) => (
                            <div key={iIdx} className="flex gap-3 text-xs leading-relaxed items-start">
                              <div className="mt-0.5 shrink-0">
                                {item.type === "success" && <CheckCircle2 size={13} className="text-emerald-500" />}
                                {item.type === "warning" && <AlertTriangle size={13} className="text-amber-500" />}
                                {item.type === "critical" && <XCircle size={13} className="text-rose-500" />}
                              </div>
                              <span className={item.type === 'critical' ? 'text-rose-900 font-medium dark:text-rose-300' : 'text-slate-600 font-light dark:text-slate-300'}>
                                {item.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills Matrix */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-2 dark:text-slate-500">
                    <Code2 size={14} /> Contextual Skill Token Arrays
                  </h3>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {report.skillsMatrix?.map((skill, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white shadow-sm text-xs dark:border-slate-800 dark:bg-slate-800/40">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-800 dark:text-slate-200">{skill.name}</span>
                          <span className="block text-[9px] text-slate-400 uppercase font-bold">{skill.category}</span>
                        </div>
                        <div className={`p-1 rounded-lg border ${
                          skill.found ? 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400' : 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500'
                        }`}>
                          {skill.found ? <Check size={11} strokeWidth={3} /> : <X size={11} strokeWidth={3} />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}