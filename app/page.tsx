"use client";

import { useState, useEffect, useCallback } from "react";
import { questions } from "@/lib/questions";
import { calculateScores, getLevelColor } from "@/lib/scoring";
import { DIMENSION_LABELS, DIMENSION_ORDER, type Question } from "@/lib/types";

const QUESTIONS_PER_PAGE = 8;
const STORAGE_KEY = "yima_diagnosis_draft";

function groupByDimension(): { dim: string; label: string; questions: Question[] }[] {
  return DIMENSION_ORDER.map((dim) => ({
    dim,
    label: DIMENSION_LABELS[dim],
    questions: questions.filter((q) => q.dimension === dim),
  }));
}

const dimensionGroups = groupByDimension();

const questionDimensionMap: Record<string, string> = {};
questions.forEach((q) => { questionDimensionMap[q.id] = q.dimension; });

// ---- Types ----
interface CompanyInfo { industry: string; storeCount: string; }
interface ReportData {
  overview: { headline: string; stage: string; strength: string; risk: string };
  dimensions: { dim: string; score: number; comment: string; tips: string[] }[];
  actions: { title: string; why: string; timeline: string }[];
  yima: string;
}

const INDUSTRIES = [
  "餐饮", "零售", "酒店民宿", "教育培训", "美容美发", "健身运动",
  "汽车服务", "医疗健康", "宠物服务", "便利店", "服装", "其他连锁",
];

// ===================== Main =====================
export default function QuestionnairePage() {
  const [phase, setPhase] = useState<"welcome" | "info" | "survey" | "result">("welcome");
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({ industry: "", storeCount: "" });
  const [currentDim, setCurrentDim] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [scores, setScores] = useState<ReturnType<typeof calculateScores> | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setAnswers(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  const saveAnswers = useCallback((next: Record<string, number>) => {
    setAnswers(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  }, []);

  const handleAnswer = (questionId: string, value: number) => {
    saveAnswers({ ...answers, [questionId]: value });
  };

  const answeredInDim = (i: number) =>
    dimensionGroups[i].questions.filter((q) => answers[q.id] !== undefined).length;

  const totalAnswered = () => questions.filter((q) => answers[q.id] !== undefined).length;

  const handleSubmit = () => {
    const result = calculateScores(answers, questionDimensionMap);
    setScores(result);
    setPhase("result");
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleRestart = () => {
    setAnswers({});
    setScores(null);
    setCompanyInfo({ industry: "", storeCount: "" });
    setCurrentDim(0);
    setPhase("welcome");
  };

  if (phase === "welcome") return <WelcomeScreen onStart={() => setPhase("info")} />;
  if (phase === "info") return <InfoScreen info={companyInfo} setInfo={setCompanyInfo} onNext={() => setPhase("survey")} />;
  if (phase === "result" && scores) return <ResultScreen scores={scores} info={companyInfo} onRestart={handleRestart} />;

  const dim = dimensionGroups[currentDim];
  const progress = Math.round((totalAnswered() / questions.length) * 100);
  const isLast = currentDim === dimensionGroups.length - 1;
  const canNext = answeredInDim(currentDim) === QUESTIONS_PER_PAGE;
  const canSubmit = questions.length === totalAnswered();

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50">
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-zinc-200">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3">
          <span className="text-xs sm:text-sm whitespace-nowrap font-medium text-zinc-800">逸马诊断</span>
          <div className="flex-1 h-1.5 sm:h-2 bg-zinc-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-[11px] sm:text-xs text-zinc-400">{progress}%</span>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-2xl px-3 sm:px-4 py-4 sm:py-6">
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-500 mb-0.5 sm:mb-1">
            <span>维度 {currentDim + 1}/{dimensionGroups.length}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-zinc-900">{dim.label}</h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5 sm:mt-1">已答 {answeredInDim(currentDim)}/{QUESTIONS_PER_PAGE} 题</p>
        </div>

        <div className="space-y-3 sm:space-y-5">
          {dim.questions.map((q, idx) => (
            <div key={q.id} className="bg-white rounded-xl border border-zinc-200 p-3.5 sm:p-5 shadow-sm">
              <p className="font-medium text-zinc-900 mb-3 sm:mb-4 text-sm sm:text-base leading-relaxed">
                <span className="text-blue-600 mr-1.5">{idx + 1}.</span>{q.text}
              </p>
              <div className="space-y-2">
                {q.options.map((opt) => {
                  const sel = answers[q.id] === opt.value;
                  return (
                    <button key={opt.value} onClick={() => handleAnswer(q.id, opt.value)}
                      className={`w-full text-left px-3.5 sm:px-4 py-3 sm:py-3 rounded-lg border text-sm transition-all ${
                        sel ? "border-blue-600 bg-blue-50 text-blue-900 font-medium" : "border-zinc-200 text-zinc-600 hover:border-zinc-300 active:bg-zinc-50"
                      }`}>
                      <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full border-2 mr-2.5 sm:mr-3 text-[11px] sm:text-xs shrink-0 ${
                        sel ? "border-blue-600 bg-blue-600 text-white" : "border-zinc-300"
                      }`}>{sel ? "✓" : ""}</span>
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-zinc-200 safe-bottom">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3">
          <button onClick={() => setCurrentDim((p) => Math.max(0, p - 1))} disabled={currentDim === 0}
            className="px-3 sm:px-4 py-2.5 text-sm font-medium text-zinc-600 disabled:text-zinc-300 active:text-zinc-900 transition-colors">
            ← 上一维度
          </button>
          <div className="flex gap-2">
            {isLast ? (
              <button onClick={handleSubmit} disabled={!canSubmit}
                className={`px-5 sm:px-6 py-2.5 sm:py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  canSubmit ? "bg-blue-600 text-white active:bg-blue-700 shadow-sm" : "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                }`}>
                {canSubmit ? "提交查看诊断结果" : `还有 ${questions.length - totalAnswered()} 题未答`}
              </button>
            ) : (
              <button onClick={() => setCurrentDim((p) => Math.min(dimensionGroups.length - 1, p + 1))} disabled={!canNext}
                className={`px-5 sm:px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  canNext ? "bg-blue-600 text-white active:bg-blue-700 shadow-sm" : "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                }`}>
                下一维度 →
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

// ===================== Welcome =====================
function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-gradient-to-b from-blue-50 to-white px-5 py-8">
      <div className="max-w-md w-full text-center">
        <div className="text-4xl sm:text-5xl mb-4 sm:mb-5">🏬</div>
        <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 mb-2 sm:mb-3">
          你的连锁企业，离失控还有多远？
        </h1>
        <p className="text-sm sm:text-base text-zinc-500 leading-relaxed mb-2">
          扩张越快，隐患越深。标准化跟不上，复制就是找死。
        </p>
        <p className="text-xs sm:text-sm text-zinc-400 mb-5">
          逸马 22 年方法论 · 9 维度成熟度模型 · 30 分钟出报告
        </p>

        <div className="flex flex-wrap justify-center gap-1.5 mb-5 text-xs text-zinc-400">
          {DIMENSION_ORDER.map((d) => (
            <span key={d} className="bg-white border border-zinc-200 rounded-full px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs">{DIMENSION_LABELS[d]}</span>
          ))}
        </div>
        <div className="text-xs sm:text-sm text-zinc-400 mb-5 sm:mb-6">共 72 题 · 约 12 分钟 · 完全免费</div>
        <button onClick={onStart}
          className="w-full py-4 rounded-xl bg-blue-600 text-white font-semibold text-base sm:text-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-[0.98]">
          开始免费诊断
        </button>
        <p className="text-[11px] text-zinc-400 mt-3">已有 3,286 家企业完成诊断 · 答题进度自动保存</p>

        {/* Social Proof */}
        <div className="mt-8 pt-6 border-t border-zinc-200">
          <p className="text-[10px] sm:text-xs text-zinc-400 mb-3 uppercase tracking-wider">已服务客户</p>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-zinc-400 font-medium">
            <span>百果园</span><span className="text-zinc-200">·</span>
            <span>锅圈食汇</span><span className="text-zinc-200">·</span>
            <span>木屋烧烤</span><span className="text-zinc-200">·</span>
            <span>苏宁</span><span className="text-zinc-200">·</span>
            <span>良品铺子</span><span className="text-zinc-200">·</span>
            <span>周黑鸭</span>
          </div>
          <p className="text-[10px] text-zinc-400 mt-2">3,000+ 会员企业 · 195 家已上市</p>
        </div>
      </div>
    </div>
  );
}

// ===================== Info Step =====================
function InfoScreen({ info, setInfo, onNext }: {
  info: CompanyInfo;
  setInfo: (v: CompanyInfo) => void;
  onNext: () => void;
}) {
  const canNext = info.industry && info.storeCount;
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-zinc-50 px-5">
      <div className="max-w-md w-full">
        <h2 className="text-lg sm:text-xl font-bold text-zinc-900 mb-1 sm:mb-2 text-center">基本信息</h2>
        <p className="text-xs sm:text-sm text-zinc-400 mb-6 sm:mb-8 text-center">帮助我们生成更精准的诊断报告</p>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">所属行业</label>
            <select value={info.industry} onChange={(e) => setInfo({ ...info, industry: e.target.value })}
              className="w-full px-4 py-3.5 rounded-xl border border-zinc-200 bg-white text-zinc-900 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all appearance-none">
              <option value="">请选择行业</option>
              {INDUSTRIES.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">门店数量</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {["1-10家", "11-50家", "51-200家", "200家以上"].map((opt) => (
                <button key={opt} onClick={() => setInfo({ ...info, storeCount: opt })}
                  className={`py-3 rounded-lg border text-sm font-medium transition-all ${
                    info.storeCount === opt
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
                  }`}>{opt}</button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={onNext} disabled={!canNext}
          className={`w-full mt-8 py-4 rounded-xl font-semibold text-base transition-all ${
            canNext ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-[0.98]" : "bg-zinc-200 text-zinc-400 cursor-not-allowed"
          }`}>
          开始答题
        </button>
      </div>
    </div>
  );
}

// ===================== Result =====================
function ResultScreen({
  scores, info, onRestart,
}: {
  scores: ReturnType<typeof calculateScores>;
  info: CompanyInfo;
  onRestart: () => void;
}) {
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState<ReportData | null>(null);
  const [error, setError] = useState("");

  const generateReport = async () => {
    setGenerating(true);
    setError("");
    try {
      const resp = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          overall_score: scores.overall_score,
          level: scores.level,
          scores: scores.scores,
          answers: scores.answers,
          industry: info.industry,
          storeCount: info.storeCount,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "请求失败");
      setReport(data.report);
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setGenerating(false);
    }
  };

  const levelColor = scores.level === "领先型" ? "from-emerald-500 to-emerald-600"
    : scores.level === "成熟型" ? "from-blue-500 to-blue-600"
    : scores.level === "成长型" ? "from-amber-500 to-amber-600"
    : "from-red-500 to-red-600";

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Hero */}
      <div className={`bg-gradient-to-b ${levelColor} text-white`}>
        <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12 text-center">
          <p className="text-white/70 text-xs sm:text-sm mb-1 sm:mb-2">逸马连锁成熟度诊断报告</p>
          <div className="text-5xl sm:text-7xl font-black mb-1 sm:mb-2 tracking-tight">{scores.overall_score}</div>
          <p className="text-white/60 text-xs sm:text-sm mb-3 sm:mb-4">综合得分</p>
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-bold bg-white/20 backdrop-blur">
            {scores.level}
          </span>
          {info.industry && (
            <p className="text-white/50 text-xs mt-2 sm:mt-3">{info.industry} · {info.storeCount}</p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-3 sm:px-4 py-6 sm:py-8">
        {/* Radar Chart + Score Grid */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-4 sm:p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs sm:text-sm font-semibold text-zinc-400 uppercase tracking-wider">各维度得分</h3>
            <button onClick={() => {
              if (navigator.share) {
                navigator.share({ title: "逸马连锁成熟度诊断", text: `我的连锁成熟度得分：${scores.overall_score}分（${scores.level}）`, url: window.location.href }).catch(() => {});
              } else {
                navigator.clipboard.writeText(window.location.href).then(() => alert("链接已复制，发送给合伙人一起测！")).catch(() => {});
              }
            }} className="text-xs text-blue-600 font-medium active:text-blue-800 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
              分享给合伙人
            </button>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <RadarChart scores={scores.scores} />
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-1.5 w-full sm:w-auto text-xs">
              {DIMENSION_ORDER.map((dim) => {
                const score = scores.scores[dim] || 0;
                let dot = "bg-red-500";
                if (score >= 66) dot = "bg-emerald-500";
                else if (score >= 41) dot = "bg-amber-500";
                return (
                  <div key={dim} className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
                    <span className="text-zinc-600 truncate">{DIMENSION_LABELS[dim]}</span>
                    <span className="font-semibold text-zinc-900 ml-auto">{score}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* AI Section */}
        {!report && (
          <div className="text-center py-6 sm:py-8">
            {error && <p className="text-red-500 text-xs sm:text-sm mb-4 bg-red-50 py-2 px-3 rounded-lg">{error}</p>}
            <button onClick={generateReport} disabled={generating}
              className={`px-6 sm:px-8 py-3.5 rounded-xl font-semibold text-sm sm:text-base transition-all ${
                generating
                  ? "bg-zinc-200 text-zinc-500"
                  : "bg-gradient-to-r from-blue-600 to-blue-700 text-white active:from-blue-700 active:to-blue-800 shadow-lg shadow-blue-200"
              }`}>
              {generating ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  AI 诊断分析中...
                </span>
              ) : "生成 AI 诊断报告 →"}
            </button>
            <p className="text-[11px] sm:text-xs text-zinc-400 mt-2 sm:mt-3">基于您的答题数据，AI 深度分析约需 10-20 秒</p>
          </div>
        )}

        {report && <ReportView report={report} scores={scores} onRegenerate={generateReport} generating={generating} info={info} />}

        <div className="mt-5 sm:mt-6 text-center">
          <button onClick={onRestart} className="text-xs sm:text-sm text-zinc-400 hover:text-zinc-600 transition-colors">重新诊断</button>
        </div>
      </div>
    </div>
  );
}

// ===================== Radar Chart =====================
function RadarChart({ scores }: { scores: Record<string, number> }) {
  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 80;
  const levels = 5;

  const angleSlice = (2 * Math.PI) / DIMENSION_ORDER.length;

  const getPoint = (dim: string, value: number) => {
    const idx = DIMENSION_ORDER.indexOf(dim);
    const angle = angleSlice * idx - Math.PI / 2;
    const r = (value / 100) * radius;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  const gridLines = Array.from({ length: levels }, (_, i) => {
    const r = ((i + 1) / levels) * radius;
    return DIMENSION_ORDER.map((_, idx) => {
      const angle = angleSlice * idx - Math.PI / 2;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    }).join(" ");
  });

  const dataPoints = DIMENSION_ORDER.map((dim) => {
    const p = getPoint(dim, scores[dim] || 0);
    return `${p.x},${p.y}`;
  }).join(" ");

  return (
    <div className="flex-shrink-0">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {gridLines.map((pts, i) => (
          <polygon key={i} points={pts} fill="none" stroke="#e4e4e7" strokeWidth={i === 4 ? 1.5 : 0.5} />
        ))}
        {DIMENSION_ORDER.map((dim, idx) => {
          const p = getPoint(dim, 100);
          return <line key={dim} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#e4e4e7" strokeWidth={0.5} />;
        })}
        <polygon points={dataPoints} fill="rgba(37,99,235,0.15)" stroke="#2563eb" strokeWidth={2} strokeLinejoin="round" />
        {DIMENSION_ORDER.map((dim) => {
          const p = getPoint(dim, scores[dim] || 0);
          return <circle key={dim} cx={p.x} cy={p.y} r={3} fill="#2563eb" />;
        })}
        {DIMENSION_ORDER.map((dim, idx) => {
          const angle = angleSlice * idx - Math.PI / 2;
          const labelR = radius + 18;
          const x = cx + labelR * Math.cos(angle);
          const y = cy + labelR * Math.sin(angle);
          return (
            <text key={dim} x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="fill-zinc-500" style={{ fontSize: "9px" }}>
              {DIMENSION_LABELS[dim]}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

// ===================== Report View =====================
function ReportView({ report, scores, onRegenerate, generating, info }: {
  report: ReportData;
  scores: ReturnType<typeof calculateScores>;
  onRegenerate: () => void;
  generating: boolean;
  info: CompanyInfo;
}) {
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const handlePrint = () => window.print();
  const handleConsult = () => { if (!phone) return; setSubmitted(true); };
  // Sort dimensions low to high
  const sortedDims = [...report.dimensions].sort((a, b) => a.score - b.score);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Overview */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-4 sm:p-6 shadow-sm">
        <h3 className="text-xs sm:text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3 sm:mb-4">诊断总览</h3>
        <p className="text-base sm:text-lg font-bold text-zinc-900 mb-3 sm:mb-4 leading-snug">{report.overview.headline}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
          <OverviewCard icon="📌" label="发展阶段" value={report.overview.stage} />
          <OverviewCard icon="💪" label="核心优势" value={report.overview.strength} />
          <OverviewCard icon="⚠️" label="最大风险" value={report.overview.risk} color="red" />
        </div>
      </div>

      {/* Dimension Analysis */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-4 sm:p-6 shadow-sm">
        <h3 className="text-xs sm:text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3 sm:mb-4">
          维度分析 <span className="text-zinc-300">（按得分排序）</span>
        </h3>
        <div className="space-y-2 sm:space-y-3">
          {sortedDims.map((dim) => {
            const realScore = scores.scores[dim.dim] || dim.score;
            let barColor = "bg-red-500";
            if (realScore >= 66) barColor = "bg-emerald-500";
            else if (realScore >= 41) barColor = "bg-amber-500";
            return (
              <details key={dim.dim} className="group">
                <summary className="flex items-center gap-2 sm:gap-3 cursor-pointer list-none py-2 px-2 sm:px-3 -mx-2 sm:-mx-3 rounded-xl active:bg-zinc-50 transition-colors">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${barColor}`} />
                  <span className="text-sm font-medium text-zinc-800 w-16 sm:w-20 shrink-0">{dim.dim}</span>
                  <span className={`text-sm font-bold w-7 sm:w-8 shrink-0 ${realScore >= 66 ? "text-emerald-600" : realScore >= 41 ? "text-amber-600" : "text-red-600"}`}>{realScore}</span>
                  <span className="text-xs sm:text-sm text-zinc-500 truncate flex-1">{dim.comment}</span>
                  <svg className="w-4 h-4 text-zinc-300 shrink-0 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <div className="mt-2 ml-6 sm:ml-7 pl-3 sm:pl-4 border-l-2 border-zinc-100 space-y-1.5">
                  <p className="text-xs sm:text-sm text-zinc-500">{dim.comment}</p>
                  {dim.tips.map((tip, i) => (
                    <p key={i} className="text-xs sm:text-sm text-blue-600 flex items-start gap-1.5 sm:gap-2">
                      <span className="text-blue-300 mt-0.5 shrink-0">→</span>{tip}
                    </p>
                  ))}
                </div>
              </details>
            );
          })}
        </div>
      </div>

      {/* Action Plan */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-4 sm:p-6 shadow-sm">
        <h3 className="text-xs sm:text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3 sm:mb-4">优先行动</h3>
        <div className="space-y-3 sm:space-y-4">
          {report.actions.map((act, i) => (
            <div key={i} className="flex gap-3 sm:gap-4">
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-600 text-white text-xs sm:text-sm font-bold flex items-center justify-center shrink-0">{i + 1}</div>
                {i < report.actions.length - 1 && <div className="w-0.5 flex-1 bg-blue-100 mt-1" />}
              </div>
              <div className="pb-1">
                <p className="font-semibold text-zinc-900 text-sm">{act.title}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{act.why}</p>
                <span className="inline-block mt-1.5 text-[11px] sm:text-xs px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-500">{act.timeline}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Yima Value */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-4 sm:p-6">
        <h3 className="text-xs sm:text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2 sm:mb-3">逸马如何帮到你</h3>
        <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed">{report.yima}</p>
      </div>

      {/* Consultation CTA */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-4 sm:p-6 shadow-sm">
        <h3 className="text-sm font-bold text-zinc-900 mb-2">获取专属改进方案</h3>
        <p className="text-xs text-zinc-500 mb-4">留下手机号，逸马顾问将为您定制诊断深度解读与改进路线图。</p>
        {submitted ? (
          <div className="text-center py-3 bg-green-50 rounded-xl">
            <p className="text-sm font-semibold text-green-700">已提交！</p>
            <p className="text-xs text-green-600 mt-1">逸马顾问将在 1 个工作日内联系您</p>
          </div>
        ) : (
          <div className="flex gap-2">
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="请输入手机号"
              className="flex-1 px-4 py-3 rounded-xl border border-zinc-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            <button onClick={handleConsult} disabled={!phone}
              className={`px-5 py-3 rounded-xl text-sm font-semibold transition-all shrink-0 ${
                phone ? "bg-blue-600 text-white active:bg-blue-700" : "bg-zinc-200 text-zinc-400"
              }`}>预约咨询</button>
          </div>
        )}
      </div>

      {/* Actions: PDF + Share + Regenerate */}
      <div className="flex items-center justify-center gap-4 pt-1 sm:pt-2 flex-wrap">
        <button onClick={handlePrint} className="text-xs sm:text-sm text-zinc-500 active:text-zinc-800 font-medium flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          下载 PDF
        </button>
        <span className="text-zinc-200">|</span>
        <button onClick={onRegenerate} disabled={generating}
          className="text-xs sm:text-sm text-blue-600 active:text-blue-800 font-medium">
          {generating ? "重新生成中..." : "重新生成报告"}
        </button>
      </div>
    </div>
  );
}

function OverviewCard({ icon, label, value, color }: {
  icon: string; label: string; value: string; color?: string;
}) {
  const borderColor = color === "red" ? "border-red-100 bg-red-50/50" : "border-zinc-100 bg-zinc-50/50";
  return (
    <div className={`rounded-xl border ${borderColor} p-3`}>
      <p className="text-xs text-zinc-400 mb-1">{icon} {label}</p>
      <p className="text-sm font-medium text-zinc-800 leading-snug">{value}</p>
    </div>
  );
}
