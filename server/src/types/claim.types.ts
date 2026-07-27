import { Document, Types } from 'mongoose';

export enum ClaimStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

export interface IClaim {
  _id: Types.ObjectId;
  id: string;
  claimNumber: string;
  patientId: Types.ObjectId;
  provider: string;
  claimAmount: number;
  diagnosisCode: string;
  procedureCode: string;
  description: string;
  document?: string;
  status: ClaimStatus;
  approvedAmount: number;
  comments: string;
  reviewedBy?: Types.ObjectId;
  reviewDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IClaimDocument extends Omit<IClaim, 'id'>, Document {}

export interface CreateClaimDTO {
  provider: string;
  claimAmount: number;
  diagnosisCode: string;
  procedureCode: string;
  description: string;
  document?: string;
}

export interface UpdateClaimDTO {
  status?: ClaimStatus;
  approvedAmount?: number;
  comments?: string;
}

export interface ClaimQueryFilter {
  patientId?: string;
  status?: ClaimStatus;
  search?: string;
  page?: number;
  limit?: number;
}
