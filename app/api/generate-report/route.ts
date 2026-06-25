import { DIMENSION_LABELS, DIMENSION_ORDER } from "@/lib/types";

interface ReportRequest {
  overall_score: number;
  level: string;
  scores: Record<string, number>;
  answers: Record<string, number>;
  industry?: string;
  storeCount?: string;
}

export async function POST(request: Request) {
  try {
    const body: ReportRequest = await request.json();
    const { overall_score, level, scores, industry, storeCount } = body;

    const prompt = buildPrompt(overall_score, level, scores, industry, storeCount);

    const baseUrl = (process.env.ANTHROPIC_BASE_URL || "").replace(/\/+$/, "");
    const authToken = process.env.ANTHROPIC_AUTH_TOKEN;
    const apiKey = process.env.ANTHROPIC_API_KEY;
    const isLehe = baseUrl.includes("lehe.com");
    const model =
      process.env.ANTHROPIC_MODEL ||
      process.env.ANTHROPIC_DEFAULT_SONNET_MODEL ||
      process.env.ANTHROPIC_DEFAULT_OPUS_MODEL ||
      (isLehe ? "deepseek-v4-pro" : "claude-sonnet-4-6");

    const endpoints: { url: string; headers: Record<string, string> }[] = [];

    // 1. 远程代理（优先，Cloudflare 上唯一可用的）
    if (baseUrl) {
      const h: Record<string, string> = {
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
      };
      if (authToken && authToken !== "PROXY_MANAGED") {
        h["Authorization"] = `Bearer ${authToken}`;
      } else if (apiKey) {
        h["x-api-key"] = apiKey;
      }
      endpoints.push({ url: `${baseUrl}/v1/messages`, headers: h });
    }

    // 2. Anthropic 官方
    if (apiKey) {
      endpoints.push({
        url: "https://api.anthropic.com/v1/messages",
        headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      });
    }

    // 3. 本地代理兜底（仅开发环境有效）
    endpoints.push({
      url: "http://127.0.0.1:15721/v1/messages",
      headers: { "Content-Type": "application/json", "anthropic-version": "2023-06-01" },
    });

    let lastError = "";
    for (const endpoint of endpoints) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 120_000);

        const resp = await fetch(endpoint.url, {
          method: "POST",
          headers: endpoint.headers,
          body: JSON.stringify({
            model,
            max_tokens: 2048,
            system:
              "你是逸马集团资深连锁咨询顾问，拥有20年连锁企业诊断经验。你的报告专业、务实、一针见血。必须严格按照JSON格式输出，不要有任何额外文字。",
            messages: [{ role: "user", content: prompt }],
          }),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (resp.ok) {
          const data = await resp.json();
          const text =
            data.content
              ?.filter((c: { type: string }) => c.type === "text")
              .map((c: { text: string }) => c.text)
              .join("") || "";

          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const report = JSON.parse(jsonMatch[0]);
            return Response.json({ report });
          }
          lastError = "AI 返回格式异常，未找到有效 JSON";
        } else {
          const err = await resp.text();
          lastError = `${endpoint.url} → ${resp.status}: ${err.slice(0, 200)}`;
        }
      } catch (e: unknown) {
        lastError = `${endpoint.url} → ${(e as Error).message}`;
      }
    }

    return Response.json(
      { error: `所有 API 端点均失败。最后错误: ${lastError}` },
      { status: 500 }
    );
  } catch (e: unknown) {
    return Response.json(
      { error: `服务器错误: ${(e as Error).message}` },
      { status: 500 }
    );
  }
}

function buildPrompt(
  overall_score: number,
  level: string,
  scores: Record<string, number>,
  industry?: string,
  storeCount?: string,
): string {
  const dimList = DIMENSION_ORDER.map((dim) => {
    const score = scores[dim] || 0;
    let s = "薄弱";
    if (score >= 66) s = "良好";
    else if (score >= 41) s = "一般";
    return `${DIMENSION_LABELS[dim]}:${score}分(${s})`;
  }).join("，");

  const context = [];
  if (industry) context.push(`行业：${industry}`);
  if (storeCount) context.push(`门店数：${storeCount}`);
  const contextStr = context.length > 0 ? `\n企业背景：${context.join("，")}` : "";

  return `连锁企业诊断数据：综合${overall_score}分，等级${level}。维度得分：${dimList}。${contextStr}

请只输出以下JSON（不要markdown，不要额外文字）：

{
  "overview": {"headline":"一句话定性(20字内)","stage":"发展阶段(15字内)","strength":"核心优势(30字内)","risk":"最大风险(30字内)"},
  "dimensions":[{"dim":"维度名","score":分数,"comment":"一句话诊断(25字内)","tips":["建议1(20字内)","建议2(20字内)"]}],
  "actions":[{"title":"行动项(15字内)","why":"原因(20字内)","timeline":"周期(如:1个月)"}],
  "yima":"逸马如何帮到你(80字内)"
}

要求：
- overview各字段简洁有冲击力
- dimensions包含全部9个维度，按得分从低到高排列，每个维度2条建议
- actions给3条最优先行动
- 所有中文字符控制在800字以内`;
}
