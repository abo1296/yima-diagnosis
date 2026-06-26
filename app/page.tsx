"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { getQuestionsForIndustry, industryWarmup } from "@/lib/questions";
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

function groupByDim(qs: Question[]): { dim: string; label: string; questions: Question[] }[] {
  return DIMENSION_ORDER.map((dim) => ({ dim, label: DIMENSION_LABELS[dim], questions: qs.filter((q) => q.dimension === dim) }));
}

function buildQDimMap(qs: Question[]): Record<string, string> {
  const m: Record<string, string> = {};
  qs.forEach((q) => { m[q.id] = q.dimension; });
  return m;
}

// Types
interface CompanyInfo { industry: string; storeCount: string; }
interface ReportData {
  summary?: { fatal: string; strongest: string; first: string };
  overview: { headline: string; stage: string; strength: string; risk: string };
  dimensions: { dim: string; score: number; comment: string; tips: string[] }[];
  actions: { title: string; why: string; timeline: string }[];
  benchmark?: string;
  painpoint?: string;
  yima: string;
  nextStep?: string;
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

  // 根据行业动态加载题库
  const industryQs = useMemo(() => getQuestionsForIndustry(info.industry, info.storeCount), [info.industry, info.storeCount]);
  const dimGroups = useMemo(() => groupByDim(industryQs), [industryQs]);
  const qDimMap = useMemo(() => buildQDimMap(industryQs), [industryQs]);

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

  return <SurveyFlow answers={answers} saveAnswers={saveAnswers} step={surveyStep} setStep={setSurveyStep} onComplete={(sc) => { setScores(sc); setPhase("result"); localStorage.removeItem(STORAGE_KEY); }} questions={industryQs} dimGroups={dimGroups} qDimMap={qDimMap} />;
}

// ===== Welcome (Full Landing Page Pro) =====
function Welcome({ onStart }: { onStart: () => void }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [trustNums, setTrustNums] = useState([0,0,0,0]);
  const [reportBars, setReportBars] = useState(false);
  const heroCardRef = useRef<HTMLDivElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);

  // Network canvas
  useEffect(() => {
    const canvas = document.getElementById("bgCanvas") as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let animId: number, mouseX = -200, mouseY = -200;
    const nodes: { x:number; y:number; vx:number; vy:number; r:number }[] = [];
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize(); window.addEventListener("resize", resize);
    for (let i = 0; i < 60; i++) nodes.push({ x:Math.random()*canvas.width, y:Math.random()*canvas.height, vx:(Math.random()-.5)*0.4, vy:(Math.random()-.5)*0.4, r:Math.random()*2+1 });
    const onMove = (e:MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY; };
    window.addEventListener("mousemove", onMove);
    const animate = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      for (let i=0; i<nodes.length; i++) {
        for (let j=i+1; j<nodes.length; j++) {
          const dx=nodes[i].x-nodes[j].x, dy=nodes[i].y-nodes[j].y, dist=Math.sqrt(dx*dx+dy*dy);
          if (dist<140) { ctx.beginPath(); ctx.moveTo(nodes[i].x,nodes[i].y); ctx.lineTo(nodes[j].x,nodes[j].y); ctx.strokeStyle=`rgba(59,130,246,${0.08*(1-dist/140)})`; ctx.lineWidth=0.5; ctx.stroke(); }
        }
      }
      nodes.forEach(n => {
        n.x+=n.vx; n.y+=n.vy;
        if (n.x<0) n.x=canvas.width; if (n.x>canvas.width) n.x=0;
        if (n.y<0) n.y=canvas.height; if (n.y>canvas.height) n.y=0;
        const dx=n.x-mouseX, dy=n.y-mouseY, dist=Math.sqrt(dx*dx+dy*dy);
        if (dist<200) { n.x+=dx/dist*0.8; n.y+=dy/dist*0.8; }
        ctx.beginPath(); ctx.arc(n.x,n.y,n.r,0,Math.PI*2); ctx.fillStyle="rgba(96,165,250,0.5)"; ctx.fill();
      });
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); window.removeEventListener("mousemove", onMove); };
  }, []);

  // 3D tilt card
  const handleTilt = (e: React.MouseEvent) => {
    if (!heroCardRef.current) return;
    const rect = heroCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width/2;
    const y = e.clientY - rect.top - rect.height/2;
    heroCardRef.current.style.transform = `rotateY(${x*0.02}deg) rotateX(${-y*0.02}deg) translateZ(10px)`;
  };
  const resetTilt = () => { if (heroCardRef.current) heroCardRef.current.style.transform = "rotateY(0) rotateX(0) translateZ(0)"; };

  // Counter + bar animations on scroll
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        if (e.target === trustRef.current) {
          [22,3000,195,200].forEach((target, i) => {
            const start = performance.now();
            const anim = (now: number) => {
              const p = Math.min((now-start)/2000, 1);
              const v = Math.round(target * (1-Math.pow(1-p,3)));
              setTrustNums(prev => { const n = [...prev]; n[i] = v; return n; });
              if (p<1) requestAnimationFrame(anim);
            };
            requestAnimationFrame(anim);
          });
        }
        if (e.target === reportRef.current) setReportBars(true);
      });
    }, { threshold: 0.3 });
    if (trustRef.current) obs.observe(trustRef.current);
    if (reportRef.current) obs.observe(reportRef.current);

    // Scroll reveal
    const revealObs = new IntersectionObserver((entries) => { entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("on"); }); }, { threshold: 0.1 });
    document.querySelectorAll(".reveal").forEach(el => revealObs.observe(el));
    return () => { obs.disconnect(); revealObs.disconnect(); };
  }, []);

  return (
    <>
      <canvas id="bgCanvas" />

      {/* NAV */}
      <nav className="landing-nav">
        <div className="nav-brand">
          <img src="/logo.png" alt="逸马" className="logo-img" />
          逸马诊断
        </div>
        <ul className="nav-links">
          <li><a href="#how">诊断流程</a></li><li><a href="#model">9维模型</a></li><li><a href="#report">样本报告</a></li><li><a href="#clients">服务客户</a></li><li><a href="#faq">FAQ</a></li>
        </ul>
        <button onClick={onStart} className="nav-cta">开始诊断</button>
      </nav>

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-grid">
          <div className="reveal">
            <div className="hero-tag"><span className="pulse-dot" /> 22年方法论 · 智能化诊断</div>
            <h1>你的连锁<br />在<span className="grad">什么段位</span>？</h1>
            <p className="hero-sub">基于22年连锁咨询数据训练的智能诊断引擎。<br />9大维度 × 72项指标，15分钟精准定位企业成熟度。</p>
            <div className="hero-actions">
              <button onClick={onStart} className="btn-main">→ 开始免费诊断</button>
              <a href="/share?score=78&level=成熟型" className="btn-ghost">查看样本报告</a>
            </div>
          </div>
          <div className="hero-card-wrap reveal">
            <div className="hero-3d-card" ref={heroCardRef} onMouseMove={handleTilt} onMouseLeave={resetTilt}>
              <div className="card-dots"><span className="card-dot r" /><span className="card-dot y" /><span className="card-dot g" /></div>
              <div className="card-badge">LIVE DIAGNOSTIC</div>
              <div className="card-score-row">
                <div className="card-big-num">78<span className="unit">/100</span></div>
                <div className="card-level"><b>成熟型</b><br />超过 68% 同行</div>
              </div>
              <div className="card-grid">
                {[{l:"战略定位",v:"85",c:"#10B981"},{l:"运营标准",v:"72",c:"#60A5FA"},{l:"数字化",v:"45",c:"#F59E0B"},{l:"人才体系",v:"60",c:"#818CF8"}].map(d => (
                  <div key={d.l} className="card-mini"><div className="label">{d.l}</div><div className="val" style={{color:d.c}}>{d.v}</div><div className="bar"><div className="fill" style={{width:d.v+"%",background:d.c}} /></div></div>
                ))}
              </div>
              <div className="card-footer-row"><span>DIAGNOSTIC REPORT v2.4</span><span>即时分析中…</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="trust-section" ref={trustRef}>
        <div className="trust-row">
          {[["22"," 年","连锁咨询深耕"],["3000","+","会员企业"],["195"," 家","已上市"],["200","+","高校教材覆盖"]].map(([n,u,l],i) => (
            <div key={l} className="trust-card"><div className="trust-num">{trustNums[i]}<span className="unit">{u}</span></div><div className="trust-label">{l}</div></div>
          ))}
          <div className="trust-card"><div className="trust-num">72<span className="unit"> 项</span></div><div className="trust-label">诊断指标</div></div>
        </div>
      </section>

      {/* STEPS */}
      <section className="landing-section" id="how">
        <div className="landing-section-inner">
          <div className="section-label reveal">诊断流程</div>
          <h2 className="section-title reveal">三步完成诊断，即时出报告</h2>
          <p className="section-sub reveal">无需注册，AI 引擎自动分析，15-20分钟获得专业级连锁成熟度评估</p>
          <div className="steps-grid">
            {[{n:"01",i:"📝",t:"填写诊断问卷",d:"72道专业题目，覆盖连锁经营全部关键维度。答题进度实时保存，支持中途退出续答。"},{n:"02",i:"🧠",t:"AI智能分析",d:"基于22年行业数据训练的算法引擎，自动生成9维雷达图、成熟度评分和同业对比。"},{n:"03",i:"📄",t:"获取诊断报告",d:"一键下载PDF报告，含改进路线图与优先级矩阵。适合10-500家门店的连锁企业。"}].map(s => (
              <div key={s.n} className="magnetic-card reveal"><div className="step-num">{s.n}</div><div className="step-icon">{s.i}</div><h3>{s.t}</h3><p>{s.d}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* MODEL */}
      <section className="landing-section alt" id="model">
        <div className="landing-section-inner">
          <div className="section-label reveal">诊断模型</div>
          <h2 className="section-title reveal">9维度连锁成熟度模型</h2>
          <p className="section-sub reveal">从战略顶层到执行细节，系统化诊断企业核心竞争力</p>
          <div className="model-grid">
            <div className="model-tags reveal">
              {DIMENSION_ORDER.map((d,i) => <span key={d} className={`model-tag${i===0?" active":""}`} title={DIMENSION_TIPS[d]}>{["🎯","💰","📋","👥","🔗","📚","✅","💻","🏛"][i]} {DIMENSION_LABELS[d]}</span>)}
            </div>
            <div className="reveal" style={{display:"flex",justifyContent:"center"}}>
              <svg viewBox="0 0 220 220" width="100%" style={{maxWidth:380}}>
                <defs>
                  <radialGradient id="radarGlow" cx="50%" cy="50%"><stop offset="0%" stopColor="#3B82F6" stopOpacity="0.08"/><stop offset="100%" stopColor="transparent"/></radialGradient>
                  <linearGradient id="radarFill" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3"/><stop offset="100%" stopColor="#06B6D4" stopOpacity="0.1"/></linearGradient>
                  <filter id="glow"><feGaussianBlur stdDeviation="2"/></filter>
                </defs>
                <circle cx="110" cy="110" r="100" fill="url(#radarGlow)"/>
                {[25,45,65,85].map(r => <circle key={r} cx="110" cy="110" r={r} fill="none" stroke="rgba(59,130,246,0.06)" strokeWidth="0.5"/>)}
                <line x1="110" y1="10" x2="110" y2="210" stroke="rgba(59,130,246,0.04)" strokeWidth="0.5"/>
                <line x1="10" y1="110" x2="210" y2="110" stroke="rgba(59,130,246,0.04)" strokeWidth="0.5"/>
                <line x1="39" y1="39" x2="181" y2="181" stroke="rgba(59,130,246,0.04)" strokeWidth="0.5"/>
                <line x1="39" y1="181" x2="181" y2="39" stroke="rgba(59,130,246,0.04)" strokeWidth="0.5"/>
                <polygon points="110,25 157,48 185,110 165,172 110,195 55,172 35,110 63,48" fill="url(#radarFill)" stroke="#3B82F6" strokeWidth="1.5" filter="url(#glow)"/>
                {[[110,25],[157,48],[185,110],[165,172],[110,195],[55,172],[35,110],[63,48]].map(([cx,cy]) => <circle key={`${cx},${cy}`} cx={cx} cy={cy} r="4" fill="#60A5FA"/>)}
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* REPORT */}
      <section className="landing-section" id="report">
        <div className="landing-section-inner" ref={reportRef}>
          <div className="section-label reveal">诊断产出</div>
          <h2 className="section-title reveal">你的专属连锁诊断报告</h2>
          <p className="section-sub reveal">不止一个分数 —— 你会获得完整的改进地图和行业对标分析</p>
          <div className="report-grid">
            <div className="report-card reveal">
              <div className="report-card-top"><div className="card-dots"><span className="card-dot r" /><span className="card-dot y" /><span className="card-dot g" /></div><span style={{fontSize:10,color:"var(--text-muted)"}}>DIAGNOSTIC REPORT</span></div>
              <div className="report-card-body">
                <div style={{fontSize:10,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:1}}>成熟度总分</div>
                <div className="report-score">78<span style={{fontSize:18,color:"var(--text-muted)"}}>/100</span></div>
                <div style={{fontSize:12,color:"var(--text-muted)",marginBottom:4}}>成熟型 · 超过 68% 同规模企业</div>
                <div className="report-bar-list">
                  {[["战略","85"],["运营","72"],["人才","60"],["数字化","45"],["供应链","78"]].map(([n,v]) => (
                    <div key={n} className="report-bar-row"><span className="report-bar-name">{n}</span><div className="report-bar-track"><div className="report-bar-fill" style={{width:reportBars?`${v}%`:"0"}} /></div><span className="report-bar-val">{v}</span></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="report-features reveal">
              <h4>每份报告包含</h4>
              {["9维度成熟度雷达图 + 同业对比","改进优先级矩阵（紧急/重要）","分阶段升级路线图（0→6→12月）","关键短板与风险预警","行业标杆数据对标","逸马专家深度解读"].map((f,i) => (
                <div key={i} className="report-feat"><span className="feat-icon">◆</span> {f}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CLIENTS */}
      <section className="landing-section alt" id="clients">
        <div className="landing-section-inner">
          <div className="section-label reveal">服务客户</div>
          <h2 className="section-title reveal">行业头部企业的共同选择</h2>
          <div className="client-row reveal">
            {["百果园","锅圈食汇","木屋烧烤","苏宁","良品铺子","周黑鸭"].map(c => <span key={c} className="client-tile">{c}</span>)}
          </div>
          <div className="client-stats reveal">
            {[["3,000+","会员企业"],["195家","已上市"],["200+","高校教材覆盖"],["25本","连锁专著"]].map(([n,l]) => (
              <div key={l} style={{textAlign:"center"}}><div className="client-stat-num">{n}</div><div className="client-stat-lbl">{l}</div></div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="landing-section" id="faq">
        <div className="landing-section-inner">
          <div className="section-label reveal">常见问题</div>
          <h2 className="section-title reveal">快速解答</h2>
          <div className="faq-grid">
            {[
              {q:"真的完全免费吗？",a:"完全免费。诊断是我们22年方法论的产品化展示，通过深度咨询项目盈利，诊断环节不收取任何费用。"},
              {q:"答题数据安全吗？",a:"数据加密传输，仅用于生成你的诊断报告，绝不会分享给任何第三方。"},
              {q:"适合什么规模的企业？",a:"10-500家门店的连锁企业最具诊断价值。单店或超大型集团参考意义有限。"},
              {q:"报告多久能出来？",a:"提交问卷后即时生成，PDF报告可直接下载保存，也可在线查看。"},
              {q:"可以重复测试吗？",a:"建议每6个月复诊一次，追踪成熟度变化趋势，量化改进行动效果。"},
              {q:"逸马为什么做免费诊断？",a:"让更多连锁企业体验22年方法论的价值，建立信任后再探讨深度合作可能。"},
            ].map((faq,i) => (
              <div key={i} className={`faq-item reveal${openFaq===i?" open":""}`} onClick={() => setOpenFaq(openFaq===i?null:i)}>
                <div className="faq-q">{faq.q}<span className="faq-toggle">+</span></div>
                <div className="faq-a">{faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-banner-section">
        <h2 className="reveal">你的连锁能打几分？</h2>
        <p className="reveal" style={{color:"var(--text-secondary)",marginBottom:28,fontSize:15}}>3,286家企业已获得清晰诊断报告，现在轮到你了</p>
        <button onClick={onStart} className="btn-main reveal">→ 开始免费诊断</button>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="reveal">
          <img src="/logo.png" alt="逸马" style={{width:24,height:24,borderRadius:8,objectFit:"cover",marginBottom:14}} />
          <h4 style={{fontSize:15,fontWeight:700,marginBottom:6}}>逸马连锁成熟度诊断</h4>
          <p>基于22年连锁咨询方法论<br />9维度全面评估体系成熟度<br />手机浏览器打开 yima777.cn 随时测</p>
        </div>
        <div className="reveal"><h5>快速导航</h5><a href="#how">诊断流程</a><a href="#model">9维模型</a><a href="#report">样本报告</a><a href="#faq">常见问题</a></div>
        <div className="reveal"><h5>关于逸马</h5><a href="#">逸马官网</a><a href="#">连锁专著</a><a href="#">咨询合作</a><a href="#">隐私政策</a></div>
      </footer>
      <div className="f-bar"><span>© 2026 逸马诊断 yima777.cn</span><span>方法论进入 200+ 高校教材 · 25本连锁专著 · 国家版权课程</span></div>
    </>
  );
}

// ===== Info Step =====
function InfoStep({ info, setInfo, onNext }: { info: CompanyInfo; setInfo: (v: CompanyInfo) => void; onNext: () => void }) {
  const canNext = info.industry && info.storeCount;
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] px-5" style={{ background: "var(--bg)" }}>
      <div className="max-w-md w-full">
        <div className="section-label" style={{justifyContent:"center"}}>STEP 01</div>
        <h2 className="text-2xl font-extrabold mb-1 text-center tracking-tight" style={{ color: "var(--text-primary)" }}>基本信息</h2>
        <p className="text-sm mb-8 text-center" style={{ color: "var(--text-secondary)" }}>帮助生成更精准的行业对标诊断</p>
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-semibold mb-2.5 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>所属行业</label>
            <select value={info.industry} onChange={(e) => setInfo({ ...info, industry: e.target.value })}
              className="w-full px-5 py-4 rounded-xl text-base outline-none transition-all appearance-none"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-primary)", backdropFilter:"blur(10px)" }}>
              <option value="">请选择行业</option>
              {INDUSTRIES.map((ind) => <option key={ind} value={ind} style={{ background: "#020617" }}>{ind}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-2.5 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>门店数量</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {["1-10家","11-50家","51-200家","200家以上"].map((opt) => (
                <button key={opt} onClick={() => setInfo({ ...info, storeCount: opt })}
                  className="py-3.5 rounded-xl text-sm font-semibold transition-all"
                  style={info.storeCount === opt
                    ? { borderColor: "var(--brand)", background: "rgba(59,130,246,0.12)", color: "var(--brand-light)", border: "1px solid var(--brand)" }
                    : { border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-secondary)", backdropFilter:"blur(10px)" }}>
                  {opt}</button>
              ))}
            </div>
          </div>
        </div>
        <button onClick={onNext} disabled={!canNext} className="w-full mt-8 py-4 rounded-xl font-bold text-base transition-all"
          style={canNext ? { background: "linear-gradient(135deg,#3B82F6,#2563EB)", color:"#fff", boxShadow:"0 4px 24px rgba(59,130,246,0.25)" } : { background: "rgba(255,255,255,0.04)", color: "var(--text-muted)" }}>
          下一步：开始诊断 →
        </button>
      </div>
    </div>
  );
}

// ===== Survey Flow =====
function SurveyFlow({ answers, saveAnswers, step, setStep, onComplete, questions, dimGroups, qDimMap }: {
  answers: Record<string, number>;
  saveAnswers: (v: Record<string, number>) => void;
  step: { dimIdx: number; showIntro: boolean; qIdx: number };
  setStep: (v: { dimIdx: number; showIntro: boolean; qIdx: number }) => void;
  onComplete: (sc: ReturnType<typeof calculateScores>) => void;
  questions: Question[];
  dimGroups: ReturnType<typeof groupByDim>;
  qDimMap: Record<string, string>;
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
    <div className="flex flex-col min-h-[100dvh]" style={{ background: "var(--bg)" }}>
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
    <div className="flex flex-col min-h-[100dvh]" style={{ background: "var(--bg)" }}>
      <div className="sticky top-0 z-10 px-4 py-3" style={{ background: "rgba(2,6,23,0.95)" }}>
        <div className="progress-line mx-auto max-w-xl">
          <div className="progress-line-fill" style={{ width: `${Math.round((idx / Math.max(wqs.length, 1)) * 100)}%` }} />
        </div>
        <p className="text-[11px] mt-2 text-center" style={{ color: "var(--text-muted)" }}>
          <span style={{ color: "var(--brand-light)" }}>行业定制 </span>{idx + 1}/{wqs.length}
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
function DimIntro({ dim, dimIdx, hue, onDone }: { dim: { dim: string; label: string; questions: Question[] }; dimIdx: number; hue: string; onDone: () => void }) {
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
    <div className="flex flex-col items-center justify-center min-h-[100dvh] px-5" style={{ background: "var(--bg)" }}>
      <div className="text-center animate-pop-in">
        <div className="text-5xl mb-4">✓</div>
        <h2 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>诊断完成</h2>
        <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>72 题全部完成，查看你的连锁成熟度报告</p>
        <button onClick={onSubmit} className="animate-breathe px-10 py-4 rounded-xl font-bold text-base transition-all"
          style={{ background: "linear-gradient(135deg,#3B82F6,#2563EB)", color:"#fff", boxShadow:"0 0 20px rgba(59,130,246,0.3)" }}>
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
    <div style={{ background: "var(--bg)", minHeight: "100dvh" }}>
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
            }} className="text-sm font-medium flex items-center gap-1" style={{ color: "var(--brand)" }}>
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
            <svg className="animate-spin h-6 w-6 mx-auto mb-4" viewBox="0 0 24 24" fill="none" style={{ color: "var(--brand)" }}>
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
            <button onClick={handleRegenerate} className="px-6 py-3 rounded-xl text-sm font-semibold" style={{ background: "var(--brand)", color: "white" }}>
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
          fill="rgba(192,57,43,0.15)" stroke="var(--brand)" strokeWidth={1.5} strokeLinejoin="round" />
        {DIMENSION_ORDER.map((dim) => {
          const p = getPt(dim, scores[dim] || 0);
          return <g key={dim}><circle cx={p.x} cy={p.y} r={3} fill="var(--brand)" />{/* Value label on dot */}</g>;
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
  const [showFloatCTA, setShowFloatCTA] = useState(false);
  const floatSentinelRef = useRef<HTMLDivElement>(null);
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

  // 浮底 CTA：过半屏后显示
  useEffect(() => {
    const el = floatSentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      setShowFloatCTA(entry.isIntersecting);
    }, { threshold: 0 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [report]);

  return (<>
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

      {/* TL;DR 摘要卡 —— 老板5秒看懂 */}
      {report.summary && (
        <div className="glass-card p-4 sm:p-6 animate-pop-in" style={{ borderColor: "rgba(59,130,246,0.2)", background: "linear-gradient(135deg, rgba(59,130,246,0.04), rgba(6,182,212,0.02))" }}>
          <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--brand-light)" }}>🔍 3 秒速览</h3>
          <div className="space-y-2.5">
            <div className="flex items-start gap-2.5">
              <span className="text-xs shrink-0 mt-0.5" style={{ color: "#ef4444", fontWeight:700 }}>最致命</span>
              <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{report.summary.fatal}</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="text-xs shrink-0 mt-0.5" style={{ color: "#10b981", fontWeight:700 }}>最强项</span>
              <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{report.summary.strongest}</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="text-xs shrink-0 mt-0.5" style={{ color: "var(--brand-light)", fontWeight:700 }}>先做</span>
              <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{report.summary.first}</span>
            </div>
          </div>
        </div>
      )}

      {/* 过半屏哨兵 — 触发浮底 CTA */}
      <div ref={floatSentinelRef} />

      {/* Benchmark */}
      {report.benchmark && (
        <div className="glass-card p-4 sm:p-6" style={{ borderColor: "rgba(212,168,83,0.3)" }}>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--brand-light)" }}>行业对比</h3>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{report.benchmark}</p>
        </div>
      )}

      {/* Pain Points — 让老板觉得"在说我" */}
      {report.painpoint && (
        <div className="glass-card p-4 sm:p-6" style={{ borderColor: "rgba(239,68,68,0.2)" }}>
          <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "#ef4444" }}>⚠️ 这个阶段最容易犯的错</h3>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{report.painpoint}</p>
        </div>
      )}

      {/* Dimension Analysis */}
      <div className="glass-card p-4 sm:p-6">
        <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>维度分析 <span style={{ color: "var(--text-muted)" }}>（按得分排序）</span></h3>
        <div className="space-y-2">
          {sortedDims.map((dim) => {
            const realScore = scores.scores[dim.dim] || dim.score;
            const isLow = realScore < 40;
            let dot = "#ef4444"; if (realScore >= 66) dot = "#10b981"; else if (realScore >= 41) dot = "#f59e0b";
            return (
              <details key={dim.dim} className={`group${isLow ? " dim-alert" : ""}`} open={isLow || undefined}>
                <summary className="flex items-center gap-2 cursor-pointer list-none py-2 px-2 -mx-2 rounded-xl transition-colors" style={{ background: isLow ? "rgba(239,68,68,0.06)" : "transparent" }}>
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: dot }} />
                  <span className="text-sm font-medium w-16 shrink-0" style={{ color: "var(--text-primary)" }}>{dim.dim}</span>
                  <span className="text-sm font-bold w-7 shrink-0" style={{ color: dot }}>{realScore}</span>
                  {isLow && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 animate-pulse" style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444" }}>关注</span>}
                  <span className="text-xs truncate flex-1" style={{ color: "var(--text-secondary)" }}>{dim.comment}</span>
                  <svg className="w-4 h-4 shrink-0 group-open:rotate-180 transition-transform" fill="none" stroke="var(--text-muted)" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <div className="mt-2 ml-6 pl-3 border-l-2 space-y-1.5" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{dim.comment}</p>
                  {dim.tips.map((tip, i) => <p key={i} className="text-xs flex items-start gap-1.5" style={{ color: "var(--brand)" }}><span style={{ color: "var(--brand-light)" }} className="mt-0.5 shrink-0">→</span>{tip}</p>)}
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
            const pColor = i === 0 ? "var(--brand)" : i === 1 ? "#f59e0b" : "var(--text-muted)";
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

      {/* Yima Value — 具体案例，不是泛泛的"我们有方法" */}
      <div className="glass-card p-4 sm:p-6" style={{ borderColor: "rgba(59,130,246,0.2)" }}>
        <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--brand-light)" }}>逸马如何帮你解决这些问题</h3>
        <p className="text-xs sm:text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>{report.yima}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {["22年连锁经验","3000+企业验证","195家推动上市","方法进入200+高校教材"].map((t) => (
            <span key={t} className="text-[10px] px-2 py-1 rounded-full" style={{ background: "rgba(59,130,246,0.08)", color: "var(--brand-light)", border: "1px solid rgba(59,130,246,0.15)" }}>✓ {t}</span>
          ))}
        </div>
      </div>

      {/* CTA — 动态文案，基于诊断结果 */}
      <div className="glass-card p-4 sm:p-6 noprint" style={{ borderColor: "rgba(59,130,246,0.3)", background: "linear-gradient(135deg, rgba(59,130,246,0.06), rgba(6,182,212,0.04))" }}>
        <h3 className="text-sm font-bold mb-1" style={{ color: "var(--text-primary)" }}>让逸马顾问帮你把诊断变成行动</h3>
        <p className="text-xs mb-4 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {report.nextStep || `基于你的${scores.overall_score}分诊断结果，我们建议下一步进行针对性的深度分析。留下手机号，逸马顾问将在1个工作日内联系你，提供免费的30分钟电话解读。`}
        </p>
        {submitted ? (
          <div className="text-center py-4 rounded-xl" style={{ background: "rgba(16,185,129,0.1)" }}>
            <p className="text-sm font-semibold" style={{ color: "#10b981" }}>已提交，逸马顾问将尽快联系你</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>如果有紧急问题，可直接拨打 400-xxx-xxxx</p>
          </div>
        ) : (
          <>
            {scores.overall_score < 45 && (
              <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg animate-pulse" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <span className="text-sm shrink-0">⚠️</span>
                <span className="text-xs font-medium" style={{ color: "#ef4444" }}>你的系统性问题较多，按当前状态继续运营，6个月内出问题的概率很高。建议尽快做一次深度诊断。</span>
              </div>
            )}
            <div className="flex gap-2">
            <input type="tel" value={phone} onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 11); setPhone(v); }} placeholder="输入手机号，获取专属方案"
              className="flex-1 px-4 py-3 rounded-xl text-sm outline-none" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "var(--text-primary)" }} maxLength={11} />
            <button onClick={handleConsult} disabled={phone.length !== 11} className="px-5 py-3 rounded-xl text-sm font-semibold transition-all shrink-0"
              style={phone.length === 11 ? { background: "var(--brand)", color: "white", boxShadow: "0 0 20px rgba(59,130,246,0.3)" } : { background: "rgba(255,255,255,0.06)", color: "var(--text-muted)" }}>
              免费解读</button>
          </div>
          </>
        )}
        <p className="text-[10px] mt-3 text-center" style={{ color: "var(--text-muted)" }}>不收费 · 不限时 · 纯粹基于你的诊断结果做深度解读</p>
      </div>

      {/* Bottom actions */}
      <div className="flex items-center justify-center gap-4 pt-1 flex-wrap noprint">
        <button onClick={handlePrint} className="px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all"
          style={{ background: "var(--brand)", color: "white" }}>
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
        <button onClick={onRegenerate} className="text-sm font-medium" style={{ color: "var(--brand)" }}>
          重新生成报告
        </button>
      </div>
    </div>

    {/* 浮底 CTA 条 —— 过半屏后出现 */}
    {showFloatCTA && !submitted && (
      <div className="float-cta-bar" style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
        background: "rgba(2,6,23,0.97)", backdropFilter: "blur(16px)",
        borderTop: "1px solid rgba(59,130,246,0.15)",
        padding: "10px 16px", paddingBottom: "max(10px, env(safe-area-inset-bottom))",
      }}>
        <div className="max-w-lg mx-auto flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>
              你的报告只看了一半——最关键的建议在下面
            </p>
            <p className="text-[10px] truncate" style={{ color: "var(--text-muted)" }}>
              留手机号，逸马顾问免费为你解读完整报告
            </p>
          </div>
          <input type="tel" value={phone} onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 11); setPhone(v); }}
            placeholder="手机号" maxLength={11}
            className="w-28 px-3 py-2 rounded-lg text-sm outline-none shrink-0"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "var(--text-primary)" }} />
          <button onClick={handleConsult} disabled={phone.length !== 11}
            className="px-3 py-2 rounded-lg text-xs font-semibold transition-all shrink-0"
            style={phone.length === 11 ? { background: "var(--brand)", color: "white" } : { background: "rgba(255,255,255,0.06)", color: "var(--text-muted)" }}>
            免费解读
          </button>
        </div>
      </div>
    )}

    {showFloatCTA && !submitted && <div style={{ height: "72px" }} />}
  </>);
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
