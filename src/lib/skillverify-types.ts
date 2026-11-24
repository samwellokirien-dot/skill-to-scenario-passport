export type WorkflowStep = 1 | 2 | 3;
export type Language = "en" | "fr" | "ar";
export type CompetencyLevel = "Emerging" | "Developing" | "Competent" | "Proficient";
export type AssessmentSource = "demo" | "gemini";
export type DocumentStatus = "" | "available" | "partial" | "lost" | "never_issued";

export type QualificationStatus =
  | "Documents verified by recognised institution"
  | "Documents provided – awaiting verification"
  | "Documents unavailable"
  | "Experience-based evidence available"
  | "Further assessment required";

export interface EvidenceFile {
  id: string;
  name: string;
  size: number;
  type: string;
}

export interface CandidateProfile {
  profession: string;
  professionOther: string;
  countryOfOrigin: string;
  countryOfQualification: string;
  yearsOfExperience: string;
  rolesHeld: string;
  workSummary: string;
  skills: string[];
  documentStatus: DocumentStatus;
  hasInstitutionalVerification: boolean;
  qualificationFiles: EvidenceFile[];
  alternativeEvidenceFiles: EvidenceFile[];
  alternativeEvidenceNotes: string;
  consent: boolean;
  personaId?: string;
}

export interface QualificationMapping {
  qualificationStatus: QualificationStatus;
  potentialLocalPathway: string;
  regulatoryBodies: string[];
  internationalFramework: string;
  indicativeKnqfLevel: string;
  existingQualifications: string;
  previousExperience: string;
  identifiedCompetencies: string[];
  missingDocumentation: string;
  recommendedVerificationProcess: string;
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
  mapping: QualificationMapping;
  questions: ScenarioQuestion[];
  difficulty: "Foundational" | "Intermediate" | "Advanced";
  source: AssessmentSource;
}

export type RubricCriterionKey =
  | "technicalKnowledge"
  | "problemSolving"
  | "decisionMaking"
  | "safetyCompliance"
  | "professionalCommunication";

export const RUBRIC_CRITERIA: Array<{
  key: RubricCriterionKey;
  label: string;
  weight: number;
  description: string;
}> = [
  {
    key: "technicalKnowledge",
    label: "Technical Knowledge",
    weight: 30,
    description: "Correct methods, technical concepts, measurements, and profession-specific standards.",
  },
  {
    key: "problemSolving",
    label: "Problem-Solving Ability",
    weight: 25,
    description: "Systematic diagnosis, evidence gathering, options, and verification of the solution.",
  },
  {
    key: "decisionMaking",
    label: "Decision-Making",
    weight: 20,
    description: "Prioritisation, justified choices, escalation, and response to constraints.",
  },
  {
    key: "safetyCompliance",
    label: "Safety & Compliance Procedures",
    weight: 15,
    description: "Risk controls, ethics, regulation, documentation, and protection of people or data.",
  },
  {
    key: "professionalCommunication",
    label: "Professional Communication",
    weight: 10,
    description: "Clear handover, stakeholder communication, teamwork, and usable records.",
  },
];

export interface ScenarioCriterionScore {
  criterion: RubricCriterionKey;
  label: string;
  weight: number;
  score: number;
  feedback: string;
}

export interface ScenarioScore {
  questionId: string;
  title: string;
  competencyArea: string;
  score: number;
  criteria: ScenarioCriterionScore[];
  strengths: string[];
  gaps: string[];
  feedback: string;
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
  scenarioScores: ScenarioScore[];
  strengths: string[];
  competenciesDemonstrated: string[];
  skillsGaps: string[];
  recommendedTraining: string[];
  validatedSkills: ValidatedSkill[];
  bridgingPlan: BridgingMilestone[];
  source: AssessmentSource;
}

export interface ProfileValidationErrors {
  profession?: string;
  professionOther?: string;
  countryOfOrigin?: string;
  countryOfQualification?: string;
  yearsOfExperience?: string;
  rolesHeld?: string;
  workSummary?: string;
  skills?: string;
  documentStatus?: string;
  consent?: string;
}

export function getCompetencyLevel(score: number): CompetencyLevel {
  if (score >= 85) return "Proficient";
  if (score >= 65) return "Competent";
  if (score >= 45) return "Developing";
  return "Emerging";
}

export function getAssessmentDifficulty(yearsOfExperience: string): AssessmentAnalysis["difficulty"] {
  const years = Number(yearsOfExperience);
  if (years >= 6) return "Advanced";
  if (years >= 2) return "Intermediate";
  return "Foundational";
}

export function getQualificationStatus(profile: CandidateProfile): QualificationStatus {
  const hasQualificationFiles = profile.qualificationFiles.length > 0;
  const hasAlternativeEvidence =
    profile.alternativeEvidenceFiles.length > 0 || profile.alternativeEvidenceNotes.trim().length >= 10;

  if (profile.hasInstitutionalVerification && hasQualificationFiles) {
    return "Documents verified by recognised institution";
  }
  if (hasQualificationFiles) return "Documents provided – awaiting verification";
  if (profile.documentStatus === "lost" && !hasAlternativeEvidence) return "Documents unavailable";
  if (hasAlternativeEvidence) return "Experience-based evidence available";
  return "Further assessment required";
}

export function validateCandidateProfile(profile: CandidateProfile): ProfileValidationErrors {
  const errors: ProfileValidationErrors = {};

  if (!profile.profession.trim()) errors.profession = "Select your claimed profession.";
  if (profile.profession === "Other" && !profile.professionOther.trim()) {
    errors.professionOther = "Describe your profession.";
  }
  if (!profile.countryOfOrigin.trim()) errors.countryOfOrigin = "Enter your country of origin.";
  if (!profile.countryOfQualification.trim()) {
    errors.countryOfQualification = "Enter the country where your qualifications were obtained.";
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

  if (profile.rolesHeld.trim().length < 2) errors.rolesHeld = "List at least one specific role held.";
  if (profile.workSummary.trim().length < 25) {
    errors.workSummary = "Provide at least 25 characters covering responsibilities, tools, and achievements.";
  }
  if (profile.skills.length === 0) errors.skills = "Add at least one technical, professional, or transferable skill.";
  if (!profile.documentStatus) errors.documentStatus = "Select your document availability status.";
  if (!profile.consent) errors.consent = "Consent is required before the preliminary assessment can run.";

  return errors;
}

export function validateScenarioAnswers(
  questions: ScenarioQuestion[],
  answers: Record<string, string>,
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const question of questions) {
    const value = (answers[question.id] ?? "").trim();
    if (value.length < 20) {
      errors[question.id] = "Write at least 20 characters explaining how you would handle this scenario.";
    }
  }
  return errors;
}
