function getKV() {
  try {
    // ES Module Worker: process.env 暴露绑定
    const env = process.env as any;
    if (env?.YIMA_LEADS?.get) return env.YIMA_LEADS;
  } catch {}
  try {
    // 全局变量 fallback
    const g = globalThis as any;
    if (g?.YIMA_LEADS?.get) return g.YIMA_LEADS;
  } catch {}
  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, industry, storeCount, score, level, action } = body;

    // 查询列表
    if (action === "list") {
      const kv = getKV();
      if (!kv) return Response.json({ error: "存储未配置，KV绑定可能未生效。请在Cloudflare控制台→Workers→yima-diagnosis→Settings→Variables→KV Namespace Bindings 中添加 YIMA_LEADS 绑定到 79c7a651e94d42bd88cc125be8940373", leads: [] }, { status: 200 });
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

    // 存线索
    if (!phone) return Response.json({ error: "手机号不能为空" }, { status: 400 });

    const kv = getKV();
    if (kv) {
      await kv.put(`lead:${Date.now()}:${phone}`, JSON.stringify({
        phone, industry: industry || "", storeCount: storeCount || "",
        score: score || "", level: level || "", time: new Date().toISOString()
      }));
    }

    const webhook = ((process.env as any)?.LEADS_WEBHOOK_URL) || ((globalThis as any)?.LEADS_WEBHOOK_URL) || "https://open.feishu.cn/open-apis/bot/v2/hook/e62aa6ed-ff47-459a-b344-b1d4a698ad55";
    if (webhook) {
      try { await fetch(webhook, { method: "POST", headers: { "Content-Type": "application/json; charset=utf-8" }, body: JSON.stringify({ msg_type: "text", content: { text: `📞新线索\n手机：${phone}\n行业：${industry||"-"}\n门店：${storeCount||"-"}\n得分：${score||"-"}（${level||"-"}）` } }) }); } catch {}
    }

    console.log(`[LEAD] ${phone} ${industry} ${storeCount} ${score} ${level}`);
    return Response.json({ success: true, kv: !!kv });
  } catch (e: unknown) {
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}
