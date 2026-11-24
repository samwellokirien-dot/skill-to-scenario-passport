import type {
  AssessmentAnalysis,
  BridgingMilestone,
  CandidateProfile,
  CompetencyPassport,
  QualificationMapping,
} from "./skillverify-types";
import {
  getAssessmentDifficulty,
  getCompetencyLevel,
  getQualificationStatus,
} from "./skillverify-types";
import { getProfessionGuidance } from "./skillverify-professions";
import { generateProfessionScenarios } from "./skillverify-scenarios";
import {
  createPassportId,
  scoreDemoScenario,
  summariseDemoEvaluation,
} from "./skillverify-scoring";

export interface SamplePersona {
  id: string;
  label: string;
  profile: CandidateProfile;
}

export const SAMPLE_PERSONAS: SamplePersona[] = [
  {
    id: "syria-civil-engineer",
    label: "Civil Engineer · Syria · lost documents · 8 yrs",
    profile: {
      personaId: "syria-civil-engineer",
      profession: "Civil Engineer",
      professionOther: "",
      countryOfOrigin: "Syria",
      countryOfQualification: "Syria",
      yearsOfExperience: "8",
      rolesHeld: "Site Civil Engineer; Structural QA/QC Lead; Municipal Drainage Supervisor",
      workSummary: "Led structural inspection, reinforced concrete verification, and municipal drainage rehabilitation in Aleppo and Damascus. Managed crews of 35+, reviewed AutoCAD drawings, used levels and testing equipment, prepared bills of quantities, and improved concrete rejection and QA/QC reporting.",
      skills: ["Structural inspection", "AutoCAD", "Concrete QA/QC", "Site safety", "Team leadership", "Client reporting"],
      documentStatus: "lost",
      hasInstitutionalVerification: false,
      qualificationFiles: [],
      alternativeEvidenceFiles: [
        { id: "eng-portfolio", name: "Aleppo_site_supervision_portfolio.pdf", size: 1_840_000, type: "application/pdf" },
      ],
      alternativeEvidenceNotes: "Two former project managers available for reference checks; site diary photographs and a displacement attestation are available.",
      consent: true,
    },
  },
  {
    id: "south-sudan-nurse",
    label: "Registered Nurse · South Sudan · partial transcripts · 6 yrs",
    profile: {
      personaId: "south-sudan-nurse",
      profession: "Registered Nurse",
      professionOther: "",
      countryOfOrigin: "South Sudan",
      countryOfQualification: "South Sudan",
      yearsOfExperience: "6",
      rolesHeld: "Emergency Nurse; Primary Health Clinic Shift Lead; Immunisation Officer",
      workSummary: "Provided emergency triage, inpatient stabilisation, maternal-child immunisation, and infection prevention at Juba Teaching Hospital and regional clinics. Used patient monitors and cold-chain equipment, trained community health volunteers, and improved vaccine stock recording across two clinics.",
      skills: ["Emergency triage", "IV therapy", "Cold-chain management", "Infection prevention", "SBAR handover", "Patient education"],
      documentStatus: "partial",
      hasInstitutionalVerification: false,
      qualificationFiles: [
        { id: "nurse-transcript", name: "Juba_nursing_partial_transcript.pdf", size: 920_000, type: "application/pdf" },
      ],
      alternativeEvidenceFiles: [],
      alternativeEvidenceNotes: "Original diploma remains unavailable; former shift supervisor can confirm clinical roles and dates.",
      consent: true,
    },
  },
  {
    id: "drc-software-developer",
    label: "Software Developer · DRC · portfolio evidence · 4 yrs",
    profile: {
      personaId: "drc-software-developer",
      profession: "Software Developer",
      professionOther: "",
      countryOfOrigin: "Democratic Republic of the Congo",
      countryOfQualification: "Democratic Republic of the Congo",
      yearsOfExperience: "4",
      rolesHeld: "Full-Stack Developer; Junior Technical Lead; Community Digital Trainer",
      workSummary: "Built payment and case-management web applications using TypeScript, React, Node.js, PostgreSQL, and REST APIs. Debugged production incidents, introduced automated tests, improved a slow reporting query, and mentored four junior developers in a community technology programme.",
      skills: ["TypeScript", "React", "PostgreSQL", "REST API design", "Debugging", "Technical mentoring"],
      documentStatus: "never_issued",
      hasInstitutionalVerification: false,
      qualificationFiles: [],
      alternativeEvidenceFiles: [
        { id: "dev-portfolio", name: "DRC_fullstack_project_portfolio.pdf", size: 2_140_000, type: "application/pdf" },
      ],
      alternativeEvidenceNotes: "Public code samples and two deployed project demonstrations are available; former technical lead can provide a reference.",
      consent: true,
    },
  },
];

function buildMapping(profile: CandidateProfile): QualificationMapping {
  const profession = profile.profession === "Other" ? profile.professionOther.trim() : profile.profession;
  const guidance = getProfessionGuidance(profile.profession);
  const qualificationStatus = getQualificationStatus(profile);
  const documentDescription = {
    available: "Certificates, transcripts, or licences are reported as available",
    partial: "Only part of the qualification record is available",
    lost: "Original documents are reported lost or destroyed during displacement",
    never_issued: "No formal qualification document was issued for the claimed learning",
    "": "Document availability has not been confirmed",
  }[profile.documentStatus];

  const missingDocumentation = profile.documentStatus === "available" && profile.qualificationFiles.length > 0
    ? "Institutional authenticity checks, complete transcripts where applicable, and regulatory verification remain outstanding."
    : profile.documentStatus === "partial"
      ? "Missing certificates, complete transcripts, licence history, or issuing-institution confirmation must be identified and requested."
      : profile.documentStatus === "lost"
        ? "Original academic or licensing records are unavailable; obtain certified copies where possible and assemble alternative evidence."
        : profile.documentStatus === "never_issued"
          ? "No issued credential is claimed; evidence of learning outcomes and supervised practice must be assembled for RPL review."
          : "A document inventory and issuing-institution verification are required.";

  const recommendedVerificationProcess = profile.documentStatus === "lost" || profile.documentStatus === "never_issued"
    ? `Use Recognition of Prior Learning (RPL): build a portfolio of work samples, references, role history, and practical demonstrations, then seek review through KNQA and ${guidance.regulatoryBodies[0]}. RPL can recognise learning from experience; it does not itself grant a statutory licence.`
    : `Request direct confirmation from issuing institutions in ${profile.countryOfQualification}, then seek KNQA recognition review and assessment by ${guidance.regulatoryBodies[0]}. Uploaded file names in this prototype are not verification; original documents and human review are required.`;

  return {
    qualificationStatus,
    potentialLocalPathway: guidance.potentialLocalPathway,
    regulatoryBodies: guidance.regulatoryBodies,
    internationalFramework: guidance.internationalFramework,
    indicativeKnqfLevel: guidance.indicativeKnqfLevel,
    existingQualifications: `${documentDescription}. Qualification country: ${profile.countryOfQualification}. ${profile.qualificationFiles.length} qualification file(s) listed; contents not verified.`,
    previousExperience: `${profile.yearsOfExperience} years reported as ${profile.rolesHeld}. Experience summary covers responsibilities, tools, and achievements in ${profile.countryOfOrigin}.`,
    identifiedCompetencies: profile.skills,
    missingDocumentation,
    recommendedVerificationProcess,
    summaryNote: `This is a potential pathway for a ${profession}, not an official equivalency finding. ${guidance.regulatoryBodies.join(" and ")} must determine recognition, registration, licensing, and any examinations.`,
  };
}

export function generateDemoAnalysis(profile: CandidateProfile): AssessmentAnalysis {
  return {
    source: "demo",
    difficulty: getAssessmentDifficulty(profile.yearsOfExperience),
    mapping: buildMapping(profile),
    questions: generateProfessionScenarios(profile),
  };
}

function buildDevelopmentPlan(
  profile: CandidateProfile,
  analysis: AssessmentAnalysis,
  passportScores: ReturnType<typeof scoreDemoScenario>[],
  skillsGaps: string[],
): BridgingMilestone[] {
  const guidance = getProfessionGuidance(profile.profession);
  const weakestCriteria = [...new Set(
    passportScores
      .flatMap((scenario) => scenario.criteria)
      .filter((criterion) => criterion.score < 65)
      .map((criterion) => criterion.label.toLowerCase()),
  )].slice(0, 3);
  const weakestScenario = [...passportScores].sort((a, b) => a.score - b.score)[0];
  const gapFocus = weakestCriteria.length > 0 ? weakestCriteria.join(", ") : "Kenyan standards, local regulation, and advanced professional practice";

  return [
    {
      week: "Week 1 (Days 1–7)",
      sdgTag: "SDG 4",
      title: "Documentation Review & Recognition Pathway Identification",
      action: `Review the ${profile.countryOfQualification} qualification record, request missing institutional evidence, and open a recognition or RPL enquiry. Current classification: ${analysis.mapping.qualificationStatus}.`,
      partnerOrBody: `KNQA / ${analysis.mapping.regulatoryBodies[0]}`,
    },
    {
      week: "Week 2 (Days 8–14)",
      sdgTag: "SDG 4",
      title: "Targeted Bridging & Gap-Closing Modules",
      action: `Complete supervised learning focused on ${gapFocus}. Use practical exercises tied directly to the assessment feedback and retain evidence of completion.`,
      partnerOrBody: guidance.trainingInstitution,
    },
    {
      week: "Week 3 (Days 15–21)",
      sdgTag: "SDG 8",
      title: "Practical Preparation & Supervised Professional Evaluation",
      action: `Reattempt and demonstrate ${weakestScenario?.competencyArea ?? "the priority professional competency"} under observation. Address ${skillsGaps[0] ?? "local verification requirements"} and obtain written human-assessor feedback.`,
      partnerOrBody: `${analysis.mapping.regulatoryBodies[0]} / recognised assessment centre`,
    },
    {
      week: "Week 4 (Days 22–30)",
      sdgTag: "SDG 8",
      title: "Registration Guidance, Portfolio & Employment Readiness",
      action: "Update the portfolio with verified evidence, scenario feedback, training records, references, and a CV. Confirm registration or licensing requirements directly before representing yourself as registered, then share this preliminary report for employer review.",
      partnerOrBody: `${analysis.mapping.regulatoryBodies[0]} / ILO PROSPECTS Kenya / Refugee Affairs Secretariat`,
    },
  ];
}

export function evaluateDemoAssessment(
  profile: CandidateProfile,
  analysis: AssessmentAnalysis,
  answers: Record<string, string>,
): CompetencyPassport {
  const scenarioScores = analysis.questions.map((question) =>
    scoreDemoScenario(question, answers[question.id] ?? ""),
  );
  const summary = summariseDemoEvaluation(scenarioScores);
  const validatedSkills = scenarioScores
    .filter((scenario) => scenario.score >= 55)
    .map((scenario) => ({
      skill: scenario.competencyArea,
      proficiency: getCompetencyLevel(scenario.score),
      evidence: scenario.strengths[0] ?? "Some practical evidence was provided; supervised confirmation remains necessary.",
    }));
  const recommendedTraining = [
    ...summary.recommendedTraining,
    `Complete Kenyan regulatory and workplace standards orientation with ${getProfessionGuidance(profile.profession).trainingInstitution}.`,
  ];
  const bridgingPlan = buildDevelopmentPlan(profile, analysis, scenarioScores, summary.skillsGaps);

  return {
    passportId: createPassportId(),
    issuedAt: new Date().toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" }),
    competencyLevel: summary.competencyLevel,
    overallScore: summary.overallScore,
    evaluatorSummary: `${profile.profession === "Other" ? profile.professionOther : profile.profession} responses produced a preliminary ${summary.competencyLevel.toLowerCase()} rating from weighted evidence across three scenarios. ${summary.skillsGaps.length > 0 ? "Identified gaps should be addressed before supervised reassessment." : "All rubric areas show evidence, but supervised human verification is still required."}`,
    scenarioScores,
    strengths: summary.strengths,
    competenciesDemonstrated: validatedSkills.map((skill) => skill.skill),
    skillsGaps: summary.skillsGaps,
    recommendedTraining,
    validatedSkills,
    bridgingPlan,
    source: "demo",
  };
}
