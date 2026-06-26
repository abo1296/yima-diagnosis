// Cloudflare KV REST API credentials (CI注入)
const CF_ACCOUNT = "__CF_ACCOUNT_ID__";
const CF_API_KEY = "__CF_API_KEY__";
const CF_EMAIL = "__CF_EMAIL__";
const CF_KV = "79c7a651e94d42bd88cc125be8940373";
const CF_API = "https://api.cloudflare.com/client/v4/accounts";
const CF_HEADERS = { "X-Auth-Key": CF_API_KEY, "X-Auth-Email": CF_EMAIL };

async function kvPut(key: string, value: string) {
  const url = `${CF_API}/${CF_ACCOUNT}/storage/kv/namespaces/${CF_KV}/values/${encodeURIComponent(key)}`;
  await fetch(url, { method: "PUT", headers: CF_HEADERS, body: value });
}

async function kvList() {
  const url = `${CF_API}/${CF_ACCOUNT}/storage/kv/namespaces/${CF_KV}/keys`;
  const res = await fetch(url, { headers: CF_HEADERS });
  const data: any = await res.json();
  return data.result || [];
}

async function kvGet(key: string) {
  const url = `${CF_API}/${CF_ACCOUNT}/storage/kv/namespaces/${CF_KV}/values/${encodeURIComponent(key)}`;
  const res = await fetch(url, { headers: CF_HEADERS });
  if (!res.ok) return null;
  return await res.text();
}

// JSON.stringify 的 UTF-8 安全版本（中文转 \uXXXX，绕开 Workers bug）
function safeJson(obj: unknown): string {
  return JSON.stringify(obj).replace(/[^\x00-\x7F]/g, (ch) => {
    const cp = ch.codePointAt(0)!;
    return '\\u' + cp.toString(16).padStart(4, '0');
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, industry, industry_code, storeCode, storeCount, store_code, score, level, action } = body;

    // 行业编号→中文映射（前端传编号，绕开OpenNext中文bug）
    const INDUSTRY_NAME: Record<number, string> = {
      0: "餐饮", 1: "零售", 2: "医药", 3: "教育", 4: "服饰",
      5: "酒类", 6: "家电", 7: "酒店民宿", 8: "美容美发",
      9: "健身运动", 10: "汽车服务", 11: "宠物服务", 12: "便利店",
      13: "其他连锁"
    };
    const industryName = INDUSTRY_NAME[industry_code] || industry || "-";

    // 门店编号→中文
    const STORE_NAME: Record<number, string> = { 0: "1-10家", 1: "11-50家", 2: "51-200家", 3: "200家以上" };
    const storeName = STORE_NAME[store_code] || storeCount || storeCode || "-";

    // 根据分数重算等级
    const numScore = parseInt(score) || 0;
    const levelName = numScore <= 40 ? "成长型" : numScore <= 70 ? "成熟型" : "领先型";

    if (action === "list") {
      try {
        const keys = await kvList();
        const leads: unknown[] = [];
        for (const k of keys) {
          const val = await kvGet(k.name);
          if (val) leads.push(JSON.parse(val));
        }
        leads.sort((a: any, b: any) => b.time?.localeCompare(a.time || "") || 0);
        return new Response(safeJson({ leads: leads.slice(0, 50) }), { headers: { "Content-Type": "application/json" } });
      } catch (e: unknown) {
        return new Response(safeJson({ error: (e as Error).message, leads: [] }), { status: 200, headers: { "Content-Type": "application/json" } });
      }
    }

    if (!phone) return new Response(safeJson({ error: "phone required" }), { status: 400, headers: { "Content-Type": "application/json" } });

    // 存线索
    await kvPut(`lead:${Date.now()}:${phone}`, JSON.stringify({
      phone, industry: industryName, storeCount: storeName,
      score: score || "", level: levelName, time: new Date().toISOString()
    }));

    // 飞书通知
    const WEBHOOK_URL = "https://open.feishu.cn/open-apis/bot/v2/hook/e62aa6ed-ff47-459a-b344-b1d4a698ad55";
    const webhook = ((process.env as any)?.LEADS_WEBHOOK_URL) || ((globalThis as any)?.LEADS_WEBHOOK_URL) || WEBHOOK_URL;
    if (webhook) {
      const payload = JSON.stringify({
        msg_type: "text",
        content: { text: `📞新线索\n手机：${phone}\n行业：${industryName}\n门店：${storeName}\n得分：${score || "-"}（${levelName}）` }
      });
      try { await fetch(webhook, { method: "POST", headers: { "Content-Type": "application/json" }, body: payload }); } catch {}
    }

    return new Response(safeJson({ success: true, kv: true }), { headers: { "Content-Type": "application/json" } });
  } catch (e: unknown) {
    return new Response(safeJson({ error: (e as Error).message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
