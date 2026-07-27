import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Table } from '@/components/tables/Table';
import { Skeleton } from '@/components/common/Skeleton';
import { claimService } from '@/services/claimService';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Claim, ClaimStatus } from '@/types/claim';
import { Search, Filter, CheckCircle, XCircle, FileText, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

export const InsurerClaimsPage: React.FC = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Adjudication Review Modal state
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [adjudicationStatus, setAdjudicationStatus] = useState<ClaimStatus>('Approved');
  const [approvedAmount, setApprovedAmount] = useState<number>(0);
  const [comments, setComments] = useState<string>('');
  const [isAdjudicating, setIsAdjudicating] = useState<boolean>(false);

  const fetchClaims = async () => {
    setIsLoading(true);
    try {
      const res = await claimService.getClaims({
        search: searchTerm,
        status: statusFilter,
        page,
        limit: 10,
      });
      setClaims(res.claims);
      setTotalPages(res.pagination.totalPages || 1);
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to load claims for insurer queue.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchClaims();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, statusFilter, page]);

  const openAdjudicationModal = (claim: Claim, targetStatus: ClaimStatus) => {
    setSelectedClaim(claim);
    setAdjudicationStatus(targetStatus);
    setApprovedAmount(targetStatus === 'Approved' ? claim.claimAmount || claim.totalAmount || 0 : 0);
    setComments('');
  };

  const handleAdjudicateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClaim) return;

    setIsAdjudicating(true);
    try {
      await claimService.updateClaim(selectedClaim.id, {
        status: adjudicationStatus,
        approvedAmount: Number(approvedAmount),
        comments,
      });
      toast.success(`Claim ${selectedClaim.claimNumber || selectedClaim.id} status updated to ${adjudicationStatus}!`);
      setSelectedClaim(null);
      fetchClaims();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update claim adjudication.');
    } finally {
      setIsAdjudicating(false);
    }
  };

  const columns = [
    {
      header: 'Claim ID',
      accessor: (row: Claim) => (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="font-semibold text-slate-900">{row.claimNumber || `CLM-${row.id.substring(0, 8)}`}</span>
        </div>
      ),
    },
    {
      header: 'Patient Name',
      accessor: (row: Claim) => {
        if (typeof row.patientId === 'object' && row.patientId !== null) {
          return row.patientId.name;
        }
        return row.patientName || 'N/A';
      },
    },
    { header: 'Provider', accessor: (row: Claim) => row.provider || row.providerName || 'N/A' },
    { header: 'Submitted Date', accessor: (row: Claim) => formatDate(row.createdAt || row.submissionDate || row.submittedDate || '') },
    { header: 'Claim Amount', accessor: (row: Claim) => formatCurrency(row.claimAmount || row.totalAmount || 0) },
    { header: 'Approved Amount', accessor: (row: Claim) => formatCurrency(row.approvedAmount || 0) },
    { header: 'Status', accessor: (row: Claim) => <Badge status={row.status as any} /> },
    {
      header: 'Adjudication Controls',
      accessor: (row: Claim) => (
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openAdjudicationModal(row, 'Approved')}
            className="text-emerald-600 hover:bg-emerald-50 h-7 text-xs px-2"
          >
            <CheckCircle className="w-3.5 h-3.5 mr-1" />
            Approve
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openAdjudicationModal(row, 'Rejected')}
            className="text-rose-600 hover:bg-rose-50 h-7 text-xs px-2"
          >
            <XCircle className="w-3.5 h-3.5 mr-1" />
            Reject
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Insurer Master Claims Registry</h1>
        <p className="text-sm text-slate-500">Comprehensive database of all submitted healthcare claims across member networks.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Claims Master Queue</CardTitle>
            <CardDescription>Filter and adjudicate claims in real time.</CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="w-full sm:w-64">
              <Input
                placeholder="Search patient, provider, or ID..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/60 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="bg-transparent font-medium text-slate-700 focus:outline-none pr-2 py-1 cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          {isLoading ? (
            <div className="space-y-3 py-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <>
              <Table
                columns={columns}
                data={claims}
                keyExtractor={(item) => item.id}
                emptyMessage="No claims matching the search criteria."
              />

              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500">
                  <span>Page {page} of {totalPages}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Adjudication Review Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Claim Adjudication Form</h3>
                <p className="text-xs text-slate-500">Reviewing {selectedClaim.claimNumber || selectedClaim.id}</p>
              </div>
              <Badge status={adjudicationStatus as any} />
            </div>

            <form onSubmit={handleAdjudicateSubmit} className="space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl space-y-1.5 text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-400">Patient:</span>
                  <span className="font-semibold">
                    {typeof selectedClaim.patientId === 'object' && selectedClaim.patientId !== null
                      ? selectedClaim.patientId.name
                      : selectedClaim.patientName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Provider:</span>
                  <span className="font-semibold">{selectedClaim.provider || selectedClaim.providerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Billed Amount:</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(selectedClaim.claimAmount || selectedClaim.totalAmount || 0)}</span>
                </div>
                {selectedClaim.document && (
                  <div className="flex justify-between pt-1 border-t border-slate-200/60">
                    <span className="text-slate-400">Attached Bill/Doc:</span>
                    <a
                      href={`http://localhost:5000${selectedClaim.document}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      View File
                    </a>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Set Decision Status</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAdjudicationStatus('Approved');
                      setApprovedAmount(selectedClaim.claimAmount || selectedClaim.totalAmount || 0);
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 ${
                      adjudicationStatus === 'Approved'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Approve Claim
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAdjudicationStatus('Rejected');
                      setApprovedAmount(0);
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 ${
                      adjudicationStatus === 'Rejected'
                        ? 'bg-rose-50 border-rose-300 text-rose-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" /> Reject Claim
                  </button>
                </div>
              </div>

              {adjudicationStatus === 'Approved' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Approved Payout Amount ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={approvedAmount}
                    onChange={(e) => setApprovedAmount(Number(e.target.value))}
                    max={selectedClaim.claimAmount || selectedClaim.totalAmount}
                    className="w-full bg-white text-slate-900 text-xs rounded-xl border border-slate-200 py-2 px-3 focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                  Insurer Comments / Explanation Notes
                </label>
                <textarea
                  rows={3}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Enter insurer explanation notes or approval policy terms..."
                  className="w-full bg-white text-slate-900 text-xs rounded-xl border border-slate-200 py-2 px-3 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedClaim(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" isLoading={isAdjudicating} disabled={isAdjudicating}>
                  Save Decision
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
