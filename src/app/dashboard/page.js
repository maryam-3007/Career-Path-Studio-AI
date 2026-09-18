"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useRef, useEffect } from "react";
import {
  Download, Sliders, Sparkles, Loader2, CheckCircle2,
  Briefcase, Send, RotateCcw, AlertTriangle, XCircle, Award, Bot
} from "lucide-react";

// ---------- Mock Interview helpers ----------

const VERDICT_STYLES = {
  correct: {
    label: "Correct",
    icon: CheckCircle2,
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30",
    ring: "border-emerald-200 dark:border-emerald-500/30",
  },
  incomplete: {
    label: "Incomplete",
    icon: AlertTriangle,
    badge: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30",
    ring: "border-amber-200 dark:border-amber-500/30",
  },
  wrong: {
    label: "Incorrect",
    icon: XCircle,
    badge: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30",
    ring: "border-rose-200 dark:border-rose-500/30",
  },
};

// useSearchParams() requires a Suspense boundary during static generation.
export default function Dashboard() {
  return (
    <Suspense fallback={null}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "guidance";

  // ---------- Guidance tab state ----------
  const [interests, setInterests] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [apiError, setApiError] = useState(null);

  const handleInterestToggle = (interest) => {
    let updated = [...interests];
    if (updated.includes(interest)) {
      updated = updated.filter((i) => i !== interest);
    } else {
      updated.push(interest);
    }
    setInterests(updated);
  };

  const fetchAIRoadmap = async () => {
    if (interests.length === 0) return;
    setLoadingAI(true);
    setApiError(null);
    try {
      const res = await fetch("/api/generate-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interests }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to generate roadmap.");
      setRecommendations(data);
    } catch (err) {
      setApiError(err.message || "Failed to communicate with AI engine.");
    } finally {
      setLoadingAI(false);
    }
  };

  // ---------- CV builder tab state ----------
  const cvRef = useRef(null);
  const [cvData, setCvData] = useState({
    fullName: "", email: "", github: "", linkedin: "",
    summary: "", experience: "", projects: "", education: "", skills: ""
  });

  const downloadCV = () => {
    const element = cvRef.current;
    if (!element) return;

    const printWindow = window.open('', '_blank', 'width=800,height=600');

    printWindow.document.write(`
      <html>
        <head>
          <title>Resume</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #000; }
            .cv-content { width: 100%; max-width: 800px; margin: auto; }
            h1 { text-transform: uppercase; }
            h4 { border-bottom: 1px solid #ccc; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="cv-content">
            ${element.innerHTML}
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  // ---------- Mock interview tab state ----------
  const [interviewRole, setInterviewRole] = useState("");
  const [sessionQuestions, setSessionQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [turns, setTurns] = useState([]); // { type: 'question'|'answer'|'evaluation', ...}
  const [input, setInput] = useState("");
  const [starting, setStarting] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [interviewError, setInterviewError] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns, evaluating]);

  const scores = turns.filter((t) => t.type === "evaluation").map((t) => t.score).filter((s) => typeof s === "number");
  const averageScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;

  const startInterview = async () => {
    if (!interviewRole.trim() || starting) return;
    setStarting(true);
    setInterviewError(null);
    try {
      const res = await fetch("/api/mock-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start", role: interviewRole.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Could not start the interview.");

      setSessionQuestions(data.questions);
      setCurrentIndex(0);
      setCompleted(false);
      setTurns([{ type: "question", text: data.question, qIndex: 0, total: data.questions.length }]);
    } catch (err) {
      setInterviewError(err.message || "Something went wrong starting the interview.");
    } finally {
      setStarting(false);
    }
  };

  const sendMessage = async () => {
    const answer = input.trim();
    if (!answer || evaluating || completed) return;

    setInput("");
    setTurns((prev) => [...prev, { type: "answer", text: answer }]);
    setEvaluating(true);
    setInterviewError(null);

    try {
      const res = await fetch("/api/mock-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "evaluate",
          role: interviewRole.trim(),
          questions: sessionQuestions,
          index: currentIndex,
          answer,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Could not evaluate that answer.");

      setTurns((prev) => [
        ...prev,
        {
          type: "evaluation",
          verdict: data.verdict,
          score: data.score,
          feedback: data.feedback,
          idealAnswer: data.idealAnswer,
        },
      ]);

      if (data.completed) {
        setCompleted(true);
      } else {
        setCurrentIndex(data.nextIndex);
        setTurns((prev) => [
          ...prev,
          { type: "question", text: data.nextQuestion, qIndex: data.nextIndex, total: data.total },
        ]);
      }
    } catch (err) {
      setInterviewError(err.message || "Something went wrong evaluating that answer.");
      // Put the answer back so the user doesn't lose it.
      setInput(answer);
      setTurns((prev) => prev.filter((t, i) => !(i === prev.length - 1 && t.type === "answer")));
    } finally {
      setEvaluating(false);
    }
  };

  const resetInterview = () => {
    setInterviewRole("");
    setSessionQuestions([]);
    setCurrentIndex(0);
    setTurns([]);
    setInput("");
    setCompleted(false);
    setInterviewError(null);
  };

  const handleInterviewKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="font-sans text-slate-800 antialiased p-4 sm:p-8 dark:text-slate-100">
      {activeTab === "guidance" && (
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-3 items-start animate-in fade-in duration-300">
          {/* --- INTEREST ENGINE --- */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 shadow-sm space-y-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 mb-2">
              <Sliders size={18} className="text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-slate-100">Professional Compass</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                "Coding", "Leadership", "Product Mgmt", "Design Thinking", "Copywriting",
                "Public Speaking", "Data Analytics", "Financial Ops", "Healthcare Mgmt",
                "Marketing Strategy", "Project Mgmt", "Business Dev", "Entrepreneurship",
                "Talent Acq", "Legal & Compliance", "Sales", "Humanities"
              ].map((interest) => (
                <button
                  key={interest}
                  onClick={() => handleInterestToggle(interest)}
                  className={`px-3 py-2 text-[10px] font-bold rounded-lg border transition-all duration-200 flex items-center justify-between ${
                    interests.includes(interest)
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/40"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  }`}
                >
                  {interest}
                  {interests.includes(interest) && <CheckCircle2 size={12} />}
                </button>
              ))}
            </div>

            <button
              onClick={fetchAIRoadmap}
              disabled={interests.length === 0 || loadingAI}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-4 text-sm font-bold text-white hover:bg-slate-800 transition-all disabled:opacity-50 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              {loadingAI ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              {loadingAI ? "Mapping..." : "Map Career Pathway"}
            </button>

            {apiError && (
              <p className="text-xs font-medium text-rose-600 dark:text-rose-400">{apiError}</p>
            )}
          </div>

          {/* --- CAREER GROWTH STRATEGY --- */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-xl font-black text-slate-900 tracking-tight dark:text-white">Your Career Growth Strategy</h2>

            {!recommendations.length ? (
              <div className="rounded-3xl border-2 border-dashed border-slate-200 p-20 text-center text-slate-400 font-light text-sm dark:border-slate-800 dark:text-slate-500">
                Select your professional interests to generate a custom career development roadmap.
              </div>
            ) : (
              <div className="space-y-8">
                {recommendations.map((path, idx) => (
                  <div key={idx} className="rounded-3xl border border-slate-200 bg-white p-10 shadow-lg space-y-6 dark:border-slate-800 dark:bg-slate-900">
                    {/* Role Header */}
                    <div className="border-b border-slate-100 pb-6 dark:border-slate-800">
                      <h3 className="font-black text-3xl text-slate-900 tracking-tight dark:text-white">{path.role}</h3>
                      <p className="text-xs uppercase font-bold tracking-[0.2em] text-emerald-600 bg-emerald-50 px-3 py-1 inline-block rounded-full mt-3 dark:text-emerald-400 dark:bg-emerald-500/10">
                        Core Competencies: {path.skills}
                      </p>
                    </div>

                    {/* Tree/Timeline Structure */}
                    <div className="space-y-10 mt-8">
                      {path.roadmap?.map((phase, pIdx) => (
                        <div key={pIdx} className="relative pl-10 border-l-2 border-slate-200 dark:border-slate-800">
                          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow-sm dark:border-slate-900" />

                          <h4 className="font-bold text-xl text-slate-800 mb-4 dark:text-slate-100">{phase.phase}</h4>
                          <div className="grid gap-3">
                            {phase.steps?.map((step, sIdx) => (
                              <div key={sIdx} className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-emerald-200 transition-colors dark:bg-slate-800/60 dark:border-slate-800 dark:hover:border-emerald-500/30">
                                <div className="mt-1.5 w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                                <p className="text-sm text-slate-600 leading-relaxed font-medium dark:text-slate-300">{step}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "cv-builder" && (
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-12 items-start animate-in fade-in duration-300">
          {/* Input Form */}
          <div className="lg:col-span-5 space-y-6 rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 border-b border-slate-100 pb-3 dark:text-emerald-400 dark:border-slate-800">Identity & Experience Matrix</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input placeholder="Full Name" value={cvData.fullName} onChange={(e) => setCvData({...cvData, fullName: e.target.value})} className="w-full rounded-xl border p-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500" />
              <input placeholder="Email" value={cvData.email} onChange={(e) => setCvData({...cvData, email: e.target.value})} className="w-full rounded-xl border p-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500" />
              <input placeholder="GitHub" value={cvData.github} onChange={(e) => setCvData({...cvData, github: e.target.value})} className="w-full rounded-xl border p-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500" />
              <input placeholder="LinkedIn" value={cvData.linkedin} onChange={(e) => setCvData({...cvData, linkedin: e.target.value})} className="w-full rounded-xl border p-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500" />
            </div>

            <textarea placeholder="Professional Summary" value={cvData.summary} onChange={(e) => setCvData({...cvData, summary: e.target.value})} className="w-full rounded-xl border p-3 text-sm h-24 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500" />
            <textarea placeholder="Experience (Role, Company, Dates, Bullets)" value={cvData.experience} onChange={(e) => setCvData({...cvData, experience: e.target.value})} className="w-full rounded-xl border p-3 text-sm h-24 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500" />
            <textarea placeholder="Projects (Name, Tech Stack, Key Outcomes)" value={cvData.projects} onChange={(e) => setCvData({...cvData, projects: e.target.value})} className="w-full rounded-xl border p-3 text-sm h-24 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500" />
            <textarea placeholder="Education (Degree, Institution, Year)" value={cvData.education} onChange={(e) => setCvData({...cvData, education: e.target.value})} className="w-full rounded-xl border p-3 text-sm h-20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500" />
            <input placeholder="Skills (React, Node, Python...)" value={cvData.skills} onChange={(e) => setCvData({...cvData, skills: e.target.value})} className="w-full rounded-xl border p-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500" />
          </div>

          {/* Preview */}
          <div className="lg:col-span-7 flex flex-col gap-4 min-w-0">
            <div className="flex justify-end">
              <button onClick={downloadCV} className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white hover:bg-emerald-700 transition-all">
                <Download size={14} /> Export PDF
              </button>
            </div>
            {/* The resume itself stays paper-white & dark text even in dark mode, since it is what gets printed/exported.
               On-screen it scales to the available width; the fixed A4 dimensions only apply to the print output
               (built separately in downloadCV via a plain <style> block), so shrinking it here doesn't affect the PDF. */}
            <div className="rounded-3xl border border-slate-200 bg-slate-100 p-3 sm:p-8 shadow-inner overflow-x-auto dark:border-slate-800 dark:bg-slate-900">
               <div ref={cvRef} className="mx-auto w-full max-w-[210mm] min-h-0 sm:min-h-[297mm] p-6 sm:p-16 bg-white text-slate-900 shadow-md space-y-6">
                  <h1 className="text-4xl font-black uppercase text-slate-900">{cvData.fullName || "YOUR NAME"}</h1>
                  <div className="flex gap-4 text-xs text-slate-500">
                    {cvData.email && <p>{cvData.email}</p>}
                    {cvData.github && <p>GitHub: {cvData.github}</p>}
                    {cvData.linkedin && <p>LinkedIn: {cvData.linkedin}</p>}
                  </div>
                  <div><h4 className="font-bold text-xs uppercase border-b pb-1">Summary</h4><p className="text-sm mt-2">{cvData.summary}</p></div>
                  <div><h4 className="font-bold text-xs uppercase border-b pb-1">Experience</h4><p className="text-sm mt-2 whitespace-pre-line">{cvData.experience}</p></div>
                  <div><h4 className="font-bold text-xs uppercase border-b pb-1">Projects</h4><p className="text-sm mt-2 whitespace-pre-line">{cvData.projects}</p></div>
                  <div><h4 className="font-bold text-xs uppercase border-b pb-1">Education</h4><p className="text-sm mt-2 whitespace-pre-line">{cvData.education}</p></div>
                  <div><h4 className="font-bold text-xs uppercase border-b pb-1">Skills</h4><p className="text-sm mt-2">{cvData.skills}</p></div>
               </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "interview" && (
        <div className="max-w-2xl mx-auto space-y-4 animate-in fade-in duration-500">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden dark:bg-slate-900 dark:border-slate-800">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <Briefcase size={15} />
                </div>
                <div>
                  <h2 className="text-sm font-black uppercase text-emerald-600 dark:text-emerald-400">Mock Interview Engine</h2>
                  {sessionQuestions.length > 0 && (
                    <p className="text-[11px] text-slate-400 font-semibold dark:text-slate-500">
                      {completed ? "Session complete" : `Question ${currentIndex + 1} of ${sessionQuestions.length}`}
                      {averageScore !== null && ` · Avg score ${averageScore}/100`}
                    </p>
                  )}
                </div>
              </div>
              {turns.length > 0 && (
                <button
                  onClick={resetInterview}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-[11px] font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                >
                  <RotateCcw size={12} /> New session
                </button>
              )}
            </div>

            {/* Progress bar */}
            {sessionQuestions.length > 0 && (
              <div className="h-1 w-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-1 bg-emerald-500 transition-all duration-500"
                  style={{ width: `${(Math.min(currentIndex + (completed ? 1 : 0), sessionQuestions.length) / sessionQuestions.length) * 100}%` }}
                />
              </div>
            )}

            <div className="p-6">
              {!turns.length ? (
                <div className="space-y-4">
                  <p className="text-xs text-slate-500 leading-relaxed dark:text-slate-400">
                    Enter the role you want to practice for. The AI interviewer will ask you role-specific questions
                    one at a time, then check every answer — marking it correct, incomplete, or wrong — and show you
                    a corrected or completed model answer before moving on.
                  </p>
                  <input
                    placeholder="Enter role (e.g., Frontend Developer)"
                    value={interviewRole}
                    onChange={(e) => setInterviewRole(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && startInterview()}
                    className="w-full p-4 border rounded-xl text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                  />
                  <button
                    onClick={startInterview}
                    disabled={!interviewRole.trim() || starting}
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white p-4 rounded-xl font-bold disabled:opacity-50 transition-all dark:bg-emerald-600 dark:hover:bg-emerald-500"
                  >
                    {starting ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    {starting ? "Preparing questions..." : "Start Session"}
                  </button>
                  {interviewError && (
                    <p className="text-xs font-medium text-rose-600 dark:text-rose-400">{interviewError}</p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
                    {turns.map((turn, i) => {
                      if (turn.type === "question") {
                        return (
                          <div key={i} className="flex gap-2.5">
                            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white dark:bg-emerald-600">
                              <Bot size={13} />
                            </div>
                            <div className="rounded-2xl rounded-tl-sm bg-slate-100 p-4 text-sm text-slate-700 max-w-[85%] dark:bg-slate-800 dark:text-slate-200">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 dark:text-slate-500">
                                Question {turn.qIndex + 1}{turn.total ? ` / ${turn.total}` : ""}
                              </p>
                              <p>{turn.text}</p>
                            </div>
                          </div>
                        );
                      }
                      if (turn.type === "answer") {
                        return (
                          <div key={i} className="flex justify-end">
                            <div className="rounded-2xl rounded-tr-sm bg-emerald-600 p-4 text-sm text-white max-w-[85%]">
                              {turn.text}
                            </div>
                          </div>
                        );
                      }
                      if (turn.type === "evaluation") {
                        const style = VERDICT_STYLES[turn.verdict] || VERDICT_STYLES.incomplete;
                        const Icon = style.icon;
                        return (
                          <div key={i} className={`rounded-2xl border p-4 space-y-2.5 ${style.ring} bg-white dark:bg-slate-900`}>
                            <div className="flex items-center justify-between">
                              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${style.badge}`}>
                                <Icon size={12} /> {style.label}
                              </span>
                              {typeof turn.score === "number" && (
                                <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 dark:text-slate-500">
                                  <Award size={12} /> {turn.score}/100
                                </span>
                              )}
                            </div>
                            {turn.feedback && (
                              <p className="text-xs text-slate-600 leading-relaxed dark:text-slate-300">{turn.feedback}</p>
                            )}
                            {turn.idealAnswer && (
                              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 dark:bg-slate-800/60 dark:border-slate-800">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 mb-1 dark:text-emerald-400">
                                  {turn.verdict === "correct" ? "Model answer" : "Corrected / completed answer"}
                                </p>
                                <p className="text-xs text-slate-600 leading-relaxed dark:text-slate-300">{turn.idealAnswer}</p>
                              </div>
                            )}
                          </div>
                        );
                      }
                      return null;
                    })}

                    {evaluating && (
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold dark:text-slate-500">
                        <Loader2 size={13} className="animate-spin" /> Checking your answer...
                      </div>
                    )}

                    {completed && (
                      <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white text-center space-y-1 dark:from-emerald-900 dark:to-slate-900">
                        <p className="text-sm font-black">🎉 Interview complete!</p>
                        <p className="text-xs text-slate-300">
                          {averageScore !== null
                            ? `Average score: ${averageScore}/100 across ${scores.length} questions.`
                            : "Great job working through the session."}
                        </p>
                      </div>
                    )}

                    <div ref={chatEndRef} />
                  </div>

                  {interviewError && (
                    <p className="text-xs font-medium text-rose-600 dark:text-rose-400">{interviewError}</p>
                  )}

                  {!completed && (
                    <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleInterviewKeyDown}
                        disabled={evaluating}
                        className="flex-1 p-3 border rounded-xl text-sm disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                        placeholder="Type your answer..."
                      />
                      <button
                        onClick={sendMessage}
                        disabled={evaluating || !input.trim()}
                        className="flex items-center gap-1.5 bg-emerald-600 text-white px-5 rounded-xl font-bold disabled:opacity-50 hover:bg-emerald-700 transition-all"
                      >
                        {evaluating ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
