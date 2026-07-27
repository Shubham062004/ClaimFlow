import apiClient from './apiClient';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import { Claim, CreateClaimPayload, UpdateClaimPayload, ClaimsResponse } from '@/types/claim';

export interface GetClaimsParams {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * Service for claims CRUD operations via Express REST API.
 */
export const claimService = {
  async getClaims(params: GetClaimsParams = {}): Promise<ClaimsResponse> {
    const queryParams = new URLSearchParams();
    if (params.status && params.status !== 'all') {
      queryParams.append('status', params.status);
    }
    if (params.search) {
      queryParams.append('search', params.search);
    }
    if (params.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params.limit) {
      queryParams.append('limit', params.limit.toString());
    }

    const url = `${API_ENDPOINTS.CLAIMS.LIST}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiClient.get<{
      success: boolean;
      data: Claim[];
      meta?: any;
    }>(url);

    return {
      claims: response.data.data,
      pagination: response.data.meta || {
        total: response.data.data.length,
        page: params.page || 1,
        limit: params.limit || 10,
        totalPages: 1,
      },
    };
  },

  async getClaimById(id: string): Promise<Claim> {
    const response = await apiClient.get<{ success: boolean; data: Claim }>(
      API_ENDPOINTS.CLAIMS.DETAILS(id)
    );
    return response.data.data;
  },

  async createClaim(payload: CreateClaimPayload): Promise<Claim> {
    const formData = new FormData();
    formData.append('provider', payload.provider);
    formData.append('claimAmount', payload.claimAmount.toString());
    formData.append('diagnosisCode', payload.diagnosisCode);
    formData.append('procedureCode', payload.procedureCode);
    formData.append('description', payload.description);

    if (payload.document) {
      formData.append('document', payload.document);
    }

    const response = await apiClient.post<{ success: boolean; data: Claim }>(
      API_ENDPOINTS.CLAIMS.CREATE,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.data;
  },

  async updateClaim(id: string, payload: UpdateClaimPayload): Promise<Claim> {
    const response = await apiClient.patch<{ success: boolean; data: Claim }>(
      API_ENDPOINTS.CLAIMS.UPDATE(id),
      payload
    );
    return response.data.data;
  },
};
