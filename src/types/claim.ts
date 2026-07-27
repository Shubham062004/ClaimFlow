export type ClaimStatus =
  | 'Pending'
  | 'Approved'
  | 'Rejected'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected';

export interface Claim {
  id: string;
  _id?: string;
  claimNumber: string;
  patientId: string | { _id: string; name: string; email: string };
  patientName?: string;
  patientEmail?: string;
  provider: string;
  providerName?: string;
  claimAmount: number;
  totalAmount?: number;
  diagnosisCode: string;
  procedureCode: string;
  description: string;
  document?: string;
  documentUrl?: string;
  documents?: { name: string; url: string; size: string }[];
  status: ClaimStatus;
  approvedAmount: number;
  comments?: string;
  insurerComments?: string;
  reviewerNotes?: string;
  reviewedBy?: any;
  reviewDate?: string;
  createdAt?: string;
  submissionDate?: string;
  submittedDate?: string;
  updatedAt?: string;
}

export interface CreateClaimPayload {
  provider: string;
  claimAmount: number;
  diagnosisCode: string;
  procedureCode: string;
  description: string;
  document?: File | null;
}

export interface UpdateClaimPayload {
  status?: ClaimStatus;
  approvedAmount?: number;
  comments?: string;
}

export interface ClaimsResponse {
  claims: Claim[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
