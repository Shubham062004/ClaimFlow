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
import { ShieldAlert, ArrowUpRight, CheckCircle2, Clock, FileCheck, Layers } from 'lucide-react';

export const InsurerDashboardPage: React.FC = () => {
  const { claims } = useClaims();

  const columns = [
    {
      header: 'Claim ID',
      accessor: (row: Claim) => <span className="font-semibold text-slate-900">{row.claimNumber}</span>,
    },
    { header: 'Patient Name', accessor: 'patientName' as const },
    { header: 'Provider', accessor: 'providerName' as const },
    { header: 'Date Submitted', accessor: (row: Claim) => formatDate(row.submittedDate) },
    { header: 'Billed Amount', accessor: (row: Claim) => formatCurrency(row.totalAmount) },
    { header: 'Status', accessor: (row: Claim) => <Badge status={row.status} /> },
    {
      header: 'Action',
      accessor: () => (
        <Button variant="outline" size="sm">
          Review Adjudication
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Insurer Adjudication Dashboard</h1>
          <p className="text-sm text-slate-500">Monitor incoming claims queue, automate approval rules, and audit decisions.</p>
        </div>
        <Link to={ROUTES.INSURER.CLAIMS}>
          <Button variant="primary" leftIcon={<Layers className="w-4 h-4" />}>
            Full Claims Queue
          </Button>
        </Link>
      </div>

      {/* Adjudicator Key Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Review</CardTitle>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">2 Claims</div>
            <p className="text-xs text-slate-500 mt-1">Requires adjudicator action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Auto-Approved</CardTitle>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">14 Claims</div>
            <p className="text-xs text-slate-500 mt-1">Passed rules engine</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Flagged Exceptions</CardTitle>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">1 Claim</div>
            <p className="text-xs text-slate-500 mt-1">Diagnosis code mismatch</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Volume</CardTitle>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <FileCheck className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">$6,600.00</div>
            <p className="text-xs text-slate-500 mt-1">Current batch volume</p>
          </CardContent>
        </Card>
      </div>

      {/* Actionable Claims Queue Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Adjudication Work Queue</CardTitle>
            <CardDescription>Claims requiring manual inspection or approval override.</CardDescription>
          </div>
          <Link to={ROUTES.INSURER.CLAIMS}>
            <Button variant="ghost" size="sm" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
              Open Queue
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="pt-2">
          <Table
            columns={columns}
            data={claims}
            keyExtractor={(item) => item.id}
            emptyMessage="No pending claims in the queue."
          />
        </CardContent>
      </Card>
    </div>
  );
};
