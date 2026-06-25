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
