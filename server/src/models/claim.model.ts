import mongoose, { Schema } from 'mongoose';
import { IClaimDocument, ClaimStatus } from '../types/claim.types.js';

const ClaimSchema: Schema<IClaimDocument> = new Schema(
  {
    claimNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Patient ID is required'],
      index: true,
    },
    provider: {
      type: String,
      required: [true, 'Healthcare provider name is required'],
      trim: true,
    },
    claimAmount: {
      type: Number,
      required: [true, 'Claim amount is required'],
      min: [0.01, 'Claim amount must be greater than 0'],
    },
    diagnosisCode: {
      type: String,
      required: [true, 'Diagnosis code is required'],
      trim: true,
    },
    procedureCode: {
      type: String,
      required: [true, 'Procedure code is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Claim description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    document: {
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
    comments: {
      type: String,
      default: '',
      trim: true,
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reviewDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, any>) => {
        ret.id = ret._id.toString();
        if (ret.patientId && typeof ret.patientId === 'object' && ret.patientId._id) {
          ret.patientName = ret.patientId.name;
          ret.patientEmail = ret.patientId.email;
        }
        ret.documentUrl = ret.document;
        ret.insurerComments = ret.comments;
        ret.providerName = ret.provider;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

// Virtual aliases for frontend compatibility
ClaimSchema.virtual('documentUrl').get(function () {
  return this.document;
});

ClaimSchema.virtual('insurerComments').get(function () {
  return this.comments;
});

ClaimSchema.virtual('providerName').get(function () {
  return this.provider;
});

export const Claim = mongoose.model<IClaimDocument>('Claim', ClaimSchema);
