import type {
  AssessmentAnalysis,
  BridgingMilestone,
  CandidateProfile,
  CompetencyLevel,
  CompetencyPassport,
  ScenarioQuestion,
  ValidatedSkill,
} from "./skillverify-types";

export interface SamplePersona {
  id: string;
  label: string;
  profile: CandidateProfile;
}

export const SAMPLE_PERSONAS: SamplePersona[] = [
  {
    id: "syria-civil-engineer",
    label: "Displaced Civil Engineer from Syria (8 yrs)",
    profile: {
      personaId: "syria-civil-engineer",
      profession: "Civil Engineer (Structural & Site Supervision)",
      countryOfOrigin: "Syria",
      yearsOfExperience: "8",
      workSummary:
        "Led structural inspection, reinforced concrete mix verification, and municipal road drainage rehabilitation for residential and public-works projects in Aleppo and Damascus. Managed site crews of 35+ workers, reviewed AutoCAD drawings, and prepared bills of quantities and QA/QC compliance logs.",
      documentsLost: true,
    },
  },
  {
    id: "south-sudan-nurse",
    label: "Registered Nurse from South Sudan (6 yrs)",
    profile: {
      personaId: "south-sudan-nurse",
      profession: "Registered Clinical Nurse (Emergency & Maternal Care)",
      countryOfOrigin: "South Sudan",
      yearsOfExperience: "6",
      workSummary:
        "Provided inpatient triage, emergency stabilization, maternal-child immunization, and infection prevention at Juba Teaching Hospital and regional primary health clinics. Administered IV therapy, monitored post-operative patients, managed cold-chain vaccine stock, and trained community health volunteers.",
      documentsLost: true,
    },
  },
];

function buildCivilEngineerAnalysis(profile: CandidateProfile): AssessmentAnalysis {
  return {
    source: "demo",
    translation: {
      kenyanEquivalent: "Bachelor of Science in Civil Engineering — Graduate / Consulting Site Engineer Track",
      kenyanAuthority: "Engineers Board of Kenya (EBK) & Kenya National Qualifications Authority (KNQA)",
      internationalEquivalent: "ISCED Level 6 / EQF Level 6 — Civil & Structural Engineering",
      knqfLevel: "KNQF Level 7 (Degree Equivalent)",
      recognitionPathway: profile.documentsLost
        ? "KNQA Recognition of Prior Learning (RPL) + UNESCO Qualifications Passport (UQP) Portfolio Track"
        : "Direct Foreign Qualification Equation via KNQA & EBK Academic Verification",
      summaryNote:
        "Mapped 8 years of structural supervision and municipal drainage rehabilitation in Syria to Kenyan site engineering standards (BS/Eurocode & NCA site compliance).",
    },
    questions: [
      {
        id: "q1",
        title: "Reinforced Concrete Slump Failure on Pour Day",
        competencyArea: "Structural QA/QC & Materials Testing",
        scenario:
          "During a slab pour for a 4-storey clinic in Nairobi, a ready-mix truck arrives with a measured slump of 195 mm instead of the specified 100 mm (±25 mm). The foreman wants to pour immediately to avoid crane standby charges.",
        prompt:
          "Explain step by step how you would handle the batch, protect structural integrity, and document the decision on site.",
        sampleAnswer:
          "I would halt the pour immediately and reject the non-conforming batch because excessive slump signals high water-cement ratio, risking honeycombing, segregation, and reduced compressive strength. I would inspect the batching ticket for unauthorized water addition, take control test cubes only if an approved plasticizer adjustment is verified by the supplier's QA engineer, log a Non-Conformance Report (NCR) in the site diary, notify the Resident Engineer, and reschedule the pour joint at a low-shear zone per BS 8110 / Eurocode 2.",
        expectedKeywords: ["reject", "water", "strength", "cube", "log", "report", "halt", "eurocode", "segregation"],
      },
      {
        id: "q2",
        title: "Unexpected Soft Black Cotton Soil in Foundation Trench",
        competencyArea: "Geotechnical Risk & Foundation Engineering",
        scenario:
          "Excavation for pad footings at 1.5 m depth exposes expansive black cotton clay not shown in the preliminary sketch, with seasonal groundwater seepage entering the trench.",
        prompt:
          "What immediate site actions and engineering redesign recommendations would you initiate before placing blinding concrete?",
        sampleAnswer:
          "I would stop blinding placement and dewater the trench safely while protecting trench walls with shoring to prevent collapse. Next, I would request a geotechnical bearing capacity test and Atterberg limits check, excavate the expansive clay down to a stable stratum or specify engineered hardcore/granular replacement with geotextile separation, and ask the structural designer to confirm whether strip footings, ground beams, or deeper pads are required under Kenyan building code.",
        expectedKeywords: ["stop", "dewater", "soil", "bearing", "excavate", "geotechnical", "footing", "shoring"],
      },
      {
        id: "q3",
        title: "Site Safety & Storm Drainage Redesign Under Budget Pressure",
        competencyArea: "Site Safety (OSHA) & Hydraulic Drainage",
        scenario:
          "Heavy rains flood an active urban drainage culvert site, washing out temporary barriers near a pedestrian walkway. The contractor asks to narrow the culvert invert by 20% to recover schedule and cost.",
        prompt:
          "How do you address public safety right now and evaluate the contractor's proposed culvert reduction?",
        sampleAnswer:
          "First, I would secure the perimeter with rigid barricades, warning signage, and safe pedestrian diversion under Kenya OSHA 2007 and NCA safety rules, and pump out standing water. Second, I would decline any arbitrary 20% reduction in culvert cross-section without hydraulic recalculation of peak storm runoff (Rational Method) and velocity checks, because undersizing risks backwater flooding and scour. Any value-engineering change requires formal client approval and revised drawings.",
        expectedKeywords: ["safety", "barricade", "hydraulic", "runoff", "flood", "decline", "drawing", "approval"],
      },
    ],
  };
}

function buildNurseAnalysis(profile: CandidateProfile): AssessmentAnalysis {
  return {
    source: "demo",
    translation: {
      kenyanEquivalent: "Kenya Registered Community Health Nurse (KRCHN) — Clinical Practice Track",
      kenyanAuthority: "Nursing Council of Kenya (NCK) & Kenya National Qualifications Authority (KNQA)",
      internationalEquivalent: "ISCED Level 5–6 / WHO Competency Framework — Registered Nurse",
      knqfLevel: "KNQF Level 6 (Higher Diploma / Degree Equivalent)",
      recognitionPathway: profile.documentsLost
        ? "NCK Foreign-Trained Nurse Competency Assessment + KNQA RPL Portfolio Verification"
        : "NCK Credential Verification & Licensure Examination Pathway",
      summaryNote:
        "Mapped 6 years of emergency triage, maternal-child care, and infection prevention in South Sudan to NCK clinical nursing standards.",
    },
    questions: [
      {
        id: "q1",
        title: "Multi-Patient Emergency Triage in a Busy Outpatient Clinic",
        competencyArea: "Emergency Triage & Clinical Prioritization",
        scenario:
          "Three patients arrive simultaneously: (A) a 4-year-old child with lethargy, sunken eyes, and capillary refill > 3 seconds; (B) a pregnant woman at 34 weeks with BP 165/110 mmHg and severe headache; (C) an adult with a clean 4 cm forearm laceration and stable vitals.",
        prompt:
          "State your triage order, immediate stabilization actions for the top priorities, and escalation steps.",
        sampleAnswer:
          "Both Patient A (severe dehydration/hypovolemic shock) and Patient B (severe pre-eclampsia with imminent eclampsia risk) are immediate red emergencies. I would call for backup immediately, initiate IV access and isotonic fluid bolus per IMCI/ETAT+ guidelines while checking blood glucose for the child, and place the pregnant mother in left-lateral position, monitor vitals and fetal heart rate, administer magnesium sulfate and antihypertensive per physician order/MoH obstetric protocol, and prepare urgent referral. Patient C receives pressure dressing and waits safely in yellow/green priority.",
        expectedKeywords: ["triage", "shock", "dehydration", "eclampsia", "iv", "magnesium", "vitals", "escalate"],
      },
      {
        id: "q2",
        title: "Vaccine Cold-Chain Temperature Excursion",
        competencyArea: "Immunization & Cold-Chain Management",
        scenario:
          "Opening the clinic EPI refrigerator at 08:00, you see the digital logger peaked at +11°C for 5 hours overnight due to a power outage. Thirty mothers are waiting for routine childhood vaccinations.",
        prompt:
          "What exact protocol do you follow before administering any vaccine doses?",
        sampleAnswer:
          "I would not administer any vaccines from the affected fridge until viability is verified. I would quarantine and label the stock as 'DO NOT USE — Pending Cold-Chain Assessment', check each vial's Vaccine Vial Monitor (VVM) stage and shake-test eligibility where applicable, record the excursion in the EPI temperature log, transfer unaffected/backup stock to conditioned ice-lined carriers, and contact the Sub-County EPI Cold-Chain Officer for replacement vials and guidance before resuming immunization.",
        expectedKeywords: ["quarantine", "vvm", "do not", "temperature", "log", "supervisor", "officer", "carrier"],
      },
      {
        id: "q3",
        title: "Post-Operative Sepsis Warning Signs & Infection Control",
        competencyArea: "Infection Prevention & Clinical Escalation",
        scenario:
          "On night shift, a post-cesarean patient develops a temperature of 39.1°C, pulse 124 bpm, foul-smelling wound exudate, and mild confusion.",
        prompt:
          "Outline your immediate nursing assessment, infection-prevention precautions, and structured handover to the on-call clinician.",
        sampleAnswer:
          "These are red-flag signs of post-operative sepsis. I would perform a full ABCDE assessment including oxygen saturation, blood pressure, and urine output, apply standard and contact precautions with hand hygiene and sterile PPE before inspecting the wound, obtain prescribed blood/wound cultures before starting IV broad-spectrum antibiotics and IV fluids per sepsis bundle, and give a structured SBAR handover to the on-call doctor while documenting trends closely.",
        expectedKeywords: ["sepsis", "antibiotic", "vitals", "sbar", "ppe", "hand", "fluid", "escalate"],
      },
    ],
  };
}

function buildCustomAnalysis(profile: CandidateProfile): AssessmentAnalysis {
  const role = profile.profession.trim();
  const origin = profile.countryOfOrigin.trim();
  const years = Number(profile.yearsOfExperience) || 0;

  return {
    source: "demo",
    translation: {
      kenyanEquivalent: `${role} — KNQA / TVETA Skilled Practitioner Equivalent`,
      kenyanAuthority: "Kenya National Qualifications Authority (KNQA) & Relevant Sector Regulatory Body",
      internationalEquivalent:
        years >= 5
          ? `ISCED Level 6 / EQF Level 6 — Senior ${role}`
          : `ISCED Level 5 / EQF Level 5 — Certified ${role}`,
      knqfLevel: years >= 5 ? "KNQF Level 6–7 (Diploma / Degree Equivalent)" : "KNQF Level 5–6 (Craft / Diploma Equivalent)",
      recognitionPathway: profile.documentsLost
        ? "KNQA Recognition of Prior Learning (RPL) + Practical Competency Portfolio Assessment"
        : "KNQA Foreign Qualification Equation & Sector Licensing Review",
      summaryNote: `Mapped ${years} years of ${role} practice from ${origin} to Kenyan workplace competency frameworks and international ISCED standards.`,
    },
    questions: [
      {
        id: "q1",
        title: "Quality Assurance & Standards Compliance Under Pressure",
        competencyArea: "Technical Standards & QA/QC",
        scenario: `On a Kenyan worksite as a ${role}, a supervisor asks you to skip a mandatory safety and quality inspection step to meet an urgent client deadline.`,
        prompt:
          "How would you handle the request, uphold technical standards, and document your professional decision?",
        sampleAnswer: `I would pause the task, explain the specific safety and compliance risks of skipping verification in ${role} work, propose a fast-track inspection sequence that preserves mandatory checks, and record the inspection metrics and sign-off in the official log before proceeding.`,
        expectedKeywords: ["safety", "standard", "inspect", "document", "risk", "verify", "log", "compliance"],
      },
      {
        id: "q2",
        title: "Diagnosing an Unexpected Operational Fault",
        competencyArea: "Applied Problem-Solving & Root-Cause Analysis",
        scenario: `Halfway through a critical ${role} deliverable, an unexpected fault threatens both delivery quality and team safety, with limited replacement resources on hand.`,
        prompt:
          "Walk through how you isolate the root cause, implement a safe interim mitigation, and verify the final fix.",
        sampleAnswer:
          "I would isolate the affected area to prevent harm, gather baseline measurements to pinpoint the root cause rather than masking symptoms, apply a documented interim control within safety tolerances, escalate resource needs clearly to the lead, and run a final verification check before returning to full operation.",
        expectedKeywords: ["isolate", "root", "safety", "verify", "check", "escalate", "mitigation", "document"],
      },
      {
        id: "q3",
        title: "Cross-Cultural Handover & Local Regulatory Alignment",
        competencyArea: "Communication, Ethics & Local Regulation",
        scenario: `You are collaborating with a Kenyan team whose reporting procedures and local codes differ slightly from what you used in ${origin}.`,
        prompt:
          "How do you align your technical workflow with local regulations while ensuring clear handover to colleagues?",
        sampleAnswer:
          "I would review the Kenyan statutory guidelines and site SOPs first, cross-check terminology and units with my supervisor, use structured written handover notes covering completed work and open risks, and confirm mutual understanding with the incoming team.",
        expectedKeywords: ["regulation", "sop", "handover", "confirm", "code", "document", "team", "standard"],
      },
    ],
  };
}

export function generateDemoAnalysis(profile: CandidateProfile): AssessmentAnalysis {
  const roleLower = profile.profession.toLowerCase();
  if (profile.personaId === "syria-civil-engineer" || roleLower.includes("civil engineer")) {
    return buildCivilEngineerAnalysis(profile);
  }
  if (profile.personaId === "south-sudan-nurse" || roleLower.includes("nurse")) {
    return buildNurseAnalysis(profile);
  }
  return buildCustomAnalysis(profile);
}

export function evaluateDemoAssessment(
  profile: CandidateProfile,
  analysis: AssessmentAnalysis,
  answers: Record<string, string>,
): CompetencyPassport {
  let totalPoints = 0;
  const validatedSkills: ValidatedSkill[] = analysis.questions.map((q) => {
    const answerText = (answers[q.id] ?? "").trim();
    const lower = answerText.toLowerCase();
    const wordCount = answerText.split(/\s+/).filter(Boolean).length;
    const matchedKeywords = q.expectedKeywords.filter((kw) => lower.includes(kw));

    const depthScore = Math.min(45, wordCount * 1.1);
    const keywordScore = Math.min(55, (matchedKeywords.length / Math.max(3, q.expectedKeywords.length * 0.55)) * 55);
    const questionScore = Math.round(Math.min(100, Math.max(38, depthScore + keywordScore)));
    totalPoints += questionScore;

    const proficiency: CompetencyLevel =
      questionScore >= 80 ? "Senior" : questionScore >= 60 ? "Competent" : "Emerging";

    const evidence =
      matchedKeywords.length >= 3
        ? `Demonstrated structured practical reasoning covering ${matchedKeywords.slice(0, 3).join(", ")} with clear operational sequencing.`
        : wordCount >= 25
          ? "Provided a coherent field response with practical awareness; would benefit from explicit regulatory and documentation steps."
          : "Identified core priorities briefly; deeper technical troubleshooting and formal compliance documentation recommended.";

    return {
      skill: q.competencyArea,
      proficiency,
      evidence,
    };
  });

  const overallScore = Math.round(totalPoints / Math.max(1, analysis.questions.length));
  const years = Number(profile.yearsOfExperience) || 0;
  const competencyLevel: CompetencyLevel =
    overallScore >= 82 && years >= 5 ? "Senior" : overallScore >= 62 ? "Competent" : "Emerging";

  const isCivil = profile.profession.toLowerCase().includes("civil engineer");
  const isNurse = profile.profession.toLowerCase().includes("nurse");

  const bridgingPlan: BridgingMilestone[] = isCivil
    ? [
        {
          week: "Week 1 (Days 1–7)",
          sdgTag: "SDG 4",
          title: "KNQA RPL Portfolio & UNESCO Qualifications Passport Intake",
          action:
            "Compile this AI Competency Passport, project logs, and sworn affidavit for lost credentials to open a KNQA Recognition of Prior Learning (RPL) file.",
          partnerOrBody: "KNQA / UNHCR Kenya Education & Livelihoods Desk",
        },
        {
          week: "Week 2 (Days 8–14)",
          sdgTag: "SDG 4",
          title: "Kenyan Building Code & Eurocode/BS 8110 Bridging Module",
          action:
            "Complete a 10-hour online refresher on National Construction Authority (NCA) site supervision rules, Kenya OSHA 2007, and local soil/concrete standards.",
          partnerOrBody: "National Construction Authority (NCA) / TVETA",
        },
        {
          week: "Week 3 (Days 15–21)",
          sdgTag: "SDG 8",
          title: "EBK Graduate Engineer Registration & Supervised Assessment",
          action:
            "Submit translated competency evidence to the Engineers Board of Kenya (EBK) and schedule a technical panel interview for provisional registration.",
          partnerOrBody: "Engineers Board of Kenya (EBK)",
        },
        {
          week: "Week 4 (Days 22–30)",
          sdgTag: "SDG 8",
          title: "Verified Employer Placement & Work Permit Linkage",
          action:
            "Share your Verified Competency Passport with ILO-partnered infrastructure contractors and initiate Refugee ID / Class M work authorization support.",
          partnerOrBody: "ILO PROSPECTS Kenya / Refugee Affairs Secretariat",
        },
      ]
    : isNurse
      ? [
          {
            week: "Week 1 (Days 1–7)",
            sdgTag: "SDG 4",
            title: "KNQA RPL Dossier & NCK Foreign-Trained Nurse Application",
            action:
              "Submit this Competency Passport and displacement attestation to initiate Recognition of Prior Learning (RPL) and NCK clinical eligibility screening.",
            partnerOrBody: "Nursing Council of Kenya (NCK) / KNQA",
          },
          {
            week: "Week 2 (Days 8–14)",
            sdgTag: "SDG 4",
            title: "Kenya MoH Clinical Protocols & EPI Cold-Chain Refresher",
            action:
              "Complete accredited CPD modules covering Kenya IMCI/ETAT+ emergency triage, obstetric emergency bundles, and National EPI cold-chain guidelines.",
            partnerOrBody: "Kenya Medical Training College (KMTC) / MoH",
          },
          {
            week: "Week 3 (Days 15–21)",
            sdgTag: "SDG 8",
            title: "Supervised OSCE Practical Skills Verification",
            action:
              "Complete a 5-day observed clinical attachment and OSCE skills check at an accredited county referral hospital to unlock temporary practice clearance.",
            partnerOrBody: "NCK Accredited County Referral Hospital",
          },
          {
            week: "Week 4 (Days 22–30)",
            sdgTag: "SDG 8",
            title: "Decent Work Placement in Public & Humanitarian Health Clinics",
            action:
              "Match with verified NGO and county health employers through ILO/UNHCR livelihood partners with documented NCK bridging status.",
            partnerOrBody: "ILO PROSPECTS / Kenya Red Cross & IRC Health",
          },
        ]
      : [
          {
            week: "Week 1 (Days 1–7)",
            sdgTag: "SDG 4",
            title: "KNQA Recognition of Prior Learning (RPL) Intake",
            action:
              "Present this Competency Passport and work portfolio at a KNQA-accredited RPL assessment center to formally document prior skills.",
            partnerOrBody: "Kenya National Qualifications Authority (KNQA)",
          },
          {
            week: "Week 2 (Days 8–14)",
            sdgTag: "SDG 4",
            title: "Local Standards & Occupational Safety Bridging Workshop",
            action:
              "Complete a short accredited module aligning your core technical practice with Kenyan statutory standards and workplace safety codes.",
            partnerOrBody: "TVETA / Accredited Sector Training Institute",
          },
          {
            week: "Week 3 (Days 15–21)",
            sdgTag: "SDG 8",
            title: "Practical Trade / Professional Body Verification",
            action:
              "Undergo a focused practical skills demonstration with the relevant Kenyan regulatory body to obtain provisional certification.",
            partnerOrBody: "Sector Regulatory Body / NITA",
          },
          {
            week: "Week 4 (Days 22–30)",
            sdgTag: "SDG 8",
            title: "Employer Matching & Decent Work Onboarding",
            action:
              "Share your verified passport with local employers and ILO livelihood partners to transition into formal, protected employment.",
            partnerOrBody: "ILO PROSPECTS Kenya / Local Chamber of Commerce",
          },
        ];

  const codeSuffix = String(Math.abs(overallScore * 73 + years * 19 + profile.profession.length * 31)).slice(0, 5).padStart(5, "0");

  return {
    passportId: `SV-ILO-2026-${codeSuffix}`,
    issuedAt: new Date().toLocaleDateString("en-KE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    competencyLevel,
    overallScore,
    evaluatorSummary:
      competencyLevel === "Senior"
        ? `Candidate demonstrated strong field-ready judgment across all three ${profile.profession} scenarios, consistently prioritizing safety, technical standards, and formal escalation.`
        : competencyLevel === "Competent"
          ? `Candidate showed solid operational capability in ${profile.profession} scenarios and is ready for targeted Kenyan regulatory bridging toward full local licensure.`
          : `Candidate demonstrated foundational awareness in ${profile.profession}; structured local refresher training and supervised practice are recommended prior to independent licensing.`,
    validatedSkills,
    bridgingPlan,
    source: "demo",
  };
}