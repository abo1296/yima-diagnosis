import { DIMENSION_LABELS, DIMENSION_ORDER } from "@/lib/types";

interface ReportRequest {
  overall_score: number;
  level: string;
  scores: Record<string, number>;
  answers: Record<string, number>;
  industry?: string;
  storeCount?: string;
  warmup?: string;
}

export async function POST(request: Request) {
  try {
    const body: ReportRequest = await request.json();
    const { overall_score, level, scores, industry, storeCount, warmup } = body;

    const prompt = buildPrompt(overall_score, level, scores, industry, storeCount, warmup);

    const baseUrl = (process.env.ANTHROPIC_BASE_URL || "https://ai.lehe.com").replace(/\/+$/, "");
    const authToken = process.env.ANTHROPIC_AUTH_TOKEN || "sk-ri2SiLredMTWyPaT96h0kbkFMgWjvfwa7Q80BLl3hocQlNwb";
    const apiKey = process.env.ANTHROPIC_API_KEY || "";
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
    const allErrors: string[] = [];
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

          // 尝试提取并修复 JSON
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            let jsonStr = jsonMatch[0];
            try {
              const report = JSON.parse(jsonStr);
              return Response.json({ report });
            } catch {
              // JSON 修复：补缺失逗号、去尾逗号
              try {
                jsonStr = jsonStr
                  .replace(/,\s*}/g, "}")           // 去对象尾逗号
                  .replace(/,\s*]/g, "]")            // 去数组尾逗号
                  .replace(/"\s+"/g, '","')          // 补字符串间逗号
                  .replace(/]\s*"/g, '],"')          // 补 ]" 间逗号
                  .replace(/}\s*{/g, "},{")          // 补对象间逗号
                  .replace(/]\s*\[/g, "],[");        // 补数组间逗号
                const report = JSON.parse(jsonStr);
                return Response.json({ report });
              } catch {
                lastError = "AI JSON 格式异常，无法修复";
              }
            }
          } else {
            lastError = "AI 返回格式异常，未找到有效 JSON";
          }
          allErrors.push(`${endpoint.url} → 格式异常`);
        } else {
          const err = await resp.text();
          lastError = `${endpoint.url} → ${resp.status}: ${err.slice(0, 200)}`;
          allErrors.push(lastError);
        }
      } catch (e: unknown) {
        lastError = `${endpoint.url} → ${(e as Error).message}`;
        allErrors.push(lastError);
      }
    }

    return Response.json(
      { error: `所有 API 端点均失败。错误列表: ${allErrors.join(" | ")}` },
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
  warmup?: string,
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
  const industryHint = industry ? `\n该企业属于${industry}行业，诊断分析和建议需针对${industry}连锁特性（如${industry === "餐饮" ? "翻台率、食安、菜品标准化" : industry === "零售" ? "库存周转、坪效、全渠道" : industry === "酒店民宿" ? "入住率、OTA依赖度、服务标准化" : industry === "教育培训" ? "续费率、师资复制、课程标准化" : industry === "美容美发" ? "会员储值、技师留存、服务一致性" : industry === "健身运动" ? "会员活跃度、私教转化、场地利用率" : industry === "汽车服务" ? "回厂率、技师认证、配件供应链" : industry === "医疗健康" ? "复诊率、诊疗标准化、数字化病历" : industry === "宠物服务" ? "复购率、自有品牌、服务标准化" : "标准化复制能力"}）。` : "";
  const warmupHint = warmup ? `\n行业预热调研：${warmup}` : "";
  const benchmarkHint = industry ? `\n请对比${industry}行业典型连锁企业的分数分布（通常该行业平均综合得分在45-55分之间，领先企业可达70+），指出该企业与行业对比的差距和机会。` : "";

  return `连锁企业诊断数据：综合${overall_score}分，等级${level}。维度得分：${dimList}。${contextStr}${industryHint}${warmupHint}${benchmarkHint}

请只输出一行完整JSON，严格遵守以下格式（注意引号和逗号，不要有语法错误）：

{"overview":{"headline":"20字内","stage":"15字内","strength":"30字内","risk":"30字内"},"dimensions":[{"dim":"维度名","score":分数,"comment":"25字内","tips":["建议1","建议2"]}],"actions":[{"title":"15字内","why":"20字内","timeline":"周期"}],"benchmark":"与同行业对比一句话(50字内)","yima":"逸马价值80字内"}

强制规则：
- 输出必须是一行合法JSON，不要换行，不要markdown代码块
- 所有键和字符串用英文双引号
- dimensions必须包含全部9个维度，按得分从低到高排列
- benchmark字段需基于行业特性给出对比分析
- actions给3条最优先行动
- tips每个维度2条建议
- 总字数控制在900字以内`;
}
