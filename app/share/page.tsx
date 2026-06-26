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

  return (
    <html lang="zh-CN">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{`逸马诊断 - ${score}分（${level}）`}</title>
        <meta httpEquiv="refresh" content={`0;url=/?score=${score}&level=${encodeURIComponent(level)}`} />
        <style dangerouslySetInnerHTML={{ __html: `
          body { margin:0; background:#0a0a0f; color:#e0e0e0; display:flex; align-items:center; justify-content:center; height:100vh; font-family:Arial,sans-serif; }
          .card { text-align:center; }
          .score { font-size:80px; font-weight:900; }
          .label { color:#888; font-size:20px; margin-top:8px; }
        `}} />
      </head>
      <body>
        <div className="card">
          <div className="score">{score}</div>
          <div className="label">综合得分 · {level}</div>
          <p style={{color:"#666",fontSize:"14px",marginTop:"24px"}}>跳转中...</p>
        </div>
      </body>
    </html>
  );
}
