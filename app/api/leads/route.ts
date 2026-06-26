let kv: any = null;
try {
  // @ts-ignore
  if (typeof YIMA_LEADS !== "undefined") kv = YIMA_LEADS;
} catch {}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, industry, storeCount, score, level, action } = body;

    // 查询列表
    if (action === "list") {
      if (!kv) return Response.json({ error: "存储未配置" }, { status: 500 });
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
        return Response.json({ error: (e as Error).message }, { status: 500 });
      }
    }

    // 存线索
    if (!phone) return Response.json({ error: "手机号不能为空" }, { status: 400 });

    if (kv) {
      await kv.put(`lead:${Date.now()}:${phone}`, JSON.stringify({
        phone, industry: industry || "", storeCount: storeCount || "",
        score: score || "", level: level || "", time: new Date().toISOString()
      }));
    }

    const webhook = (process.env as any).LEADS_WEBHOOK_URL;
    if (webhook) {
      try {
        await fetch(webhook, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ msgtype: "text", text: { content: `📞新线索\n手机：${phone}\n行业：${industry||"-"}\n门店：${storeCount||"-"}\n得分：${score||"-"}（${level||"-"}）` } }),
        });
      } catch {}
    }

    console.log(`[LEAD] ${phone} ${industry} ${storeCount} ${score} ${level}`);
    return Response.json({ success: true, kv: !!kv });
  } catch (e: unknown) {
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}
