import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { StepIndicator } from "@/components/StepIndicator";
import { Step1Mapper } from "@/components/Step1Mapper";
import { Step2Assessment } from "@/components/Step2Assessment";
import { Step3Passport } from "@/components/Step3Passport";
import { SAMPLE_PERSONAS, evaluateDemoAssessment, generateDemoAnalysis } from "@/lib/skillverify-demo";
import { analyzeQualificationFn, evaluateAssessmentFn } from "@/lib/skillverify.functions";
import { createSharedPassportPayload, createShareablePassportUrl, readSharedPassportFromHash } from "@/lib/skillverify-share";
import { t } from "@/lib/skillverify-i18n";
import {
  validateCandidateProfile,
  validateScenarioAnswers,
  type AssessmentAnalysis,
  type CandidateProfile,
  type CompetencyPassport,
  type Language,
  type ProfileValidationErrors,
  type WorkflowStep,
} from "@/lib/skillverify-types";

const STORAGE_KEY = "skillverify-ai-state-v2";
const API_KEY_STORAGE = "skillverify-gemini-api-key";

const EMPTY_PROFILE: CandidateProfile = {
  profession: "",
  professionOther: "",
  countryOfOrigin: "",
  countryOfQualification: "",
  yearsOfExperience: "",
  rolesHeld: "",
  workSummary: "",
  skills: [],
  documentStatus: "",
  hasInstitutionalVerification: false,
  qualificationFiles: [],
  alternativeEvidenceFiles: [],
  alternativeEvidenceNotes: "",
  consent: false,
};

const SDGS = [
  { tag: "SDG 4", label: "Quality Education", className: "bg-sdg-four" },
  { tag: "SDG 8", label: "Decent Work", className: "bg-sdg-eight" },
  { tag: "SDG 10", label: "Reduced Inequalities", className: "bg-sdg-ten" },
  { tag: "SDG 16", label: "Peace & Justice", className: "bg-sdg-sixteen" },
  { tag: "SDG 17", label: "Partnerships", className: "bg-sdg-seventeen" },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SkillVerify AI — Preliminary RPL Assessment & Competency Passport" },
      { name: "description", content: "Map professional evidence to potential Kenyan qualification pathways, complete three profession-specific scenarios, and create a preliminary AI-assisted competency passport with a 30-day development plan." },
      { property: "og:title", content: "SkillVerify AI — Preliminary Competency Passport" },
      { property: "og:description", content: "Connected Recognition of Prior Learning evidence mapping and transparent practical assessment for skilled refugees, aligned with SDGs 4, 8, 10, 16, and 17." },
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
  const [language, setLanguage] = useState<Language>("en");
  const [step, setStep] = useState<WorkflowStep>(1);
  const [profile, setProfile] = useState<CandidateProfile>(EMPTY_PROFILE);
  const [profileErrors, setProfileErrors] = useState<ProfileValidationErrors>({});
  const [analysis, setAnalysis] = useState<AssessmentAnalysis | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [answerErrors, setAnswerErrors] = useState<Record<string, string>>({});
  const [passport, setPassport] = useState<CompetencyPassport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isShared, setIsShared] = useState(false);

  const runAnalyzeFn = useServerFn(analyzeQualificationFn);
  const runEvaluateFn = useServerFn(evaluateAssessmentFn);

  useEffect(() => {
    try {
      const savedKey = window.localStorage.getItem(API_KEY_STORAGE);
      if (savedKey) setGeminiApiKey(savedKey);

      const shared = readSharedPassportFromHash(window.location.hash);
      if (shared) {
        setProfile(shared.profile);
        setAnalysis(shared.analysis);
        setPassport(shared.passport);
        setStep(3);
        setIsShared(true);
        setHydrated(true);
        return;
      }

      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          demoMode?: boolean;
          language?: Language;
          step?: WorkflowStep;
          profile?: CandidateProfile;
          analysis?: AssessmentAnalysis | null;
          answers?: Record<string, string>;
          passport?: CompetencyPassport | null;
        };
        if (typeof parsed.demoMode === "boolean") setDemoMode(parsed.demoMode);
        if (parsed.language === "en" || parsed.language === "fr" || parsed.language === "ar") setLanguage(parsed.language);
        if (parsed.profile) setProfile({ ...EMPTY_PROFILE, ...parsed.profile });
        if (parsed.analysis?.mapping && Array.isArray(parsed.analysis.questions)) setAnalysis(parsed.analysis);
        if (parsed.answers) setAnswers(parsed.answers);
        if (parsed.passport && Array.isArray(parsed.passport.scenarioScores)) setPassport(parsed.passport);
        if (parsed.step === 3 && parsed.passport?.scenarioScores && parsed.analysis?.mapping) setStep(3);
        else if (parsed.step === 2 && parsed.analysis?.mapping) setStep(2);
      }
    } catch {
      // Ignore malformed browser storage or an invalid shared link.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  useEffect(() => {
    if (!hydrated || isShared) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ demoMode, language, step, profile, analysis, answers, passport }));
    } catch {
      // Ignore storage quota errors.
    }
  }, [hydrated, isShared, demoMode, language, step, profile, analysis, answers, passport]);

  const handleSaveApiKey = (nextKey: string) => {
    setGeminiApiKey(nextKey);
    try {
      if (nextKey) window.localStorage.setItem(API_KEY_STORAGE, nextKey);
      else window.localStorage.removeItem(API_KEY_STORAGE);
    } catch {
      // Ignore storage errors.
    }
    toast.success(nextKey ? "Gemini API key saved for live evaluation." : "Gemini API key removed.");
  };

  const handleSelectPersona = (personaId: string) => {
    const found = SAMPLE_PERSONAS.find((persona) => persona.id === personaId);
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
    if (Object.keys(errors).length > 0) {
      toast.error("Complete the required fields and consent before continuing.");
      return;
    }
    if (!demoMode && !geminiApiKey.trim()) {
      toast.error("Connect a Gemini API key in the navbar or enable Demo Mode.");
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = demoMode ? generateDemoAnalysis(profile) : await runAnalyzeFn({ data: { apiKey: geminiApiKey.trim(), profile } });
      setAnalysis(result);
      setAnswers({});
      setAnswerErrors({});
      setPassport(null);
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not generate assessment.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFillSampleAnswers = () => {
    if (!analysis) return;
    const nextAnswers: Record<string, string> = {};
    for (const item of analysis.questions) nextAnswers[item.id] = item.sampleAnswer;
    setAnswers(nextAnswers);
    setAnswerErrors({});
    toast.success("Filled realistic sample responses. Edit them to see the score change.");
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
              mapping: analysis.mapping,
              questions: analysis.questions.map(({ id, title, competencyArea, scenario, prompt, expectedKeywords }) => ({ id, title, competencyArea, scenario, prompt, expectedKeywords })),
              answers,
            },
          });
      setPassport(result);
      setStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not evaluate skills.");
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
    setIsShared(false);
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    try { window.localStorage.removeItem(STORAGE_KEY); } catch { /* Ignore storage errors. */ }
  };

  const handleCopyShare = async () => {
    if (!analysis || !passport) return;
    const payload = createSharedPassportPayload(profile, analysis, passport);
    const url = createShareablePassportUrl(payload, window.location.href);
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Private shareable profile link copied. It contains this report, not your API key.");
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = url;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      const copied = document.execCommand("copy");
      textArea.remove();
      if (copied) toast.success("Private shareable profile link copied.");
      else toast.error("Could not copy automatically. Allow clipboard access and try again.");
    }
  };

  const maxCompletedStep = passport ? 3 : analysis ? 1 : 0;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar demoMode={demoMode} onDemoModeChange={setDemoMode} geminiApiKey={geminiApiKey} onSaveApiKey={handleSaveApiKey} language={language} onLanguageChange={setLanguage} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {!isShared && <StepIndicator currentStep={step} maxCompletedStep={maxCompletedStep} language={language} onSelectStep={(target) => {
          if (target === 1) setStep(1);
          if (target === 2 && analysis) setStep(2);
          if (target === 3 && passport) setStep(3);
        }} />}
        {step === 1 && <Step1Mapper profile={profile} errors={profileErrors} isLoading={isAnalyzing} demoMode={demoMode} language={language} onChange={(next) => { setProfile(next); setProfileErrors({}); }} onSelectPersona={handleSelectPersona} onSubmit={() => void handleAnalyze()} />}
        {step === 2 && analysis && <Step2Assessment profile={profile} analysis={analysis} answers={answers} errors={answerErrors} isLoading={isEvaluating} demoMode={demoMode} language={language} onAnswerChange={(id, value) => { setAnswers((previous) => ({ ...previous, [id]: value })); setAnswerErrors((previous) => { const { [id]: _removed, ...rest } = previous; return rest; }); }} onFillSampleAnswers={handleFillSampleAnswers} onBack={() => setStep(1)} onEvaluate={() => void handleEvaluate()} />}
        {step === 3 && analysis && passport && <Step3Passport profile={profile} analysis={analysis} passport={passport} language={language} isShared={isShared} onStartOver={handleStartOver} onCopyShare={() => void handleCopyShare()} />}
      </main>
      <footer className="no-print border-t border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 sm:px-6">
          <div className="flex flex-wrap items-center gap-2"><span className="me-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t(language, "sdgAlignment")}</span>{SDGS.map((sdg) => <span key={sdg.tag} className={`rounded px-2 py-1 text-[11px] font-semibold text-primary-foreground ${sdg.className}`} title={sdg.label}>{sdg.tag} · {sdg.label}</span>)}</div>
          <p className="text-xs leading-relaxed text-muted-foreground">{t(language, "footerNote")} Results do not replace official recognition, licensing, regulatory examinations, or human review.</p>
        </div>
      </footer>
    </div>
  );
}
