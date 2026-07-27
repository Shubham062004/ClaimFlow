import mongoose from 'mongoose';
import { Claim } from '../models/claim.model.js';
import { AuthUser } from '../types/express.js';
import { UserRole } from '../types/user.types.js';
import { ClaimStatus } from '../types/claim.types.js';
import { DashboardMetricsDTO } from '../types/api.types.js';

export class DashboardService {
  static async getMetrics(user: AuthUser): Promise<DashboardMetricsDTO> {
    const filter: Record<string, any> = {};

    // Filter by patient ID if request is from a Patient
    if (user.role === UserRole.PATIENT) {
      filter.patientId = new mongoose.Types.ObjectId(user.id);
    }

    const [stats, recentClaims] = await Promise.all([
      Claim.aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            totalClaims: { $sum: 1 },
            pendingClaims: {
              $sum: { $cond: [{ $eq: ['$status', ClaimStatus.PENDING] }, 1, 0] },
            },
            approvedClaims: {
              $sum: { $cond: [{ $eq: ['$status', ClaimStatus.APPROVED] }, 1, 0] },
            },
            rejectedClaims: {
              $sum: { $cond: [{ $eq: ['$status', ClaimStatus.REJECTED] }, 1, 0] },
            },
            totalClaimAmount: { $sum: '$claimAmount' },
            totalApprovedAmount: { $sum: '$approvedAmount' },
          },
        },
      ]),
      Claim.find(filter)
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('patientId', 'name email role'),
    ]);

    const metrics = stats[0] || {
      totalClaims: 0,
      pendingClaims: 0,
      approvedClaims: 0,
      rejectedClaims: 0,
      totalClaimAmount: 0,
      totalApprovedAmount: 0,
    };

    return {
      totalClaims: metrics.totalClaims,
      pendingClaims: metrics.pendingClaims,
      approvedClaims: metrics.approvedClaims,
      rejectedClaims: metrics.rejectedClaims,
      totalClaimAmount: metrics.totalClaimAmount,
      totalApprovedAmount: metrics.totalApprovedAmount,
      recentClaims,
    };
  }
}
