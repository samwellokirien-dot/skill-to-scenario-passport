import type { AssessmentAnalysis, CandidateProfile, CompetencyPassport } from "./skillverify-types";

export interface SharedPassportPayload {
  version: 1;
  profile: CandidateProfile;
  analysis: AssessmentAnalysis;
  passport: CompetencyPassport;
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function base64UrlToBytes(value: string): Uint8Array {
  const base64 = value.replaceAll("-", "+").replaceAll("_", "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

export function createSharedPassportPayload(
  profile: CandidateProfile,
  analysis: AssessmentAnalysis,
  passport: CompetencyPassport,
): SharedPassportPayload {
  return {
    version: 1,
    profile,
    analysis: { ...analysis, questions: [] },
    passport,
  };
}

export function encodeSharedPassport(payload: SharedPassportPayload): string {
  return bytesToBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
}

export function decodeSharedPassport(value: string): SharedPassportPayload | null {
  try {
    if (value.length > 250_000) return null;
    const parsed = JSON.parse(new TextDecoder().decode(base64UrlToBytes(value))) as Partial<SharedPassportPayload>;
    if (
      parsed.version !== 1 ||
      !parsed.profile ||
      !parsed.analysis?.mapping ||
      !Array.isArray(parsed.analysis.questions) ||
      !parsed.passport ||
      !Array.isArray(parsed.passport.scenarioScores) ||
      !Array.isArray(parsed.passport.validatedSkills) ||
      !Array.isArray(parsed.passport.skillsGaps) ||
      !Array.isArray(parsed.passport.bridgingPlan) ||
      typeof parsed.passport.overallScore !== "number"
    ) {
      return null;
    }
    return parsed as SharedPassportPayload;
  } catch {
    return null;
  }
}

export function createShareablePassportUrl(payload: SharedPassportPayload, currentUrl: string): string {
  const url = new URL(currentUrl);
  url.hash = `passport=${encodeSharedPassport(payload)}`;
  return url.toString();
}

export function readSharedPassportFromHash(hash: string): SharedPassportPayload | null {
  const parameters = new URLSearchParams(hash.replace(/^#/, ""));
  const encoded = parameters.get("passport");
  return encoded ? decodeSharedPassport(encoded) : null;
}
