import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Table } from '@/components/tables/Table';
import { Skeleton } from '@/components/common/Skeleton';
import { claimService } from '@/services/claimService';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { ROUTES } from '@/constants/routes';
import { Claim } from '@/types/claim';
import { PlusCircle, Search, FileText, Filter, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

export const MyClaimsPage: React.FC = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

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
      toast.error(e.response?.data?.message || 'Failed to load claims history.');
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

  const columns = [
    {
      header: 'Claim Number',
      accessor: (row: Claim) => (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="font-semibold text-slate-900">{row.claimNumber || `CLM-${row.id.substring(0, 8)}`}</span>
        </div>
      ),
    },
    { header: 'Provider', accessor: (row: Claim) => row.provider || row.providerName || 'N/A' },
    { header: 'Submitted Date', accessor: (row: Claim) => formatDate(row.createdAt || row.submissionDate || row.submittedDate || '') },
    { header: 'Diagnosis Code', accessor: (row: Claim) => row.diagnosisCode || 'N/A' },
    { header: 'Claim Amount', accessor: (row: Claim) => formatCurrency(row.claimAmount || row.totalAmount || 0) },
    { header: 'Approved Payout', accessor: (row: Claim) => formatCurrency(row.approvedAmount || 0) },
    { header: 'Status', accessor: (row: Claim) => <Badge status={row.status as any} /> },
    {
      header: 'Details',
      accessor: (row: Claim) => (
        <button
          onClick={() => setSelectedClaim(row)}
          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-blue-600 transition-colors"
          title="View Claim Details"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Claims Registry</h1>
          <p className="text-sm text-slate-500">History of all claims filed under your patient record.</p>
        </div>
        <Link to={ROUTES.PATIENT.NEW_CLAIM}>
          <Button variant="primary" leftIcon={<PlusCircle className="w-4 h-4" />}>
            File New Claim
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Filtered Claims List</CardTitle>
            <CardDescription>Search by provider, claim number, or status filters.</CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="w-full sm:w-64">
              <Input
                placeholder="Search claims..."
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
                emptyMessage="No matching claims found in your record."
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

      {/* Claim Detail Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Claim Details</h3>
                <p className="text-xs text-slate-500">{selectedClaim.claimNumber || selectedClaim.id}</p>
              </div>
              <Badge status={selectedClaim.status as any} />
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl">
                <div>
                  <span className="text-slate-400 block">Provider</span>
                  <span className="font-semibold text-slate-900">{selectedClaim.provider || selectedClaim.providerName || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Claim Amount</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(selectedClaim.claimAmount || selectedClaim.totalAmount || 0)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Diagnosis Code</span>
                  <span className="font-semibold text-slate-900">{selectedClaim.diagnosisCode || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Procedure Code</span>
                  <span className="font-semibold text-slate-900">{selectedClaim.procedureCode || 'N/A'}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Description</span>
                <p className="bg-slate-50 p-2.5 rounded-lg">{selectedClaim.description}</p>
              </div>

              {selectedClaim.document && (
                <div>
                  <span className="text-slate-400 block mb-1">Attached Document</span>
                  <a
                    href={`http://localhost:5000${selectedClaim.document}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-blue-600 hover:underline font-medium"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    View Medical Document
                  </a>
                </div>
              )}

              {selectedClaim.comments && (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl">
                  <span className="text-amber-800 font-semibold block mb-0.5">Insurer Comments:</span>
                  <p className="text-amber-900">{selectedClaim.comments}</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setSelectedClaim(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
