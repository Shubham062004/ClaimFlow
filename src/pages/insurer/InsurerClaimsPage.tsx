import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Table } from '@/components/tables/Table';
import { useClaims } from '@/hooks/useClaims';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Claim } from '@/types/claim';
import { Search, Filter, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const InsurerClaimsPage: React.FC = () => {
  const { claims } = useClaims();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredClaims = claims.filter((claim) => {
    const matchesSearch =
      claim.claimNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.providerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || claim.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleApprove = (claimNumber: string) => {
    toast.success(`Claim ${claimNumber} marked as Approved!`);
  };

  const handleReject = (claimNumber: string) => {
    toast.error(`Claim ${claimNumber} marked as Rejected.`);
  };

  const columns = [
    {
      header: 'Claim ID',
      accessor: (row: Claim) => <span className="font-semibold text-slate-900">{row.claimNumber}</span>,
    },
    { header: 'Patient Name', accessor: 'patientName' as const },
    { header: 'Provider', accessor: 'providerName' as const },
    { header: 'Service Date', accessor: (row: Claim) => formatDate(row.serviceDate) },
    { header: 'Billed Amount', accessor: (row: Claim) => formatCurrency(row.totalAmount) },
    { header: 'Status', accessor: (row: Claim) => <Badge status={row.status} /> },
    {
      header: 'Adjudication Controls',
      accessor: (row: Claim) => (
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleApprove(row.claimNumber)}
            className="text-emerald-600 hover:bg-emerald-50 h-7 text-xs px-2"
          >
            <CheckCircle className="w-3.5 h-3.5 mr-1" />
            Approve
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleReject(row.claimNumber)}
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
            <CardTitle>Claims Master Table</CardTitle>
            <CardDescription>Filter and adjudicate claims in real time.</CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="w-full sm:w-64">
              <Input
                placeholder="Search patient, provider, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/60 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent font-medium text-slate-700 focus:outline-none pr-2 py-1 cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          <Table
            columns={columns}
            data={filteredClaims}
            keyExtractor={(item) => item.id}
            emptyMessage="No claims matching the search criteria."
          />
        </CardContent>
      </Card>
    </div>
  );
};
