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
          let text =
            data.content
              ?.filter((c: { type: string }) => c.type === "text")
              .map((c: { text: string }) => c.text)
              .join("") || "";

          // Fallback: OpenAI-compatible format (choices[0].message.content)
          if (!text && data.choices?.[0]?.message?.content) {
            text = data.choices[0].message.content;
          }

          // 尝试提取并修复 JSON
          // 1. 去掉 markdown 代码块标记
          let cleanText = text.replace(/```(?:json)?\s*/gi, "").replace(/```/g, "");
          // 2. 找到最外层 JSON
          const start = cleanText.indexOf("{");
          const end = cleanText.lastIndexOf("}");
          if (start >= 0 && end > start) {
            let jsonStr = cleanText.slice(start, end + 1);
            try {
              const report = JSON.parse(jsonStr);
              return Response.json({ report });
            } catch {
              // JSON 修复：去尾逗号、补缺失逗号
              try {
                jsonStr = jsonStr
                  .replace(/,\s*}/g, "}")
                  .replace(/,\s*]/g, "]")
                  .replace(/"\s+"/g, '","')
                  .replace(/]\s*"/g, '],"')
                  .replace(/}\s*\{/g, "},{")
                  .replace(/]\s*\[/g, "],[");
                const report = JSON.parse(jsonStr);
                return Response.json({ report });
              } catch {
                lastError = `AI JSON 格式异常，无法修复。原始响应前200字: ${text.slice(0, 200)}`;
              }
            }
          } else {
            lastError = `AI 未返回 JSON，原始响应前200字: ${text.slice(0, 200)}`;
          }
          allErrors.push(`${endpoint.url} → ${lastError}`);
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

  // 行业深度上下文
  const industryDeepContext = getIndustryContext(industry, storeCount, warmup, overall_score, level, scores);

  return `你是一位拥有20年连锁企业实战经验的资深诊断顾问，你说话一针见血、不说废话、不堆砌形容词。你的诊断报告让连锁老板读完后产生三个反应：①"说得太准了" ②"原来问题出在这" ③"怎么联系你们？"

以下是连锁企业的诊断数据：
- 综合得分：${overall_score}分（${level}）
- 各维度得分：${dimList}
- ${context.join("，")}

${industryDeepContext}

=== 输出格式要求 ===

请只输出一行完整JSON，勿加markdown代码块或额外文字：

{
  "summary": {
    "fatal": "最致命的问题——一句话点穴（10字内）",
    "strongest": "最强的资产——你最该放大的东西（10字内）",
    "first": "最先该做的事——老板明天就能动手干（10字内）"
  },
  "overview": {
    "headline": "一针见血的诊断定性，让老板看了就觉得'这人懂我'（20字内）",
    "stage": "该企业在连锁发展路径上所处的阶段（15字内）",
    "strength": "最值得放大的核心优势，用行业术语（30字内）",
    "risk": "如果不改善，接下来3-6个月会发生什么，要让老板感到紧迫（30字内）"
  },
  "dimensions": [
    {
      "dim": "维度名",
      "score": 分数,
      "comment": "一句话点出最关键的发现，不是描述分数而是指出问题本质（20字内）",
      "tips": ["具体可执行的建议1","具体可执行的建议2"]
    }
  ],
  "actions": [
    {
      "title": "能给老板现在就开始做的事（15字内）",
      "why": "为什么这件事是P0，不做会怎样（20字内）",
      "timeline": "预估见效周期（如'3个月内见效'）"
    }
  ],
  "benchmark": "与同行业对标的一句话，用数据说话（50字内）",
  "painpoint": "这个分数段的企业最常见的3个失误，用老板的日常语言描述，让他觉得'就是在说我'（80字内）",
  "yima": "逸马具体能怎么帮他——不是泛泛的'我们有方法'，而是具体到'针对你的XX短板，逸马做过XX案例，可以帮你XX'（100字内）",
  "nextStep": "下一步建议：一句让老板觉得'值得花10分钟聊聊'的话（30字内）"
}

=== 写作风格强制规则 ===
1. 用老板的语言写作——不说'组织效能不足'，说'店长不够用，开了新店没人管'
2. 每条建议都具体到动作——不说'加强培训'，说'把招牌菜操作拍成3分钟视频，新厨师对着视频练'
3. dimensions按得分从低到高排列，最弱的维度最先说
4. 给3条actions（优先级排序）
5. 每个维度给2条tips
6. headline要能让老板心里咯噔一下
7. painpoint必须用'你'开头，像当面说的感觉
8. yima部分必须具体——提到逸马22年经验、3000+会员企业、具体案例
9. 总字数控制在1100字以内`;
}

function getIndustryContext(
  industry?: string,
  storeCount?: string,
  warmup?: string,
  overall_score?: number,
  level?: string,
  scores?: Record<string, number>,
): string {
  if (!industry) return "";

  const contexts: Record<string, string> = {
    "餐饮": `【餐饮连锁行业深度语境】
- 核心竞争力：出品一致性（同一道菜在每家店味道一样）+ 食安底线 + 翻台率
- 常见死法：开到30家就失控——培训跟不上、中央厨房没建、加盟商私采食材
- 行业均值：综合45-55分，领先企业（海底捞/百胜/锅圈）70+
- 当前门店数${storeCount || "未知"}——注意餐饮连锁的拐点通常在30店（脱离创始人直接管控）
- 诊断重点：食材成本率、中央厨房覆盖、SOP执行偏差、外卖占比、加盟商管控`,

    "零售": `【零售连锁行业深度语境】
- 核心竞争力：鲜食供应链（毛利35-50% vs 标品15-20%）+ 选址精准度 + 库存周转
- 常见死法：50家店后供应链撑不住——鲜食报损率飙升、加盟店不听总部、选址模型失效
- 行业均值：综合42-52分，领先企业（永辉/红旗/美宜佳）65-80+
- 当前门店数${storeCount || "未知"}——注意零售连锁的拐点在50店（供应链复杂度指数级上升）
- 诊断重点：鲜食报损率、自有品牌占比、加盟店标准化率、全渠道占比、自动补货覆盖率`,

    "医药": `【医药连锁行业深度语境】
- 核心竞争力：GSP合规（生存线）+ 执业药师配置 + 处方外流承接能力
- 常见死法：飞检不合格罚款=单店3-6个月利润、执业药师挂靠东窗事发、医保统筹店接入慢
- 行业均值：综合40-50分，领先企业（大参林/老百姓/益丰）65-80+
- 当前门店数${storeCount || "未知"}——注意医药连锁拐点在80店（GSP合规成本指数级增长）
- 诊断重点：GSP合规自动化率、药师在岗率、自有品牌占比、慢病会员复购率、处方流转对接`,

    "教育": `【教育培训连锁行业深度语境】
- 核心竞争力：课程标准化 + 师资复制能力 + 续费率/转介绍率
- 常见死法：名师出走带走40-60%生源、预付费资金监管抽干现金流、续费率从75%跌到55%
- 行业均值：综合35-48分，领先企业（新东方/好未来）60-75+
- 当前门店数${storeCount || "未知"}——注意教育连锁拐点在20店（名师供给断裂）
- 诊断重点：名师集中度、标准化师训体系、续费率、满班率、获客成本CAC`,

    "服饰": `【服饰连锁行业深度语境】
- 核心竞争力：库存周转（售罄率>75%是健康线）+ 快反供应链 + 全渠道能力
- 常见死法：季末售罄率<55%吃掉整个季度利润、买手凭经验订货撞大运、线下沦为线上试衣间
- 行业均值：综合38-50分，领先企业（优衣库/海澜之家/太平鸟）65-80+
- 当前门店数${storeCount || "未知"}——注意服饰连锁拐点在50店（库存周转开始失控）
- 诊断重点：季末售罄率、柔供快反占比、智能配补调覆盖、全渠道库存通、导购人效`,

    "酒类": `【酒类连锁行业深度语境】
- 核心竞争力：名酒配额获取 + 正品保真信任 + 烟草许可证覆盖
- 常见死法：假酒事件摧毁区域品牌信任、名酒配额不够分（单店货值高但毛利仅5-8%）、私域复购率<25%
- 行业均值：综合35-48分，领先企业（华致酒行/1919）60-75+
- 当前门店数${storeCount || "未知"}——注意酒类连锁拐点在30店（名酒配额/烟草证成瓶颈）
- 诊断重点：名酒配额利用率、一物一码溯源覆盖、窜货率、私域复购率、自有品牌占比`,

    "家电": `【家电连锁行业深度语境】
- 核心竞争力：售后服务品质（安装满意度）+ 全渠道价格管控 + 场景化体验能力
- 常见死法：安装外包差评拉低NPS 15-25点、线上比价导致线下成免费展厅、传统大家电零增长
- 行业均值：综合35-48分，领先企业（京东五星/苏宁/顺电）60-75+
- 当前门店数${storeCount || "未知"}——注意家电连锁拐点在30店（售后服务外包开始反噬品牌）
- 诊断重点：安装好评率、售后SLA达标率、新品类占比、坪效、导购人效`,
  };

  const baseCtx = contexts[industry] || `【${industry}连锁行业】请结合${industry}行业的连锁特性进行诊断分析。`;
  const scoreHint = overall_score !== undefined && level
    ? `\n该企业综合${overall_score}分（${level}）。`
    : "";
  const warmupHint = warmup ? `\n行业预热调研：${warmup}` : "";

  return `${baseCtx}${scoreHint}${warmupHint}

【诊断报告的核心目的】
这份报告不仅要让老板看到问题，更要让他产生行动冲动。每个维度的痛点都要让他觉得"就是在说我现在的状况"，每条建议都要让他觉得"这个可以马上做"。

【逸马价值植入】
报告末尾必须自然引出逸马能提供什么——不要硬广，要基于诊断结果具体说：
- 如果培训得分低："逸马帮木屋烧烤搭建培训体系时，3个月让新店员上岗周期从4周缩短到10天"
- 如果供应链得分低："逸马帮锅圈食汇建立中央厨房后，食材成本率下降了4个百分点"
- 如果督导得分低："逸马的'督导教练模式'帮百果园的巡店问题闭环率从40%提到85%"

【电话留资转化】
nextStep字段要写成"老板觉得值得花10分钟聊聊"的感觉。不是"联系顾问"，而是"我们针对你的XX短板有个免费深度诊断，10分钟电话帮你理清3个月内的突破口"。`;
}
