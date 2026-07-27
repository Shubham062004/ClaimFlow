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
    const documentUrl = file ? `/uploads/${file.filename}` : dto.documentUrl || '';

    const claim = await Claim.create({
      patientId: user.id,
      name: dto.name || user.name,
      email: dto.email || user.email,
      claimAmount: dto.claimAmount,
      description: dto.description,
      documentUrl,
      status: ClaimStatus.PENDING,
      approvedAmount: 0,
      insurerComments: '',
      submissionDate: new Date(),
    });

    return claim;
  }

  /**
   * Fetch list of claims with role-based visibility and pagination/filtering
   */
  static async getClaims(user: AuthUser, query: ClaimQueryFilter) {
    const { status, search, page = 1, limit = 10 } = query;
    const filter: Record<string, any> = {};

    // Patient can only see their own claims
    if (user.role === UserRole.PATIENT) {
      filter.patientId = user.id;
    }

    // Filter by status if provided
    if (status) {
      filter.status = status;
    }

    // Search filter across name, email, or description
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const limitNum = Number(limit);

    const [claims, total] = await Promise.all([
      Claim.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate('patientId', 'name email role'),
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
   * Fetch single claim by ID with role ownership check
   */
  static async getClaimById(id: string, user: AuthUser) {
    const claim = await Claim.findById(id).populate('patientId', 'name email role');
    if (!claim) {
      throw ApiError.notFound(`Claim with ID '${id}' not found.`);
    }

    // Role check: Patients can only view their own claim
    if (user.role === UserRole.PATIENT) {
      const patientObjId = (claim.patientId as any)._id || claim.patientId;
      if (patientObjId.toString() !== user.id) {
        throw ApiError.forbidden('Access denied. You can only view your own claims.');
      }
    }

    return claim;
  }

  /**
   * Update claim status and adjudication details (Insurer / Admin action)
   */
  static async updateClaim(id: string, dto: UpdateClaimDTO, _user: AuthUser) {
    const claim = await Claim.findById(id);
    if (!claim) {
      throw ApiError.notFound(`Claim with ID '${id}' not found.`);
    }

    if (dto.status !== undefined) {
      claim.status = dto.status;
    }

    if (dto.approvedAmount !== undefined) {
      if (dto.approvedAmount > claim.claimAmount) {
        throw ApiError.badRequest('Approved amount cannot be greater than requested claim amount.');
      }
      claim.approvedAmount = dto.approvedAmount;
    }

    // Auto-set approved amount if status changed to Approved without explicit amount
    if (dto.status === ClaimStatus.APPROVED && dto.approvedAmount === undefined && claim.approvedAmount === 0) {
      claim.approvedAmount = claim.claimAmount;
    }

    // Reset approved amount to 0 if rejected
    if (dto.status === ClaimStatus.REJECTED) {
      claim.approvedAmount = 0;
    }

    if (dto.insurerComments !== undefined) {
      claim.insurerComments = dto.insurerComments;
    }

    await claim.save();

    return claim;
  }
}
