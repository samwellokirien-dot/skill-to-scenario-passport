export interface ProfessionGuidance {
  potentialLocalPathway: string;
  regulatoryBodies: string[];
  trainingInstitution: string;
  indicativeKnqfLevel: string;
  internationalFramework: string;
}

export const PROFESSION_OPTIONS = [
  { value: "Registered Nurse", label: "Healthcare — Registered Nurse" },
  { value: "Civil Engineer", label: "Engineering — Civil Engineer" },
  { value: "Software Developer", label: "ICT — Software Developer" },
  { value: "Teacher", label: "Education — Teacher" },
  { value: "Electrician", label: "Technical Trades — Electrician" },
  { value: "Accountant", label: "Finance — Accountant" },
  { value: "Agriculture Specialist", label: "Agriculture" },
  { value: "Business Professional", label: "Business" },
  { value: "Other", label: "Other profession" },
] as const;

const GUIDANCE: Record<string, ProfessionGuidance> = {
  "Registered Nurse": {
    potentialLocalPathway: "Nursing Council of Kenya foreign-trained nurse assessment, registration review, and KNQA recognition support",
    regulatoryBodies: ["Nursing Council of Kenya (NCK)", "Kenya National Qualifications Authority (KNQA)"],
    trainingInstitution: "Kenya Medical Training College (KMTC) or an NCK-recognised CPD provider",
    indicativeKnqfLevel: "Indicative KNQF Level 6–7 review, subject to KNQA and NCK decisions",
    internationalFramework: "ISCED-aligned nursing education review and WHO competency references; no equivalency decision",
  },
  "Civil Engineer": {
    potentialLocalPathway: "Engineers Board of Kenya registration review with KNQA qualification recognition and supervised practice evidence",
    regulatoryBodies: ["Engineers Board of Kenya (EBK)", "Kenya National Qualifications Authority (KNQA)", "National Construction Authority (NCA)"],
    trainingInstitution: "NCA-accredited training provider or recognised engineering institution",
    indicativeKnqfLevel: "Indicative KNQF Level 7 review, subject to KNQA and EBK decisions",
    internationalFramework: "ISCED-aligned engineering education review and Washington Accord references; no equivalency decision",
  },
  "Software Developer": {
    potentialLocalPathway: "KNQA Recognition of Prior Learning portfolio review and a TVETA-accredited ICT competency assessment",
    regulatoryBodies: ["Kenya National Qualifications Authority (KNQA)", "TVETA", "ICT Authority Kenya"],
    trainingInstitution: "TVETA-accredited ICT institution or recognised professional training provider",
    indicativeKnqfLevel: "Indicative KNQF Level 6–7 review, subject to KNQA assessment",
    internationalFramework: "ISCED-aligned ICT learning review and SFIA competency references; no equivalency decision",
  },
  Teacher: {
    potentialLocalPathway: "Teachers Service Commission registration review with KNQA recognition of teacher education and teaching practice evidence",
    regulatoryBodies: ["Teachers Service Commission (TSC)", "Kenya National Qualifications Authority (KNQA)"],
    trainingInstitution: "Recognised teacher education institution or TSC-approved CPD provider",
    indicativeKnqfLevel: "Indicative KNQF Level 6–7 review, subject to KNQA and TSC decisions",
    internationalFramework: "ISCED-aligned teacher education review; no equivalency or registration decision",
  },
  Electrician: {
    potentialLocalPathway: "EPRA electrician licensing pathway with NITA trade testing and KNQA/TVETA prior-learning assessment",
    regulatoryBodies: ["Energy and Petroleum Regulatory Authority (EPRA)", "NITA", "TVETA", "KNQA"],
    trainingInstitution: "TVETA-accredited electrical training institution or NITA trade-test centre",
    indicativeKnqfLevel: "Indicative KNQF Level 4–6 review, subject to trade testing and KNQA assessment",
    internationalFramework: "ISCED-aligned vocational education review and IEC wiring references; no equivalency decision",
  },
  Accountant: {
    potentialLocalPathway: "ICPAK professional registration review with KASNEB qualification assessment and KNQA recognition support",
    regulatoryBodies: ["Institute of Certified Public Accountants of Kenya (ICPAK)", "KASNEB", "KNQA"],
    trainingInstitution: "KASNEB-recognised trainer or ICPAK-approved CPD provider",
    indicativeKnqfLevel: "Indicative KNQF Level 6–7 review, subject to KASNEB, ICPAK, and KNQA decisions",
    internationalFramework: "ISCED-aligned accounting education review and IFAC competency references; no equivalency decision",
  },
  "Agriculture Specialist": {
    potentialLocalPathway: "KNQA prior-learning review and practical assessment through a recognised agricultural or TVETA institution",
    regulatoryBodies: ["Kenya National Qualifications Authority (KNQA)", "TVETA", "County Department of Agriculture"],
    trainingInstitution: "Recognised agricultural training institute or TVETA-accredited provider",
    indicativeKnqfLevel: "Indicative KNQF Level 5–7 review, subject to evidence and KNQA assessment",
    internationalFramework: "ISCED-aligned agricultural learning review; no equivalency decision",
  },
  "Business Professional": {
    potentialLocalPathway: "KNQA Recognition of Prior Learning portfolio review and sector-relevant professional assessment",
    regulatoryBodies: ["Kenya National Qualifications Authority (KNQA)", "TVETA", "NITA"],
    trainingInstitution: "TVETA-accredited business training institution or recognised professional body",
    indicativeKnqfLevel: "Indicative KNQF Level 5–7 review, subject to evidence and KNQA assessment",
    internationalFramework: "ISCED-aligned business education review; no equivalency decision",
  },
};

const DEFAULT_GUIDANCE: ProfessionGuidance = {
  potentialLocalPathway: "KNQA Recognition of Prior Learning review and referral to the relevant Kenyan sector regulator or professional body",
  regulatoryBodies: ["Kenya National Qualifications Authority (KNQA)", "Relevant sector regulator or professional body"],
  trainingInstitution: "KNQA/TVETA-recognised assessment centre or sector training institution",
  indicativeKnqfLevel: "Indicative KNQF level to be determined after evidence review; no level is awarded here",
  internationalFramework: "ISCED-aligned preliminary review only; no equivalency decision",
};

export function getProfessionGuidance(profession: string): ProfessionGuidance {
  return GUIDANCE[profession] ?? DEFAULT_GUIDANCE;
}
