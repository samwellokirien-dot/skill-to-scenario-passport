import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { AssessmentAnalysis, CompetencyPassport } from "./skillverify-types";

const profileSchema = z.object({
  profession: z.string().min(1),
  countryOfOrigin: z.string().min(1),
  yearsOfExperience: z.string().min(1),
  workSummary: z.string().min(10),
  documentsLost: z.boolean(),
});

const analyzeInputSchema = z.object({
  apiKey: z.string().min(10),
  profile: profileSchema,
});

const evaluateInputSchema = z.object({
  apiKey: z.string().min(10),
  profile: profileSchema,
  translation: z.object({
    kenyanEquivalent: z.string(),
    kenyanAuthority: z.string(),
    internationalEquivalent: z.string(),
    knqfLevel: z.string(),
    recognitionPathway: z.string(),
    summaryNote: z.string(),
  }),
  questions: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      competencyArea: z.string(),
      scenario: z.string(),
      prompt: z.string(),
    }),
  ),
  answers: z.record(z.string(), z.string()),
});

async function callGeminiJson<T>(apiKey: string, prompt: string): Promise<T> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.3,
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    if (response.status === 400 || response.status === 401 || response.status === 403) {
      throw new Error("Gemini API key was rejected. Check your key or switch to Demo Mode.");
    }
    if (response.status === 429) {
      throw new Error("Gemini API rate limit reached. Wait a moment or switch to Demo Mode.");
    }
    throw new Error(`Gemini API request failed (${response.status}): ${errorBody.slice(0, 140)}`);
  }

  const payload = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const rawText = payload.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) {
    throw new Error("Gemini returned an empty response. Please try again.");
  }

  const cleaned = rawText.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
  return JSON.parse(cleaned) as T;
}

export const analyzeQualificationFn = createServerFn({ method: "POST" })
  .inputValidator((data) => analyzeInputSchema.parse(data))
  .handler(async ({ data }): Promise<AssessmentAnalysis> => {
    const { apiKey, profile } = data;
    const prompt = `You are SkillVerify AI for the ILO Mini-Hackathon (Track 1: Credential Recognition & Skills Validation for Skilled Refugees in Kenya).
Analyze this candidate profile:
- Claimed Profession: ${profile.profession}
- Country of Origin: ${profile.countryOfOrigin}
- Years of Experience: ${profile.yearsOfExperience}
- Physical Documents Lost/Unavailable: ${profile.documentsLost ? "Yes (use KNQA RPL / UNESCO Qualifications Passport pathway)" : "No"}
- Work Summary: ${profile.workSummary}

Return ONLY valid JSON matching this exact shape:
{
  "translation": {
    "kenyanEquivalent": "string (specific Kenyan qualification/title)",
    "kenyanAuthority": "string (relevant Kenyan regulatory body e.g. KNQA, EBK, NCK, TVETA)",
    "internationalEquivalent": "string (ISCED / EQF international equivalent)",
    "knqfLevel": "string (e.g. KNQF Level 7)",
    "recognitionPathway": "string (recommended recognition pathway)",
    "summaryNote": "string (1-2 sentence translation summary)"
  },
  "questions": [
    {
      "id": "q1",
      "title": "string",
      "competencyArea": "string",
      "scenario": "string (realistic field scenario in Kenya/East Africa)",
      "prompt": "string (clear question asking how they handle it)",
      "sampleAnswer": "string (strong model answer)",
      "expectedKeywords": ["string", "string", "string"]
    }
  ]
}
Generate exactly 3 distinct, practical scenario-based technical questions (ids "q1", "q2", "q3").`;

    const parsed = await callGeminiJson<Omit<AssessmentAnalysis, "source">>(apiKey, prompt);
    if (!parsed.translation || !Array.isArray(parsed.questions) || parsed.questions.length !== 3) {
      throw new Error("Gemini returned an unexpected assessment structure. Please retry.");
    }
    return { ...parsed, source: "gemini" };
  });

export const evaluateAssessmentFn = createServerFn({ method: "POST" })
  .inputValidator((data) => evaluateInputSchema.parse(data))
  .handler(async ({ data }): Promise<CompetencyPassport> => {
    const { apiKey, profile, translation, questions, answers } = data;
    const qaTranscript = questions
      .map(
        (q, i) =>
          `Scenario ${i + 1} (${q.competencyArea} — ${q.title}):\nContext: ${q.scenario}\nPrompt: ${q.prompt}\nCandidate Answer: ${answers[q.id] ?? ""}`,
      )
      .join("\n\n");

    const prompt = `You are SkillVerify AI evaluating a displaced professional's practical competency for an ILO Verified AI Competency Passport.
Candidate: ${profile.profession} from ${profile.countryOfOrigin}, ${profile.yearsOfExperience} years experience.
Kenyan Equivalent: ${translation.kenyanEquivalent} (${translation.kenyanAuthority}).
Physical Documents Lost: ${profile.documentsLost ? "Yes" : "No"}.

Candidate Scenario Responses:
${qaTranscript}

Grade their practical reasoning fairly and return ONLY valid JSON matching this exact shape:
{
  "competencyLevel": "Emerging" | "Competent" | "Senior",
  "overallScore": 0-100 integer,
  "evaluatorSummary": "string (2 sentences summarizing practical reasoning)",
  "validatedSkills": [
    {
      "skill": "string",
      "proficiency": "Emerging" | "Competent" | "Senior",
      "evidence": "string (1 sentence grounded in their answer)"
    }
  ],
  "bridgingPlan": [
    {
      "week": "Week 1 (Days 1–7)",
      "sdgTag": "SDG 4" | "SDG 8",
      "title": "string",
      "action": "string",
      "partnerOrBody": "string (Kenyan/UN/ILO body)"
    }
  ]
}
Include 3 validatedSkills (one per scenario) and 4 weekly milestones in bridgingPlan covering both SDG 4 and SDG 8 across 30 days.`;

    const parsed = await callGeminiJson<Omit<CompetencyPassport, "passportId" | "issuedAt" | "source">>(
      apiKey,
      prompt,
    );

    const validLevels = new Set(["Emerging", "Competent", "Senior"]);
    const competencyLevel = validLevels.has(parsed.competencyLevel) ? parsed.competencyLevel : "Competent";
    const score = Math.max(0, Math.min(100, Math.round(Number(parsed.overallScore) || 75)));
    const codeSuffix = String(Date.now()).slice(-5);

    return {
      passportId: `SV-ILO-2026-${codeSuffix}`,
      issuedAt: new Date().toLocaleDateString("en-KE", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      competencyLevel,
      overallScore: score,
      evaluatorSummary: parsed.evaluatorSummary,
      validatedSkills: parsed.validatedSkills,
      bridgingPlan: parsed.bridgingPlan,
      source: "gemini",
    };
  });