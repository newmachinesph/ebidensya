export type EvidenceKind =
  | "chat"
  | "receipt"
  | "contract"
  | "photograph"
  | "affidavit"
  | "official"
  | "email"
  | "financial";

export type OcrStatus = "verified" | "review" | "unreadable" | "manual";

export interface OcrField {
  label: string;
  value: string | null;
  confidence: number;
}

export interface EvidenceItem {
  id: string;
  filename: string;
  kind: EvidenceKind;
  /** Messenger, Viber, GCash, BDO, LBC, flatbed scan, phone camera. */
  source: string;
  capturedOn: string | null;
  uploadedOn: string;
  exhibit: string | null;
  pages: number;
  sizeKb: number;
  /** Only for photographic evidence. */
  photoSeed?: string;
  ocr: {
    status: OcrStatus;
    confidence: number;
    defects: string[];
    note: string | null;
    text: string | null;
    fields: OcrField[];
  };
  corroborates: string[];
  tags: string[];
}

export interface TimelineEntry {
  id: string;
  date: string;
  title: string;
  detail: string;
  confidence: number;
  sources: string[];
  flag: "contradiction" | "gap" | null;
}

export interface ChronologyParagraph {
  id: string;
  text: string;
  citations: string[];
}

export interface Exhibit {
  label: string;
  title: string;
  evidenceId: string;
  offeredFor: string;
}

export interface Witness {
  id: string;
  name: string;
  role: string;
  appearsIn: string[];
  status: "confirmed" | "to-contact" | "adverse";
  note: string;
}

export interface Contradiction {
  id: string;
  severity: "high" | "medium" | "low";
  claim: string;
  against: string;
  sources: string[];
  observation: string;
}

export interface MissingItem {
  id: string;
  document: string;
  why: string;
  blocks: string | null;
  priority: "critical" | "high" | "normal";
  where: string;
}

export interface ProofElement {
  element: string;
  authority: string;
  evidence: string[];
  status: "supported" | "partial" | "unsupported";
  note: string;
}

export interface ClaimStrength {
  claim: string;
  supporting: string[];
  missing: string[];
  strength: "strong" | "workable" | "thin";
}

export interface BinderWitness {
  witnessId: string;
  purpose: string;
  questions: string[];
  documents: string[];
}

export interface Hearing {
  date: string;
  time: string;
  court: string;
  purpose: string;
  witness: string | null;
  exhibits: string[];
  issues: string[];
  reminders: string[];
}

export interface CaseSummary {
  id: string;
  title: string;
  docket: string;
  causeOfAction: string;
  court: string;
  clientRole: string;
  client: string;
  adverse: string;
  lead: string;
  status: "intake" | "drafting" | "filed" | "trial";
  openedOn: string;
  nextHearing: string | null;
  amountInvolved: number | null;
  fileCount: number;
  needsReviewCount: number;
  readiness: number;
}

export interface CaseFile {
  summary: CaseSummary;
  evidence: EvidenceItem[];
  timeline: TimelineEntry[];
  chronology: ChronologyParagraph[];
  exhibits: Exhibit[];
  witnesses: Witness[];
  contradictions: Contradiction[];
  missing: MissingItem[];
  proofMatrix: { caseType: string; basis: string; elements: ProofElement[] };
  claims: ClaimStrength[];
  binder: BinderWitness[];
  hearing: Hearing | null;
}
