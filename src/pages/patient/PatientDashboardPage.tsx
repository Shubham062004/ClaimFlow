import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table } from '@/components/tables/Table';
import { Skeleton } from '@/components/common/Skeleton';
import { dashboardService, DashboardMetrics } from '@/services/dashboardService';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { ROUTES } from '@/constants/routes';
import { Claim } from '@/types/claim';
import { FileText, Clock, CheckCircle2, XCircle, PlusCircle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export const PatientDashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      setIsLoading(true);
      try {
        const data = await dashboardService.getMetrics();
        setMetrics(data);
      } catch (e: any) {
        toast.error(e.response?.data?.message || 'Failed to fetch patient dashboard metrics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const columns = [
    {
      header: 'Claim Number',
      accessor: (row: Claim) => (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="font-semibold text-slate-900">{row.claimNumber || `CLM-${row.id}`}</span>
        </div>
      ),
    },
    { header: 'Provider', accessor: (row: Claim) => row.provider || row.providerName || 'N/A' },
    { header: 'Submitted Date', accessor: (row: Claim) => formatDate(row.createdAt || row.submissionDate || row.submittedDate || '') },
    { header: 'Claim Amount', accessor: (row: Claim) => formatCurrency(row.claimAmount || row.totalAmount || 0) },
    { header: 'Approved Amount', accessor: (row: Claim) => formatCurrency(row.approvedAmount || 0) },
    { header: 'Status', accessor: (row: Claim) => <Badge status={row.status as any} /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Patient Overview</h1>
          <p className="text-sm text-slate-500">Track your active healthcare claims and reimbursement status.</p>
        </div>
        <Link to={ROUTES.PATIENT.NEW_CLAIM}>
          <Button variant="primary" leftIcon={<PlusCircle className="w-4 h-4" />}>
            Submit New Claim
          </Button>
        </Link>
      </div>

      {/* Metric Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
          </>
        ) : (
          <>
            <StatCard
              title="Total Claims Filed"
              value={metrics?.totalClaims ?? 0}
              icon={<FileText className="w-5 h-5 text-blue-600" />}
            />
            <StatCard
              title="Pending Review"
              value={metrics?.pendingClaims ?? 0}
              icon={<Clock className="w-5 h-5 text-amber-600" />}
            />
            <StatCard
              title="Approved Claims"
              value={metrics?.approvedClaims ?? 0}
              icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
            />
            <StatCard
              title="Total Approved Payout"
              value={formatCurrency(metrics?.totalApprovedAmount ?? 0)}
              icon={<XCircle className="w-5 h-5 text-slate-600" />}
            />
          </>
        )}
      </div>

      {/* Recent Claims Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Submissions</CardTitle>
            <CardDescription>Latest healthcare reimbursement filings.</CardDescription>
          </div>
          <Link to={ROUTES.PATIENT.MY_CLAIMS}>
            <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All Claims
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3 py-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <Table
              columns={columns}
              data={metrics?.recentClaims || []}
              keyExtractor={(item) => item.id || item._id || String(Math.random())}
              emptyMessage="No recent claims found. Submit a new claim to get started."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
