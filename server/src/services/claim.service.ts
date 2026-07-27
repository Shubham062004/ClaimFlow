import { Claim } from '../models/claim.model.js';
import { CreateClaimDTO, UpdateClaimDTO, ClaimQueryFilter, ClaimStatus } from '../types/claim.types.js';
import { AuthUser } from '../types/express.js';
import { UserRole } from '../types/user.types.js';
import { ApiError } from '../utils/apiError.js';

export class ClaimService {
  /**
   * Create a new healthcare claim (Patient action)
   */
  static async createClaim(user: AuthUser, dto: CreateClaimDTO, file?: Express.Multer.File) {
    const documentPath = file ? `/uploads/${file.filename}` : dto.document || '';
    const uniqueClaimNumber = `CLM-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const claim = await Claim.create({
      claimNumber: uniqueClaimNumber,
      patientId: user.id,
      provider: dto.provider,
      claimAmount: dto.claimAmount,
      diagnosisCode: dto.diagnosisCode,
      procedureCode: dto.procedureCode,
      description: dto.description,
      document: documentPath,
      status: ClaimStatus.PENDING,
      approvedAmount: 0,
      comments: '',
    });

    return claim;
  }

  /**
   * Fetch claims list with role-based scoping, search, filter, and pagination
   */
  static async getClaims(user: AuthUser, query: ClaimQueryFilter) {
    const { status, search, page = 1, limit = 10 } = query;
    const filter: Record<string, any> = {};

    // Scoping: Patients only see their own claims
    if (user.role === UserRole.PATIENT) {
      filter.patientId = user.id;
    }

    // Status filter
    if (status) {
      filter.status = status;
    }

    // Comprehensive backend search
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { claimNumber: searchRegex },
        { provider: searchRegex },
        { diagnosisCode: searchRegex },
        { procedureCode: searchRegex },
        { description: searchRegex },
        { status: searchRegex },
      ];

      // If search query is numeric, match claim amount
      const numericSearch = Number(search);
      if (!isNaN(numericSearch)) {
        filter.$or.push({ claimAmount: numericSearch });
        filter.$or.push({ approvedAmount: numericSearch });
      }
    }

    const skip = (Number(page) - 1) * Number(limit);
    const limitNum = Number(limit);

    const [claims, total] = await Promise.all([
      Claim.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate('patientId', 'name email role')
        .populate('reviewedBy', 'name email role'),
      Claim.countDocuments(filter),
    ]);

    return {
      claims,
      pagination: {
        total,
        page: Number(page),
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    };
  }

  /**
   * Get claim details by ID with role-based ownership validation
   */
  static async getClaimById(id: string, user: AuthUser) {
    const claim = await Claim.findById(id)
      .populate('patientId', 'name email role')
      .populate('reviewedBy', 'name email role');

    if (!claim) {
      throw ApiError.notFound(`Claim with ID '${id}' not found.`);
    }

    // Patients can only view their own claims
    if (user.role === UserRole.PATIENT) {
      const patientObjId = (claim.patientId as any)._id || claim.patientId;
      if (patientObjId.toString() !== user.id) {
        throw ApiError.forbidden('Access denied. You can only view your own claims.');
      }
    }

    return claim;
  }

  /**
   * Adjudicate claim status (Insurer / Admin action)
   */
  static async updateClaim(id: string, dto: UpdateClaimDTO, user: AuthUser) {
    const claim = await Claim.findById(id);
    if (!claim) {
      throw ApiError.notFound(`Claim with ID '${id}' not found.`);
    }

    if (dto.status !== undefined) {
      claim.status = dto.status;
    }

    if (dto.approvedAmount !== undefined) {
      if (dto.approvedAmount > claim.claimAmount) {
        throw ApiError.badRequest('Approved amount cannot exceed requested claim amount.');
      }
      claim.approvedAmount = dto.approvedAmount;
    }

    // Default approved amount to full claim amount if approved without explicit amount specified
    if (dto.status === ClaimStatus.APPROVED && dto.approvedAmount === undefined && claim.approvedAmount === 0) {
      claim.approvedAmount = claim.claimAmount;
    }

    // Reset approved amount to 0 if rejected
    if (dto.status === ClaimStatus.REJECTED) {
      claim.approvedAmount = 0;
    }

    if (dto.comments !== undefined) {
      claim.comments = dto.comments;
    }

    claim.reviewedBy = user.id as any;
    claim.reviewDate = new Date();

    await claim.save();

    return claim.populate([
      { path: 'patientId', select: 'name email role' },
      { path: 'reviewedBy', select: 'name email role' },
    ]);
  }
}
