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
import { FileText, Clock, CheckCircle2, XCircle, ArrowRight, ShieldCheck, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

export const InsurerDashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      setIsLoading(true);
      try {
        const data = await dashboardService.getMetrics();
        setMetrics(data);
      } catch (e: any) {
        toast.error(e.response?.data?.message || 'Failed to fetch insurer dashboard metrics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const columns = [
    {
      header: 'Claim ID',
      accessor: (row: Claim) => (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="font-semibold text-slate-900">{row.claimNumber || `CLM-${row.id}`}</span>
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
    { header: 'Billed Amount', accessor: (row: Claim) => formatCurrency(row.claimAmount || row.totalAmount || 0) },
    {
      header: 'Medical Document',
      accessor: (row: Claim) => (
        row.document ? (
          <a
            href={`http://localhost:5000${row.document}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold hover:underline"
            title="Inspect attached medical PDF"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>View PDF</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <span className="text-slate-400 text-xs italic">No document</span>
        )
      ),
    },
    { header: 'Status', accessor: (row: Claim) => <Badge status={row.status as any} /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 text-sm font-semibold mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Adjudication Command Center</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Insurer Portal Dashboard</h1>
          <p className="text-sm text-slate-500">Monitor Network Claim Volumes, Adjudication Speeds, and Payout Balances.</p>
        </div>
        <Link to={ROUTES.INSURER.CLAIMS}>
          <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Manage Claims Queue
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
              title="Total Network Claims"
              value={metrics?.totalClaims ?? 0}
              icon={<FileText className="w-5 h-5 text-blue-600" />}
            />
            <StatCard
              title="Pending Queue"
              value={metrics?.pendingClaims ?? 0}
              icon={<Clock className="w-5 h-5 text-amber-600" />}
            />
            <StatCard
              title="Approved Claims"
              value={metrics?.approvedClaims ?? 0}
              icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
            />
            <StatCard
              title="Total Billed Volume"
              value={formatCurrency(metrics?.totalClaimAmount || metrics?.totalAmount || 0)}
              icon={<XCircle className="w-5 h-5 text-slate-600" />}
            />
          </>
        )}
      </div>

      {/* Latest Claims Queue */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Latest Claims Incoming Queue</CardTitle>
            <CardDescription>Most recent claims submitted across healthcare providers with attached medical document links.</CardDescription>
          </div>
          <Link to={ROUTES.INSURER.CLAIMS}>
            <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Open Full Master Queue
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
              data={metrics?.latestClaims || metrics?.recentClaims || []}
              keyExtractor={(item) => item.id || item._id || String(Math.random())}
              emptyMessage="No claims currently pending in the network queue."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
