import type { Metadata } from "next";

type Props = { searchParams: Promise<{ score?: string; level?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { score = "0", level = "成长型" } = await searchParams;
  const imgUrl = `https://yima777.cn/api/og?score=${score}&level=${encodeURIComponent(level)}`;

  return {
    title: `我的连锁成熟度：${score}分（${level}）| 逸马诊断`,
    description: `逸马连锁成熟度诊断报告：${score}分，等级${level}。9大维度全面评估，基于逸马22年连锁方法论。`,
    openGraph: {
      title: `我的连锁成熟度：${score}分（${level}）`,
      description: `逸马连锁成熟度诊断报告，9大维度全面评估。`,
      url: `https://yima777.cn/share?score=${score}&level=${encodeURIComponent(level)}`,
      images: [{ url: imgUrl, width: 1200, height: 630 }],
      type: "website",
      locale: "zh_CN",
      siteName: "逸马诊断",
    },
  };
}

export default async function SharePage({ searchParams }: Props) {
  const { score = "0", level = "成长型" } = await searchParams;
  const levelColor = level === "领先型" ? "#10b981" : level === "成熟型" ? "#3b82f6" : level === "成长型" ? "#f59e0b" : "#ef4444";

  return (
    <html lang="zh-CN">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{`逸马诊断 - ${score}分（${level}）`}</title>
        <style dangerouslySetInnerHTML={{ __html: `
          * { margin:0; padding:0; box-sizing:border-box; }
          body { background:#0a0a0f; color:#e0e0e0; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif; min-height:100dvh; display:flex; align-items:center; justify-content:center; padding:24px; }
          .card { max-width:400px; width:100%; text-align:center; }
          .score-circle { width:160px; height:160px; margin:0 auto 16px; border-radius:50%; display:flex; flex-direction:column; align-items:center; justify-content:center; background:rgba(255,255,255,0.04); border:3px solid ${levelColor}; }
          .score-num { font-size:64px; font-weight:900; line-height:1; }
          .score-label { font-size:14px; color:#888; margin-top:4px; }
          .level-badge { display:inline-block; padding:6px 24px; border-radius:20px; font-size:16px; font-weight:bold; color:${levelColor}; background:${levelColor}22; border:1px solid ${levelColor}; margin-bottom:24px; }
          .cta { display:block; width:100%; padding:16px; border-radius:14px; font-size:18px; font-weight:bold; background:#c0392b; color:#fff; border:none; cursor:pointer; text-decoration:none; margin-bottom:8px; transition:all 0.2s; }
          .cta:hover { box-shadow:0 0 30px rgba(192,57,43,0.45); transform:translateY(-1px); }
          .sub { color:#888; font-size:12px; }
          .footer { margin-top:32px; padding-top:24px; border-top:1px solid rgba(255,255,255,0.06); color:#666; font-size:12px; }
        `}} />
      </head>
      <body>
        <div className="card">
          <div className="score-circle">
            <div className="score-num">{score}</div>
            <div className="score-label">综合得分</div>
          </div>
          <div className="level-badge">{level}</div>
          <p style={{color:"#888",fontSize:"15px",marginBottom:"24px"}}>你的连锁企业多少分？</p>
          <a href="/" className="cta">开始免费诊断 →</a>
          <p className="sub">72题 · 15-20分钟 · 完全免费</p>
          <div className="footer">
            逸马 22 年连锁方法论 · 3,000+ 会员企业
          </div>
        </div>
      </body>
    </html>
  );
}
