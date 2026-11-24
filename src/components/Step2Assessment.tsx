import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, ShieldAlert, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RUBRIC_CRITERIA, type AssessmentAnalysis, type CandidateProfile, type Language } from "@/lib/skillverify-types";
import { t } from "@/lib/skillverify-i18n";

interface Step2AssessmentProps {
  profile: CandidateProfile;
  analysis: AssessmentAnalysis;
  answers: Record<string, string>;
  errors: Record<string, string>;
  isLoading: boolean;
  demoMode: boolean;
  language: Language;
  onAnswerChange: (questionId: string, value: string) => void;
  onFillSampleAnswers: () => void;
  onBack: () => void;
  onEvaluate: () => void;
}

export function Step2Assessment({ profile, analysis, answers, errors, isLoading, demoMode, language, onAnswerChange, onFillSampleAnswers, onBack, onEvaluate }: Step2AssessmentProps) {
  const { mapping, questions } = analysis;
  const profession = profile.profession === "Other" ? profile.professionOther : profile.profession;

  return (
    <div className="space-y-6">
      <Card className="border-primary/25 bg-card shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">{t(language, "mappingReport")}</p>
            <span className="rounded bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">{mapping.qualificationStatus}</span>
          </div>
          <CardTitle className="font-serif text-xl font-bold text-foreground">{mapping.potentialLocalPathway}</CardTitle>
          <CardDescription className="text-sm leading-relaxed text-muted-foreground">{mapping.summaryNote}</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 border-t border-border pt-4 text-sm sm:grid-cols-2">
            <div><dt className="text-xs font-medium text-muted-foreground">{t(language, "profession")}</dt><dd className="mt-1 font-medium text-foreground">{profession}</dd></div>
            <div><dt className="text-xs font-medium text-muted-foreground">{t(language, "evidenceStatus")}</dt><dd className="mt-1 font-medium text-foreground">{mapping.qualificationStatus}</dd></div>
            <div><dt className="text-xs font-medium text-muted-foreground">{t(language, "existingQualifications")}</dt><dd className="mt-1 leading-relaxed text-foreground">{mapping.existingQualifications}</dd></div>
            <div><dt className="text-xs font-medium text-muted-foreground">{t(language, "previousExperience")}</dt><dd className="mt-1 leading-relaxed text-foreground">{mapping.previousExperience}</dd></div>
            <div><dt className="text-xs font-medium text-muted-foreground">{t(language, "identifiedCompetencies")}</dt><dd className="mt-1 leading-relaxed text-foreground">{mapping.identifiedCompetencies.join(" · ")}</dd></div>
            <div><dt className="text-xs font-medium text-muted-foreground">{t(language, "potentialPathway")}</dt><dd className="mt-1 leading-relaxed text-foreground">{mapping.potentialLocalPathway}</dd></div>
            <div><dt className="text-xs font-medium text-muted-foreground">{t(language, "authorities")}</dt><dd className="mt-1 leading-relaxed text-foreground">{mapping.regulatoryBodies.join(" · ")}</dd></div>
            <div><dt className="text-xs font-medium text-muted-foreground">{t(language, "indicativeLevel")}</dt><dd className="mt-1 leading-relaxed text-foreground">{mapping.indicativeKnqfLevel}</dd></div>
            <div><dt className="text-xs font-medium text-muted-foreground">{t(language, "missingDocumentation")}</dt><dd className="mt-1 leading-relaxed text-foreground">{mapping.missingDocumentation}</dd></div>
            <div><dt className="text-xs font-medium text-muted-foreground">{t(language, "verificationProcess")}</dt><dd className="mt-1 leading-relaxed text-foreground">{mapping.recommendedVerificationProcess}</dd></div>
          </dl>
          <div className="mt-5 flex items-start gap-2 rounded-md border border-primary/20 bg-accent/50 p-3 text-xs leading-relaxed text-foreground">
            <ShieldAlert className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            Potential pathways only. No foreign qualification is described as officially equivalent; recognition and licensing remain with the named institutions.
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="border-b border-border pb-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Step 2 of 3 · {analysis.difficulty} level</p>
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <CardTitle className="mt-1 font-serif text-2xl font-bold text-foreground">{t(language, "step2Name")}</CardTitle>
              <CardDescription className="mt-1 text-sm leading-relaxed text-muted-foreground">Three Profession-Specific Real-World Scenarios for {profession}. Your answers—not your claimed years of experience—determine the practical score.</CardDescription>
            </div>
            {demoMode && <Button type="button" variant="outline" size="sm" onClick={onFillSampleAnswers} className="shrink-0 gap-1.5"><Sparkles className="size-3.5 text-primary" aria-hidden="true" />{t(language, "fillSamples")}</Button>}
          </div>
        </CardHeader>
        <CardContent className="space-y-7 pt-6">
          <section className="rounded-lg border border-border bg-surface-subtle p-4" aria-labelledby="rubric-heading">
            <h2 id="rubric-heading" className="font-serif text-lg font-bold">{t(language, "rubricTitle")}</h2>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t(language, "rubricIntro")}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {RUBRIC_CRITERIA.map((criterion) => (
                <div key={criterion.key} className="rounded-md border border-border bg-card p-3">
                  <div className="flex items-center justify-between gap-2"><h3 className="text-xs font-semibold text-foreground">{criterion.label}</h3><span className="font-mono text-xs font-bold text-primary">{criterion.weight}%</span></div>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">{criterion.description}</p>
                </div>
              ))}
            </div>
          </section>

          <form onSubmit={(event) => { event.preventDefault(); onEvaluate(); }} className="space-y-6" noValidate>
            {questions.map((item, index) => {
              const answerValue = answers[item.id] ?? "";
              const errorMsg = errors[item.id];
              const isComplete = answerValue.trim().length >= 20;
              return (
                <div key={item.id} className="rounded-lg border border-border bg-surface-subtle p-4 sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">Scenario {index + 1} · {item.competencyArea}</span>
                    {isComplete && <span className="inline-flex items-center gap-1 text-xs font-medium text-verified"><CheckCircle2 className="size-3.5" aria-hidden="true" />{t(language, "answered")}</span>}
                  </div>
                  <h3 className="mt-1.5 text-base font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/90">{item.scenario}</p>
                  <div className="mt-4 space-y-1.5">
                    <Label htmlFor={`answer-${item.id}`} className="text-sm font-medium leading-relaxed text-foreground">{item.prompt}</Label>
                    <Textarea id={`answer-${item.id}`} rows={6} className="bg-card" placeholder="Explain step-by-step technical decisions, evidence, safety checks, communication, and verification..." value={answerValue} onChange={(event) => onAnswerChange(item.id, event.target.value)} aria-invalid={Boolean(errorMsg)} />
                    <div className="flex justify-between gap-2"><span>{errorMsg && <p className="text-xs font-medium text-destructive">{errorMsg}</p>}</span><span className="text-[11px] text-muted-foreground">{answerValue.trim().split(/\s+/).filter(Boolean).length} words</span></div>
                  </div>
                </div>
              );
            })}
            <div className="flex flex-col-reverse items-stretch justify-between gap-3 border-t border-border pt-5 sm:flex-row sm:items-center">
              <Button type="button" variant="outline" onClick={onBack} disabled={isLoading} className="gap-1.5"><ArrowLeft className="size-4" aria-hidden="true" />{t(language, "editProfile")}</Button>
              <Button type="submit" size="lg" disabled={isLoading} className="gap-2">{isLoading ? <><Loader2 className="size-4 animate-spin" aria-hidden="true" />{t(language, "evaluating")}</> : <>{t(language, "evaluate")}<ArrowRight className="size-4" aria-hidden="true" /></>}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
