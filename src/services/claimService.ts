import apiClient from './apiClient';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import { Claim, CreateClaimPayload } from '@/types/claim';

/**
 * Service for claims CRUD operations.
 * Includes mock datasets for initial frontend verification.
 */
export const claimService = {
  async getClaims(): Promise<Claim[]> {
    try {
      const response = await apiClient.get<Claim[]>(API_ENDPOINTS.CLAIMS.LIST);
      return response.data;
    } catch {
      // Mock data for initial frontend view rendering
      return [
        {
          id: 'clm_1',
          claimNumber: 'CLM-2026-881',
          patientId: 'usr_pt_101',
          patientName: 'Eleanor Vance',
          providerName: 'Metropolitan General Hospital',
          serviceDate: '2026-06-14',
          submittedDate: '2026-06-15',
          totalAmount: 1450.0,
          coveredAmount: 1200.0,
          status: 'approved',
          diagnosisCode: 'M54.5 (Low Back Pain)',
          procedureCode: '99214 (Outpatient Visit)',
          description: 'Comprehensive evaluation and physical therapy initial intake.',
        },
        {
          id: 'clm_2',
          claimNumber: 'CLM-2026-904',
          patientId: 'usr_pt_101',
          patientName: 'Eleanor Vance',
          providerName: 'City Diagnostic Imaging',
          serviceDate: '2026-07-02',
          submittedDate: '2026-07-03',
          totalAmount: 850.0,
          status: 'under_review',
          diagnosisCode: 'R07.9 (Chest Pain)',
          procedureCode: '71250 (CT Thorax)',
          description: 'High resolution chest CT scan with contrast.',
        },
        {
          id: 'clm_3',
          claimNumber: 'CLM-2026-942',
          patientId: 'usr_pt_102',
          patientName: 'James Sterling',
          providerName: 'Apex Surgical Center',
          serviceDate: '2026-07-10',
          submittedDate: '2026-07-12',
          totalAmount: 4300.0,
          status: 'submitted',
          diagnosisCode: 'K80.20 (Gallstone Disease)',
          procedureCode: '47562 (Laparoscopic Cholecystectomy)',
          description: 'Outpatient laparoscopic procedure and surgical recovery.',
        },
      ];
    }
  },

  async createClaim(payload: CreateClaimPayload): Promise<Claim> {
    try {
      const response = await apiClient.post<Claim>(API_ENDPOINTS.CLAIMS.CREATE, payload);
      return response.data;
    } catch {
      return {
        id: `clm_${Date.now()}`,
        claimNumber: `CLM-2026-${Math.floor(100 + Math.random() * 900)}`,
        patientId: 'usr_pt_101',
        patientName: 'Eleanor Vance',
        providerName: payload.providerName,
        serviceDate: payload.serviceDate,
        submittedDate: new Date().toISOString().split('T')[0],
        totalAmount: payload.totalAmount,
        status: 'submitted',
        diagnosisCode: payload.diagnosisCode,
        procedureCode: payload.procedureCode,
        description: payload.description,
      };
    }
  },
};
