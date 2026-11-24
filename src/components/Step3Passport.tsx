import { Award, CheckCircle2, Printer, RotateCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import type {
  AssessmentAnalysis,
  CandidateProfile,
  CompetencyLevel,
  CompetencyPassport,
} from "@/lib/skillverify-types";

interface Step3PassportProps {
  profile: CandidateProfile;
  analysis: AssessmentAnalysis;
  passport: CompetencyPassport;
  onStartOver: () => void;
}

function levelBadgeClass(level: CompetencyLevel): string {
  if (level === "Senior") return "bg-verified text-verified-foreground";
  if (level === "Competent") return "bg-primary text-primary-foreground";
  return "bg-secondary text-secondary-foreground";
}

export function Step3Passport({ profile, analysis, passport, onStartOver }: Step3PassportProps) {
  const { translation } = analysis;

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="space-y-6">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Step 3 of 3</p>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Verified AI Competency Passport &amp; Bridging Roadmap
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={onStartOver} className="gap-1.5">
            <RotateCcw className="size-4" aria-hidden="true" />
            New Assessment
          </Button>
          <Button type="button" onClick={handlePrint} className="gap-2">
            <Printer className="size-4" aria-hidden="true" />
            Print / Save as PDF
          </Button>
        </div>
      </div>

      <article className="certificate-frame overflow-hidden rounded-xl">
        <div className="certificate-header-band px-6 py-6 sm:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest opacity-90">
                <ShieldCheck className="size-4" aria-hidden="true" />
                ILO Track 1 · Skills &amp; Credential Verification
              </div>
              <h2 className="font-serif text-2xl font-bold tracking-tight sm:text-3xl">
                Verified AI Competency Passport
              </h2>
              <p className="text-sm opacity-90">
                Issued under Recognition of Prior Learning (RPL) Practical Competency Assessment
              </p>
            </div>

            <div className="rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-3 text-left sm:text-right">
              <p className="text-[11px] uppercase tracking-wider opacity-80">Passport ID</p>
              <p className="font-mono text-sm font-semibold">{passport.passportId}</p>
              <p className="mt-1 text-xs opacity-85">Issued {passport.issuedAt}</p>
            </div>
          </div>
        </div>

        <div className="space-y-8 p-6 sm:p-8">
          <section className="grid grid-cols-1 gap-6 border-b border-border pb-6 md:grid-cols-3">
            <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 md:col-span-2">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Profession
                </dt>
                <dd className="mt-1 font-semibold text-foreground">{profile.profession}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Origin &amp; Experience
                </dt>
                <dd className="mt-1 font-semibold text-foreground">
                  {profile.countryOfOrigin} · {profile.yearsOfExperience} years
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Kenyan Equivalent ({translation.knqfLevel})
                </dt>
                <dd className="mt-1 font-medium text-foreground">{translation.kenyanEquivalent}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Document Status
                </dt>
                <dd className="mt-1 font-medium text-foreground">
                  {profile.documentsLost
                    ? "Physical documents unavailable (RPL Competency Track)"
                    : "Supporting credentials available"}
                </dd>
              </div>
            </dl>

            <div className="flex flex-col justify-between rounded-lg border border-border bg-surface-subtle p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Verified Level
                </span>
                <Award className="size-4 text-primary" aria-hidden="true" />
              </div>
              <div className="my-3 flex items-baseline gap-3">
                <span
                  className={`inline-flex rounded-md px-3 py-1 text-base font-bold ${levelBadgeClass(
                    passport.competencyLevel,
                  )}`}
                >
                  {passport.competencyLevel}
                </span>
                <span className="font-mono text-2xl font-bold text-foreground">
                  {passport.overallScore}
                  <span className="text-sm font-normal text-muted-foreground">/100</span>
                </span>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">{passport.evaluatorSummary}</p>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-foreground">Validated Technical Skills</h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {passport.validatedSkills.map((item) => (
                <div key={item.skill} className="rounded-lg border border-border bg-surface-subtle p-4">
                  <div className="flex items-start justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                      <CheckCircle2 className="size-4 shrink-0 text-verified" aria-hidden="true" />
                      {item.skill}
                    </span>
                  </div>
                  <span
                    className={`mt-2 inline-block rounded px-2 py-0.5 text-xs font-semibold ${levelBadgeClass(
                      item.proficiency,
                    )}`}
                  >
                    {item.proficiency}
                  </span>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.evidence}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-3 border-t border-border pt-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-serif text-lg font-bold text-foreground">
                30-Day Bridging &amp; Re-Certification Action Plan
              </h3>
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="rounded bg-sdg-four px-2 py-0.5 text-primary-foreground">
                  SDG 4 · Quality Education
                </span>
                <span className="rounded bg-sdg-eight px-2 py-0.5 text-primary-foreground">
                  SDG 8 · Decent Work
                </span>
              </div>
            </div>

            <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {passport.bridgingPlan.map((milestone) => (
                <li
                  key={milestone.week}
                  className="rounded-lg border border-border bg-card p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-semibold text-primary">{milestone.week}</span>
                    <span
                      className={`rounded px-2 py-0.5 text-[11px] font-semibold text-primary-foreground ${
                        milestone.sdgTag === "SDG 4" ? "bg-sdg-four" : "bg-sdg-eight"
                      }`}
                    >
                      {milestone.sdgTag}
                    </span>
                  </div>
                  <h4 className="mt-2 text-sm font-semibold text-foreground">{milestone.title}</h4>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{milestone.action}</p>
                  <p className="mt-2 text-xs font-medium text-foreground/80">
                    Partner / Body: {milestone.partnerOrBody}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
            <span>
              Authority Reference: {translation.kenyanAuthority} · {translation.internationalEquivalent}
            </span>
            <span>
              Evaluation Engine:{" "}
              {passport.source === "gemini" ? "Live Gemini 2.5 Flash" : "SkillVerify AI (Demo Mode)"}
            </span>
          </footer>
        </div>
      </article>
    </div>
  );
}