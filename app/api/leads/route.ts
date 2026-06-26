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
      const payload = JSON.stringify({
        msg_type: "text",
        content: { text: `[New Lead]\nPhone: ${phone}\nIndustry: ${industry || "-"}\nStores: ${storeCount || "-"}\nScore: ${score || "-"} (${level || "-"})` }
      });
      try { await fetch(webhook, { method: "POST", headers: { "Content-Type": "application/json" }, body: payload }); } catch {}
    }

    return Response.json({ success: true, kv: !!kv });
  } catch (e: unknown) {
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}
