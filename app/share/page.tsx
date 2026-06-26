import type { Metadata } from "next";

type Props = { searchParams: Promise<{ score?: string; level?: string; industry?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { score = "0", level = "成长型" } = await searchParams;
  const imgUrl = `https://yima777.cn/api/og?score=${score}&level=${encodeURIComponent(level)}`;

  return {
    title: `我的连锁成熟度：${score}分（${level}）| 逸马诊断`,
    description: `9大维度全面评估连锁体系成熟度。${score}分，等级${level}。你也来测测你的连锁能打几分？`,
    openGraph: {
      title: `我的连锁成熟度：${score}分（${level}）`,
      description: `逸马连锁成熟度诊断报告，9大维度全面评估。你也来测测？`,
      url: `https://yima777.cn/share?score=${score}&level=${encodeURIComponent(level)}`,
      images: [{ url: imgUrl, width: 1200, height: 630 }],
      type: "website",
      locale: "zh_CN",
      siteName: "逸马诊断",
    },
  };
}

export default async function SharePage({ searchParams }: Props) {
  const { score = "0", level = "成长型", industry = "" } = await searchParams;
  const numScore = parseInt(score) || 0;
  const levelColor = level === "领先型" ? "#10b981" : level === "成熟型" ? "#3b82f6" : "#f59e0b";
  const percentile = numScore >= 70 ? 82 : numScore >= 50 ? 55 : 28;

  return (
    <html lang="zh-CN">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{`逸马诊断 - ${score}分（${level}）`}</title>
        <style dangerouslySetInnerHTML={{ __html: `
          * { margin:0; padding:0; box-sizing:border-box; }
          body { background:#020617; color:#F1F5F9; font-family:'Inter','Noto Sans SC',-apple-system,sans-serif; min-height:100dvh; display:flex; align-items:center; justify-content:center; padding:24px; }
          .card { max-width:420px; width:100%; text-align:center; }
          .industry-tag { display:inline-block; padding:4px 14px; border-radius:100px; font-size:11px; color:#94A3B8; background:rgba(59,130,246,0.06); border:1px solid rgba(59,130,246,0.1); margin-bottom:20px; }
          .score-circle { width:160px; height:160px; margin:0 auto 16px; border-radius:50%; display:flex; flex-direction:column; align-items:center; justify-content:center; background:rgba(59,130,246,0.04); border:3px solid ${levelColor}; position:relative; }
          .score-num { font-size:64px; font-weight:900; line-height:1; background:linear-gradient(180deg,#F59E0B,#FDE68A); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
          .score-label { font-size:12px; color:#64748B; margin-top:2px; }
          .level-badge { display:inline-block; padding:6px 24px; border-radius:20px; font-size:16px; font-weight:800; color:${levelColor}; background:${levelColor}15; border:1px solid ${levelColor}30; margin-bottom:16px; }
          .percentile { font-size:13px; color:#94A3B8; margin-bottom:24px; }
          .percentile b { color:#F59E0B; }
          .cta { display:block; width:100%; padding:16px; border-radius:14px; font-size:17px; font-weight:700; background:linear-gradient(135deg,#3B82F6,#2563EB); color:#fff; border:none; cursor:pointer; text-decoration:none; margin-bottom:8px; transition:all 0.3s; box-shadow:0 4px 24px rgba(59,130,246,0.25); }
          .cta:hover { box-shadow:0 8px 36px rgba(59,130,246,0.45); transform:translateY(-2px); }
          .sub { color:#64748B; font-size:12px; margin-bottom:16px; }
          .mini-radar { width:120px; height:120px; margin:0 auto 16px; opacity:0.5; }
          .footer { margin-top:28px; padding-top:20px; border-top:1px solid rgba(255,255,255,0.04); color:#64748B; font-size:11px; display:flex; justify-content:center; gap:20px; }
        `}} />
      </head>
      <body>
        <div className="card">
          {(industry || numScore > 0) && <div className="industry-tag">{industry || "连锁企业"} · {numScore > 0 ? level : "诊断中"}</div>}
          <div className="score-circle">
            <div className="score-num">{score}</div>
            <div className="score-label">综合得分</div>
          </div>
          <div className="level-badge">{level}</div>
          {numScore > 0 && <p className="percentile">超过 <b>{percentile}%</b> 同规模连锁企业</p>}
          <p style={{ color: "#94A3B8", fontSize: "15px", marginBottom: "20px" }}>
            {numScore > 0 ? "你的连锁企业能打几分？" : "你的连锁在什么段位？"}
          </p>
          <a href="/" className="cta">{numScore > 0 ? "我也要测 →" : "开始免费诊断 →"}</a>
          <p className="sub">50题 · 15-20分钟 · 完全免费 · 即时出报告</p>
          <div className="footer">
            <span>逸马 22 年连锁方法论</span>
            <span>3,000+ 会员企业</span>
          </div>
        </div>
      </body>
    </html>
  );
}
