import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table } from '@/components/tables/Table';
import { useClaims } from '@/hooks/useClaims';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { ROUTES } from '@/constants/routes';
import { Claim } from '@/types/claim';
import { PlusCircle, FileText, ArrowUpRight, DollarSign, Clock, CheckCircle } from 'lucide-react';

export const PatientDashboardPage: React.FC = () => {
  const { claims } = useClaims();

  const columns = [
    {
      header: 'Claim Number',
      accessor: (row: Claim) => (
        <span className="font-semibold text-blue-600 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5" />
          {row.claimNumber}
        </span>
      ),
    },
    { header: 'Healthcare Provider', accessor: 'providerName' as const },
    { header: 'Service Date', accessor: (row: Claim) => formatDate(row.serviceDate) },
    { header: 'Total Billed', accessor: (row: Claim) => formatCurrency(row.totalAmount) },
    { header: 'Status', accessor: (row: Claim) => <Badge status={row.status} /> },
  ];

  return (
    <div className="space-y-6">
      {/* Dashboard Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Patient Claims Overview</h1>
          <p className="text-sm text-slate-500">Track claim statuses, coverage breakdowns, and submit new reimbursement requests.</p>
        </div>
        <Link to={ROUTES.PATIENT.NEW_CLAIM}>
          <Button variant="primary" leftIcon={<PlusCircle className="w-4 h-4" />}>
            Submit New Claim
          </Button>
        </Link>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Billed</CardTitle>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">$2,300.00</div>
            <p className="text-xs text-slate-500 mt-1">Across active claims</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Under Review</CardTitle>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">1 Claim</div>
            <p className="text-xs text-slate-500 mt-1">Awaiting adjudication</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Approved Amount</CardTitle>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">$1,200.00</div>
            <p className="text-xs text-slate-500 mt-1">Reimbursed to date</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Table Container */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Claim Submissions</CardTitle>
            <CardDescription>View latest status updates and adjudication decisions.</CardDescription>
          </div>
          <Link to={ROUTES.PATIENT.MY_CLAIMS}>
            <Button variant="ghost" size="sm" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
              View All Claims
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="pt-2">
          <Table
            columns={columns}
            data={claims.slice(0, 3)}
            keyExtractor={(item) => item.id}
            emptyMessage="No recent claims found. Click 'Submit New Claim' to create your first claim."
          />
        </CardContent>
      </Card>
    </div>
  );
};
