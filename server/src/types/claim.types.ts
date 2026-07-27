import { Document, Types } from 'mongoose';

export enum ClaimStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

export interface IClaim {
  _id: Types.ObjectId;
  id: string;
  patientId: Types.ObjectId;
  name: string;
  email: string;
  claimAmount: number;
  description: string;
  documentUrl?: string;
  status: ClaimStatus;
  approvedAmount: number;
  insurerComments: string;
  submissionDate: Date;
  updatedAt: Date;
}

export interface IClaimDocument extends Omit<IClaim, 'id'>, Document {}

export interface CreateClaimDTO {
  name: string;
  email: string;
  claimAmount: number;
  description: string;
  documentUrl?: string;
}

export interface UpdateClaimDTO {
  status?: ClaimStatus;
  approvedAmount?: number;
  insurerComments?: string;
}

export interface ClaimQueryFilter {
  patientId?: string;
  status?: ClaimStatus;
  search?: string;
  page?: number;
  limit?: number;
}
