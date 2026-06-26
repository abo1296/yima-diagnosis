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

const INDUSTRIES = ["餐饮","零售","医药","教育","服饰","酒类","家电","酒店民宿","美容美发","健身运动","汽车服务","宠物服务","便利店","其他连锁"];

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
          <p className="text-center font-semibold mb-10 leading-relaxed" style={{ fontSize: "20px", color: "var(--text-primary)" }}>
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
          <p className="text-center font-semibold mb-10 leading-relaxed" style={{ fontSize: "20px", color: "var(--text-primary)" }}>{currentQ.text}</p>
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

// ===== Result Screen (三段式体验) =====
function ResultScreen({ scores, info, warmupContext, onRestart }: { scores: ReturnType<typeof calculateScores>; info: CompanyInfo; warmupContext: string; onRestart: () => void }) {
  const [phase, setPhase] = useState<"loading"|"reveal"|"report">("loading");
  const [displayScore, setDisplayScore] = useState(0);
  const [report, setReport] = useState<ReportData | null>(null);
  const [error, setError] = useState("");
  const [barsAnimated, setBarsAnimated] = useState(false);
  const startedRef = useRef(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const circumference = 2 * Math.PI * 95;
  const scorePercent = scores.overall_score / 100;
  const levelColor = scores.level === "领先型" ? "#10b981" : scores.level === "成熟型" ? "#3b82f6" : "#f59e0b";
  const levelBg = scores.level === "领先型" ? "rgba(16,185,129,0.12)" : scores.level === "成熟型" ? "rgba(59,130,246,0.12)" : "rgba(245,158,11,0.12)";
  const scoreGradient = scores.level === "领先型" ? ["#10B981","#34D399"] : scores.level === "成熟型" ? ["#3B82F6","#06B6D4"] : ["#F59E0B","#FDE68A"];
  const percentile = scores.overall_score >= 70 ? 82 : scores.overall_score >= 50 ? 55 : 28;

  // Fetch AI report
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    const minLoading = setTimeout(() => setPhase("reveal"), 2200);
    (async () => {
      try {
        const resp = await fetch("/api/generate-report", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ overall_score: scores.overall_score, level: scores.level, scores: scores.scores, answers: scores.answers, industry: info.industry, storeCount: info.storeCount, warmup: warmupContext }),
        });
        const data = await resp.json();
        if (!resp.ok) throw new Error(data.error || "请求失败");
        setReport(data.report);
      } catch (e: unknown) { setError((e as Error).message); }
    })();
    return () => clearTimeout(minLoading);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Score count-up during reveal
  useEffect(() => {
    if (phase !== "reveal") return;
    const target = scores.overall_score;
    const totalSteps = Math.max(1, Math.ceil(target / (target <= 40 ? 4 : target <= 70 ? 2 : 1.5)));
    let step = 0;
    const timer = setInterval(() => {
      step++;
      if (step >= totalSteps) { setDisplayScore(target); clearInterval(timer); }
      else { const p = step / totalSteps; setDisplayScore(Math.round(target * (1 - Math.pow(1 - p, 3)))); }
    }, 35);
    return () => clearInterval(timer);
  }, [phase, scores.overall_score]);

  // Dismiss reveal on scroll or click
  const dismissReveal = useCallback(() => {
    setPhase("report");
    setTimeout(() => setBarsAnimated(true), 400);
  }, []);

  useEffect(() => {
    if (phase !== "reveal") return;
    const handler = () => { dismissReveal(); };
    window.addEventListener("wheel", handler, { once: true });
    return () => window.removeEventListener("wheel", handler);
  }, [phase, dismissReveal]);

  return (
    <>
      {/* ===== Phase 1: Loading ===== */}
      {phase === "loading" && (
        <div style={{ position: "fixed", inset: 0, zIndex: 999, background: "var(--bg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div className="load-ring-wrap">
            <div className="load-ring-bg" />
            <div className="load-ring-fill" />
            <div className="load-icon-pulse">🔍</div>
          </div>
          <p style={{ marginTop: 24, fontSize: 16, color: "var(--text-secondary)", letterSpacing: 1 }}>
            逸马AI 正在分析你的连锁体系<span className="load-dots" />
          </p>
        </div>
      )}

      {/* ===== Phase 2: Score Reveal Overlay ===== */}
      {phase === "reveal" && (
        <div className="reveal-overlay" onClick={dismissReveal}>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 14, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 3, marginBottom: 16 }}>诊断完成</p>
            <div style={{ position: "relative", width: 200, height: 200, margin: "0 auto 20px" }}>
              <svg className="reveal-ring-svg" viewBox="0 0 200 200">
                <defs>
                  <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={scoreGradient[0]} />
                    <stop offset="100%" stopColor={scoreGradient[1]} />
                  </linearGradient>
                </defs>
                <circle className="reveal-ring-track" cx="100" cy="100" r="95" />
                <circle className="reveal-ring-progress" cx="100" cy="100" r="95"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - scorePercent)} />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div className={`reveal-num${displayScore > 0 ? " show" : ""}`} style={{
                  background: `linear-gradient(180deg,${scoreGradient[0]},${scoreGradient[1]})`,
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
                }}>{displayScore}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>综合得分 / 100</div>
              </div>
            </div>
            <div className={`reveal-badge-r${displayScore > 0 ? " show" : ""}`}
              style={{ color: levelColor, background: levelBg, border: `1px solid ${levelColor}20` }}>
              {scores.level}型企业
            </div>
            <p className={`reveal-sub-r${displayScore > 0 ? " show" : ""}`} style={{ marginTop: 8, color: "var(--text-secondary)" }}>
              <b style={{ color: "#F59E0B" }}>超过 {percentile}%</b> 同规模连锁企业
            </p>
            <p className={`reveal-hint${displayScore > 0 ? " show" : ""}`} style={{ color: "var(--text-muted)" }}>
              ↓ 向下滚动查看完整报告
            </p>
          </div>
        </div>
      )}

      {/* ===== Phase 3: Full Report ===== */}
      {phase === "report" && (
        <div ref={contentRef} className={`report-main${phase === "report" ? " show" : ""}`} style={{ padding: "60px 5% 80px" }}>
          <div className="page-inner" style={{ maxWidth: 960, margin: "0 auto" }}>
            <NewReportView scores={scores} report={report} error={error} info={info} barsAnimated={barsAnimated} onRestart={onRestart} />
          </div>
        </div>
      )}
    </>
  );
}


// ===== 行业平均分参考 =====
function getIndustryAverages(industry?: string): Record<string, number> {
  const m: Record<string, Record<string, number>> = {
    "餐饮": { strategy: 62, model: 58, operation: 55, organization: 52, supply_chain: 54, training: 48, supervision: 50, digital: 42, culture: 60 },
    "零售": { strategy: 58, model: 55, operation: 56, organization: 50, supply_chain: 52, training: 48, supervision: 50, digital: 45, culture: 55 },
    "服饰": { strategy: 56, model: 52, operation: 54, organization: 48, supply_chain: 50, training: 46, supervision: 48, digital: 44, culture: 52 },
    "医药": { strategy: 55, model: 50, operation: 58, organization: 48, supply_chain: 52, training: 44, supervision: 52, digital: 40, culture: 50 },
    "教育": { strategy: 52, model: 48, operation: 50, organization: 50, supply_chain: 40, training: 52, supervision: 45, digital: 38, culture: 55 },
    "酒类": { strategy: 50, model: 48, operation: 48, organization: 45, supply_chain: 55, training: 42, supervision: 45, digital: 38, culture: 48 },
    "家电": { strategy: 52, model: 50, operation: 50, organization: 48, supply_chain: 48, training: 44, supervision: 46, digital: 42, culture: 50 },
  };
  return m[industry || ""] || { strategy: 55, model: 52, operation: 53, organization: 50, supply_chain: 50, training: 48, supervision: 48, digital: 42, culture: 55 };
}

function getRating(gap: number): string {
  if (gap >= 10) return "领先";
  if (gap >= 3) return "良好";
  if (gap >= -3) return "持平";
  if (gap >= -10) return "待提升";
  return "薄弱";
}

// ===== 新版报告 View =====
function NewReportView({ scores, report, error, info, barsAnimated, onRestart }: {
  scores: ReturnType<typeof calculateScores>;
  report: ReportData | null;
  error: string;
  info: CompanyInfo;
  barsAnimated: boolean;
  onRestart: () => void;
}) {
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showFloatCTA, setShowFloatCTA] = useState(false);
  const floatSentinelRef = useRef<HTMLDivElement>(null);
  const industryAvgs = useMemo(() => getIndustryAverages(info.industry), [info.industry]);
  const radarRef = useRef<HTMLDivElement>(null);

  const percentile = scores.overall_score >= 70 ? 82 : scores.overall_score >= 50 ? 55 : 28;
  const levelColor = scores.level === "领先型" ? "#10b981" : scores.level === "成熟型" ? "#3b82f6" : "#f59e0b";

  // Strengths (top 3) & improvements (bottom 3)
  const sortedDims = useMemo(() => {
    return DIMENSION_ORDER.map(dim => ({ dim, score: scores.scores[dim] || 0, label: DIMENSION_LABELS[dim] }))
      .sort((a, b) => b.score - a.score);
  }, [scores.scores]);
  const strengths = sortedDims.slice(0, 3);
  const improvements = sortedDims.slice(-3).reverse();

  // AI report dimensions mapped by both Chinese dim name and English key
  const reportDimMap = useMemo(() => {
    if (!report) return {} as Record<string, string>;
    const m: Record<string, string> = {};
    report.dimensions.forEach(d => {
      m[d.dim] = d.comment;
      // 反向映射：从中文标签找到英文 key
      const engKey = Object.entries(DIMENSION_LABELS).find(([, v]) => v === d.dim)?.[0];
      if (engKey) m[engKey] = d.comment;
    });
    return m;
  }, [report]);

  const handleConsult = async () => {
    if (phone.length !== 11 || !/^1\d{10}$/.test(phone)) return;
    fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, industry_code: INDUSTRIES.indexOf(info.industry), store_code: ["1-10家","11-50家","51-200家","200家以上"].indexOf(info.storeCount), score: scores.overall_score }),
    }).catch(() => {});
    setSubmitted(true);
  };

  const handlePrint = () => window.print();
  const handleCopy = () => {
    const url = `${window.location.origin}/share?score=${scores.overall_score}&level=${encodeURIComponent(scores.level)}`;
    navigator.clipboard.writeText(url).then(() => alert("链接已复制！")).catch(() => {});
  };

  // Float CTA sentinel observer
  useEffect(() => {
    const el = floatSentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => { setShowFloatCTA(entry.isIntersecting); }, { threshold: 0 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Stagger triggers
  useEffect(() => {
    if (!barsAnimated) return;
    const stagers = document.querySelectorAll(".stagger");
    stagers.forEach((el, i) => {
      setTimeout(() => el.classList.add("in"), i * 120);
    });
  }, [barsAnimated]);

  const radarTargetPoints = DIMENSION_ORDER.map((dim, i) => {
    const score = scores.scores[dim] || 0;
    const angle = (2 * Math.PI / DIMENSION_ORDER.length) * i - Math.PI / 2;
    const r = (score / 100) * 90;
    return `${120 + r * Math.cos(angle)},${120 + r * Math.sin(angle)}`;
  }).join(" ");

  return (
    <>
      {/* ===== Score Summary Bar ===== */}
      <div className="act-bar stagger">
        <span style={{ fontSize: 36, fontWeight: 900, background: "linear-gradient(180deg,#F59E0B,#FDE68A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{scores.overall_score}</span>
        <span style={{ fontSize: 13, color: "var(--text-muted)", alignSelf: "flex-end", marginBottom: 6 }}>/100 · {scores.level} · 超过 {percentile}% 同行</span>
        <div style={{ flex: 1 }} />
        <button className="act-btn" onClick={handleCopy}>📋 复制链接</button>
        <button className="act-btn" onClick={handlePrint}>📥 下载PDF</button>
        <button className="act-btn primary" onClick={onRestart}>🔄 重新诊断</button>
      </div>

      {/* ===== AI Error ===== */}
      {error && (
        <div className="text-center py-8 stagger">
          <p className="text-sm py-2 px-4 rounded-lg inline-block" style={{ color: "#ef4444", background: "rgba(239,68,68,0.1)" }}>{error}</p>
        </div>
      )}

      {/* ===== TL;DR Summary ===== */}
      {report?.summary && (
        <div className="s-section stagger">
          <div className="glass-card p-4 sm:p-6" style={{ borderColor: "rgba(59,130,246,0.15)", background: "linear-gradient(135deg, rgba(59,130,246,0.04), rgba(6,182,212,0.02))" }}>
            <h3 className="s-title">3 秒速览</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#ef4444", width: 48, flexShrink: 0 }}>最致命</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{report.summary.fatal}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#10b981", width: 48, flexShrink: 0 }}>最强项</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{report.summary.strongest}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--brand-light)", width: 48, flexShrink: 0 }}>先做</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{report.summary.first}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== Radar + 9 Dimension Bars ===== */}
      <div className="s-section stagger" ref={radarRef}>
        <h3 className="s-title">9维度成熟度诊断</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "center" }}>
          {/* Radar */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <svg viewBox="0 0 240 240" width="100%" style={{ maxWidth: 360 }}>
              <defs>
                <linearGradient id="rfGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              {[30, 50, 70, 90].map(r => <circle key={r} cx="120" cy="120" r={r} fill="none" stroke="rgba(59,130,246,0.05)" strokeWidth="0.5" />)}
              {[0, 45, 90, 135].map(a => {
                const rad = (a * Math.PI) / 180;
                return <line key={a} x1={120} y1={120} x2={120 + 95 * Math.cos(rad)} y2={120 + 95 * Math.sin(rad)} stroke="rgba(59,130,246,0.04)" strokeWidth="0.5" />;
              })}
              {/* Your score */}
              <polygon points={radarTargetPoints} fill="url(#rfGrad)" stroke="#3B82F6" strokeWidth="1.5" />
              {/* Industry avg (dashed) */}
              <polygon
                points={DIMENSION_ORDER.map((dim, i) => {
                  const avg = industryAvgs[dim] || 50;
                  const angle = (2 * Math.PI / DIMENSION_ORDER.length) * i - Math.PI / 2;
                  const r = (avg / 100) * 90;
                  return `${120 + r * Math.cos(angle)},${120 + r * Math.sin(angle)}`;
                }).join(" ")}
                fill="none" stroke="rgba(148,163,184,0.2)" strokeWidth="1.5" strokeDasharray="4,3" />
              {/* Dots */}
              {DIMENSION_ORDER.map((dim, i) => {
                const sc = scores.scores[dim] || 0;
                const angle = (2 * Math.PI / DIMENSION_ORDER.length) * i - Math.PI / 2;
                const r = (sc / 100) * 90;
                const x = 120 + r * Math.cos(angle), y = 120 + r * Math.sin(angle);
                return <circle key={dim} cx={x} cy={y} r="3" fill="#60A5FA" />;
              })}
            </svg>
          </div>
          {/* Bar chart */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {DIMENSION_ORDER.map((dim) => {
              const sc = scores.scores[dim] || 0;
              let color = "linear-gradient(90deg,#EF4444,#F87171)";
              if (sc >= 66) color = "linear-gradient(90deg,#10B981,#34D399)";
              else if (sc >= 41) color = "linear-gradient(90deg,#3B82F6,#60A5FA)";
              let txtColor = "#10B981";
              if (sc < 66) txtColor = "#60A5FA";
              if (sc < 41) txtColor = "#EF4444";
              return (
                <div key={dim} className="dim-bar-row">
                  <span className="dim-bar-name" style={{ color: "var(--text-secondary)" }}>{DIMENSION_LABELS[dim]}</span>
                  <div className="dim-bar-track">
                    <div className="dim-bar-fill" style={{ width: barsAnimated ? `${sc}%` : "0", background: color }} />
                  </div>
                  <span className="dim-bar-val" style={{ color: txtColor }}>{sc}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ===== Benchmark Table ===== */}
      <div className="s-section stagger">
        <h3 className="s-title">行业对标 <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 400 }}>（虚线 = {info.industry || "行业"}均值）</span></h3>
        <div className="glass-card" style={{ overflow: "hidden" }}>
          <table className="cmp-table">
            <thead><tr><th>维度</th><th>你的得分</th><th>行业平均</th><th>差距</th><th>评级</th></tr></thead>
            <tbody>
              {DIMENSION_ORDER.map((dim) => {
                const my = scores.scores[dim] || 0;
                const avg = industryAvgs[dim] || 50;
                const gap = my - avg;
                let dot = "#EF4444"; if (my >= 66) dot = "#10B981"; else if (my >= 41) dot = "#F59E0B";
                return (
                  <tr key={dim}>
                    <td><span className="dot-ind" style={{ background: dot }} />{DIMENSION_LABELS[dim]}</td>
                    <td><b>{my}</b></td>
                    <td style={{ color: "var(--text-muted)" }}>{avg}</td>
                    <td className={gap >= 0 ? "gap-up" : "gap-down"}>{gap >= 0 ? `↑ +${gap}` : `↓ ${gap}`}</td>
                    <td style={{ color: gap >= 3 ? "#10B981" : gap >= -3 ? "var(--text-muted)" : "#EF4444", fontWeight: 600, fontSize: 12 }}>
                      {getRating(gap)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== Strengths & Improvements ===== */}
      <div className="sw-grid-r stagger">
        <div className="sw-card-r good">
          <h4>核心优势</h4>
          <ul>
            {strengths.map((s, i) => (
              <li key={s.dim}>
                <span style={{ color: "#10B981", flexShrink: 0 }}>✓</span>
                <span>{reportDimMap[s.dim] || s.label} · {s.score}分</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="sw-card-r bad">
          <h4>改进重点</h4>
          <ul>
            {improvements.map((s, i) => (
              <li key={s.dim}>
                <span style={{ color: "#F59E0B", flexShrink: 0, fontWeight: 700 }}>!</span>
                <span>{reportDimMap[s.dim] || s.label} · {s.score}分</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ===== Improvement Roadmap ===== */}
      <div className="s-section stagger">
        <h3 className="s-title">改进路线图</h3>
        <div className="road-grid-r">
          {(report?.actions || [
            { title: "数字化筑基", why: "引入轻量级数据中台", timeline: "0-6个月" },
            { title: "标准化升级", why: "搭建SOP知识库与培训平台", timeline: "6-12个月" },
            { title: "规模扩张准备", why: "完善加盟商赋能体系", timeline: "12-18个月" },
          ]).slice(0, 3).map((act, i) => {
            const phases = ["Phase 1", "Phase 2", "Phase 3"];
            const lines = ["p1", "p2", "p3"];
            return (
              <div key={i} className="road-card-r">
                <div className={`r-line ${lines[i]}`} />
                <div className="r-num">{phases[i]} · {act.timeline}</div>
                <h4>{act.title}</h4>
                <p>{act.why}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== Pain Point ===== */}
      {report?.painpoint && (
        <div className="s-section stagger">
          <div className="glass-card p-4 sm:p-6" style={{ borderColor: "rgba(239,68,68,0.15)" }}>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#ef4444" }}>这个阶段最容易犯的错</h3>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{report.painpoint}</p>
          </div>
        </div>
      )}

      {/* ===== Yima Value ===== */}
      {report?.yima && (
        <div className="s-section stagger">
          <div className="glass-card p-4 sm:p-6" style={{ borderColor: "rgba(59,130,246,0.15)" }}>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--brand-light)" }}>逸马如何帮你解决这些问题</h3>
            <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>{report.yima}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {["22年连锁经验", "3000+企业验证", "195家推动上市", "方法进入200+高校教材"].map(t => (
                <span key={t} style={{ fontSize: 10, padding: "2px 10px", borderRadius: 100, background: "rgba(59,130,246,0.08)", color: "var(--brand-light)", border: "1px solid rgba(59,130,246,0.12)" }}>✓ {t}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== CTA ===== */}
      <div className="s-section stagger noprint">
        <div className="glass-card p-4 sm:p-6" style={{ borderColor: "rgba(59,130,246,0.25)", background: "linear-gradient(135deg, rgba(59,130,246,0.06), rgba(6,182,212,0.04))" }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>让逸马顾问帮你把诊断变成行动</h3>
          <p style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 14 }}>
            {report?.nextStep || `基于你的${scores.overall_score}分诊断结果，我们建议下一步进行针对性的深度分析。留下手机号，逸马顾问将在1个工作日内联系你，提供免费的30分钟电话解读。`}
          </p>
          {submitted ? (
            <div style={{ textAlign: "center", padding: "12px", borderRadius: 10, background: "rgba(16,185,129,0.08)" }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#10b981" }}>已提交，逸马顾问将尽快联系你</p>
            </div>
          ) : (
            <>
              {scores.overall_score < 45 && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10, padding: "8px 12px", borderRadius: 8, background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}>
                  <span style={{ fontSize: 12 }}>⚠️</span>
                  <span style={{ fontSize: 11, fontWeight: 500, color: "#ef4444" }}>你的系统性问题较多，6个月内出问题的概率很高。建议尽快深度诊断。</span>
                </div>
              )}
              <div style={{ display: "flex", gap: 8 }}>
                <input type="tel" value={phone} onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 11); setPhone(v); }}
                  placeholder="输入手机号，获取专属方案" maxLength={11}
                  style={{ flex: 1, padding: "10px 14px", borderRadius: 10, fontSize: 13, outline: "none", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "var(--text-primary)" }} />
                <button onClick={handleConsult} disabled={phone.length !== 11}
                  style={{ padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600, border: "none", cursor: phone.length === 11 ? "pointer" : "default", transition: "all .3s",
                    background: phone.length === 11 ? "linear-gradient(135deg,#3B82F6,#2563EB)" : "rgba(255,255,255,0.06)", color: phone.length === 11 ? "white" : "var(--text-muted)" }}>
                  免费解读</button>
              </div>
            </>
          )}
          <p style={{ fontSize: 10, color: "var(--text-muted)", textAlign: "center", marginTop: 10 }}>不收费 · 不限时 · 纯粹基于你的诊断结果做深度解读</p>
        </div>
      </div>

      {/* Sentinel for float CTA */}
      <div ref={floatSentinelRef} />

      {/* ===== Footer ===== */}
      <footer style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-muted)", paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.04)", flexWrap: "wrap", gap: 8 }}>
        <span>© 2026 逸马诊断 yima777.cn</span>
        <span>逸马22年连锁方法论 · 200+高校教材 · 国家版权课程</span>
      </footer>

      {/* ===== Float CTA Bar ===== */}
      {showFloatCTA && !submitted && (
        <div className="float-cta-bar" style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
          background: "rgba(2,6,23,0.97)", backdropFilter: "blur(16px)",
          borderTop: "1px solid rgba(59,130,246,0.15)",
          padding: "10px 16px", paddingBottom: "max(10px, env(safe-area-inset-bottom))",
        }}>
          <div style={{ maxWidth: 500, margin: "0 auto", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                你的报告只看了一半——最关键的建议在下面
              </p>
            </div>
            <input type="tel" value={phone} onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 11); setPhone(v); }}
              placeholder="手机号" maxLength={11}
              style={{ width: 100, padding: "7px 10px", borderRadius: 8, fontSize: 12, outline: "none", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "var(--text-primary)" }} />
            <button onClick={handleConsult} disabled={phone.length !== 11}
              style={{ padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, border: "none", whiteSpace: "nowrap",
                background: phone.length === 11 ? "var(--brand)" : "rgba(255,255,255,0.06)", color: phone.length === 11 ? "white" : "var(--text-muted)" }}>
              免费解读</button>
          </div>
        </div>
      )}
      {showFloatCTA && !submitted && <div style={{ height: 60 }} />}
    </>
  );
}
