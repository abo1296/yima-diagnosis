export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, industry, storeCount, score, level } = body;

    if (!phone) {
      return Response.json({ error: "手机号不能为空" }, { status: 400 });
    }

    // 1. 发飞书/钉钉 webhook（如果配置了）
    const webhookUrl = process.env.LEADS_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            msgtype: "text",
            text: {
              content: `📞 新咨询线索\n手机号：${phone}\n行业：${industry || "未填"}\n门店数：${storeCount || "未填"}\n诊断得分：${score || "未填"}分（${level || "未填"}）\n时间：${new Date().toLocaleString("zh-CN")}`,
            },
          }),
        });
      } catch { /* webhook 失败不影响主流程 */ }
    }

    // 2. 记录到控制台日志（Cloudflare 可查看）
    console.log(`[LEAD] phone=${phone} industry=${industry} stores=${storeCount} score=${score} level=${level} time=${new Date().toISOString()}`);

    return Response.json({ success: true });
  } catch (e: unknown) {
    return Response.json({ error: `服务器错误: ${(e as Error).message}` }, { status: 500 });
  }
}
