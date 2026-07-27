import mongoose from 'mongoose';
import { config } from './config/env.js';
import { User } from './models/user.model.js';
import { Claim } from './models/claim.model.js';
import { UserRole } from './types/user.types.js';
import { ClaimStatus } from './types/claim.types.js';

const seedDatabase = async () => {
  try {
    console.log('[Seeder] Connecting to MongoDB...');
    await mongoose.connect(config.mongoUri);
    console.log('[Seeder] Connected successfully.');

    // Clear existing sample users and claims
    await User.deleteMany({});
    await Claim.deleteMany({});
    console.log('[Seeder] Cleared existing Users and Claims.');

    const password = 'Password123!';

    // Seed Single Insurer Account
    const insurerUser = await User.create({
      name: 'Dr. Marcus Vance (Insurer)',
      email: 'insurer@claimflow.com',
      password,
      role: UserRole.INSURER,
    });

    // Seed Initial Patient Account
    const patientUser = await User.create({
      name: 'Eleanor Vance',
      email: 'patient@claimflow.com',
      password,
      role: UserRole.PATIENT,
    });

    console.log('[Seeder] Accounts initialized successfully:');
    console.log(` - Single Insurer Account: ${insurerUser.email} (Password: ${password})`);
    console.log(` - Demo Patient Account:  ${patientUser.email} (Password: ${password})`);

    // Create sample claims conforming to updated schema
    const sampleClaims = [
      {
        claimNumber: 'CLM-2026-881',
        patientId: patientUser._id,
        provider: 'Metropolitan General Hospital',
        claimAmount: 1450.0,
        diagnosisCode: 'M54.5 (Low Back Pain)',
        procedureCode: '99214 (Outpatient Visit)',
        description: 'Comprehensive evaluation and physical therapy initial intake.',
        document: '',
        status: ClaimStatus.APPROVED,
        approvedAmount: 1200.0,
        comments: 'Approved after verifying out-of-network copay deductible.',
        reviewedBy: insurerUser._id,
        reviewDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        claimNumber: 'CLM-2026-904',
        patientId: patientUser._id,
        provider: 'City Diagnostic Imaging',
        claimAmount: 850.0,
        diagnosisCode: 'R07.9 (Chest Pain)',
        procedureCode: '71250 (CT Thorax)',
        description: 'High resolution chest CT scan with contrast.',
        document: '',
        status: ClaimStatus.PENDING,
        approvedAmount: 0,
        comments: '',
      },
      {
        claimNumber: 'CLM-2026-942',
        patientId: patientUser._id,
        provider: 'Apex Surgical Center',
        claimAmount: 4300.0,
        diagnosisCode: 'K80.20 (Gallstone Disease)',
        procedureCode: '47562 (Laparoscopic Cholecystectomy)',
        description: 'Outpatient laparoscopic procedure and surgical recovery.',
        document: '',
        status: ClaimStatus.REJECTED,
        approvedAmount: 0,
        comments: 'Prior authorization form missing. Resubmit with completed Form 104-B.',
        reviewedBy: insurerUser._id,
        reviewDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    ];

    await Claim.insertMany(sampleClaims);
    console.log(`[Seeder] Seeded ${sampleClaims.length} initial healthcare claims.`);

    await mongoose.disconnect();
    console.log('[Seeder] Database seeding completed cleanly.');
    process.exit(0);
  } catch (error) {
    console.error('[Seeder Error] Failed to seed database:', error);
    process.exit(1);
  }
};

seedDatabase();
