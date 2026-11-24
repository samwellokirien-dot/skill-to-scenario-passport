import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { StepIndicator } from "@/components/StepIndicator";
import { Step1Mapper } from "@/components/Step1Mapper";
import { Step2Assessment } from "@/components/Step2Assessment";
import { Step3Passport } from "@/components/Step3Passport";
import {
  SAMPLE_PERSONAS,
  evaluateDemoAssessment,
  generateDemoAnalysis,
} from "@/lib/skillverify-demo";
import { analyzeQualificationFn, evaluateAssessmentFn } from "@/lib/skillverify.functions";
import {
  validateCandidateProfile,
  validateScenarioAnswers,
  type AssessmentAnalysis,
  type CandidateProfile,
  type CompetencyPassport,
  type ProfileValidationErrors,
  type WorkflowStep,
} from "@/lib/skillverify-types";

const STORAGE_KEY = "skillverify-ai-state-v1";
const API_KEY_STORAGE = "skillverify-gemini-api-key";

const EMPTY_PROFILE: CandidateProfile = {
  profession: "",
  countryOfOrigin: "",
  yearsOfExperience: "",
  workSummary: "",
  documentsLost: false,
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SkillVerify AI — Refugee Credential Recognition & Competency Passport" },
      {
        name: "description",
        content:
          "ILO Mini-Hackathon Track 1: Translate foreign qualifications into Kenyan and international equivalents, complete practical scenarios, and earn a Verified AI Competency Passport.",
      },
      { property: "og:title", content: "SkillVerify AI — Verified Competency Passport" },
      {
        property: "og:description",
        content:
          "3-step credential recognition and practical skills validation for skilled refugees aligned with SDG 4 and SDG 8.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SkillVerifyApp,
});

function SkillVerifyApp() {
  const [hydrated, setHydrated] = useState(false);
  const [demoMode, setDemoMode] = useState(true);
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [step, setStep] = useState<WorkflowStep>(1);
  const [profile, setProfile] = useState<CandidateProfile>(EMPTY_PROFILE);
  const [profileErrors, setProfileErrors] = useState<ProfileValidationErrors>({});
  const [analysis, setAnalysis] = useState<AssessmentAnalysis | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [answerErrors, setAnswerErrors] = useState<Record<string, string>>({});
  const [passport, setPassport] = useState<CompetencyPassport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const runAnalyzeFn = useServerFn(analyzeQualificationFn);
  const runEvaluateFn = useServerFn(evaluateAssessmentFn);

  useEffect(() => {
    try {
      const savedKey = window.localStorage.getItem(API_KEY_STORAGE);
      if (savedKey) setGeminiApiKey(savedKey);

      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          demoMode?: boolean;
          step?: WorkflowStep;
          profile?: CandidateProfile;
          analysis?: AssessmentAnalysis | null;
          answers?: Record<string, string>;
          passport?: CompetencyPassport | null;
        };
        if (typeof parsed.demoMode === "boolean") setDemoMode(parsed.demoMode);
        if (parsed.profile) setProfile(parsed.profile);
        if (parsed.analysis) setAnalysis(parsed.analysis);
        if (parsed.answers) setAnswers(parsed.answers);
        if (parsed.passport) setPassport(parsed.passport);
        if (parsed.step === 3 && parsed.passport && parsed.analysis) setStep(3);
        else if (parsed.step === 2 && parsed.analysis) setStep(2);
      }
    } catch {
      // Ignore malformed browser storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ demoMode, step, profile, analysis, answers, passport }),
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [hydrated, demoMode, step, profile, analysis, answers, passport]);

  const handleSaveApiKey = (nextKey: string) => {
    setGeminiApiKey(nextKey);
    try {
      if (nextKey) window.localStorage.setItem(API_KEY_STORAGE, nextKey);
      else window.localStorage.removeItem(API_KEY_STORAGE);
    } catch {
      // Ignore storage errors
    }
    toast.success(nextKey ? "Gemini API key saved for live evaluation." : "Gemini API key removed.");
  };

  const handleSelectPersona = (personaId: string) => {
    const found = SAMPLE_PERSONAS.find((p) => p.id === personaId);
    if (!found) return;
    setProfile(found.profile);
    setProfileErrors({});
    setAnalysis(null);
    setAnswers({});
    setPassport(null);
    toast.success(`Loaded sample persona: ${found.label}`);
  };

  const handleAnalyze = async () => {
    const errors = validateCandidateProfile(profile);
    setProfileErrors(errors);
    if (Object.keys(errors).length > 0) return;

    if (!demoMode && !geminiApiKey.trim()) {
      toast.error("Connect a Gemini API key in the navbar or enable Demo Mode.");
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = demoMode
        ? generateDemoAnalysis(profile)
        : await runAnalyzeFn({ data: { apiKey: geminiApiKey.trim(), profile } });

      setAnalysis(result);
      setAnswers({});
      setAnswerErrors({});
      setPassport(null);
      setStep(2);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not generate assessment.";
      toast.error(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFillSampleAnswers = () => {
    if (!analysis) return;
    const nextAnswers: Record<string, string> = {};
    for (const q of analysis.questions) {
      nextAnswers[q.id] = q.sampleAnswer;
    }
    setAnswers(nextAnswers);
    setAnswerErrors({});
    toast.success("Filled realistic sample responses. You can edit them before evaluating.");
  };

  const handleEvaluate = async () => {
    if (!analysis) return;
    const errors = validateScenarioAnswers(analysis.questions, answers);
    setAnswerErrors(errors);
    if (Object.keys(errors).length > 0) return;

    if (!demoMode && !geminiApiKey.trim()) {
      toast.error("Connect a Gemini API key in the navbar or enable Demo Mode.");
      return;
    }

    setIsEvaluating(true);
    try {
      const result = demoMode
        ? evaluateDemoAssessment(profile, analysis, answers)
        : await runEvaluateFn({
            data: {
              apiKey: geminiApiKey.trim(),
              profile,
              translation: analysis.translation,
              questions: analysis.questions.map(({ id, title, competencyArea, scenario, prompt }) => ({
                id,
                title,
                competencyArea,
                scenario,
                prompt,
              })),
              answers,
            },
          });

      setPassport(result);
      setStep(3);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not evaluate skills.";
      toast.error(message);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleStartOver = () => {
    setProfile(EMPTY_PROFILE);
    setProfileErrors({});
    setAnalysis(null);
    setAnswers({});
    setAnswerErrors({});
    setPassport(null);
    setStep(1);
  };

  const maxCompletedStep = passport ? 3 : analysis ? 1 : 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar
        demoMode={demoMode}
        onDemoModeChange={setDemoMode}
        geminiApiKey={geminiApiKey}
        onSaveApiKey={handleSaveApiKey}
      />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <StepIndicator
          currentStep={step}
          maxCompletedStep={maxCompletedStep}
          onSelectStep={(target) => {
            if (target === 1) setStep(1);
            if (target === 2 && analysis) setStep(2);
            if (target === 3 && passport) setStep(3);
          }}
        />

        {step === 1 && (
          <Step1Mapper
            profile={profile}
            errors={profileErrors}
            isLoading={isAnalyzing}
            demoMode={demoMode}
            onChange={(next) => {
              setProfile(next);
              setProfileErrors({});
            }}
            onSelectPersona={handleSelectPersona}
            onSubmit={() => void handleAnalyze()}
          />
        )}

        {step === 2 && analysis && (
          <Step2Assessment
            profile={profile}
            analysis={analysis}
            answers={answers}
            errors={answerErrors}
            isLoading={isEvaluating}
            demoMode={demoMode}
            onAnswerChange={(id, value) => {
              setAnswers((prev) => ({ ...prev, [id]: value }));
              setAnswerErrors((prev) => {
                const { [id]: _removed, ...rest } = prev;
                return rest;
              });
            }}
            onFillSampleAnswers={handleFillSampleAnswers}
            onBack={() => setStep(1)}
            onEvaluate={() => void handleEvaluate()}
          />
        )}

        {step === 3 && analysis && passport && (
          <Step3Passport
            profile={profile}
            analysis={analysis}
            passport={passport}
            onStartOver={handleStartOver}
          />
        )}
      </main>
    </div>
  );
}
