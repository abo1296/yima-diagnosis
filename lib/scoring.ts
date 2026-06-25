import type { AssessmentData } from "./types";
import { DIMENSION_ORDER } from "./types";

/**
 * 根据用户答案计算各维度得分和综合得分
 */
export function calculateScores(
  answers: Record<string, number>,
  questionMap: Record<string, string> = {}
): Omit<AssessmentData, "id" | "user_id" | "ai_report" | "created_at" | "company_name" | "industry" | "store_count"> {
  const dimensionScores: Record<string, number> = {};
  const dimensionAnswerCount: Record<string, number> = {};

  // 按维度汇总得分
  for (const [questionId, answerValue] of Object.entries(answers)) {
    // 优先用传入的映射，fallback 到 ID 前缀解析
    const dim = questionMap[questionId] || questionId.replace(/_\d+$/, "");
    dimensionScores[dim] = (dimensionScores[dim] || 0) + answerValue;
    dimensionAnswerCount[dim] = (dimensionAnswerCount[dim] || 0) + 1;
  }

  // 换算为百分制（每维度 8 题，每题 0-2 分，满分 16 分）
  const scaledScores: Record<string, number> = {};
  for (const dim of DIMENSION_ORDER) {
    const raw = dimensionScores[dim] || 0;
    const count = dimensionAnswerCount[dim] || 8;
    scaledScores[dim] = Math.round((raw / (count * 2)) * 100);
  }

  // 综合得分 = 9 维度平均值
  const overall =
    Math.round(
      DIMENSION_ORDER.reduce((sum, dim) => sum + (scaledScores[dim] || 0), 0) / DIMENSION_ORDER.length
    );

  const level = getLevel(overall);

  return {
    scores: scaledScores,
    overall_score: overall,
    level,
    answers,
  };
}

function getLevel(score: number): string {
  if (score <= 40) return "初学者";
  if (score <= 65) return "成长型";
  if (score <= 85) return "成熟型";
  return "领先型";
}

export function getLevelColor(level: string): string {
  switch (level) {
    case "初学者":
      return "text-red-600 bg-red-50";
    case "成长型":
      return "text-orange-600 bg-orange-50";
    case "成熟型":
      return "text-blue-600 bg-blue-50";
    case "领先型":
      return "text-green-600 bg-green-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
}
