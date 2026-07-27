import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['patient', 'insurer'], {
    required_error: 'Please select a portal role',
  }),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const claimFormSchema = z.object({
  providerName: z.string().min(2, 'Healthcare provider name is required'),
  serviceDate: z.string().min(1, 'Date of service is required'),
  totalAmount: z.coerce.number().positive('Total amount must be greater than $0'),
  diagnosisCode: z.string().min(3, 'Valid ICD-10 diagnosis code is required'),
  procedureCode: z.string().min(3, 'Valid CPT procedure code is required'),
  description: z.string().min(10, 'Please provide a brief description of services (min 10 characters)'),
});

export type ClaimFormData = z.infer<typeof claimFormSchema>;
