import { ArrowRight, FileWarning, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SAMPLE_PERSONAS } from "@/lib/skillverify-demo";
import type { CandidateProfile, ProfileValidationErrors } from "@/lib/skillverify-types";

interface Step1MapperProps {
  profile: CandidateProfile;
  errors: ProfileValidationErrors;
  isLoading: boolean;
  demoMode: boolean;
  onChange: (next: CandidateProfile) => void;
  onSelectPersona: (personaId: string) => void;
  onSubmit: () => void;
}

export function Step1Mapper({
  profile,
  errors,
  isLoading,
  demoMode,
  onChange,
  onSelectPersona,
  onSubmit,
}: Step1MapperProps) {
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Card className="border-border bg-card shadow-xs">
      <CardHeader className="border-b border-border pb-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Step 1 of 3
            </p>
            <CardTitle className="mt-1 font-serif text-2xl font-bold text-foreground">
              Foreign Qualification &amp; Experience Mapper
            </CardTitle>
            <CardDescription className="mt-1 text-sm text-muted-foreground">
              Enter your professional background to map Kenyan/international equivalents and generate 3 practical scenarios.
            </CardDescription>
          </div>

          <div className="w-full sm:w-72">
            <Label htmlFor="sample-persona" className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Load Sample Persona
            </Label>
            <Select value={profile.personaId ?? ""} onValueChange={onSelectPersona}>
              <SelectTrigger id="sample-persona" aria-label="Load Sample Persona">
                <SelectValue placeholder="Choose a sample candidate..." />
              </SelectTrigger>
              <SelectContent>
                {SAMPLE_PERSONAS.map((persona) => (
                  <SelectItem key={persona.id} value={persona.id}>
                    {persona.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleFormSubmit} className="space-y-5" noValidate>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="profession">Claimed Profession</Label>
              <Input
                id="profession"
                placeholder="e.g., Civil Engineer, Registered Nurse, Electrician"
                value={profile.profession}
                onChange={(e) => {
                  const { personaId: _removed, ...rest } = profile;
                  onChange({ ...rest, profession: e.target.value });
                }}
                aria-invalid={Boolean(errors.profession)}
              />
              {errors.profession && (
                <p className="text-xs font-medium text-destructive">{errors.profession}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="yearsOfExperience">Years of Experience</Label>
              <Input
                id="yearsOfExperience"
                type="number"
                min={0}
                max={60}
                step={1}
                placeholder="e.g., 6"
                value={profile.yearsOfExperience}
                onChange={(e) => onChange({ ...profile, yearsOfExperience: e.target.value })}
                aria-invalid={Boolean(errors.yearsOfExperience)}
              />
              {errors.yearsOfExperience && (
                <p className="text-xs font-medium text-destructive">{errors.yearsOfExperience}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="countryOfOrigin">Country of Origin</Label>
            <Input
              id="countryOfOrigin"
              placeholder="e.g., Syria, South Sudan, Somalia, DRC"
              value={profile.countryOfOrigin}
              onChange={(e) => onChange({ ...profile, countryOfOrigin: e.target.value })}
              aria-invalid={Boolean(errors.countryOfOrigin)}
            />
            {errors.countryOfOrigin && (
              <p className="text-xs font-medium text-destructive">{errors.countryOfOrigin}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="workSummary">Summary of Past Work &amp; Core Responsibilities</Label>
            <Textarea
              id="workSummary"
              rows={4}
              placeholder="Describe roles held, technical standards or equipment used, team sizes, and key responsibilities..."
              value={profile.workSummary}
              onChange={(e) => onChange({ ...profile, workSummary: e.target.value })}
              aria-invalid={Boolean(errors.workSummary)}
            />
            {errors.workSummary && (
              <p className="text-xs font-medium text-destructive">{errors.workSummary}</p>
            )}
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-border bg-surface-subtle p-4">
            <Checkbox
              id="documentsLost"
              checked={profile.documentsLost}
              onCheckedChange={(checked) => onChange({ ...profile, documentsLost: checked === true })}
              className="mt-0.5"
            />
            <div className="space-y-1">
              <Label htmlFor="documentsLost" className="cursor-pointer font-medium text-foreground">
                Physical documents lost/unavailable
              </Label>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <FileWarning className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
                Activates the KNQA Recognition of Prior Learning (RPL) &amp; competency-first verification pathway.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-stretch justify-between gap-3 border-t border-border pt-5 sm:flex-row sm:items-center">
            <p className="text-xs text-muted-foreground">
              Mode:{" "}
              <span className="font-medium text-foreground">
                {demoMode ? "Demo Mode (Pre-filled AI)" : "Live Gemini 2.5 Flash"}
              </span>
            </p>
            <Button type="submit" size="lg" disabled={isLoading} className="gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Analyzing &amp; Generating Scenarios...
                </>
              ) : (
                <>
                  Analyze &amp; Generate Assessment
                  <ArrowRight className="size-4" aria-hidden="true" />
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}