"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { questions, industryWarmup } from "@/lib/questions";
import { calculateScores } from "@/lib/scoring";
import { DIMENSION_LABELS, DIMENSION_ORDER, DIMENSION_TIPS, type Question } from "@/lib/types";

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

// ===== Welcome (Full Landing Page) =====
function Welcome({ onStart }: { onStart: () => void }) {
  const scrollRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Particle system
  useEffect(() => {
    const canvas = document.getElementById("particles") as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let animId: number;
    const particles: { x: number; y: number; size: number; speed: number; opacity: number; drift: number }[] = [];
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize(); window.addEventListener("resize", resize);
    for (let i = 0; i < 60; i++) particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, size: Math.random() * 1.5 + 0.5, speed: Math.random() * 0.3 + 0.08, opacity: Math.random() * 0.4 + 0.1, drift: Math.random() * 0.2 - 0.1 });
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) { ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.strokeStyle = `rgba(59,130,246,${0.05 * (1 - dist / 100)})`; ctx.lineWidth = 0.5; ctx.stroke(); }
        }
      }
      particles.forEach(p => { p.y += p.speed; p.x += p.drift; if (p.y > canvas.height + 10) { p.y = -10; p.x = Math.random() * canvas.width; } ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fillStyle = `rgba(96,165,250,${p.opacity})`; ctx.fill(); });
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  // Navbar scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll reveal
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => { entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("on"); }); }, { threshold: 0.1 });
    document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <canvas id="particles" />
      <div className="glow-orb glow-1" /><div className="glow-orb glow-2" />

      {/* NAVBAR */}
      <nav className={`landing-nav${scrolled ? " scrolled" : ""}`}>
        <div className="nav-brand">
          <div className="logo-box">逸</div>
          <span>逸马诊断</span>
        </div>
        <ul className="nav-links">
          <li><a href="#how">诊断流程</a></li>
          <li><a href="#model">9维模型</a></li>
          <li><a href="#report">样本报告</a></li>
          <li><a href="#clients">服务客户</a></li>
          <li><a href="#faq">FAQ</a></li>
        </ul>
        <button onClick={onStart} className="nav-cta">开始诊断</button>
      </nav>

      {/* HERO */}
      <section className="hero-section" ref={scrollRef}>
        <div className="hero-grid">
          <div>
            <div className="hero-badge"><span className="dot-ring" /> 22年方法论 · AI驱动诊断</div>
            <h1 className="hero">你的连锁<br />在<span className="highlight">什么段位</span>？</h1>
            <p className="hero-sub">基于22年连锁咨询数据训练的智能诊断引擎。<br />9大维度 × 72项指标，15分钟精准定位企业成熟度。</p>
            <div className="hero-actions">
              <button onClick={onStart} className="btn-primary">→ 开始免费诊断</button>
              <a href="/share?score=78&level=成熟型" className="btn-secondary">查看样本报告</a>
            </div>
            <div className="hero-stats">
              <div><div className="hero-stat-val">3,286<span> 家</span></div><div className="hero-stat-lbl">已完成诊断</div></div>
              <div><div className="hero-stat-val">78<span> 分</span></div><div className="hero-stat-lbl">企业平均分</div></div>
              <div><div className="hero-stat-val">94<span>%</span></div><div className="hero-stat-lbl">报告满意度</div></div>
            </div>
          </div>
          {/* Dashboard preview */}
          <div className="hero-dash-card">
            <div className="dash-header">
              <div className="dash-dots"><span className="dash-dot r" /><span className="dash-dot y" /><span className="dash-dot g" /></div>
              <div className="dash-tag">LIVE</div>
            </div>
            <div className="dash-score-row">
              <div className="dash-big-num">78<span className="unit">/100</span></div>
              <div className="dash-level"><b>成熟型</b><br />超过 68% 同行</div>
            </div>
            <div className="dash-grid">
              <div className="dash-mini"><div className="dash-mini-label">战略定位</div><div className="dash-mini-val" style={{color:"#10B981"}}>85</div><div className="dash-mini-bar"><div className="dash-mini-fill green" style={{width:"85%"}} /></div></div>
              <div className="dash-mini"><div className="dash-mini-label">运营标准</div><div className="dash-mini-val" style={{color:"#60A5FA"}}>72</div><div className="dash-mini-bar"><div className="dash-mini-fill blue" style={{width:"72%"}} /></div></div>
              <div className="dash-mini"><div className="dash-mini-label">数字化</div><div className="dash-mini-val" style={{color:"#F59E0B"}}>45</div><div className="dash-mini-bar"><div className="dash-mini-fill cyan" style={{width:"45%"}} /></div></div>
              <div className="dash-mini"><div className="dash-mini-label">人才体系</div><div className="dash-mini-val" style={{color:"#818CF8"}}>60</div><div className="dash-mini-bar"><div className="dash-mini-fill blue" style={{width:"60%"}} /></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="trust-bar">
        <div className="trust-track">
          {[["22 年","连锁咨询深耕"],["3,000+","会员企业"],["195 家","已上市"],["200+","高校教材覆盖"],["72 项","诊断指标"]].map(([n, l]) => (
            <div key={l} className="trust-item"><div className="trust-num">{n.split(" ")[0]}<span className="unit">{n.includes(" ") ? " " + n.split(" ")[1] : ""}</span></div><div className="trust-label">{l}</div></div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="landing-section" id="how">
        <div className="landing-section-inner">
          <div className="section-label">诊断流程</div>
          <h2 className="section-title">三步完成诊断，即时出报告</h2>
          <p className="section-sub">无需注册，AI 引擎自动分析，15-20分钟获得专业级连锁成熟度评估</p>
          <div className="steps-grid">
            {[{ n:"01", i:"📝", t:"填写诊断问卷", d:"72道专业题目，覆盖连锁经营全部关键维度。答题进度实时保存，支持中途退出续答。" },
              { n:"02", i:"🧠", t:"AI智能分析", d:"基于22年行业数据训练的算法引擎，自动生成9维雷达图、成熟度评分和同业对比。" },
              { n:"03", i:"📄", t:"获取诊断报告", d:"一键下载PDF报告，含改进路线图与优先级矩阵。适合10-500家门店的连锁企业。" }].map((s) => (
              <div key={s.n} className="step-card reveal">
                <div className="step-num">{s.n}</div>
                <div className="step-icon">{s.i}</div>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9 DIMENSIONS */}
      <section className="landing-section alt" id="model">
        <div className="landing-section-inner">
          <div className="section-label">诊断模型</div>
          <h2 className="section-title">9维度连锁成熟度模型</h2>
          <p className="section-sub">从战略顶层到执行细节，系统化诊断企业核心竞争力</p>
          <div className="model-grid">
            <div className="model-tags reveal">
              {DIMENSION_ORDER.map((d, i) => <span key={d} className={`model-tag${i===0?" active":""}`} title={DIMENSION_TIPS[d]}>{i===0?"🎯 ":i===1?"💰 ":i===2?"📋 ":i===3?"👥 ":i===4?"🔗 ":i===5?"📚 ":i===6?"✅ ":i===7?"💻 ":"🏛 "}{DIMENSION_LABELS[d]}</span>)}
            </div>
            <div className="reveal" style={{display:"flex",justifyContent:"center"}}>
              <svg viewBox="0 0 200 200" width="100%" style={{maxWidth:340}}>
                <defs>
                  <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25"/>
                    <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.08"/>
                  </linearGradient>
                </defs>
                {[20,40,60,80].map(r => <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="rgba(59,130,246,0.06)" strokeWidth="0.5"/>)}
                <line x1="100" y1="20" x2="100" y2="180" stroke="rgba(59,130,246,0.04)" strokeWidth="0.5"/>
                <line x1="20" y1="100" x2="180" y2="100" stroke="rgba(59,130,246,0.04)" strokeWidth="0.5"/>
                <polygon points="100,28 152,52 175,100 158,152 100,170 42,152 25,100 48,52" fill="url(#rg)" stroke="#3B82F6" strokeWidth="1.5"/>
                {[[100,28],[152,52],[175,100],[158,152],[100,170],[42,152],[25,100],[48,52]].map(([cx,cy]) => <circle key={`${cx},${cy}`} cx={cx} cy={cy} r="3" fill="#60A5FA"/>)}
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* SAMPLE REPORT */}
      <section className="landing-section" id="report">
        <div className="landing-section-inner">
          <div className="section-label">诊断产出</div>
          <h2 className="section-title">你的专属连锁诊断报告</h2>
          <p className="section-sub">不止一个分数 —— 你会获得完整的改进地图和行业对标分析</p>
          <div className="report-grid">
            <div className="report-card reveal">
              <div className="report-card-top">
                <div className="dash-dots"><span className="dash-dot r" /><span className="dash-dot y" /><span className="dash-dot g" /></div>
                <span style={{fontSize:10,color:"var(--text-muted)"}}>DIAGNOSTIC REPORT</span>
              </div>
              <div className="report-card-body">
                <div style={{fontSize:10,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:1}}>成熟度总分</div>
                <div className="report-score">78<span style={{fontSize:18,color:"var(--text-muted)"}}> /100</span></div>
                <div style={{fontSize:11,color:"var(--text-muted)"}}>成熟型 · 超过 68% 同规模企业</div>
                <div className="report-bar-list">
                  {[["战略",85,"h"],["运营",72,"h"],["人才",60,"m"],["数字化",45,"m"],["供应链",78,"h"]].map(([n,v,c]) => (
                    <div key={n as string} className="report-bar-row"><span className="report-bar-name">{n}</span><div className="report-bar-track"><div className={`report-bar-fill ${c}`} style={{width:`${v}%`}} /></div><span className="report-bar-val">{v}</span></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="report-features reveal">
              <h4>每份报告包含</h4>
              {["9维度成熟度雷达图 + 同业对比","改进优先级矩阵（紧急/重要）","分阶段升级路线图（0→6→12月）","关键短板与风险预警","行业标杆数据对标","逸马专家深度解读"].map((f,i) => (
                <div key={i} className="report-feat"><span style={{color:"var(--accent)",fontWeight:700,flexShrink:0}}>◆</span> {f}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CLIENTS */}
      <section className="landing-section alt" id="clients">
        <div className="landing-section-inner">
          <div className="section-label">服务客户</div>
          <h2 className="section-title">行业头部企业的共同选择</h2>
          <div className="client-row reveal">
            {["百果园","锅圈食汇","木屋烧烤","苏宁","良品铺子","周黑鸭"].map(c => <span key={c} className="client-tile">{c}</span>)}
          </div>
          <div className="client-stats reveal">
            {[["3,000+","会员企业"],["195家","已上市"],["200+","高校教材覆盖"],["25本","连锁专著"]].map(([n,l]) => (
              <div key={l} className="client-stat"><div className="client-stat-num">{n}</div><div className="client-stat-lbl">{l}</div></div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="landing-section" id="faq">
        <div className="landing-section-inner">
          <div className="section-label">常见问题</div>
          <h2 className="section-title">快速解答</h2>
          <div className="faq-grid">
            {[
              { q:"真的完全免费吗？", a:"完全免费。诊断是我们22年方法论的产品化展示，通过深度咨询项目盈利，诊断环节不收取任何费用。" },
              { q:"答题数据安全吗？", a:"数据加密传输，仅用于生成你的诊断报告，绝不会分享给任何第三方。" },
              { q:"适合什么规模的企业？", a:"10-500家门店的连锁企业最具诊断价值。单店或超大型集团参考意义有限。" },
              { q:"报告多久能出来？", a:"提交问卷后即时生成，PDF报告可直接下载保存，也可在线查看。" },
              { q:"可以重复测试吗？", a:"建议每6个月复诊一次，追踪成熟度变化趋势，量化改进行动效果。" },
              { q:"逸马为什么做免费诊断？", a:"让更多连锁企业体验22年方法论的价值，建立信任后再探讨深度合作可能。" },
            ].map((faq, i) => (
              <div key={i} className={`faq-item${openFaq===i?" open":""}`} onClick={() => setOpenFaq(openFaq===i?null:i)}>
                <div className="faq-q">{faq.q}<span className="toggle">+</span></div>
                <div className="faq-a">{faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="cta-banner-section">
        <h2>你的连锁能打几分？</h2>
        <p className="cta-sub">3,286家企业已获得清晰诊断报告，现在轮到你了</p>
        <button onClick={onStart} className="btn-primary">→ 开始免费诊断</button>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="footer-brand">
          <div className="f-logo">逸</div>
          <h4 style={{fontSize:14,fontWeight:700,marginBottom:4}}>逸马连锁成熟度诊断</h4>
          <p>基于22年连锁咨询方法论<br />9维度全面评估体系成熟度<br />手机浏览器打开 yima777.cn 随时测</p>
        </div>
        <div>
          <h5>快速导航</h5>
          <a href="#how">诊断流程</a><a href="#model">9维模型</a><a href="#report">样本报告</a><a href="#faq">常见问题</a>
        </div>
        <div>
          <h5>关于逸马</h5>
          <a href="#">逸马官网</a><a href="#">连锁专著</a><a href="#">咨询合作</a>
        </div>
      </footer>
      <div className="footer-bar">
        <span>© 2026 逸马诊断 yima777.cn</span>
        <span>方法论进入 200+ 高校教材 · 25本连锁专著 · 国家版权课程</span>
      </div>
    </>
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
    if (phone.length !== 11 || !/^1\d{10}$/.test(phone)) return;
    // 异步提交，不阻塞 UI
    fetch("/api/leads", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, industry_code: INDUSTRIES.indexOf(info.industry), store_code: ["1-10家","11-50家","51-200家","200家以上"].indexOf(info.storeCount), score: scores.overall_score }),
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
      <div className="glass-card p-4 sm:p-6 noprint">
        <h3 className="text-sm font-bold mb-2" style={{ color: "var(--text-primary)" }}>获取专属改进方案</h3>
        <p className="text-xs mb-4" style={{ color: "var(--text-secondary)" }}>留下手机号，逸马顾问将为您定制深度解读与改进路线图。</p>
        {submitted ? (
          <div className="text-center py-3 rounded-xl" style={{ background: "rgba(16,185,129,0.1)" }}>
            <p className="text-sm font-semibold" style={{ color: "#10b981" }}>已提交！</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>逸马顾问将在 1 个工作日内联系您</p>
          </div>
        ) : (
          <div className="flex gap-2">
            <input type="tel" value={phone} onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 11); setPhone(v); }} placeholder="请输入11位手机号"
              className="flex-1 px-4 py-3 rounded-xl text-sm outline-none" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text-primary)" }} maxLength={11} />
            <button onClick={handleConsult} disabled={phone.length !== 11} className="px-5 py-3 rounded-xl text-sm font-semibold transition-all shrink-0"
              style={phone.length === 11 ? { background: "var(--yima-red)", color: "white" } : { background: "rgba(255,255,255,0.06)", color: "var(--text-muted)" }}>
              预约咨询</button>
          </div>
        )}
      </div>

      {/* Bottom actions */}
      <div className="flex items-center justify-center gap-4 pt-1 flex-wrap noprint">
        <button onClick={handlePrint} className="px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all"
          style={{ background: "var(--yima-red)", color: "white" }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          导出 PDF
        </button>
        <span style={{ color: "var(--text-muted)" }}>|</span>
        <button onClick={() => {
          const url = `${window.location.origin}/share?score=${scores.overall_score}&level=${encodeURIComponent(scores.level)}`;
          if (navigator.share) {
            navigator.share({ title: "逸马诊断", text: `我的连锁得分：${scores.overall_score}分（${scores.level}）`, url }).catch(() => {});
          } else {
            navigator.clipboard.writeText(url).then(() => alert("分享链接已复制！")).catch(() => {});
          }
        }} className="px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all"
          style={{ background: "rgba(255,255,255,0.08)", color: "var(--text-primary)", border: "1px solid rgba(255,255,255,0.12)" }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
          分享结果
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
