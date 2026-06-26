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
    const { phone, industry, storeCount, score, level, action } = body;

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
        phone, industry: industry || "", storeCount: storeCount || "",
        score: score || "", level: level || "", time: new Date().toISOString()
      }));
    }

    const WEBHOOK_URL = "https://open.feishu.cn/open-apis/bot/v2/hook/e62aa6ed-ff47-459a-b344-b1d4a698ad55";
    const webhook = ((process.env as any)?.LEADS_WEBHOOK_URL) || ((globalThis as any)?.LEADS_WEBHOOK_URL) || WEBHOOK_URL;
    if (webhook) {
      const text = `\u{1F4DE}\u65b0\u7ebf\u7d22\n\u624b\u673a\uff1a${phone}\n\u884c\u4e1a\uff1a${industry||"-"}\n\u95e8\u5e97\uff1a${storeCount||"-"}\n\u5f97\u5206\uff1a${score||"-"}\uff08${level||"-"}\uff09`;
      const payload = JSON.stringify({ msg_type: "text", content: { text } });
      // 把所有非ASCII字符转成JSON \uXXXX 转义序列，保证payload纯ASCII
      const asciiPayload = payload.replace(/[^\x00-\x7F]/g, (ch: string) => {
        const cp = ch.codePointAt(0)!;
        if (cp > 0xFFFF) {
          const hi = Math.floor((cp - 0x10000) / 0x400) + 0xD800;
          const lo = ((cp - 0x10000) % 0x400) + 0xDC00;
          return '\\u' + hi.toString(16).padStart(4, '0') + '\\u' + lo.toString(16).padStart(4, '0');
        }
        return '\\u' + cp.toString(16).padStart(4, '0');
      });
      try { await fetch(webhook, { method: "POST", headers: { "Content-Type": "application/json" }, body: asciiPayload }); } catch {}
    }

    return Response.json({ success: true, kv: !!kv });
  } catch (e: unknown) {
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}