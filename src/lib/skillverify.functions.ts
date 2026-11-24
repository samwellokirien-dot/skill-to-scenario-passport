import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  RUBRIC_CRITERIA,
  getAssessmentDifficulty,
  getCompetencyLevel,
  getQualificationStatus,
  type AssessmentAnalysis,
  type CompetencyPassport,
  type ScenarioScore,
} from "./skillverify-types";
import { calculateOverallScore, calculateWeightedScore, createPassportId } from "./skillverify-scoring";

const evidenceFileSchema = z.object({ id: z.string(), name: z.string(), size: z.number(), type: z.string() });
const profileSchema = z.object({
  profession: z.string().min(1),
  professionOther: z.string(),
  countryOfOrigin: z.string().min(1),
  countryOfQualification: z.string().min(1),
  yearsOfExperience: z.string().min(1),
  rolesHeld: z.string().min(2),
  workSummary: z.string().min(25),
  skills: z.array(z.string()).min(1),
  documentStatus: z.enum(["available", "partial", "lost", "never_issued"]),
  hasInstitutionalVerification: z.boolean(),
  qualificationFiles: z.array(evidenceFileSchema),
  alternativeEvidenceFiles: z.array(evidenceFileSchema),
  alternativeEvidenceNotes: z.string(),
  consent: z.literal(true),
  personaId: z.string().optional(),
});

const mappingSchema = z.object({
  qualificationStatus: z.enum([
    "Documents verified by recognised institution",
    "Documents provided – awaiting verification",
    "Documents unavailable",
    "Experience-based evidence available",
    "Further assessment required",
  ]),
  potentialLocalPathway: z.string(),
  regulatoryBodies: z.array(z.string()).min(1),
  internationalFramework: z.string(),
  indicativeKnqfLevel: z.string(),
  existingQualifications: z.string(),
  previousExperience: z.string(),
  identifiedCompetencies: z.array(z.string()),
  missingDocumentation: z.string(),
  recommendedVerificationProcess: z.string(),
  summaryNote: z.string(),
});

const questionSchema = z.object({
  id: z.string(),
  title: z.string(),
  competencyArea: z.string(),
  scenario: z.string(),
  prompt: z.string(),
  sampleAnswer: z.string(),
  expectedKeywords: z.array(z.string()).min(3),
});

const gradingQuestionSchema = questionSchema.omit({ sampleAnswer: true });
const analyzeInputSchema = z.object({ apiKey: z.string().min(10), profile: profileSchema });
const evaluateInputSchema = z.object({
  apiKey: z.string().min(10),
  profile: profileSchema,
  mapping: mappingSchema,
  questions: z.array(gradingQuestionSchema).length(3),
  answers: z.record(z.string(), z.string()),
});

const criterionSchema = z.object({
  criterion: z.enum(["technicalKnowledge", "problemSolving", "decisionMaking", "safetyCompliance", "professionalCommunication"]),
  score: z.number().min(0).max(100),
  feedback: z.string(),
});
const scenarioScoreSchema = z.object({
  questionId: z.string(),
  criteria: z.array(criterionSchema).length(5),
  strengths: z.array(z.string()),
  gaps: z.array(z.string()),
  feedback: z.string(),
});
const evaluationSchema = z.object({
  scenarioScores: z.array(scenarioScoreSchema).length(3),
  evaluatorSummary: z.string(),
  strengths: z.array(z.string()),
  skillsGaps: z.array(z.string()),
  recommendedTraining: z.array(z.string()),
  bridgingPlan: z.array(z.object({
    week: z.string(),
    sdgTag: z.enum(["SDG 4", "SDG 8"]),
    title: z.string(),
    action: z.string(),
    partnerOrBody: z.string(),
  })).length(4),
});

async function callGeminiJson(apiKey: string, prompt: string): Promise<unknown> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json", temperature: 0.2 },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    if ([400, 401, 403].includes(response.status)) throw new Error("Gemini API key was rejected. Check your key or switch to Demo Mode.");
    if (response.status === 429) throw new Error("Gemini API rate limit reached. Wait a moment or switch to Demo Mode.");
    throw new Error(`Gemini API request failed (${response.status}): ${errorBody.slice(0, 140)}`);
  }

  const payload = (await response.json()) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
  const rawText = payload.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error("Gemini returned an empty response. Please try again.");
  const cleaned = rawText.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
  return JSON.parse(cleaned) as unknown;
}

export const analyzeQualificationFn = createServerFn({ method: "POST" })
  .inputValidator((data) => analyzeInputSchema.parse(data))
  .handler(async ({ data }): Promise<AssessmentAnalysis> => {
    const { apiKey, profile } = data;
    const difficulty = getAssessmentDifficulty(profile.yearsOfExperience);
    const profession = profile.profession === "Other" ? profile.professionOther : profile.profession;
    const prompt = `You are SkillVerify AI for ILO Mini-Hackathon Track 1, supporting skilled refugees in Kenya.
Create a preliminary Recognition of Prior Learning mapping and exactly three practical scenarios for this candidate:
${JSON.stringify(profile)}

Rules:
- The exact profession is ${profession}; all three scenarios must test this profession, never a different one.
- Calibrate scenario complexity to ${difficulty} difficulty for ${profile.yearsOfExperience} years of experience.
- Use realistic Kenyan or East African workplaces and complex constraints.
- NEVER say a foreign qualification is officially equivalent. Use only "potential qualification pathway" language.
- Refer to actual relevant Kenyan bodies such as NCK for nursing, EBK for engineering, TSC for teaching, ICPAK/KASNEB for accounting, EPRA/NITA for electricians, and KNQA/TVETA where relevant.
- RPL means assessing learning from experience through portfolios, references, and practical demonstrations; it does not itself grant a licence.
- Uploaded items are file metadata only and have not been verified.

Return ONLY JSON with this exact shape:
{
  "mapping": {
    "qualificationStatus": "Documents verified by recognised institution" | "Documents provided – awaiting verification" | "Documents unavailable" | "Experience-based evidence available" | "Further assessment required",
    "potentialLocalPathway": "string",
    "regulatoryBodies": ["string"],
    "internationalFramework": "string without equivalency claims",
    "indicativeKnqfLevel": "string clearly subject to KNQA decision",
    "existingQualifications": "string",
    "previousExperience": "string",
    "identifiedCompetencies": ["string"],
    "missingDocumentation": "string",
    "recommendedVerificationProcess": "string including RPL where documents are missing",
    "summaryNote": "string with preliminary human-review disclaimer"
  },
  "questions": [
    {"id":"q1","title":"string","competencyArea":"string","scenario":"string","prompt":"string","sampleAnswer":"strong profession-specific model answer","expectedKeywords":["technical","terms","for","grading"]},
    {"id":"q2","title":"string","competencyArea":"string","scenario":"string","prompt":"string","sampleAnswer":"string","expectedKeywords":["string"]},
    {"id":"q3","title":"string","competencyArea":"string","scenario":"string","prompt":"string","sampleAnswer":"string","expectedKeywords":["string"]}
  ]
}`;

    const parsed = z.object({ mapping: mappingSchema, questions: z.array(questionSchema).length(3) }).parse(await callGeminiJson(apiKey, prompt));
    return {
      mapping: {
        ...parsed.mapping,
        qualificationStatus: getQualificationStatus(profile),
        identifiedCompetencies: profile.skills,
        summaryNote: `${parsed.mapping.summaryNote} This is not an official equivalency, recognition, or licensing decision.`,
      },
      questions: parsed.questions,
      difficulty,
      source: "gemini",
    };
  });

export const evaluateAssessmentFn = createServerFn({ method: "POST" })
  .inputValidator((data) => evaluateInputSchema.parse(data))
  .handler(async ({ data }): Promise<CompetencyPassport> => {
    const { apiKey, profile, mapping, questions, answers } = data;
    const qaTranscript = questions.map((question, index) => `Scenario ${index + 1} (${question.competencyArea} — ${question.title}):\nContext: ${question.scenario}\nPrompt: ${question.prompt}\nExpected technical concepts: ${question.expectedKeywords.join(", ")}\nCandidate Answer: ${answers[question.id] ?? ""}`).join("\n\n");
    const profession = profile.profession === "Other" ? profile.professionOther : profile.profession;
    const prompt = `You are a cautious human-review-support assessor evaluating a displaced ${profession}'s written practical reasoning.
Potential pathway only: ${mapping.potentialLocalPathway}. This is not an official qualification or licence.

${qaTranscript}

Grade only evidence in each answer. Do not award 100 automatically and do not infer competence from years of experience.
Score every scenario against all five criteria:
- technicalKnowledge weight 30%
- problemSolving weight 25%
- decisionMaking weight 20%
- safetyCompliance weight 15%
- professionalCommunication weight 10%
Short, vague, incomplete, or technically inaccurate answers must receive low scores. Give actionable feedback grounded in the answer.

Return ONLY valid JSON:
{
  "scenarioScores": [
    {"questionId":"q1","criteria":[{"criterion":"technicalKnowledge","score":0,"feedback":"string"},{"criterion":"problemSolving","score":0,"feedback":"string"},{"criterion":"decisionMaking","score":0,"feedback":"string"},{"criterion":"safetyCompliance","score":0,"feedback":"string"},{"criterion":"professionalCommunication","score":0,"feedback":"string"}],"strengths":["string"],"gaps":["string"],"feedback":"string"},
    {"questionId":"q2","criteria":[],"strengths":[],"gaps":[],"feedback":"string"},
    {"questionId":"q3","criteria":[],"strengths":[],"gaps":[],"feedback":"string"}
  ],
  "evaluatorSummary":"string",
  "strengths":["string"],
  "skillsGaps":["string"],
  "recommendedTraining":["string"],
  "bridgingPlan":[
    {"week":"Week 1 (Days 1–7)","sdgTag":"SDG 4","title":"Documentation review and recognition pathway","action":"string personalised to ${profile.countryOfQualification}","partnerOrBody":"string"},
    {"week":"Week 2 (Days 8–14)","sdgTag":"SDG 4","title":"Targeted bridging","action":"string tied to identified gaps","partnerOrBody":"string"},
    {"week":"Week 3 (Days 15–21)","sdgTag":"SDG 8","title":"Supervised practical evaluation","action":"string tied to weakest scenario","partnerOrBody":"string"},
    {"week":"Week 4 (Days 22–30)","sdgTag":"SDG 8","title":"Registration and employment readiness","action":"string","partnerOrBody":"string"}
  ]
}
Populate all criteria arrays fully for q2 and q3 as for q1.`;

    const parsed = evaluationSchema.parse(await callGeminiJson(apiKey, prompt));
    const scenarioScores: ScenarioScore[] = parsed.scenarioScores.map((scenario) => {
      const sourceQuestion = questions.find((question) => question.id === scenario.questionId);
      if (!sourceQuestion) throw new Error("Gemini returned a scenario identifier that was not assessed.");
      const criteria = RUBRIC_CRITERIA.map((rubric) => {
        const result = scenario.criteria.find((criterion) => criterion.criterion === rubric.key);
        if (!result) throw new Error("Gemini omitted a required rubric criterion.");
        return { criterion: rubric.key, label: rubric.label, weight: rubric.weight, score: Math.round(result.score), feedback: result.feedback };
      });
      return {
        questionId: scenario.questionId,
        title: sourceQuestion.title,
        competencyArea: sourceQuestion.competencyArea,
        score: calculateWeightedScore(criteria),
        criteria,
        strengths: scenario.strengths,
        gaps: scenario.gaps,
        feedback: scenario.feedback,
      };
    });
    const overallScore = calculateOverallScore(scenarioScores);
    const validatedSkills = scenarioScores.filter((scenario) => scenario.score >= 55).map((scenario) => ({
      skill: scenario.competencyArea,
      proficiency: getCompetencyLevel(scenario.score),
      evidence: scenario.strengths[0] ?? scenario.feedback,
    }));

    return {
      passportId: createPassportId(),
      issuedAt: new Date().toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" }),
      competencyLevel: getCompetencyLevel(overallScore),
      overallScore,
      evaluatorSummary: `${parsed.evaluatorSummary} This remains a preliminary AI-assisted assessment requiring human verification.`,
      scenarioScores,
      strengths: parsed.strengths,
      competenciesDemonstrated: validatedSkills.map((skill) => skill.skill),
      skillsGaps: parsed.skillsGaps,
      recommendedTraining: parsed.recommendedTraining,
      validatedSkills,
      bridgingPlan: parsed.bridgingPlan,
      source: "gemini",
    };
  });
