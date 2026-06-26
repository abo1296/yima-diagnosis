// Cloudflare Workers KV binding
function getKV(): { put: (k: string, v: string) => Promise<void>; list: () => Promise<{ keys: { name: string }[] }>; get: (k: string) => Promise<string | null> } | null {
  try {
    // @ts-ignore
    if (typeof YIMA_LEADS !== "undefined") return YIMA_LEADS;
  } catch {}
  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, industry, storeCount, score, level } = body;

    if (!phone) {
      return Response.json({ error: "手机号不能为空" }, { status: 400 });
    }

    // 存 KV
    const storeStart = Date.now();
    const kv = getKV();
    if (kv) {
      await kv.put(`lead:${storeStart}:${phone}`, JSON.stringify({ phone, industry: industry || "", storeCount: storeCount || "", score: score || "", level: level || "", time: new Date().toISOString() }));
    }

    // Webhook
    const webhook = (process.env as any).LEADS_WEBHOOK_URL;
    if (webhook) {
      try {
        await fetch(webhook, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ msgtype: "text", text: { content: `📞 新线索\n手机：${phone}\n行业：${industry || "-"}\n门店：${storeCount || "-"}\n得分：${score || "-"}（${level || "-"}）` } }),
        });
      } catch {}
    }

    return Response.json({ success: true, kv: !!kv });
  } catch (e: unknown) {
    return Response.json({ error: `错误: ${(e as Error).message}` }, { status: 500 });
  }
}
