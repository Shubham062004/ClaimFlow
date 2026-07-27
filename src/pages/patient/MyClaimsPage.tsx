import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Table } from '@/components/tables/Table';
import { useClaims } from '@/hooks/useClaims';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { ROUTES } from '@/constants/routes';
import { Claim } from '@/types/claim';
import { PlusCircle, Search, FileText, Filter } from 'lucide-react';

export const MyClaimsPage: React.FC = () => {
  const { claims } = useClaims();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredClaims = claims.filter((claim) => {
    const matchesSearch =
      claim.claimNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.diagnosisCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || claim.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      header: 'Claim Number',
      accessor: (row: Claim) => (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="font-semibold text-slate-900">{row.claimNumber}</span>
        </div>
      ),
    },
    { header: 'Provider', accessor: 'providerName' as const },
    { header: 'Service Date', accessor: (row: Claim) => formatDate(row.serviceDate) },
    { header: 'Submitted Date', accessor: (row: Claim) => formatDate(row.submittedDate) },
    { header: 'Diagnosis Code', accessor: 'diagnosisCode' as const },
    { header: 'Total Billed', accessor: (row: Claim) => formatCurrency(row.totalAmount) },
    { header: 'Status', accessor: (row: Claim) => <Badge status={row.status} /> },
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
            emptyMessage="No matching claims found."
          />
        </CardContent>
      </Card>
    </div>
  );
};
