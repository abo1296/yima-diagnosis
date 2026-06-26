"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { questions, industryWarmup } from "@/lib/questions";
import { calculateScores } from "@/lib/scoring";
import { DIMENSION_LABELS, DIMENSION_ORDER, type Question } from "@/lib/types";

const STORAGE_KEY = "yima_diagnosis_draft";

const DIM_TRANSITIONS: Record<string, string> = {
  strategy: "方向比速度更重要",
  model: "你能赚钱，但能复制吗",
  operation: "一致性决定了你能走多远",
  organization: "人跟得上，店才跟得上",
  supply_chain: "后方的效率，前方的底气",
  training: "复制人的能力，比复制店更难",
  supervision: "不查不知道，一查吓一跳",
  digital: "用数据替代拍脑袋",
  culture: "看不见的东西，决定了看得见的一切",
};

const DIM_HUES: Record<string, string> = {
  strategy: "220",
  model: "250",
  operation: "200",
  organization: "280",
  supply_chain: "180",
  training: "300",
  supervision: "240",
  digital: "320",
  culture: "260",
};

function groupByDim(): { dim: string; label: string; questions: Question[] }[] {
  return DIMENSION_ORDER.map((dim) => ({ dim, label: DIMENSION_LABELS[dim], questions: questions.filter((q) => q.dimension === dim) }));
}
const dimGroups = groupByDim();

const qDimMap: Record<string, string> = {};
questions.forEach((q) => { qDimMap[q.id] = q.dimension; });

// Types
interface CompanyInfo { industry: string; storeCount: string; }
interface ReportData {
  overview: { headline: string; stage: string; strength: string; risk: string };
  dimensions: { dim: string; score: number; comment: string; tips: string[] }[];
  actions: { title: string; why: string; timeline: string }[];
  benchmark?: string;
  yima: string;
}

const INDUSTRIES = ["餐饮","零售","酒店民宿","教育培训","美容美发","健身运动","汽车服务","医疗健康","宠物服务","便利店","服装","其他连锁"];

// ===== Main =====
export default function Page() {
  const [phase, setPhase] = useState<"welcome"|"info"|"warmup"|"survey"|"result">("welcome");
  const [info, setInfo] = useState<CompanyInfo>({ industry: "", storeCount: "" });
  const [warmupAnswers, setWarmupAnswers] = useState<string>("");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [scores, setScores] = useState<ReturnType<typeof calculateScores> | null>(null);
  // Survey: dimension transition or question index within dimension
  const [surveyStep, setSurveyStep] = useState<{ dimIdx: number; showIntro: boolean; qIdx: number }>({ dimIdx: 0, showIntro: true, qIdx: 0 });
  const [showAdmin, setShowAdmin] = useState(false);

  // 检测 #admin hash（纯客户端，不触发SSR）
  useEffect(() => {
    const check = () => setShowAdmin(window.location.hash.includes("admin"));
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, []);

  // admin panel: yima777.cn/#admin
  if (showAdmin) return <AdminPanel onBack={() => { setShowAdmin(false); window.location.hash = ""; }} />;

  useEffect(() => {
    try { const s = localStorage.getItem(STORAGE_KEY); if (s) setAnswers(JSON.parse(s)); } catch {}
  }, []);

  const saveAnswers = useCallback((next: Record<string, number>) => {
    setAnswers(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
  }, []);

  const handleRestart = () => {
    setAnswers({}); setScores(null); setInfo({ industry: "", storeCount: "" });
    setSurveyStep({ dimIdx: 0, showIntro: true, qIdx: 0 }); setPhase("welcome");
    localStorage.removeItem(STORAGE_KEY);
  };

  if (phase === "welcome") return <Welcome onStart={() => setPhase("info")} />;
  if (phase === "info") return <InfoStep info={info} setInfo={setInfo} onNext={() => {
    const wq = industryWarmup[info.industry] || industryWarmup["其他连锁"];
    if (wq && wq.length > 0) setPhase("warmup");
    else { setSurveyStep({ dimIdx: 0, showIntro: true, qIdx: 0 }); setPhase("survey"); }
  }} />;
  if (phase === "warmup") return <WarmupScreen questions={industryWarmup[info.industry] || industryWarmup["其他连锁"]} onDone={(ctx) => { setWarmupAnswers(ctx); setSurveyStep({ dimIdx: 0, showIntro: true, qIdx: 0 }); setPhase("survey"); }} />;
  if (phase === "result" && scores) return <ResultScreen scores={scores} info={info} warmupContext={warmupAnswers} onRestart={handleRestart} />;

  return <SurveyFlow answers={answers} saveAnswers={saveAnswers} step={surveyStep} setStep={setSurveyStep} onComplete={(sc) => { setScores(sc); setPhase("result"); localStorage.removeItem(STORAGE_KEY); }} />;
}

// ===== Welcome =====
function Welcome({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] px-5 py-8" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-md w-full text-center">
        <div className="text-4xl sm:text-5xl mb-4 opacity-80">🏬</div>
        <h1 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>你的连锁企业，离失控还有多远？</h1>
        <p className="text-sm sm:text-base mb-2" style={{ color: "var(--text-secondary)" }}>扩张越快，隐患越深。标准化跟不上，复制就是找死。</p>
        <p className="text-xs mb-5" style={{ color: "var(--text-muted)" }}>逸马 22 年方法论 · 9 维度成熟度模型 · 30 分钟出报告</p>
        <div className="flex flex-wrap justify-center gap-1.5 mb-5 text-[11px]" style={{ color: "var(--text-muted)" }}>
          {DIMENSION_ORDER.map((d) => <span key={d} className="glass-card rounded-full px-2.5 py-0.5" style={{ background: "rgba(255,255,255,0.03)" }}>{DIMENSION_LABELS[d]}</span>)}
        </div>
        <p className="text-xs sm:text-sm mb-5" style={{ color: "var(--text-muted)" }}>共 72 题 · 约 12 分钟 · 完全免费</p>
        <button onClick={onStart} className="w-full py-4 rounded-xl font-semibold text-base sm:text-lg transition-all active:scale-[0.98] shadow-lg"
          style={{ background: "var(--yima-red)", color: "white", boxShadow: "0 0 20px rgba(192,57,43,0.3)" }}>
          开始免费诊断
        </button>
        <p className="text-[11px] mt-3" style={{ color: "var(--text-muted)" }}>已有 3,286 家企业完成诊断 · 答题进度自动保存</p>
        <div className="mt-8 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-[10px] sm:text-xs mb-3 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>已服务客户</p>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
            <span>百果园</span><span style={{ color: "var(--text-muted)" }}>·</span>
            <span>锅圈食汇</span><span style={{ color: "var(--text-muted)" }}>·</span>
            <span>木屋烧烤</span><span style={{ color: "var(--text-muted)" }}>·</span>
            <span>苏宁</span><span style={{ color: "var(--text-muted)" }}>·</span>
            <span>良品铺子</span><span style={{ color: "var(--text-muted)" }}>·</span>
            <span>周黑鸭</span>
          </div>
          <p className="text-[10px] mt-2" style={{ color: "var(--text-muted)" }}>3,000+ 会员企业 · 195 家已上市</p>
        </div>
      </div>
    </div>
  );
}

// ===== Info Step =====
function InfoStep({ info, setInfo, onNext }: { info: CompanyInfo; setInfo: (v: CompanyInfo) => void; onNext: () => void }) {
  const canNext = info.industry && info.storeCount;
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] px-5" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-md w-full">
        <h2 className="text-lg sm:text-xl font-bold mb-1 text-center" style={{ color: "var(--text-primary)" }}>基本信息</h2>
        <p className="text-xs sm:text-sm mb-6 text-center" style={{ color: "var(--text-secondary)" }}>帮助我们生成更精准的诊断报告</p>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>所属行业</label>
            <select value={info.industry} onChange={(e) => setInfo({ ...info, industry: e.target.value })}
              className="w-full px-4 py-3.5 rounded-xl text-base outline-none transition-all appearance-none" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text-primary)" }}>
              <option value="">请选择行业</option>
              {INDUSTRIES.map((ind) => <option key={ind} value={ind} style={{ background: "#1a1a1a" }}>{ind}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>门店数量</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {["1-10家","11-50家","51-200家","200家以上"].map((opt) => (
                <button key={opt} onClick={() => setInfo({ ...info, storeCount: opt })}
                  className="py-3 rounded-lg text-sm font-medium transition-all"
                  style={info.storeCount === opt
                    ? { borderColor: "var(--yima-red)", background: "rgba(192,57,43,0.12)", color: "var(--yima-red)", border: "1px solid var(--yima-red)" }
                    : { border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "var(--text-secondary)" }}>
                  {opt}</button>
              ))}
            </div>
          </div>
        </div>
        <button onClick={onNext} disabled={!canNext} className="w-full mt-8 py-4 rounded-xl font-semibold text-base transition-all active:scale-[0.98]"
          style={canNext ? { background: "var(--yima-red)", color: "white" } : { background: "rgba(255,255,255,0.06)", color: "var(--text-muted)" }}>
          开始答题
        </button>
      </div>
    </div>
  );
}

// ===== Survey Flow =====
function SurveyFlow({ answers, saveAnswers, step, setStep, onComplete }: {
  answers: Record<string, number>;
  saveAnswers: (v: Record<string, number>) => void;
  step: { dimIdx: number; showIntro: boolean; qIdx: number };
  setStep: (v: { dimIdx: number; showIntro: boolean; qIdx: number }) => void;
  onComplete: (sc: ReturnType<typeof calculateScores>) => void;
}) {
  const { dimIdx, showIntro, qIdx } = step;
  const dim = dimGroups[dimIdx];
  const totalAnswered = questions.filter((q) => answers[q.id] !== undefined).length;
  const progress = Math.round((totalAnswered / questions.length) * 100);

  // Dimension intro
  if (showIntro) {
    const hue = DIM_HUES[dim.dim] || "220";
    return <DimIntro dim={dim} dimIdx={dimIdx} hue={hue} onDone={() => setStep({ dimIdx, showIntro: false, qIdx: 0 })} />;
  }

  // All dimensions done
  if (dimIdx >= dimGroups.length) {
    const s = calculateScores(answers, qDimMap);
    return <CompleteScreen scores={s} onSubmit={() => onComplete(s)} />;
  }

  const currentQ = dim.questions[qIdx];
  const isLastQ = qIdx >= dim.questions.length - 1;

  const handleSelect = (qId: string, val: number) => {
    saveAnswers({ ...answers, [qId]: val });
    if (isLastQ) {
      // Move to next dimension or complete
      setTimeout(() => {
        const nextDim = dimIdx + 1;
        if (nextDim >= dimGroups.length) {
          setStep({ dimIdx: nextDim, showIntro: false, qIdx: 0 });
        } else {
          setStep({ dimIdx: nextDim, showIntro: true, qIdx: 0 });
        }
      }, 350);
    } else {
      setTimeout(() => setStep({ dimIdx, showIntro: false, qIdx: qIdx + 1 }), 350);
    }
  };

  const handlePrev = () => {
    if (qIdx > 0) setStep({ dimIdx, showIntro: false, qIdx: qIdx - 1 });
    else if (dimIdx > 0) {
      const prevDim = dimIdx - 1;
      setStep({ dimIdx: prevDim, showIntro: false, qIdx: dimGroups[prevDim].questions.length - 1 });
    }
  };

  const canGoPrev = qIdx > 0 || dimIdx > 0;

  return (
    <div className="flex flex-col min-h-[100dvh]" style={{ background: "var(--bg-primary)" }}>
      {/* Progress line */}
      <div className="sticky top-0 z-10 px-4 py-3" style={{ background: "rgba(10,10,15,0.95)", backdropFilter: "blur(10px)" }}>
        <div className="progress-line mx-auto max-w-xl">
          <div className="progress-line-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-5" style={{ minHeight: "calc(100dvh - 80px)" }}>
        <div className="w-full max-w-lg animate-slide-up" key={`${dimIdx}-${qIdx}`}>
          {/* Question */}
          <p className="text-center font-semibold mb-10 leading-relaxed" style={{ fontSize: "18px", color: "var(--text-primary)" }}>
            {currentQ.text}
          </p>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQ.options.map((opt) => {
              const sel = answers[currentQ.id] === opt.value;
              return (
                <button key={opt.value} className={`option-btn ${sel ? "selected" : ""}`}
                  onClick={() => handleSelect(currentQ.id, opt.value)}>
                  <span className={`option-dot ${sel ? "selected" : ""}`}>{sel ? "✓" : ""}</span>
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* Bottom nav */}
      <div className="sticky bottom-0 flex items-center justify-between px-5 py-3" style={{ background: "rgba(10,10,15,0.95)", backdropFilter: "blur(10px)" }}>
        <button onClick={handlePrev} disabled={!canGoPrev}
          className="text-sm font-medium transition-colors"
          style={{ color: canGoPrev ? "var(--text-secondary)" : "var(--text-muted)", opacity: canGoPrev ? 1 : 0.3 }}>
          ← 上一题
        </button>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {totalAnswered}/{questions.length} 题
        </p>
      </div>
    </div>
  );
}

// ===== Warmup Screen =====
function WarmupScreen({ questions: wqs, onDone }: {
  questions: { text: string; options: { value: number; label: string }[] }[];
  onDone: (ctx: string) => void;
}) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const currentQ = wqs[idx];
  const handleSelect = (val: number, label: string) => {
    const next = [...answers, `${currentQ.text} → ${label}`];
    setAnswers(next);
    if (idx >= wqs.length - 1) {
      setTimeout(() => onDone(next.join("；")), 300);
    } else {
      setTimeout(() => setIdx(idx + 1), 300);
    }
  };
  return (
    <div className="flex flex-col min-h-[100dvh]" style={{ background: "var(--bg-primary)" }}>
      <div className="sticky top-0 z-10 px-4 py-3" style={{ background: "rgba(10,10,15,0.95)" }}>
        <div className="progress-line mx-auto max-w-xl">
          <div className="progress-line-fill" style={{ width: `${Math.round((idx / Math.max(wqs.length, 1)) * 100)}%` }} />
        </div>
        <p className="text-[11px] mt-2 text-center" style={{ color: "var(--text-muted)" }}>
          <span style={{ color: "var(--yima-gold)" }}>行业定制 </span>{idx + 1}/{wqs.length}
        </p>
      </div>
      <main className="flex-1 flex flex-col items-center justify-center px-5">
        <div className="w-full max-w-lg animate-slide-up" key={idx}>
          <p className="text-center font-semibold mb-10 leading-relaxed" style={{ fontSize: "18px", color: "var(--text-primary)" }}>{currentQ.text}</p>
          <div className="space-y-2.5">
            {currentQ.options.map((opt) => (
              <button key={opt.value} className="option-btn" onClick={() => handleSelect(opt.value, opt.label)}>
                <span className="option-dot" />{opt.label}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

// ===== Dimension Intro =====
function DimIntro({ dim, dimIdx, hue, onDone }: { dim: typeof dimGroups[0]; dimIdx: number; hue: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1400);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] animate-fade-in"
      style={{ background: `hsl(${hue}, 20%, 6%)` }}>
      <p className="text-sm mb-3 tracking-widest" style={{ color: "var(--text-muted)" }}>
        {(dimIdx + 1).toString().padStart(2, "0")}
      </p>
      <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>{dim.label}</h2>
      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{DIM_TRANSITIONS[dim.dim]}</p>
    </div>
  );
}

// ===== Complete Screen =====
function CompleteScreen({ scores, onSubmit }: { scores: ReturnType<typeof calculateScores>; onSubmit: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] px-5" style={{ background: "var(--bg-primary)" }}>
      <div className="text-center animate-pop-in">
        <div className="text-5xl mb-4">✓</div>
        <h2 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>诊断完成</h2>
        <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>72 题全部完成，查看你的连锁成熟度报告</p>
        <button onClick={onSubmit} className="animate-breathe px-10 py-4 rounded-xl font-semibold text-base transition-all active:scale-[0.98]"
          style={{ background: "var(--yima-red)", color: "white", boxShadow: "0 0 20px rgba(192,57,43,0.3)" }}>
          查看我的诊断报告 →
        </button>
      </div>
    </div>
  );
}

// ===== Result Screen =====
function ResultScreen({ scores, info, warmupContext, onRestart }: { scores: ReturnType<typeof calculateScores>; info: CompanyInfo; warmupContext: string; onRestart: () => void }) {
  const [displayScore, setDisplayScore] = useState(0);
  const [showLevel, setShowLevel] = useState(false);
  const [genStatus, setGenStatus] = useState<"loading"|"done"|"error">("loading");
  const [report, setReport] = useState<ReportData | null>(null);
  const [error, setError] = useState("");
  const animRef = useRef(false);
  const startedRef = useRef(false);
  const radarRef = useRef<HTMLDivElement>(null);

  // Score count-up
  useEffect(() => {
    if (animRef.current) return;
    animRef.current = true;
    const target = scores.overall_score;
    const totalSteps = target <= 40 ? Math.ceil(target/5) : target <= 70 ? Math.ceil(40/5 + (target-40)/2) : Math.ceil(40/5 + 30/2 + (target-70));
    let step = 0;
    const timer = setInterval(() => {
      step++;
      if (step >= totalSteps) { setDisplayScore(target); setTimeout(() => setShowLevel(true), 300); clearInterval(timer); }
      else { const p = step / totalSteps; setDisplayScore(Math.round(target * (1 - Math.pow(1-p,3)))); }
    }, 30);
    return () => clearInterval(timer);
  }, [scores.overall_score]);

  // Auto-scroll to radar after score animation
  useEffect(() => {
    if (displayScore === scores.overall_score && radarRef.current) {
      setTimeout(() => {
        radarRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 500);
    }
  }, [displayScore, scores.overall_score]);

  // Auto-generate AI report
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    setGenStatus("loading");
    (async () => {
      try {
        const resp = await fetch("/api/generate-report", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ overall_score: scores.overall_score, level: scores.level, scores: scores.scores, answers: scores.answers, industry: info.industry, storeCount: info.storeCount, warmup: warmupContext }),
        });
        const data = await resp.json();
        if (!resp.ok) throw new Error(data.error || "请求失败");
        setReport(data.report);
        setGenStatus("done");
      } catch (e: unknown) { setError((e as Error).message); setGenStatus("error"); }
    })();
  }, [scores.overall_score]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRegenerate = async () => {
    setGenStatus("loading"); setError(""); setReport(null);
    try {
      const resp = await fetch("/api/generate-report", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ overall_score: scores.overall_score, level: scores.level, scores: scores.scores, answers: scores.answers, industry: info.industry, storeCount: info.storeCount }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "请求失败");
      setReport(data.report);
      setGenStatus("done");
    } catch (e: unknown) { setError((e as Error).message); setGenStatus("error"); }
  };

  const levelColor = scores.level === "领先型" ? "#10b981" : scores.level === "成熟型" ? "#3b82f6" : scores.level === "成长型" ? "#f59e0b" : "#ef4444";
  const levelBg = scores.level === "领先型" ? "rgba(16,185,129,0.15)" : scores.level === "成熟型" ? "rgba(59,130,246,0.15)" : scores.level === "成长型" ? "rgba(245,158,11,0.15)" : "rgba(239,68,68,0.15)";

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100dvh" }}>
      {/* Hero */}
      <div className="text-center px-4 py-12 sm:py-16">
        <p className="text-sm mb-2" style={{ color: "var(--text-muted)" }}>逸马连锁成熟度诊断报告</p>
        <div className="text-6xl sm:text-8xl font-black mb-1 tracking-tight transition-all" style={{ color: "var(--text-primary)" }}>
          {displayScore}
        </div>
        <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>综合得分</p>
        {showLevel && (
          <span className="animate-pop-in inline-block px-4 py-1.5 rounded-full text-sm font-bold" style={{ background: levelBg, color: levelColor }}>
            {scores.level}
          </span>
        )}
        {info.industry && <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>{info.industry} · {info.storeCount}</p>}
      </div>

      <div className="mx-auto max-w-2xl px-4 sm:px-4 pb-12">
        {/* Radar + Scores */}
        <div className="glass-card p-4 sm:p-6 mb-6" ref={radarRef}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>各维度得分</h3>
            <button onClick={() => {
              if (navigator.share) navigator.share({ title: "逸马诊断", text: `我的连锁得分：${scores.overall_score}分（${scores.level}）`, url: window.location.href }).catch(() => {});
              else navigator.clipboard.writeText(window.location.href).then(() => alert("链接已复制！")).catch(() => {});
            }} className="text-sm font-medium flex items-center gap-1" style={{ color: "var(--yima-red)" }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
              分享
            </button>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <EnhancedRadar scores={scores.scores} />
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-1.5 w-full sm:w-auto text-sm">
              {DIMENSION_ORDER.map((dim) => {
                const sc = scores.scores[dim] || 0;
                let dot = "#ef4444"; if (sc >= 66) dot = "#10b981"; else if (sc >= 41) dot = "#f59e0b";
                return <div key={dim} className="flex items-center gap-2"><span className="w-2 h-2 rounded-full shrink-0" style={{ background: dot }} /><span style={{ color: "var(--text-secondary)" }} className="truncate">{DIMENSION_LABELS[dim]}</span><span className="font-semibold ml-auto" style={{ color: "var(--text-primary)" }}>{sc}</span></div>;
              })}
            </div>
          </div>
        </div>

        {/* AI Report - auto generating */}
        {genStatus === "loading" && (
          <div className="text-center py-8">
            <svg className="animate-spin h-6 w-6 mx-auto mb-4" viewBox="0 0 24 24" fill="none" style={{ color: "var(--yima-red)" }}>
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>AI 正在分析您的诊断数据...</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>预计需要 20-40 秒</p>
          </div>
        )}

        {genStatus === "error" && (
          <div className="text-center py-8">
            <p className="text-sm mb-4 py-2 px-4 rounded-lg" style={{ color: "#ef4444", background: "rgba(239,68,68,0.1)" }}>{error}</p>
            <button onClick={handleRegenerate} className="px-6 py-3 rounded-xl text-sm font-semibold" style={{ background: "var(--yima-red)", color: "white" }}>
              重新生成报告
            </button>
          </div>
        )}

        {genStatus === "done" && report && <ReportView report={report} scores={scores} info={info} onRegenerate={handleRegenerate} />}

        <div className="mt-6 text-center">
          <button onClick={onRestart} className="text-sm" style={{ color: "var(--text-muted)" }}>重新诊断</button>
        </div>
      </div>
    </div>
  );
}

// ===== Enhanced Radar =====
function EnhancedRadar({ scores }: { scores: Record<string, number> }) {
  const size = 210; const cx = size / 2; const cy = size / 2; const radius = 85; const levels = 5;
  const angleSlice = (2 * Math.PI) / DIMENSION_ORDER.length;
  const getPt = (dim: string, val: number) => {
    const idx = DIMENSION_ORDER.indexOf(dim);
    const a = angleSlice * idx - Math.PI / 2;
    const r = (val / 100) * radius;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  };

  return (
    <div className="flex-shrink-0 radar-animate">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {Array.from({ length: levels }, (_, i) => {
          const r = ((i + 1) / levels) * radius;
          const pts = DIMENSION_ORDER.map((_, idx) => {
            const a = angleSlice * idx - Math.PI / 2;
            return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
          }).join(" ");
          return <polygon key={i} points={pts} fill="none" stroke={i === levels - 1 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)"} strokeWidth={i === levels - 1 ? 1.5 : 0.5} />;
        })}
        {DIMENSION_ORDER.map((dim) => {
          const p = getPt(dim, 100);
          return <line key={dim} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} />;
        })}
        <polygon points={DIMENSION_ORDER.map((dim) => { const p = getPt(dim, scores[dim] || 0); return `${p.x},${p.y}`; }).join(" ")}
          fill="rgba(192,57,43,0.15)" stroke="var(--yima-red)" strokeWidth={1.5} strokeLinejoin="round" />
        {DIMENSION_ORDER.map((dim) => {
          const p = getPt(dim, scores[dim] || 0);
          return <g key={dim}><circle cx={p.x} cy={p.y} r={3} fill="var(--yima-red)" />{/* Value label on dot */}</g>;
        })}
        {DIMENSION_ORDER.map((dim, idx) => {
          const a = angleSlice * idx - Math.PI / 2;
          const lr = radius + 20;
          const x = cx + lr * Math.cos(a);
          const y = cy + lr * Math.sin(a);
          return <text key={dim} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill="var(--text-muted)" fontSize="9">{DIMENSION_LABELS[dim]}</text>;
        })}
      </svg>
    </div>
  );
}

// ===== Report View =====
function ReportView({ report, scores, info, onRegenerate }: {
  report: ReportData; scores: ReturnType<typeof calculateScores>; info: CompanyInfo;
  onRegenerate: () => void;
}) {
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const sortedDims = [...report.dimensions].sort((a, b) => a.score - b.score);
  const handlePrint = () => window.print();
  const handleConsult = async () => {
    if (!phone) return;
    // 异步提交，不阻塞 UI
    fetch("/api/leads", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, industry: info.industry, storeCount: info.storeCount, score: scores.overall_score, level: scores.level }),
    }).catch(() => {});
    setSubmitted(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Overview */}
      <div className="glass-card p-4 sm:p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>诊断总览</h3>
        <p className="text-lg font-bold mb-3 leading-snug" style={{ color: "var(--text-primary)" }}>{report.overview.headline}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <OCard icon="📌" label="发展阶段" val={report.overview.stage} />
          <OCard icon="💪" label="核心优势" val={report.overview.strength} />
          <OCard icon="⚠️" label="最大风险" val={report.overview.risk} color />
        </div>
      </div>

      {/* Benchmark */}
      {report.benchmark && (
        <div className="glass-card p-4 sm:p-6" style={{ borderColor: "rgba(212,168,83,0.3)" }}>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--yima-gold)" }}>行业对比</h3>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{report.benchmark}</p>
        </div>
      )}

      {/* Dimension Analysis */}
      <div className="glass-card p-4 sm:p-6">
        <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>维度分析 <span style={{ color: "var(--text-muted)" }}>（按得分排序）</span></h3>
        <div className="space-y-2">
          {sortedDims.map((dim) => {
            const realScore = scores.scores[dim.dim] || dim.score;
            let dot = "#ef4444"; if (realScore >= 66) dot = "#10b981"; else if (realScore >= 41) dot = "#f59e0b";
            return (
              <details key={dim.dim} className="group">
                <summary className="flex items-center gap-2 cursor-pointer list-none py-2 px-2 -mx-2 rounded-xl transition-colors" style={{ background: "transparent" }}>
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: dot }} />
                  <span className="text-sm font-medium w-16 shrink-0" style={{ color: "var(--text-primary)" }}>{dim.dim}</span>
                  <span className="text-sm font-bold w-7 shrink-0" style={{ color: dot }}>{realScore}</span>
                  <span className="text-xs truncate flex-1" style={{ color: "var(--text-secondary)" }}>{dim.comment}</span>
                  <svg className="w-4 h-4 shrink-0 group-open:rotate-180 transition-transform" fill="none" stroke="var(--text-muted)" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <div className="mt-2 ml-6 pl-3 border-l-2 space-y-1.5" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{dim.comment}</p>
                  {dim.tips.map((tip, i) => <p key={i} className="text-xs flex items-start gap-1.5" style={{ color: "var(--yima-red)" }}><span style={{ color: "var(--yima-gold)" }} className="mt-0.5 shrink-0">→</span>{tip}</p>)}
                </div>
              </details>
            );
          })}
        </div>
      </div>

      {/* Action Cards */}
      <div>
        <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>优先行动</h3>
        <div className="space-y-3">
          {report.actions.map((act, i) => {
            const priority = i === 0 ? "P0" : i === 1 ? "P1" : "P2";
            const pColor = i === 0 ? "var(--yima-red)" : i === 1 ? "#f59e0b" : "var(--text-muted)";
            return (
              <div key={i} className="glass-card p-4 flex gap-3" style={{ borderLeftWidth: "3px", borderLeftStyle: "solid", borderLeftColor: pColor, borderTopLeftRadius: "12px", borderBottomLeftRadius: "12px" }}>
                <div className="flex-1">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded mb-1.5 inline-block" style={{ background: `${pColor}20`, color: pColor }}>{priority}</span>
                  <p className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>{act.title}</p>
                  <p className="text-xs mb-2" style={{ color: "var(--text-secondary)" }}>{act.why}</p>
                  <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>⏱ {act.timeline}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Yima Value */}
      <div className="glass-card p-4 sm:p-6" style={{ borderColor: "rgba(192,57,43,0.2)" }}>
        <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--yima-gold)" }}>逸马如何帮到你</h3>
        <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{report.yima}</p>
      </div>

      {/* CTA */}
      <div className="glass-card p-4 sm:p-6">
        <h3 className="text-sm font-bold mb-2" style={{ color: "var(--text-primary)" }}>获取专属改进方案</h3>
        <p className="text-xs mb-4" style={{ color: "var(--text-secondary)" }}>留下手机号，逸马顾问将为您定制深度解读与改进路线图。</p>
        {submitted ? (
          <div className="text-center py-3 rounded-xl" style={{ background: "rgba(16,185,129,0.1)" }}>
            <p className="text-sm font-semibold" style={{ color: "#10b981" }}>已提交！</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>逸马顾问将在 1 个工作日内联系您</p>
          </div>
        ) : (
          <div className="flex gap-2">
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="请输入手机号"
              className="flex-1 px-4 py-3 rounded-xl text-sm outline-none" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text-primary)" }} />
            <button onClick={handleConsult} disabled={!phone} className="px-5 py-3 rounded-xl text-sm font-semibold transition-all shrink-0"
              style={phone ? { background: "var(--yima-red)", color: "white" } : { background: "rgba(255,255,255,0.06)", color: "var(--text-muted)" }}>
              预约咨询</button>
          </div>
        )}
      </div>

      {/* Bottom actions */}
      <div className="flex items-center justify-center gap-4 pt-1 flex-wrap">
        <button onClick={handlePrint} className="text-xs font-medium flex items-center gap-1" style={{ color: "var(--text-secondary)" }}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          下载 PDF
        </button>
        <span style={{ color: "var(--text-muted)" }}>|</span>
        <button onClick={onRegenerate} className="text-sm font-medium" style={{ color: "var(--yima-red)" }}>
          重新生成报告
        </button>
      </div>
    </div>
  );
}

function OCard({ icon, label, val, color }: { icon: string; label: string; val: string; color?: boolean }) {
  const border = color ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.06)";
  return (
    <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${border}` }}>
      <p className="text-[10px] mb-1" style={{ color: "var(--text-muted)" }}>{icon} {label}</p>
      <p className="text-xs font-medium leading-snug" style={{ color: "var(--text-primary)" }}>{val}</p>
    </div>
  );
}

function AdminPanel({ onBack }: { onBack: () => void }) {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);

  const handleLogin = () => {
    if (password === "yima2024") { setAuthed(true); sessionStorage.setItem("admin_auth", "1"); }
  };

  if (!authed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-5" style={{ background: "var(--bg-primary)" }}>
        <div className="max-w-sm w-full">
          <button onClick={onBack} className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>← 返回首页</button>
          <h1 className="text-xl font-bold mb-4 text-center" style={{ color: "var(--text-primary)" }}>线索管理</h1>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="输入密码" className="w-full px-4 py-3 rounded-xl text-sm mb-3" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text-primary)" }} />
          <button onClick={handleLogin} className="w-full py-3 rounded-xl text-sm font-semibold" style={{ background: "var(--yima-red)", color: "white" }}>登录</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-5 py-8" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-2xl mx-auto">
        <button onClick={onBack} className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>← 返回首页</button>
        <h1 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>咨询线索</h1>
        <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
          查看方式：Cloudflare 控制台 → Workers & Pages → yima-diagnosis → Logs<br/>
          搜索 <code style={{ color: "var(--yima-gold)" }}>[LEAD]</code> 即可看到所有线索
        </p>
        <div className="glass-card p-4">
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            每条线索日志格式：
          </p>
          <code className="text-xs mt-2 block p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.04)", color: "var(--yima-gold)" }}>
            [LEAD] 手机号 行业 门店数 得分 等级
          </code>
          <p className="text-xs mt-4" style={{ color: "var(--text-muted)" }}>
            提示：配置 LEADS_WEBHOOK_URL 环境变量可实时推送到飞书/钉钉群
          </p>
        </div>
      </div>
    </div>
  );
}
