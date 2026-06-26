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
    const buf = await request.arrayBuffer();
    const u8 = new Uint8Array(buf);
    // 打印原始UTF-8字节（前200字节），方便在Cloudflare Logs中查看
    const hex = Array.from(u8.slice(0, 200)).map(b => b.toString(16).padStart(2,'0')).join(' ');
    console.log('[BODY HEX]', hex);
    const body = new TextDecoder("utf-8").decode(buf);
    console.log('[BODY TEXT]', body);
    const { phone, industry, storeCount, score, level, action } = JSON.parse(body);

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

    // DEBUG: 纯文本回显，不用JSON.stringify
    const debugBody = 'phone=' + phone + ' industry=[' + industry + '] level=[' + level + '] storeCount=' + storeCount + ' score=' + score;
    return new Response(debugBody, { headers: { "Content-Type": "text/plain; charset=utf-8" } });

    const kv = getKV();
    if (kv) {
      await kv.put(`lead:${Date.now()}:${phone}`, JSON.stringify({
        phone, industry: industry || "", storeCount: storeCount || "",
        score: score || "", level: level || "", time: new Date().toISOString()
      }));
    }

    const WEBHOOK_URL = "https://open.feishu.cn/open-apis/bot/v2/hook/e62aa6ed-ff47-459a-b344-b1d4a698ad55";
    const webhook = ((process.env as any)?.LEADS_WEBHOOK_URL) || ((globalThis as any)?.LEADS_WEBHOOK_URL) || WEBHOOK_URL;
    if (webhook) {
      // 纯字符串拼接，复用之前硬编码测试成功的模式
      const p = (s: string) => String(s||"-").replace(/"/g, '\\"').replace(/\\/g, '\\\\');
      const payload = '{"msg_type":"text","content":{"text":"[New Lead]\\nPhone: ' + p(phone) + '\\nIndustry: ' + p(industry) + '\\nStores: ' + p(storeCount) + '\\nScore: ' + p(score) + ' (' + p(level) + ')\"}}';
      try { await fetch(webhook, { method: "POST", headers: { "Content-Type": "application/json" }, body: payload }); } catch {}
    }

    return Response.json({ success: true, kv: !!kv });
  } catch (e: unknown) {
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}