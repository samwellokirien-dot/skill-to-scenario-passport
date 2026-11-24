import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { AssessmentAnalysis, CandidateProfile } from "@/lib/skillverify-types";

interface Step2AssessmentProps {
  profile: CandidateProfile;
  analysis: AssessmentAnalysis;
  answers: Record<string, string>;
  errors: Record<string, string>;
  isLoading: boolean;
  demoMode: boolean;
  onAnswerChange: (questionId: string, value: string) => void;
  onFillSampleAnswers: () => void;
  onBack: () => void;
  onEvaluate: () => void;
}

export function Step2Assessment({
  profile,
  analysis,
  answers,
  errors,
  isLoading,
  demoMode,
  onAnswerChange,
  onFillSampleAnswers,
  onBack,
  onEvaluate,
}: Step2AssessmentProps) {
  const { translation, questions } = analysis;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEvaluate();
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/25 bg-card shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Credential Translation Output
            </p>
            <span className="rounded bg-secondary px-2.5 py-0.5 font-mono text-xs font-medium text-secondary-foreground">
              {translation.knqfLevel}
            </span>
          </div>
          <CardTitle className="font-serif text-xl font-bold text-foreground">
            {translation.kenyanEquivalent}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {translation.summaryNote}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-3 border-t border-border pt-4 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-xs font-medium text-muted-foreground">Kenyan Regulatory Authority</dt>
              <dd className="mt-0.5 font-medium text-foreground">{translation.kenyanAuthority}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-muted-foreground">International Equivalent</dt>
              <dd className="mt-0.5 font-medium text-foreground">{translation.internationalEquivalent}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-muted-foreground">Recommended Pathway</dt>
              <dd className="mt-0.5 font-medium text-foreground">{translation.recognitionPathway}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="border-b border-border pb-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Step 2 of 3
              </p>
              <CardTitle className="mt-1 font-serif text-2xl font-bold text-foreground">
                Practical Competency Assessment
              </CardTitle>
              <CardDescription className="mt-1 text-sm text-muted-foreground">
                Respond to all 3 real-world {profile.profession} scenarios below. Practical reasoning is graded directly.
              </CardDescription>
            </div>
            {demoMode && (
              <Button type="button" variant="outline" size="sm" onClick={onFillSampleAnswers} className="gap-1.5 shrink-0">
                <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
                Fill Sample Responses
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {questions.map((question, index) => {
              const answerValue = answers[question.id] ?? "";
              const errorMsg = errors[question.id];
              const isComplete = answerValue.trim().length >= 20;

              return (
                <div key={question.id} className="rounded-lg border border-border bg-surface-subtle p-4 sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                      Scenario {index + 1} · {question.competencyArea}
                    </span>
                    {isComplete && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-verified">
                        <CheckCircle2 className="size-3.5" aria-hidden="true" />
                        Answered
                      </span>
                    )}
                  </div>
                  <h3 className="mt-1.5 text-base font-semibold text-foreground">{question.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/90">{question.scenario}</p>
                  <div className="mt-4 space-y-1.5">
                    <Label htmlFor={`answer-${question.id}`} className="text-sm font-medium text-foreground">
                      {question.prompt}
                    </Label>
                    <Textarea
                      id={`answer-${question.id}`}
                      rows={4}
                      className="bg-card"
                      placeholder="Explain your step-by-step technical decision, safety checks, and escalation or documentation steps..."
                      value={answerValue}
                      onChange={(e) => onAnswerChange(question.id, e.target.value)}
                      aria-invalid={Boolean(errorMsg)}
                    />
                    {errorMsg && <p className="text-xs font-medium text-destructive">{errorMsg}</p>}
                  </div>
                </div>
              );
            })}

            <div className="flex flex-col-reverse items-stretch justify-between gap-3 border-t border-border pt-5 sm:flex-row sm:items-center">
              <Button type="button" variant="outline" onClick={onBack} disabled={isLoading} className="gap-1.5">
                <ArrowLeft className="size-4" aria-hidden="true" />
                Edit Qualification Profile
              </Button>
              <Button type="submit" size="lg" disabled={isLoading} className="gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    Evaluating Practical Reasoning...
                  </>
                ) : (
                  <>
                    Evaluate Skills
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}