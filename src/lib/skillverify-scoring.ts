import {
  RUBRIC_CRITERIA,
  getCompetencyLevel,
  type RubricCriterionKey,
  type ScenarioCriterionScore,
  type ScenarioQuestion,
  type ScenarioScore,
} from "./skillverify-types";

const CRITERION_KEYWORDS: Record<Exclude<RubricCriterionKey, "technicalKnowledge">, string[]> = {
  problemSolving: [
    "assess",
    "analyse",
    "analyze",
    "identify",
    "test",
    "measure",
    "inspect",
    "diagnose",
    "root cause",
    "verify",
    "compare",
    "investigate",
  ],
  decisionMaking: [
    "prioritise",
    "prioritize",
    "stop",
    "halt",
    "reject",
    "isolate",
    "select",
    "escalate",
    "refer",
    "approve",
    "rollback",
    "quarantine",
  ],
  safetyCompliance: [
    "safety",
    "risk",
    "compliance",
    "standard",
    "protocol",
    "regulation",
    "ppe",
    "consent",
    "protect",
    "document",
    "log",
    "audit",
  ],
  professionalCommunication: [
    "notify",
    "inform",
    "explain",
    "report",
    "handover",
    "sbar",
    "communicate",
    "team",
    "client",
    "supervisor",
    "stakeholder",
    "document",
  ],
};

function normalise(value: string): string {
  return value.toLowerCase().replace(/[’']/g, "");
}

function countWords(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function scoreCriterion(answer: string, keywords: string[]): number {
  const lower = normalise(answer);
  const uniqueKeywords = [...new Set(keywords.map(normalise))];
  const matched = uniqueKeywords.filter((keyword) => lower.includes(keyword));
  const requiredMatches = Math.min(4, uniqueKeywords.length);
  const keywordPoints = requiredMatches === 0 ? 0 : Math.min(1, matched.length / requiredMatches) * 56;
  const depthPoints = Math.min(32, (countWords(answer) / 70) * 32);

  // Demo scoring is deliberately capped below 100: an AI text review always needs human verification.
  return Math.round(Math.min(96, 8 + depthPoints + keywordPoints));
}

function criterionFeedback(score: number, label: string): string {
  if (score >= 80) return `Clear ${label.toLowerCase()} evidence with specific, actionable reasoning.`;
  if (score >= 60) return `Adequate ${label.toLowerCase()}; more explicit steps or standards would strengthen the response.`;
  if (score >= 40) return `Partial ${label.toLowerCase()} evidence; important reasoning or procedures need development.`;
  return `Limited ${label.toLowerCase()} evidence; supervised reassessment is recommended.`;
}

export function scoreDemoScenario(question: ScenarioQuestion, answer: string): ScenarioScore {
  const criteria: ScenarioCriterionScore[] = RUBRIC_CRITERIA.map((criterion) => {
    const keywords = criterion.key === "technicalKnowledge"
      ? question.expectedKeywords
      : CRITERION_KEYWORDS[criterion.key];
    const score = scoreCriterion(answer, keywords);
    return {
      criterion: criterion.key,
      label: criterion.label,
      weight: criterion.weight,
      score,
      feedback: criterionFeedback(score, criterion.label),
    };
  });

  const score = calculateWeightedScore(criteria);
  const strengths = criteria
    .filter((criterion) => criterion.score >= 70)
    .map((criterion) => `${criterion.label}: ${criterion.feedback}`);
  const gaps = criteria
    .filter((criterion) => criterion.score < 60)
    .map((criterion) => `${criterion.label}: ${criterion.feedback}`);

  return {
    questionId: question.id,
    title: question.title,
    competencyArea: question.competencyArea,
    score,
    criteria,
    strengths,
    gaps,
    feedback: gaps.length > 0
      ? `The response shows ${strengths.length > 0 ? "some practical evidence" : "limited practical evidence"}. Prioritise ${gaps[0]?.split(":")[0]?.toLowerCase() ?? "more detailed reasoning"} before reassessment.`
      : "The response addresses all five criteria with profession-specific reasoning; confirm competence through supervised human assessment.",
  };
}

export function calculateWeightedScore(criteria: Array<Pick<ScenarioCriterionScore, "score" | "weight">>): number {
  const totalWeight = criteria.reduce((sum, criterion) => sum + criterion.weight, 0);
  if (totalWeight <= 0) return 0;
  return Math.round(criteria.reduce((sum, criterion) => sum + criterion.score * criterion.weight, 0) / totalWeight);
}

export function calculateOverallScore(scenarios: Array<Pick<ScenarioScore, "score">>): number {
  if (scenarios.length === 0) return 0;
  return Math.round(scenarios.reduce((sum, scenario) => sum + scenario.score, 0) / scenarios.length);
}

export function createPassportId(): string {
  const random = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID().replaceAll("-", "").slice(0, 4)
    : Math.floor(Math.random() * 65536).toString(16).padStart(4, "0");
  return `SV-2026-${random.toUpperCase()}`;
}

export function summariseDemoEvaluation(scenarios: ScenarioScore[]) {
  const overallScore = calculateOverallScore(scenarios);
  const competencyLevel = getCompetencyLevel(overallScore);
  const strengths = scenarios.flatMap((scenario) => scenario.strengths).slice(0, 6);
  const skillsGaps = scenarios.flatMap((scenario) => scenario.gaps).slice(0, 6);
  const recommendedTraining = [...new Set(
    scenarios
      .flatMap((scenario) => scenario.criteria)
      .filter((criterion) => criterion.score < 65)
      .map((criterion) => `Complete a targeted ${criterion.label.toLowerCase()} module with observed practical feedback.`),
  )].slice(0, 4);

  return { overallScore, competencyLevel, strengths, skillsGaps, recommendedTraining };
}
