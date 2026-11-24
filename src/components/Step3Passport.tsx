import { AlertTriangle, Award, CheckCircle2, Copy, Printer, RotateCcw, ShieldCheck, Target, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AssessmentAnalysis, CandidateProfile, CompetencyLevel, CompetencyPassport, Language } from "@/lib/skillverify-types";
import { t } from "@/lib/skillverify-i18n";

interface Step3PassportProps {
  profile: CandidateProfile;
  analysis: AssessmentAnalysis;
  passport: CompetencyPassport;
  language: Language;
  isShared: boolean;
  onStartOver: () => void;
  onCopyShare: () => void;
}

function levelBadgeClass(level: CompetencyLevel): string {
  if (level === "Proficient") return "bg-verified text-verified-foreground";
  if (level === "Competent") return "bg-primary text-primary-foreground";
  if (level === "Developing") return "bg-secondary text-secondary-foreground";
  return "bg-muted text-muted-foreground";
}

export function Step3Passport({ profile, analysis, passport, language, isShared, onStartOver, onCopyShare }: Step3PassportProps) {
  const { mapping } = analysis;
  const profession = profile.profession === "Other" ? profile.professionOther : profile.profession;

  return (
    <div className="space-y-6">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Step 3 of 3</p>
          <h1 className="font-serif text-2xl font-bold text-foreground">{t(language, "step3Name")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Assessment Report &amp; 30-Day Development Roadmap</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={onStartOver} className="gap-1.5"><RotateCcw className="size-4" aria-hidden="true" />{isShared ? t(language, "startOwn") : t(language, "newAssessment")}</Button>
          <Button type="button" variant="outline" onClick={onCopyShare} className="gap-1.5"><Copy className="size-4" aria-hidden="true" />{t(language, "share")}</Button>
          <Button type="button" onClick={() => window.print()} className="gap-1.5"><Printer className="size-4" aria-hidden="true" />{t(language, "print")}</Button>
        </div>
      </div>

      {isShared && <div className="no-print rounded-lg border border-primary/25 bg-accent/50 px-4 py-3 text-sm font-medium text-foreground">{t(language, "sharedReport")}</div>}

      <article className="certificate-frame overflow-hidden rounded-xl">
        <div className="certificate-header-band px-6 py-6 sm:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest opacity-90"><ShieldCheck className="size-4" aria-hidden="true" />ILO Track 1 · Recognition of Prior Learning</div>
              <h2 className="max-w-xl font-serif text-2xl font-bold tracking-tight sm:text-3xl">{t(language, "passportTitle")}</h2>
              <p className="text-sm opacity-90">Connected evidence mapping, practical assessment, and development reporting</p>
            </div>
            <div className="rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-3 text-left sm:text-right">
              <p className="text-[11px] uppercase tracking-wider opacity-80">Unique Passport ID</p>
              <p className="font-mono text-sm font-semibold">{passport.passportId}</p>
              <p className="mt-1 text-xs opacity-85">Assessed {passport.issuedAt}</p>
            </div>
          </div>
        </div>

        <div className="space-y-8 p-6 sm:p-8">
          <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden="true" />
            <p className="text-xs font-semibold leading-relaxed text-foreground">{t(language, "preliminaryDisclaimer")}</p>
          </div>

          <section className="grid grid-cols-1 gap-6 border-b border-border pb-6 md:grid-cols-3" aria-labelledby="profile-summary-heading">
            <div className="md:col-span-2">
              <h3 id="profile-summary-heading" className="mb-4 font-serif text-lg font-bold">{t(language, "candidateProfile")}</h3>
              <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                <div><dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t(language, "profession")}</dt><dd className="mt-1 font-semibold">{profession}</dd></div>
                <div><dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Origin &amp; Experience</dt><dd className="mt-1 font-semibold">{profile.countryOfOrigin} · {profile.yearsOfExperience} years</dd></div>
                <div><dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t(language, "countryQualification")}</dt><dd className="mt-1 font-medium">{profile.countryOfQualification}</dd></div>
                <div><dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Roles Held</dt><dd className="mt-1 font-medium">{profile.rolesHeld}</dd></div>
                <div className="sm:col-span-2"><dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t(language, "evidenceStatus")}</dt><dd className="mt-1 font-medium">{mapping.qualificationStatus}</dd></div>
              </dl>
            </div>
            <div className="flex flex-col justify-between rounded-lg border border-border bg-surface-subtle p-4">
              <div className="flex items-center justify-between gap-2"><span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t(language, "overallScore")}</span><Award className="size-4 text-primary" aria-hidden="true" /></div>
              <div className="my-3 flex items-baseline gap-3"><span className={`inline-flex rounded-md px-3 py-1 text-base font-bold ${levelBadgeClass(passport.competencyLevel)}`}>{passport.competencyLevel}</span><span className="font-mono text-2xl font-bold">{passport.overallScore}<span className="text-sm font-normal text-muted-foreground">/100</span></span></div>
              <p className="text-xs leading-relaxed text-muted-foreground">{passport.evaluatorSummary}</p>
            </div>
          </section>

          <section className="space-y-4" aria-labelledby="pathways-heading">
            <h3 id="pathways-heading" className="font-serif text-lg font-bold">{t(language, "pathwaysReferrals")}</h3>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-surface-subtle p-4"><dt className="text-xs font-semibold text-primary">{t(language, "potentialPathway")}</dt><dd className="mt-1.5 text-sm leading-relaxed">{mapping.potentialLocalPathway}</dd></div>
              <div className="rounded-lg border border-border bg-surface-subtle p-4"><dt className="text-xs font-semibold text-primary">{t(language, "authorities")}</dt><dd className="mt-1.5 text-sm leading-relaxed">{mapping.regulatoryBodies.join(" · ")}</dd></div>
              <div className="rounded-lg border border-border bg-surface-subtle p-4"><dt className="text-xs font-semibold text-primary">{t(language, "indicativeLevel")}</dt><dd className="mt-1.5 text-sm leading-relaxed">{mapping.indicativeKnqfLevel}</dd><dd className="mt-2 text-xs leading-relaxed text-muted-foreground">{mapping.internationalFramework}</dd></div>
              <div className="rounded-lg border border-border bg-surface-subtle p-4"><dt className="text-xs font-semibold text-primary">{t(language, "verificationProcess")}</dt><dd className="mt-1.5 text-sm leading-relaxed">{mapping.recommendedVerificationProcess}</dd></div>
              <div className="rounded-lg border border-border bg-surface-subtle p-4 sm:col-span-2"><dt className="text-xs font-semibold text-primary">{t(language, "missingDocumentation")}</dt><dd className="mt-1.5 text-sm leading-relaxed">{mapping.missingDocumentation}</dd></div>
            </dl>
          </section>

          <section className="space-y-4 border-t border-border pt-6" aria-labelledby="scenario-scores-heading">
            <div><h3 id="scenario-scores-heading" className="font-serif text-lg font-bold">{t(language, "scenarioBreakdown")}</h3><p className="mt-1 text-xs text-muted-foreground">Overall score = average of three scenario scores. Each scenario = Technical 30% + Problem-Solving 25% + Decision-Making 20% + Safety 15% + Communication 10%.</p></div>
            <div className="space-y-4">
              {passport.scenarioScores.map((scenario, index) => (
                <div key={scenario.questionId} className="rounded-lg border border-border bg-surface-subtle p-4 sm:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wider text-primary">Scenario {index + 1} · {scenario.competencyArea}</p><h4 className="mt-1 text-sm font-semibold">{scenario.title}</h4></div><span className="rounded-md bg-card px-3 py-1.5 font-mono text-lg font-bold text-foreground">{scenario.score}/100</span></div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    {scenario.criteria.map((criterion) => (
                      <div key={criterion.criterion} className="rounded-md border border-border bg-card p-3">
                        <div className="flex items-start justify-between gap-2"><span className="text-[11px] font-semibold">{criterion.label}</span><span className="font-mono text-xs font-bold text-primary">{criterion.score}</span></div>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted" role="meter" aria-label={`${criterion.label}: ${criterion.score} out of 100`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={criterion.score}><div className="h-full rounded-full bg-primary" style={{ width: `${criterion.score}%` }} /></div>
                        <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{criterion.feedback}</p>
                        <p className="mt-1 text-[10px] font-medium text-muted-foreground">Weight: {criterion.weight}%</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{scenario.feedback}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-5 border-t border-border pt-6 lg:grid-cols-2">
            <div>
              <h3 className="flex items-center gap-2 font-serif text-lg font-bold"><CheckCircle2 className="size-5 text-verified" aria-hidden="true" />{t(language, "demonstratedSkills")}</h3>
              {passport.validatedSkills.length > 0 ? <div className="mt-3 space-y-3">{passport.validatedSkills.map((item) => <div key={item.skill} className="rounded-lg border border-border bg-surface-subtle p-4"><div className="flex flex-wrap items-center justify-between gap-2"><span className="text-sm font-semibold">{item.skill}</span><span className={`rounded px-2 py-0.5 text-xs font-semibold ${levelBadgeClass(item.proficiency)}`}>{item.proficiency}</span></div><p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.evidence}</p></div>)}</div> : <p className="mt-3 rounded-lg border border-border bg-surface-subtle p-4 text-xs leading-relaxed text-muted-foreground">{t(language, "noDemonstratedSkills")}</p>}
            </div>
            <div>
              <h3 className="flex items-center gap-2 font-serif text-lg font-bold"><Target className="size-5 text-primary" aria-hidden="true" />{t(language, "skillsGaps")}</h3>
              {passport.skillsGaps.length > 0 ? <ul className="mt-3 space-y-2">{passport.skillsGaps.map((gap) => <li key={gap} className="rounded-lg border border-border bg-surface-subtle p-3 text-xs leading-relaxed text-foreground">{gap}</li>)}</ul> : <p className="mt-3 rounded-lg border border-border bg-surface-subtle p-4 text-xs text-muted-foreground">No major text-response gap was flagged; practical supervised verification remains required.</p>}
            </div>
          </section>

          <section className="grid gap-5 border-t border-border pt-6 lg:grid-cols-2">
            <div><h3 className="flex items-center gap-2 font-serif text-lg font-bold"><TrendingUp className="size-5 text-verified" aria-hidden="true" />{t(language, "strengths")}</h3><ul className="mt-3 list-disc space-y-2 ps-5 text-xs leading-relaxed text-muted-foreground">{passport.strengths.length > 0 ? passport.strengths.map((strength) => <li key={strength}>{strength}</li>) : <li>Complete more detailed responses to establish demonstrable strengths.</li>}</ul></div>
            <div><h3 className="font-serif text-lg font-bold">{t(language, "recommendedTraining")}</h3><ul className="mt-3 list-disc space-y-2 ps-5 text-xs leading-relaxed text-muted-foreground">{passport.recommendedTraining.map((training) => <li key={training}>{training}</li>)}</ul></div>
          </section>

          <section className="space-y-4 border-t border-border pt-6">
            <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-serif text-lg font-bold">{t(language, "developmentPlan")}</h3><div className="flex gap-2 text-xs font-semibold"><span className="rounded bg-sdg-four px-2 py-0.5 text-primary-foreground">SDG 4</span><span className="rounded bg-sdg-eight px-2 py-0.5 text-primary-foreground">SDG 8</span></div></div>
            <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {passport.bridgingPlan.map((milestone) => <li key={milestone.week} className="rounded-lg border border-border bg-card p-4"><div className="flex items-center justify-between gap-2"><span className="font-mono text-xs font-semibold text-primary">{milestone.week}</span><span className={`rounded px-2 py-0.5 text-[11px] font-semibold text-primary-foreground ${milestone.sdgTag === "SDG 4" ? "bg-sdg-four" : "bg-sdg-eight"}`}>{milestone.sdgTag}</span></div><h4 className="mt-2 text-sm font-semibold">{milestone.title}</h4><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{milestone.action}</p><p className="mt-2 text-xs font-medium text-foreground/80">Partner / Body: {milestone.partnerOrBody}</p></li>)}
            </ol>
          </section>

          <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4 text-xs text-muted-foreground"><span>Potential pathways only · Human and institutional verification required</span><span>Evaluation Engine: {passport.source === "gemini" ? "Live Gemini 2.5 Flash" : "SkillVerify AI Demo Scoring"}</span></footer>
        </div>
      </article>
    </div>
  );
}
