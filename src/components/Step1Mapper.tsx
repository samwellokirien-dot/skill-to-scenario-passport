import { useState } from "react";
import { ArrowRight, FileWarning, Loader2, Plus, ShieldAlert, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EvidenceDropzone } from "@/components/EvidenceDropzone";
import { SAMPLE_PERSONAS } from "@/lib/skillverify-demo";
import { PROFESSION_OPTIONS } from "@/lib/skillverify-professions";
import { t } from "@/lib/skillverify-i18n";
import type { CandidateProfile, DocumentStatus, Language, ProfileValidationErrors } from "@/lib/skillverify-types";

interface Step1MapperProps {
  profile: CandidateProfile;
  errors: ProfileValidationErrors;
  isLoading: boolean;
  demoMode: boolean;
  language: Language;
  onChange: (next: CandidateProfile) => void;
  onSelectPersona: (personaId: string) => void;
  onSubmit: () => void;
}

const SKILL_SUGGESTIONS = [
  { group: "Technical", values: ["Technical troubleshooting", "Quality assurance", "Digital literacy", "Data analysis"] },
  { group: "Professional", values: ["Regulatory compliance", "Project planning", "Report writing", "Supervised practice"] },
  { group: "Transferable", values: ["Team leadership", "Client communication", "Problem-solving", "Mentoring"] },
];

export function Step1Mapper({ profile, errors, isLoading, demoMode, language, onChange, onSelectPersona, onSubmit }: Step1MapperProps) {
  const [customSkill, setCustomSkill] = useState("");

  const update = (patch: Partial<CandidateProfile>) => {
    const { personaId: _removed, ...current } = profile;
    onChange({ ...current, ...patch });
  };

  const toggleSkill = (skill: string, checked: boolean) => {
    update({ skills: checked ? [...new Set([...profile.skills, skill])] : profile.skills.filter((item) => item !== skill) });
  };

  const addCustomSkill = () => {
    const skill = customSkill.trim();
    if (!skill) return;
    update({ skills: [...new Set([...profile.skills, skill])] });
    setCustomSkill("");
  };

  return (
    <Card className="border-border bg-card shadow-xs">
      <CardHeader className="border-b border-border pb-5">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Step 1 of 3</p>
            <CardTitle className="mt-1 font-serif text-2xl font-bold text-foreground">{t(language, "step1Name")}</CardTitle>
            <CardDescription className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">Professional Background, Evidence &amp; Qualification Pathways. Enter your background to identify potential routes and generate three practical scenarios.</CardDescription>
          </div>
          <div className="w-full lg:w-80">
            <Label htmlFor="sample-persona" className="mb-1.5 block text-xs font-medium text-muted-foreground">{t(language, "samplePersona")}</Label>
            <Select value={profile.personaId ?? ""} onValueChange={onSelectPersona}>
              <SelectTrigger id="sample-persona" aria-label={t(language, "samplePersona")}><SelectValue placeholder={t(language, "choosePersona")} /></SelectTrigger>
              <SelectContent>{SAMPLE_PERSONAS.map((persona) => <SelectItem key={persona.id} value={persona.id}>{persona.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={(event) => { event.preventDefault(); onSubmit(); }} className="space-y-6" noValidate>
          <section className="space-y-4" aria-labelledby="background-heading">
            <h2 id="background-heading" className="font-serif text-lg font-bold">Professional background</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="profession">{t(language, "profession")}</Label>
                <Select value={profile.profession} onValueChange={(profession) => update({ profession })}>
                  <SelectTrigger id="profession" aria-invalid={Boolean(errors.profession)}><SelectValue placeholder={t(language, "selectProfession")} /></SelectTrigger>
                  <SelectContent>{PROFESSION_OPTIONS.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent>
                </Select>
                {errors.profession && <p className="text-xs font-medium text-destructive">{errors.profession}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="yearsOfExperience">{t(language, "yearsExperience")}</Label>
                <Input id="yearsOfExperience" type="number" min={0} max={60} step={1} placeholder="e.g., 6" value={profile.yearsOfExperience} onChange={(event) => update({ yearsOfExperience: event.target.value })} aria-invalid={Boolean(errors.yearsOfExperience)} />
                {errors.yearsOfExperience && <p className="text-xs font-medium text-destructive">{errors.yearsOfExperience}</p>}
              </div>
            </div>
            {profile.profession === "Other" && (
              <div className="space-y-1.5">
                <Label htmlFor="professionOther">{t(language, "otherProfession")}</Label>
                <Input id="professionOther" value={profile.professionOther} onChange={(event) => update({ professionOther: event.target.value })} aria-invalid={Boolean(errors.professionOther)} />
                {errors.professionOther && <p className="text-xs font-medium text-destructive">{errors.professionOther}</p>}
              </div>
            )}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="countryOfOrigin">{t(language, "countryOrigin")}</Label>
                <Input id="countryOfOrigin" placeholder="e.g., Syria, South Sudan, Somalia, DRC" value={profile.countryOfOrigin} onChange={(event) => update({ countryOfOrigin: event.target.value })} aria-invalid={Boolean(errors.countryOfOrigin)} />
                {errors.countryOfOrigin && <p className="text-xs font-medium text-destructive">{errors.countryOfOrigin}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="countryOfQualification">{t(language, "countryQualification")}</Label>
                <Input id="countryOfQualification" placeholder="Country of institution or training" value={profile.countryOfQualification} onChange={(event) => update({ countryOfQualification: event.target.value })} aria-invalid={Boolean(errors.countryOfQualification)} />
                {errors.countryOfQualification && <p className="text-xs font-medium text-destructive">{errors.countryOfQualification}</p>}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rolesHeld">{t(language, "rolesHeld")}</Label>
              <Input id="rolesHeld" placeholder="e.g., Site Engineer; QA/QC Lead; Project Supervisor" value={profile.rolesHeld} onChange={(event) => update({ rolesHeld: event.target.value })} aria-invalid={Boolean(errors.rolesHeld)} />
              {errors.rolesHeld && <p className="text-xs font-medium text-destructive">{errors.rolesHeld}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="workSummary">{t(language, "workSummary")}</Label>
              <Textarea id="workSummary" rows={5} placeholder="Describe responsibilities, equipment or tools used, standards followed, team sizes, and measurable achievements..." value={profile.workSummary} onChange={(event) => update({ workSummary: event.target.value })} aria-invalid={Boolean(errors.workSummary)} />
              {errors.workSummary && <p className="text-xs font-medium text-destructive">{errors.workSummary}</p>}
            </div>
          </section>

          <section className="space-y-3 border-t border-border pt-5" aria-labelledby="skills-heading">
            <div>
              <h2 id="skills-heading" className="font-serif text-lg font-bold">{t(language, "skills")}</h2>
              <p className="text-xs text-muted-foreground">Select relevant skills and add your own. These inform the mapping report, not the practical score.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {SKILL_SUGGESTIONS.map((group) => (
                <fieldset key={group.group} className="rounded-lg border border-border bg-surface-subtle p-3">
                  <legend className="px-1 text-xs font-semibold uppercase tracking-wider text-primary">{group.group}</legend>
                  <div className="space-y-2">
                    {group.values.map((skill) => (
                      <div key={skill} className="flex items-center gap-2">
                        <Checkbox id={`skill-${skill}`} checked={profile.skills.includes(skill)} onCheckedChange={(checked) => toggleSkill(skill, checked === true)} />
                        <Label htmlFor={`skill-${skill}`} className="cursor-pointer text-xs font-normal text-foreground">{skill}</Label>
                      </div>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>
            <div className="flex gap-2">
              <Input aria-label="Add a specific skill" placeholder="Add a specific skill..." value={customSkill} onChange={(event) => setCustomSkill(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addCustomSkill(); } }} />
              <Button type="button" variant="outline" onClick={addCustomSkill} disabled={!customSkill.trim()} className="gap-1.5"><Plus className="size-4" aria-hidden="true" />Add</Button>
            </div>
            {profile.skills.length > 0 && (
              <ul className="flex flex-wrap gap-2" aria-label="Selected skills">
                {profile.skills.map((skill) => (
                  <li key={skill} className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                    {skill}<button type="button" onClick={() => toggleSkill(skill, false)} aria-label={`Remove ${skill}`} className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><X className="size-3" aria-hidden="true" /></button>
                  </li>
                ))}
              </ul>
            )}
            {errors.skills && <p className="text-xs font-medium text-destructive">{errors.skills}</p>}
          </section>

          <section className="space-y-4 border-t border-border pt-5" aria-labelledby="evidence-heading">
            <div>
              <h2 id="evidence-heading" className="font-serif text-lg font-bold">Documents &amp; alternative evidence</h2>
              <p className="text-xs text-muted-foreground">Evidence supports a preliminary classification. It is never treated as automatically verified.</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="documentStatus">{t(language, "documentStatus")}</Label>
              <Select value={profile.documentStatus} onValueChange={(documentStatus) => update({ documentStatus: documentStatus as DocumentStatus, hasInstitutionalVerification: false })}>
                <SelectTrigger id="documentStatus" aria-invalid={Boolean(errors.documentStatus)}><SelectValue placeholder={t(language, "selectStatus")} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">{t(language, "available")}</SelectItem>
                  <SelectItem value="partial">{t(language, "partial")}</SelectItem>
                  <SelectItem value="lost">{t(language, "lost")}</SelectItem>
                  <SelectItem value="never_issued">{t(language, "neverIssued")}</SelectItem>
                </SelectContent>
              </Select>
              {errors.documentStatus && <p className="text-xs font-medium text-destructive">{errors.documentStatus}</p>}
            </div>
            {(profile.documentStatus === "available" || profile.documentStatus === "partial") && (
              <div className="flex items-start gap-3 rounded-lg border border-border bg-surface-subtle p-4">
                <Checkbox id="institutionalVerification" checked={profile.hasInstitutionalVerification} onCheckedChange={(checked) => update({ hasInstitutionalVerification: checked === true })} className="mt-0.5" />
                <div><Label htmlFor="institutionalVerification" className="cursor-pointer font-medium">{t(language, "verifiedDocuments")}</Label><p className="text-xs text-muted-foreground">Attach the verification letter below. SkillVerify AI does not verify institutions itself.</p></div>
              </div>
            )}
            <div className="grid gap-5 lg:grid-cols-2">
              <EvidenceDropzone id="qualificationFiles" label={t(language, "qualificationDocuments")} description="Certificates, transcripts, licences, or institutional verification letters." files={profile.qualificationFiles} onChange={(qualificationFiles) => update({ qualificationFiles })} />
              <EvidenceDropzone id="alternativeEvidenceFiles" label={t(language, "alternativeEvidence")} description="Portfolios, work samples, photographs, reference letters, or project records." files={profile.alternativeEvidenceFiles} onChange={(alternativeEvidenceFiles) => update({ alternativeEvidenceFiles })} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="alternativeEvidenceNotes">{t(language, "alternativeNotes")}</Label>
              <Textarea id="alternativeEvidenceNotes" rows={3} placeholder="Name reference relationships, portfolio contents, work samples, or how evidence can be checked. Do not enter sensitive identity numbers." value={profile.alternativeEvidenceNotes} onChange={(event) => update({ alternativeEvidenceNotes: event.target.value })} />
            </div>
          </section>

          <section className="space-y-3 border-t border-border pt-5">
            <div className="flex items-start gap-3 rounded-lg border border-primary/25 bg-accent/50 p-4">
              <ShieldAlert className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
              <p className="text-xs leading-relaxed text-foreground">{t(language, "aiNotice")}</p>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-border bg-surface-subtle p-4">
              <Checkbox id="candidateConsent" checked={profile.consent} onCheckedChange={(checked) => update({ consent: checked === true })} className="mt-0.5" aria-invalid={Boolean(errors.consent)} />
              <div><Label htmlFor="candidateConsent" className="cursor-pointer font-medium leading-relaxed">{t(language, "consent")}</Label><p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground"><FileWarning className="size-3.5 shrink-0 text-primary" aria-hidden="true" />You can clear this browser's saved assessment by starting a new one.</p></div>
            </div>
            {errors.consent && <p className="text-xs font-medium text-destructive">{errors.consent}</p>}
          </section>

          <div className="flex flex-col items-stretch justify-between gap-3 border-t border-border pt-5 sm:flex-row sm:items-center">
            <p className="text-xs text-muted-foreground">Mode: <span className="font-medium text-foreground">{demoMode ? "Demo Mode (Pre-filled AI)" : "Live Gemini 2.5 Flash"}</span></p>
            <Button type="submit" size="lg" disabled={isLoading} className="gap-2">
              {isLoading ? <><Loader2 className="size-4 animate-spin" aria-hidden="true" />{t(language, "analyzing")}</> : <>{t(language, "analyze")}<ArrowRight className="size-4" aria-hidden="true" /></>}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
