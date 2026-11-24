export type WorkflowStep = 1 | 2 | 3;

export type CompetencyLevel = "Emerging" | "Competent" | "Senior";

export interface CandidateProfile {
  profession: string;
  countryOfOrigin: string;
  yearsOfExperience: string;
  workSummary: string;
  documentsLost: boolean;
  personaId?: string;
}

export interface CredentialTranslation {
  kenyanEquivalent: string;
  kenyanAuthority: string;
  internationalEquivalent: string;
  knqfLevel: string;
  recognitionPathway: string;
  summaryNote: string;
}

export interface ScenarioQuestion {
  id: string;
  title: string;
  competencyArea: string;
  scenario: string;
  prompt: string;
  sampleAnswer: string;
  expectedKeywords: string[];
}

export interface AssessmentAnalysis {
  translation: CredentialTranslation;
  questions: ScenarioQuestion[];
  source: "demo" | "gemini";
}

export interface ValidatedSkill {
  skill: string;
  proficiency: CompetencyLevel;
  evidence: string;
}

export interface BridgingMilestone {
  week: string;
  sdgTag: "SDG 4" | "SDG 8";
  title: string;
  action: string;
  partnerOrBody: string;
}

export interface CompetencyPassport {
  passportId: string;
  issuedAt: string;
  competencyLevel: CompetencyLevel;
  overallScore: number;
  evaluatorSummary: string;
  validatedSkills: ValidatedSkill[];
  bridgingPlan: BridgingMilestone[];
  source: "demo" | "gemini";
}

export interface ProfileValidationErrors {
  profession?: string;
  countryOfOrigin?: string;
  yearsOfExperience?: string;
  workSummary?: string;
}

export function validateCandidateProfile(profile: CandidateProfile): ProfileValidationErrors {
  const errors: ProfileValidationErrors = {};

  if (!profile.profession.trim()) {
    errors.profession = "Enter your claimed profession.";
  }
  if (!profile.countryOfOrigin.trim()) {
    errors.countryOfOrigin = "Enter your country of origin.";
  }

  const rawYears = profile.yearsOfExperience.trim();
  if (!rawYears) {
    errors.yearsOfExperience = "Enter years of experience.";
  } else {
    const parsed = Number(rawYears);
    if (!Number.isFinite(parsed) || !Number.isInteger(parsed) || parsed < 0 || parsed > 60) {
      errors.yearsOfExperience = "Enter a whole number between 0 and 60.";
    }
  }

  if (profile.workSummary.trim().length < 25) {
    errors.workSummary = "Provide at least 25 characters describing your past work and responsibilities.";
  }

  return errors;
}

export function validateScenarioAnswers(
  questions: ScenarioQuestion[],
  answers: Record<string, string>,
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const q of questions) {
    const value = (answers[q.id] ?? "").trim();
    if (value.length < 20) {
      errors[q.id] = "Write at least 20 characters explaining how you would handle this scenario.";
    }
  }
  return errors;
}