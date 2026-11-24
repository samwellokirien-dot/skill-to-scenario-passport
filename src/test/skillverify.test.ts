import { describe, expect, it } from "vitest";
import {
  SAMPLE_PERSONAS,
  evaluateDemoAssessment,
  generateDemoAnalysis,
} from "@/lib/skillverify-demo";
import {
  validateCandidateProfile,
  validateScenarioAnswers,
  type CandidateProfile,
} from "@/lib/skillverify-types";

describe("SkillVerify AI domain rules", () => {
  it("rejects empty, negative, and out-of-range profile inputs", () => {
    const invalid: CandidateProfile = {
      profession: "",
      countryOfOrigin: "",
      yearsOfExperience: "-3",
      workSummary: "short",
      documentsLost: true,
    };

    const errors = validateCandidateProfile(invalid);
    expect(errors.profession).toBeDefined();
    expect(errors.countryOfOrigin).toBeDefined();
    expect(errors.yearsOfExperience).toBeDefined();
    expect(errors.workSummary).toBeDefined();

    const tooHigh = validateCandidateProfile({
      ...invalid,
      profession: "Civil Engineer",
      countryOfOrigin: "Syria",
      yearsOfExperience: "99",
      workSummary: "Led structural site supervision and concrete QA/QC across municipal projects.",
    });
    expect(tooHigh.yearsOfExperience).toBeDefined();
  });

  it("includes both required sample personas and generates 3 practical scenarios", () => {
    expect(SAMPLE_PERSONAS).toHaveLength(2);
    const syriaEngineer = SAMPLE_PERSONAS[0];
    const sudanNurse = SAMPLE_PERSONAS[1];
    expect(syriaEngineer?.profile.countryOfOrigin).toBe("Syria");
    expect(sudanNurse?.profile.countryOfOrigin).toBe("South Sudan");

    if (!syriaEngineer || !sudanNurse) throw new Error("Missing sample personas");

    const engAnalysis = generateDemoAnalysis(syriaEngineer.profile);
    expect(engAnalysis.questions).toHaveLength(3);
    expect(engAnalysis.translation.kenyanAuthority).toContain("EBK");
    expect(engAnalysis.translation.recognitionPathway).toContain("RPL");

    const nurseAnalysis = generateDemoAnalysis(sudanNurse.profile);
    expect(nurseAnalysis.questions).toHaveLength(3);
    expect(nurseAnalysis.translation.kenyanAuthority).toContain("NCK");
  });

  it("evaluates practical responses into a Competency Passport with SDG 4 and SDG 8 bridging steps", () => {
    const syriaEngineer = SAMPLE_PERSONAS[0];
    if (!syriaEngineer) throw new Error("Missing sample persona");

    const analysis = generateDemoAnalysis(syriaEngineer.profile);
    const emptyErrors = validateScenarioAnswers(analysis.questions, {});
    expect(Object.keys(emptyErrors)).toHaveLength(3);

    const strongAnswers: Record<string, string> = {};
    for (const q of analysis.questions) {
      strongAnswers[q.id] = q.sampleAnswer;
    }
    expect(validateScenarioAnswers(analysis.questions, strongAnswers)).toEqual({});

    const passport = evaluateDemoAssessment(syriaEngineer.profile, analysis, strongAnswers);
    expect(passport.competencyLevel).toBe("Senior");
    expect(passport.validatedSkills).toHaveLength(3);
    expect(passport.bridgingPlan).toHaveLength(4);
    expect(passport.bridgingPlan.some((m) => m.sdgTag === "SDG 4")).toBe(true);
    expect(passport.bridgingPlan.some((m) => m.sdgTag === "SDG 8")).toBe(true);
  });
});