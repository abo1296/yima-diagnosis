function getKV() {
  try {
    const env = process.env as any;
    if (env?.YIMA_LEADS?.get) return env.YIMA_LEADS;
  } catch {}
  try {
    const g = globalThis as any;
    if (g?.YIMA_LEADS?.get) return g.YIMA_LEADS;
  } catch {}
  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, industry, industry_code, storeCount, score, level, action } = body;

    // 行业编号→中文映射（前端传编号，绕开OpenNext中文bug）
    const INDUSTRY_NAME: Record<number, string> = {
      0: "餐饮", 1: "零售", 2: "酒店民宿", 3: "教育培训", 4: "美容美发",
      5: "健身运动", 6: "汽车服务", 7: "医疗健康", 8: "宠物服务", 9: "便利店",
      10: "服装", 11: "其他连锁"
    };
    const industryName = INDUSTRY_NAME[industry_code] || industry || "-";

    // 根据分数重算等级（中文level入参被OpenNext毁了，用ASCII分数重算）
    const numScore = parseInt(score) || 0;
    const levelName = numScore <= 65 ? "成长型" : numScore <= 85 ? "成熟型" : "领先型";

    if (action === "list") {
      const kv = getKV();
      if (!kv) return Response.json({ error: "KV not available", leads: [] }, { status: 200 });
      try {
        const list = await kv.list();
        const leads: unknown[] = [];
        for (const key of list.keys) {
          const val = await kv.get(key.name);
          if (val) leads.push(JSON.parse(val));
        }
        leads.sort((a: any, b: any) => b.time?.localeCompare(a.time || "") || 0);
        return Response.json({ leads: leads.slice(0, 50) });
      } catch (e: unknown) {
        return Response.json({ error: (e as Error).message, leads: [] }, { status: 200 });
      }
    }

    if (!phone) return Response.json({ error: "phone required" }, { status: 400 });

    const kv = getKV();
    if (kv) {
      await kv.put(`lead:${Date.now()}:${phone}`, JSON.stringify({
        phone, industry: industryName, storeCount: storeCount || "",
        score: score || "", level: levelName, time: new Date().toISOString()
      }));
    }

    const WEBHOOK_URL = "https://open.feishu.cn/open-apis/bot/v2/hook/e62aa6ed-ff47-459a-b344-b1d4a698ad55";
    const webhook = ((process.env as any)?.LEADS_WEBHOOK_URL) || ((globalThis as any)?.LEADS_WEBHOOK_URL) || WEBHOOK_URL;
    if (webhook) {
      const payload = JSON.stringify({
        msg_type: "text",
        content: { text: `📞新线索\n手机：${phone}\n行业：${industryName}\n门店：${storeCount || "-"}\n得分：${score || "-"}（${levelName}）` }
      });
      try { await fetch(webhook, { method: "POST", headers: { "Content-Type": "application/json" }, body: payload }); } catch {}
    }

    return Response.json({ success: true, kv: !!kv });
  } catch (e: unknown) {
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}
