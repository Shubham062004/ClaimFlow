import mongoose, { Schema } from 'mongoose';
import { IClaimDocument, ClaimStatus } from '../types/claim.types.js';

const ClaimSchema: Schema<IClaimDocument> = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Patient ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Patient email is required'],
      lowercase: true,
      trim: true,
    },
    claimAmount: {
      type: Number,
      required: [true, 'Claim amount is required'],
      min: [0.01, 'Claim amount must be greater than 0'],
    },
    description: {
      type: String,
      required: [true, 'Claim description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    documentUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: Object.values(ClaimStatus),
      default: ClaimStatus.PENDING,
      index: true,
    },
    approvedAmount: {
      type: Number,
      default: 0,
      min: [0, 'Approved amount cannot be negative'],
    },
    insurerComments: {
      type: String,
      default: '',
      trim: true,
    },
    submissionDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, any>) => {
        ret.id = ret._id.toString();
        ret.patientId = ret.patientId?.toString() || ret.patientId;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

export const Claim = mongoose.model<IClaimDocument>('Claim', ClaimSchema);
