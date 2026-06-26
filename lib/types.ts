export interface QuestionOption {
  value: number;
  label: string;
}

export interface Question {
  id: string;
  dimension: string;
  dimensionLabel: string;
  text: string;
  options: QuestionOption[];
}

export interface AssessmentData {
  id?: string;
  user_id?: string;
  company_name?: string;
  industry: string;
  store_count: number;
  scores: Record<string, number>;
  overall_score: number;
  level: string;
  answers: Record<string, number>;
  ai_report?: string;
  created_at?: string;
}

export interface LeadData {
  user_id?: string;
  assessment_id: string;
  phone?: string;
  message?: string;
  source: string;
}

export const DIMENSION_LABELS: Record<string, string> = {
  strategy: "战略",
  model: "商业模式",
  operation: "运营标准化",
  organization: "组织人才",
  supply_chain: "供应链",
  training: "培训体系",
  supervision: "督导体系",
  digital: "数字化",
  culture: "企业文化",
};

export const DIMENSION_ORDER = [
  "strategy",
  "model",
  "operation",
  "organization",
  "supply_chain",
  "training",
  "supervision",
  "digital",
  "culture",
];

export const DIMENSION_TIPS: Record<string, string> = {
  strategy: "方向比速度更重要",
  model: "赚钱不难，难的是持续赚钱",
  operation: "第30家店和第一家一样好才算标准",
  organization: "人对了，事就对了",
  supply_chain: "供应链是连锁的底层竞争力",
  training: "复制人的能力比复制店更难",
  supervision: "没有检查就没有执行",
  digital: "数字化不是选择题，是生存题",
  culture: "文化决定企业能走多远",
};
