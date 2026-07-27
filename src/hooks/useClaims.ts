import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { claimService } from '@/services/claimService';
import { CreateClaimPayload } from '@/types/claim';
import toast from 'react-hot-toast';

/**
 * Custom hook wrapping TanStack Query queries & mutations for Claims.
 */
export const useClaims = () => {
  const queryClient = useQueryClient();

  const claimsQuery = useQuery({
    queryKey: ['claims'],
    queryFn: () => claimService.getClaims(),
  });

  const createClaimMutation = useMutation({
    mutationFn: (payload: CreateClaimPayload) => claimService.createClaim(payload),
    onSuccess: (newClaim) => {
      queryClient.invalidateQueries({ queryKey: ['claims'] });
      toast.success(`Claim ${newClaim.claimNumber} submitted successfully!`);
    },
    onError: () => {
      toast.error('Failed to submit claim. Please try again.');
    },
  });

  return {
    claims: claimsQuery.data || [],
    isLoading: claimsQuery.isLoading,
    isError: claimsQuery.isError,
    refetch: claimsQuery.refetch,
    createClaim: createClaimMutation.mutateAsync,
    isSubmitting: createClaimMutation.isPending,
  };
};
