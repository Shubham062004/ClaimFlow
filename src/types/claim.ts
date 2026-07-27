export type ClaimStatus =
  | 'submitted'
  | 'under_review'
  | 'pending_documents'
  | 'approved'
  | 'rejected'
  | 'paid';

export interface Claim {
  id: string;
  claimNumber: string;
  patientId: string;
  patientName: string;
  providerName: string;
  serviceDate: string;
  submittedDate: string;
  totalAmount: number;
  coveredAmount?: number;
  status: ClaimStatus;
  diagnosisCode: string;
  procedureCode: string;
  description: string;
  documents?: { name: string; url: string; size: string }[];
  reviewerNotes?: string;
}

export interface CreateClaimPayload {
  providerName: string;
  serviceDate: string;
  totalAmount: number;
  diagnosisCode: string;
  procedureCode: string;
  description: string;
}
