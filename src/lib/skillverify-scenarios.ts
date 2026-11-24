import { getAssessmentDifficulty, type CandidateProfile, type ScenarioQuestion } from "./skillverify-types";

type QuestionDraft = Omit<ScenarioQuestion, "id">;

function question(
  title: string,
  competencyArea: string,
  scenario: string,
  prompt: string,
  sampleAnswer: string,
  expectedKeywords: string[],
): QuestionDraft {
  return { title, competencyArea, scenario, prompt, sampleAnswer, expectedKeywords };
}

const CIVIL_QUESTIONS: QuestionDraft[] = [
  question(
    "Reinforced Concrete Slump Failure on Pour Day",
    "Structural QA/QC & Materials Testing",
    "During a slab pour for a four-storey clinic in Nairobi, a ready-mix truck arrives with a measured slump of 195 mm instead of the specified 100 mm (±25 mm). The foreman wants to pour immediately to avoid crane standby charges.",
    "Explain step by step how you would handle the batch, protect structural integrity, and document the decision on site.",
    "I would halt the pour and reject the non-conforming batch because excessive slump can indicate a high water-cement ratio, segregation, and reduced compressive strength. I would inspect the batching ticket for unauthorised water addition, notify the Resident Engineer, and only consider an approved plasticizer adjustment verified by the supplier's QA engineer. I would take control cubes where required, log a Non-Conformance Report in the site diary, communicate the decision to the foreman, and reschedule the pour under the approved Eurocode 2 specification.",
    ["reject", "water", "strength", "cube", "non-conformance", "halt", "eurocode", "segregation"],
  ),
  question(
    "Unexpected Soft Black Cotton Soil in a Foundation Trench",
    "Geotechnical Risk & Structural Load Assessment",
    "Excavation for pad footings at 1.5 m exposes expansive black cotton clay not shown in the preliminary sketch, with seasonal groundwater entering the trench and workers still nearby.",
    "What immediate site actions and engineering redesign recommendations would you initiate before placing blinding concrete?",
    "I would stop blinding placement, isolate the excavation, and install safe access and shoring before dewatering the trench. I would notify the structural designer and request a geotechnical investigation covering bearing capacity and Atterberg limits. After assessing the results, I would compare excavation to a stable stratum, engineered granular replacement with geotextile separation, or deeper foundations. I would not approve a footing redesign without load calculations, revised drawings, and formal engineer approval. All field tests and decisions would be documented.",
    ["stop", "dewater", "soil", "bearing", "geotechnical", "footing", "shoring", "load"],
  ),
  question(
    "Site Safety and Drainage Redesign Under Budget Pressure",
    "Project Management, Public Safety & Hydraulic Design",
    "Heavy rains flood an active urban drainage culvert site and wash out temporary barriers near a pedestrian walkway. The contractor asks to narrow the culvert invert by 20% to recover schedule and cost.",
    "How do you address public safety now, manage the project pressure, and evaluate the proposed culvert reduction?",
    "First I would stop work in the affected zone, install rigid barricades and signage, create a safe pedestrian diversion, and notify the project manager and public safety team. I would pump out standing water only after assessing electrical and collapse risks. I would decline an arbitrary 20% reduction until a hydraulic calculation verifies peak runoff, capacity, velocity, backwater, and scour. I would compare alternatives, document cost and programme impacts, and require revised drawings plus client and engineer approval before implementation.",
    ["safety", "barricade", "hydraulic", "runoff", "flood", "decline", "drawing", "approval"],
  ),
];

const NURSE_QUESTIONS: QuestionDraft[] = [
  question(
    "Multi-Patient Emergency Triage in a Busy Clinic",
    "Emergency Response & Clinical Prioritisation",
    "Three patients arrive simultaneously: a lethargic four-year-old with sunken eyes and capillary refill over three seconds; a pregnant woman at 34 weeks with BP 165/110 and severe headache; and an adult with a clean forearm laceration and stable vital signs.",
    "State your triage order, immediate stabilisation actions for the top priorities, and escalation steps.",
    "I would call for backup and recognise both the child and pregnant woman as immediate red priorities. Using ABCDE and ETAT principles, I would assess the child for shock, check glucose, establish IV access, and give a carefully monitored isotonic fluid bolus per protocol. I would place the pregnant woman left lateral, monitor blood pressure and fetal heart rate, urgently escalate suspected severe pre-eclampsia, and prepare magnesium sulfate under the authorised clinician and MoH protocol. The stable laceration patient receives pressure dressing and waits safely. I would document times, observations, treatment, and SBAR handover.",
    ["triage", "shock", "abcde", "eclampsia", "iv", "magnesium", "vitals", "escalate"],
  ),
  question(
    "Vaccine Cold-Chain Temperature Excursion",
    "Immunisation Cold-Chain & Stock Safety",
    "At 08:00 the clinic vaccine refrigerator logger shows a peak of +11°C for five hours overnight after a power outage. Thirty caregivers are waiting for routine childhood vaccinations.",
    "What exact protocol do you follow before administering any vaccine doses?",
    "I would not administer affected vaccines until viability is confirmed. I would quarantine and label the stock 'DO NOT USE — pending cold-chain assessment', record the temperature excursion, and check the vaccine vial monitor and product-specific guidance; a shake test is used only for eligible freeze-sensitive vaccines. I would notify the Sub-County EPI Cold-Chain Officer, transfer approved backup stock using conditioned carriers, and explain any delay to caregivers. I would document actions and restock only after authorised advice.",
    ["quarantine", "vvm", "do not", "temperature", "log", "officer", "carrier", "vaccine"],
  ),
  question(
    "Post-Operative Sepsis Warning Signs and Infection Control",
    "Infection Prevention & Clinical Escalation",
    "On night shift, a post-caesarean patient develops a temperature of 39.1°C, pulse 124 bpm, foul-smelling wound exudate, and new confusion.",
    "Outline your immediate nursing assessment, infection-prevention precautions, and structured handover to the on-call clinician.",
    "I would treat these as sepsis red flags, call the on-call clinician, and perform an ABCDE assessment with oxygen saturation, blood pressure, respiratory rate, and urine output. I would use hand hygiene, appropriate PPE, and standard and contact precautions while assessing the wound. Following the local sepsis protocol, I would obtain prescribed blood and wound cultures without delaying urgent antibiotics and IV fluids. I would give an SBAR handover, document trends and escalation times, and continue frequent observations.",
    ["sepsis", "antibiotic", "abcde", "sbar", "ppe", "hand hygiene", "fluid", "culture"],
  ),
];

const SOFTWARE_QUESTIONS: QuestionDraft[] = [
  question(
    "Production Payment API Failures After Deployment",
    "Production Debugging & Incident Response",
    "A refugee assistance payment API begins returning intermittent 500 errors after a release. Some retries appear to create duplicate transactions, and support staff are receiving urgent complaints.",
    "How would you contain the incident, diagnose the root cause, protect transaction integrity, and communicate with stakeholders?",
    "I would notify the incident lead, pause further deployment, and assess error rates and duplicate transaction reports. If the release is implicated, I would roll back safely while preserving logs and database evidence. I would correlate request IDs across application and gateway logs, reproduce the failure in staging, and inspect transaction boundaries and timeouts. I would enforce idempotency keys and a uniqueness constraint before replaying requests, reconcile affected records, add a regression test, and communicate status and remediation to support.",
    ["rollback", "logs", "idempotency", "transaction", "reproduce", "duplicate", "incident", "reconcile"],
  ),
  question(
    "Secure Offline-Capable Referral Application",
    "API & Application Architecture",
    "A referral application must work in low-connectivity field offices and store sensitive candidate details. Staff need different permissions, managers need an audit trail, and records must synchronise when connectivity returns.",
    "Describe an architecture that handles offline conflicts, privacy, access control, and reliable synchronisation.",
    "I would separate the client, authenticated API, and database, using role-based access control and encrypted transport and storage. Offline records would carry UUIDs, version numbers, and timestamps in an encrypted local queue. The server would validate every change, detect version conflicts, and require explicit review where two caseworkers edit the same record. I would minimise collected data, record consent, create an append-only audit log, and test retries for idempotency. I would document the threat model and agree conflict rules with field staff.",
    ["role-based", "encrypt", "offline", "conflict", "audit", "consent", "api", "synchron"],
  ),
  question(
    "Slow Employer Search and Database Optimisation",
    "Database Performance & Verification",
    "An employer search page takes 18 seconds. It filters by skill, location, and availability; the ORM issues additional queries for every result, and the table now holds two million profiles.",
    "How would you measure and optimise the query without changing search correctness?",
    "I would first reproduce the slow request and capture query counts, timing, and the execution plan. I would remove N+1 queries with a joined projection or batch loading, verify filter semantics, and add a composite index based on selectivity and actual query order. I would replace offset paging with keyset pagination if appropriate, then compare before-and-after latency on representative data. Tests would confirm identical results, and monitoring would check index usage and regressions after deployment.",
    ["execution plan", "index", "n+1", "query", "pagination", "measure", "latency", "test"],
  ),
];

const TEACHER_QUESTIONS: QuestionDraft[] = [
  question(
    "Inclusive Management of a Multilingual Classroom",
    "Inclusive Classroom Management",
    "Your class of 48 learners includes new arrivals with limited English and Kiswahili, one learner with a hearing impairment, and several students who have missed months of schooling. A group becomes disruptive during a whole-class lecture.",
    "How would you re-establish safe participation and adapt the lesson without singling out or lowering expectations for any learner?",
    "I would use calm, clear routines and visual instructions, check understanding privately, and seat the learner with hearing impairment where they can see my face and materials. I would group learners flexibly for peer support, use home-language scaffolding where possible, and provide the same learning objective through visuals, demonstrations, and short tasks. I would assess prior learning without labels, agree class norms with learners, and communicate with support staff or caregivers when additional assessment is needed.",
    ["inclusive", "visual", "hearing", "language", "peer", "routine", "support", "prior learning"],
  ),
  question(
    "Differentiated Lesson Planning for a Practical Topic",
    "Differentiated Lesson Planning",
    "Tomorrow's science lesson covers water purification. Learners have wide literacy levels, limited laboratory materials, and varying prior experience of water treatment in their communities.",
    "Design a lesson with common learning goals, differentiated activities, resources, and checks for understanding.",
    "I would define measurable goals for identifying contamination risks and comparing purification methods. A demonstration using locally available clear containers, cloth, sand, and safe illustrations would introduce the topic. Learners would choose or receive tiered tasks: sequencing picture cards, completing a labelled diagram, or evaluating which methods make water safe and why boiling remains necessary. I would use questioning, mini-whiteboards, and a short exit ticket to check misconceptions, then record who needs targeted support.",
    ["objective", "differentiat", "resources", "assessment", "exit ticket", "misconception", "activity", "support"],
  ),
  question(
    "Fair Assessment and Suspected Learning Gaps",
    "Learner Assessment & Professional Ethics",
    "A learner who participates well orally performs poorly on written tests. Another learner's marks rise sharply on an unsupervised take-home task, and parents are pressuring you to change grades.",
    "How would you assess learning fairly, investigate concerns, and communicate outcomes while protecting learner dignity?",
    "I would use multiple assessment formats, including oral explanation, practical demonstration, and written work, aligned to the same criteria. I would review earlier evidence and hold a private, non-accusatory conversation with each learner, providing appropriate accommodations where assessment identifies a need. I would not alter grades under pressure; I would explain the rubric and evidence to parents, follow school policy, document decisions, and consult the assessment lead if concerns remain. Feedback would focus on next learning steps.",
    ["assessment", "rubric", "oral", "accommodation", "evidence", "policy", "feedback", "dignity"],
  ),
];

const ELECTRICIAN_QUESTIONS: QuestionDraft[] = [
  question(
    "Repeated RCD Tripping in a Small Clinic",
    "Electrical Fault Diagnosis",
    "A clinic's residual-current device trips repeatedly during rain. Refrigeration and lighting share circuits, staff have used extension leads, and resetting the device works only briefly.",
    "Explain how you would make the area safe and systematically diagnose the fault before restoring power.",
    "I would switch off and isolate the affected supply, prevent re-energisation, and keep people away from wet equipment. Using appropriately rated PPE and test instruments, I would inspect damaged extension leads, moisture ingress, sockets, and outdoor fittings. After confirming safe test conditions, I would disconnect loads and use insulation resistance and continuity tests to narrow the faulty circuit or appliance. I would not bypass the RCD. Repairs would comply with applicable wiring standards, followed by RCD trip testing, functional checks, and a signed job record.",
    ["isolate", "rcd", "insulation resistance", "moisture", "test", "fault", "ppe", "bypass"],
  ),
  question(
    "Unsafe Wiring Found During a Shop Fit-Out",
    "Wiring Safety Compliance",
    "During a fit-out you find undersized conductors, shared neutrals between circuits, no earthing to metal fittings, and connections hidden behind a ceiling. The owner asks you to energise today.",
    "What defects do you prioritise, how do you respond to the owner, and what inspections are required before energisation?",
    "I would refuse to energise the unsafe installation and explain the shock and fire risks to the owner. I would isolate the work area, record each defect, and specify corrective work: correctly sized conductors and protective devices, compliant circuit arrangements, verified protective earthing, and accessible approved enclosures. I would inspect containment and connections before concealment, then test continuity, insulation resistance, polarity, earth fault loop impedance, and protective-device operation. Certification would follow satisfactory results, not the owner's deadline.",
    ["earth", "undersized", "isolate", "insulation", "polarity", "certificate", "fire", "refuse"],
  ),
  question(
    "New Circuit Installation for a Community Workshop",
    "Circuit Installation & Load Planning",
    "A workshop wants a new circuit for three welding machines and future expansion. The available supply capacity is unclear, and machinery will operate in a dusty environment.",
    "How would you calculate requirements, select protection and equipment, and verify the completed circuit?",
    "I would obtain equipment nameplate ratings and duty cycles, assess maximum demand and diversity, and confirm supply capacity with the responsible engineer or utility. I would calculate design current, voltage drop, and fault levels before selecting cable size, containment, isolation, and overcurrent and residual-current protection. Dust-resistant appropriately rated fittings and protective earthing would be specified. After safe installation I would inspect and test continuity, insulation, polarity, earth continuity, and protection operation, label the distribution board, and issue test records.",
    ["load", "demand", "voltage drop", "cable", "protection", "earthing", "rating", "test"],
  ),
];

const ACCOUNTANT_QUESTIONS: QuestionDraft[] = [
  question(
    "Bank Reconciliation With Unexplained Differences",
    "Financial Reporting Reconciliation",
    "Month-end cash in the ledger exceeds the bank balance by KES 480,000. You find unpresented cheques, duplicate customer receipts, bank charges, and a transfer with no supporting authorisation.",
    "How would you reconcile the balance, treat each item, and escalate the unsupported transfer?",
    "I would obtain the bank statement and ledger, reconcile opening balances, and prepare a timed listing of deposits in transit, unpresented cheques, and bank charges. I would trace the duplicate receipts to source documents and reverse or correct them with approval, rather than netting unexplained items. The unsupported transfer would remain separately identified; I would preserve evidence and notify the finance manager under the fraud and whistleblowing policy. Adjusting entries would have supporting documents, review, and an audit trail before the reconciliation is signed off.",
    ["reconcile", "unpresented", "duplicate", "bank charges", "authorisation", "adjusting", "audit trail", "supporting"],
  ),
  question(
    "Budget Variance in a Training Programme",
    "Budgeting & Variance Analysis",
    "A vocational programme is 15% over its quarterly training budget. Venue costs rose, participant attendance fell, and one supplier invoice covers two different projects.",
    "How would you analyse the variance and recommend corrective action without misallocating costs?",
    "I would separate price, volume, and timing variances by comparing actual costs and participant numbers with the approved budget. I would inspect contracts and attendance records, then allocate the shared supplier invoice using a documented, consistent basis supported by project codes. I would quantify the venue rate increase and cost per participant, discuss operational causes with programme staff, and recommend renegotiation or an appropriate venue while protecting delivery quality. A revised forecast, corrective actions, and approval limits would be reported to management.",
    ["variance", "actual", "budget", "allocate", "attendance", "forecast", "invoice", "cost"],
  ),
  question(
    "Audit Trail and Error Detection",
    "Audit Error Detection & Controls",
    "While reviewing payables, you find a supplier created one day before a large payment, a purchase order approved by the same person who requested it, and an invoice number already recorded last month.",
    "What audit checks would you perform, and how would you distinguish an error from a possible control override?",
    "I would preserve the documents and compare the duplicate invoice numbers, amounts, bank details, goods-received records, and supplier master history. I would verify the supplier independently using trusted contact details and review user access and approval logs for segregation-of-duties conflicts. I would not assume fraud or alter records; I would quantify any duplicate payment, document exceptions, and escalate through the internal audit or authorised reporting channel. Recommendations would include independent supplier onboarding, duplicate-invoice controls, and separated approvals.",
    ["audit", "duplicate", "supplier", "segregation", "approval", "verify", "invoice", "control"],
  ),
];

const AGRICULTURE_QUESTIONS: QuestionDraft[] = [
  question(
    "Crop Disease Outbreak Under Production Pressure",
    "Crop Health & Integrated Pest Management",
    "A cooperative's tomato crop shows spreading lesions days before a major delivery. The buyer wants immediate harvest, and workers propose applying a higher pesticide dose.",
    "How would you diagnose the problem, protect workers and consumers, and advise the cooperative?",
    "I would isolate affected rows, record symptoms and distribution, and consult a qualified crop protection officer or extension service for diagnosis. I would not exceed label dosage; I would assess registered control options, PPE, pre-harvest intervals, and withholding requirements. Affected produce would be separated and traced, with harvest decisions based on safety and market standards. I would document the recommendation and explain integrated prevention for the next cycle.",
    ["diagnose", "isolate", "pesticide", "ppe", "pre-harvest", "extension", "trace", "label"],
  ),
  question(
    "Irrigation Allocation During Water Shortage",
    "Farm Resource Planning",
    "Water available to a smallholder irrigation scheme falls by 35% during a critical growth period, and upstream farmers are taking larger shares.",
    "How would you assess crop needs and design a fair, verifiable irrigation response?",
    "I would measure available flow, inspect the distribution system for losses, and identify crop growth stages and critical water requirements. I would facilitate an agreed rotation based on transparent needs rather than upstream access, prioritising efficient irrigation and urgent crop stages. Soil moisture checks and delivery records would guide adjustments. I would communicate the schedule, document concerns, and review yield and water-use outcomes with the scheme committee.",
    ["water", "flow", "crop", "rotation", "soil moisture", "efficient", "schedule", "measure"],
  ),
  question(
    "Produce Quality and Market Rejection",
    "Post-Harvest Quality & Cooperative Communication",
    "A buyer rejects a produce consignment for damage and inconsistent sizing while farmers dispute the grading decision.",
    "How would you investigate quality losses and implement a fair corrective process?",
    "I would inspect representative samples against the agreed grade standard, photograph defects, and review harvest maturity, handling, packaging, transport time, and temperature records. A joint grading check with farmer and buyer representatives would verify whether the rejection was applied consistently. I would document findings, agree corrective sorting or processing for safe produce, and train handlers on the specific loss points. The next consignment would include a checklist and signed handover.",
    ["grade", "sample", "quality", "harvest", "packaging", "transport", "standard", "checklist"],
  ),
];

const BUSINESS_QUESTIONS: QuestionDraft[] = [
  question(
    "Cash-Flow Shortfall Before Payroll",
    "Business Finance & Operational Decision-Making",
    "A growing social enterprise cannot cover payroll in ten days because a major customer is late paying, inventory purchases increased, and the owner wants to take a high-interest informal loan.",
    "How would you assess the position and recommend an ethical, evidence-based response?",
    "I would prepare a 13-week cash-flow forecast, verify receivables and payment commitments, and separate essential from deferrable spending. I would contact the customer with a documented collection plan, negotiate supplier terms, and compare financing costs and risks rather than accepting an unreviewed loan. Payroll obligations would be prioritised transparently, with any changes communicated lawfully. I would present scenarios, approvals, and weekly monitoring to management.",
    ["cash flow", "forecast", "receivables", "payroll", "supplier", "financing", "prioritise", "scenario"],
  ),
  question(
    "Customer Decline After a Service Change",
    "Service Operations & Root-Cause Analysis",
    "Customer retention falls 20% after a new service process launches. Staff blame marketing, while complaints mention waiting times and inconsistent advice.",
    "How would you identify the operational causes and test improvements?",
    "I would segment retention data, review complaints, observe the customer journey, and compare waiting times and advice across branches before assigning blame. Staff and customer interviews would help identify root causes. I would pilot standard service guidance, a queue measure, and staff coaching in one location, using a baseline and clear retention and satisfaction indicators. Results would be documented and reviewed before wider implementation.",
    ["retention", "data", "customer", "root cause", "waiting", "pilot", "baseline", "indicator"],
  ),
  question(
    "Procurement Conflict of Interest",
    "Business Ethics & Procurement Controls",
    "A manager recommends a new supplier owned by a close relative. The price is competitive, but the relationship has not been declared and two other quotes look incomplete.",
    "How would you protect a fair procurement decision and maintain constructive stakeholder communication?",
    "I would pause the award, document the concern, and ask the manager to declare the relationship under the conflict-of-interest policy. Independent staff would verify supplier details and obtain complete comparable quotations using the same specifications. The conflicted manager would not participate in evaluation or approval. I would apply a documented scoring rubric, retain the audit trail, and communicate the decision and any required review respectfully to all parties.",
    ["conflict", "declare", "procurement", "quotation", "independent", "approval", "rubric", "audit trail"],
  ),
];

function genericQuestions(profession: string, country: string): QuestionDraft[] {
  return [
    question(
      "Quality and Safety Under Deadline Pressure",
      "Technical Standards & Quality Assurance",
      `On a Kenyan worksite as a ${profession}, a supervisor asks you to skip a mandatory safety and quality inspection to meet an urgent client deadline.`,
      "How would you handle the request, uphold technical standards, and document your professional decision?",
      `I would pause the task and assess the immediate risk. I would explain the safety and compliance consequences to the supervisor, propose a faster sequence that retains mandatory checks, and escalate if the request continues. I would document the inspection results, decision, approvals, and handover before resuming work. Local Kenyan standards would guide the decision rather than my previous practice in ${country}.`,
      ["safety", "standard", "inspect", "document", "risk", "verify", "log", "compliance"],
    ),
    question(
      "Diagnosing an Unexpected Operational Fault",
      "Applied Problem-Solving & Root-Cause Analysis",
      `Halfway through a critical ${profession} deliverable, an unexpected fault threatens quality and safety with limited replacement resources available.`,
      "Walk through how you isolate the root cause, implement safe interim mitigation, and verify the final fix.",
      "I would isolate the affected area, gather baseline measurements, and identify the root cause rather than masking symptoms. I would compare safe options, escalate resource needs, and apply a documented interim control within approved limits. Final functional tests and stakeholder sign-off would verify the fix before normal operation resumed.",
      ["isolate", "root", "safety", "verify", "check", "escalate", "mitigation", "document"],
    ),
    question(
      "Cross-Cultural Handover and Local Alignment",
      "Professional Communication & Local Regulation",
      `You join a Kenyan team whose reporting procedures and local codes differ from those you used in ${country}. A complex task must be handed over during a staff shortage.`,
      "How do you align your workflow with local requirements and ensure a clear professional handover?",
      "I would review the Kenyan regulations and workplace procedures with the responsible supervisor, clarify terminology, and compare my previous method against local requirements. I would prepare a structured handover covering completed work, measurements, open risks, and required follow-up. The incoming colleague would repeat back critical actions, and I would document questions and approvals for the team record.",
      ["regulation", "procedure", "handover", "confirm", "code", "document", "team", "standard"],
    ),
  ];
}

function getQuestionBank(profession: string, country: string): QuestionDraft[] {
  switch (profession) {
    case "Civil Engineer": return CIVIL_QUESTIONS;
    case "Registered Nurse": return NURSE_QUESTIONS;
    case "Software Developer": return SOFTWARE_QUESTIONS;
    case "Teacher": return TEACHER_QUESTIONS;
    case "Electrician": return ELECTRICIAN_QUESTIONS;
    case "Accountant": return ACCOUNTANT_QUESTIONS;
    case "Agriculture Specialist": return AGRICULTURE_QUESTIONS;
    case "Business Professional": return BUSINESS_QUESTIONS;
    default: return genericQuestions(profession, country);
  }
}

export function generateProfessionScenarios(profile: CandidateProfile): ScenarioQuestion[] {
  const profession = profile.profession === "Other" ? profile.professionOther.trim() : profile.profession;
  const difficulty = getAssessmentDifficulty(profile.yearsOfExperience);
  const difficultyInstruction = difficulty === "Advanced"
    ? "Act as the lead professional: address competing priorities, justify trade-offs, and specify escalation and verification."
    : difficulty === "Intermediate"
      ? "Provide a safe sequence, justify decisions, and include documentation and escalation."
      : "Explain your immediate actions within supervised practice and when you would seek help.";

  return getQuestionBank(profession, profile.countryOfQualification).map((item, index) => ({
    ...item,
    id: `q${index + 1}`,
    prompt: `${item.prompt} ${difficultyInstruction}`,
  }));
}
