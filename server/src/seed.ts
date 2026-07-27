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

    // Create sample users
    const password = 'Password123!';

    const patientUser = await User.create({
      name: 'John Doe (Patient)',
      email: 'patient@claimflow.com',
      password,
      role: UserRole.PATIENT,
    });

    const insurerUser = await User.create({
      name: 'Sarah Connor (Insurer)',
      email: 'insurer@claimflow.com',
      password,
      role: UserRole.INSURER,
    });

    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@claimflow.com',
      password,
      role: UserRole.ADMIN,
    });

    console.log('[Seeder] Sample accounts created:');
    console.log(` - Patient: ${patientUser.email} (Password: ${password})`);
    console.log(` - Insurer: ${insurerUser.email} (Password: ${password})`);
    console.log(` - Admin:   ${adminUser.email} (Password: ${password})`);

    // Create sample claims
    const sampleClaims = [
      {
        patientId: patientUser._id,
        name: patientUser.name,
        email: patientUser.email,
        claimAmount: 1250.50,
        description: 'Outpatient consultations, MRI scan, and prescribed medication for knee inflammation.',
        documentUrl: '',
        status: ClaimStatus.PENDING,
        approvedAmount: 0,
        insurerComments: '',
        submissionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        patientId: patientUser._id,
        name: patientUser.name,
        email: patientUser.email,
        claimAmount: 3450.00,
        description: 'Emergency room visit and overnight observation post allergic reaction.',
        documentUrl: '',
        status: ClaimStatus.APPROVED,
        approvedAmount: 3200.00,
        insurerComments: 'Approved after policy deductible deduction of $250.',
        submissionDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
      {
        patientId: patientUser._id,
        name: patientUser.name,
        email: patientUser.email,
        claimAmount: 850.00,
        description: 'Elective cosmetic dental whitening treatment.',
        documentUrl: '',
        status: ClaimStatus.REJECTED,
        approvedAmount: 0,
        insurerComments: 'Elective cosmetic dental procedures are not covered under standard plan policy section 4.2.',
        submissionDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      },
    ];

    await Claim.insertMany(sampleClaims);
    console.log(`[Seeder] Seeded ${sampleClaims.length} sample claims successfully.`);

    await mongoose.disconnect();
    console.log('[Seeder] Seeding completed successfully. Disconnected DB.');
    process.exit(0);
  } catch (error) {
    console.error('[Seeder Error] Failed to seed database:', error);
    process.exit(1);
  }
};

seedDatabase();
