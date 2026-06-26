// Cloudflare Workers KV binding
function getKV(): { put: (k: string, v: string) => Promise<void>; list: () => Promise<{ keys: { name: string }[] }>; get: (k: string) => Promise<string | null> } | null {
  try {
    // @ts-ignore - Cloudflare Workers global binding
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

    const lead = JSON.stringify({
      phone,
      industry: industry || "",
      storeCount: storeCount || "",
      score: score || "",
      level: level || "",
      time: new Date().toISOString(),
    });

    // 存 KV
    const kv = getKV();
    if (kv) {
      const key = `lead:${Date.now()}:${phone}`;
      await kv.put(key, lead);
    }

    // 飞书/钉钉 webhook（如果配置了）
    const webhook = (process.env as any).LEADS_WEBHOOK_URL;
    if (webhook) {
      try {
        await fetch(webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            msgtype: "text",
            text: { content: `📞 新线索\n手机：${phone}\n行业：${industry || "-"}\n门店：${storeCount || "-"}\n得分：${score || "-"}（${level || "-"}）` },
          }),
        });
      } catch {}
    }

    console.log(`[LEAD] ${phone} ${industry} ${storeCount} ${score} ${level}`);

    return Response.json({ success: true });
  } catch (e: unknown) {
    return Response.json({ error: `服务器错误: ${(e as Error).message}` }, { status: 500 });
  }
}

// GET: 查看所有线索
export async function GET() {
  const kv = getKV();
  if (!kv) {
    return Response.json({ error: "KV 未配置" }, { status: 500 });
  }
  try {
    const list = await kv.list();
    const leads: unknown[] = [];
    for (const key of list.keys) {
      const val = await kv.get(key.name);
      if (val) leads.push(JSON.parse(val));
    }
    leads.sort((a: any, b: any) => b.time?.localeCompare(a.time || "") || 0);
    return Response.json({ leads });
  } catch (e: unknown) {
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}
