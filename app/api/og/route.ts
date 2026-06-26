import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const score = req.nextUrl.searchParams.get("score");
  const level = req.nextUrl.searchParams.get("level");

  // 品牌宣传OG（无分数参数时）
  if (!score) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
      <rect width="1200" height="630" fill="#0a0a0f"/>
      <rect x="40" y="40" width="1120" height="550" rx="24" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
      <text x="600" y="180" text-anchor="middle" fill="#e0e0e0" font-size="48" font-weight="900" font-family="sans-serif">逸马连锁成熟度诊断</text>
      <text x="600" y="250" text-anchor="middle" fill="#888" font-size="28" font-family="sans-serif">你的连锁处于哪个阶段？</text>
      <text x="600" y="340" text-anchor="middle" fill="#c0392b" font-size="32" font-weight="bold" font-family="sans-serif">9 大维度 · 72 题 · 15-20 分钟</text>
      <rect x="440" y="380" width="320" height="52" rx="26" fill="#c0392b"/>
      <text x="600" y="415" text-anchor="middle" fill="white" font-size="24" font-weight="bold" font-family="sans-serif">免费开始诊断</text>
      <text x="600" y="490" text-anchor="middle" fill="#888" font-size="22" font-family="sans-serif">3,000+ 会员企业 · 195 家已上市</text>
      <text x="600" y="550" text-anchor="middle" fill="#666" font-size="18" font-family="sans-serif">yima777.cn · 逸马 22 年连锁方法论</text>
    </svg>`;
    return new Response(svg, { headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=86400" } });
  }

  const levelColor = level === "领先型" ? "#10b981" : level === "成熟型" ? "#3b82f6" : level === "成长型" ? "#f59e0b" : "#ef4444";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="#0a0a0f"/>
    <rect x="40" y="40" width="1120" height="550" rx="24" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
    <text x="600" y="180" text-anchor="middle" fill="#888" font-size="24" font-family="sans-serif">逸马连锁成熟度诊断报告</text>
    <text x="600" y="340" text-anchor="middle" fill="#e0e0e0" font-size="120" font-weight="900" font-family="sans-serif">${score}</text>
    <text x="600" y="400" text-anchor="middle" fill="#888" font-size="28" font-family="sans-serif">综合得分</text>
    <rect x="520" y="440" width="160" height="44" rx="22" fill="${levelColor}20" stroke="${levelColor}" stroke-width="1.5"/>
    <text x="600" y="469" text-anchor="middle" fill="${levelColor}" font-size="26" font-weight="bold" font-family="sans-serif">${level}</text>
    <text x="600" y="550" text-anchor="middle" fill="#666" font-size="18" font-family="sans-serif">yima777.cn · 基于逸马22年连锁方法论</text>
  </svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
