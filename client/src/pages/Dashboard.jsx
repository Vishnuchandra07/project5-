import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  FiTarget,
  FiTrendingUp,
  FiCheckCircle,
  FiDollarSign,
  FiRefreshCw,
  FiArrowRight,
  FiPercent,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import ChartCard from '../components/dashboard/ChartCard';
import DashboardSkeleton from '../components/dashboard/DashboardSkeleton';
import RevenueChart from '../components/dashboard/RevenueChart';
import ConversionChart from '../components/dashboard/ConversionChart';
import ConversionRateChart from '../components/dashboard/ConversionRateChart';
import MonthlyPerformance from '../components/dashboard/MonthlyPerformance';
import RecentActivities from '../components/dashboard/RecentActivities';
import QuickActions from '../components/dashboard/QuickActions';
import {
  getDashboardStats,
  getRevenueChart,
  getConversionStats,
} from '../services/dashboardService';
import { getActivities } from '../services/activityService';
import { formatCurrency } from '../utils/formatters';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [funnelData, setFunnelData] = useState([]);
  const [conversionSummary, setConversionSummary] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchDashboard = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError('');

    try {
      const [statsRes, revenueRes, conversionRes, activitiesRes] = await Promise.all([
        getDashboardStats(),
        getRevenueChart(),
        getConversionStats(),
        getActivities({ limit: 8 }),
      ]);

      setStats(statsRes.data);
      setRevenueData(revenueRes.data);
      setFunnelData(conversionRes.data.funnel);
      setConversionSummary(conversionRes.data.summary);
      setActivities(activitiesRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const firstName = user?.name?.split(' ')[0] || 'there';

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error && !stats) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-rose-200 bg-rose-50 p-8 text-center">
        <p className="text-sm font-medium text-rose-700">{error}</p>
        <button
          type="button"
          onClick={() => fetchDashboard()}
          className="btn-primary mt-4"
        >
          <FiRefreshCw className="h-4 w-4" />
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <PageHeader
        title={`Hi, ${firstName}`}
        description="Quick view of leads, revenue, and recent updates"
        action={
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fetchDashboard(true)}
              disabled={refreshing}
              className="btn-secondary"
              aria-label="Refresh dashboard"
            >
              <FiRefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <Link to="/pipeline" className="btn-primary">
              View pipeline
              <FiArrowRight className="h-4 w-4" />
            </Link>
          </div>
        }
      />

      {/* Quick actions — mobile friendly */}
      <QuickActions />

      {/* KPI cards — responsive grid */}
      <section aria-label="Key metrics">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Leads"
            value={stats?.totalLeads ?? 0}
            subtitle="All pipeline prospects"
            icon={FiTarget}
            color="brand"
            href="/leads"
          />
          <StatCard
            title="Active Deals"
            value={stats?.activeDeals ?? 0}
            subtitle="Open opportunities"
            icon={FiTrendingUp}
            color="amber"
            href="/pipeline"
          />
          <StatCard
            title="Closed Deals"
            value={stats?.closedDeals ?? 0}
            subtitle={`${stats?.closedWon ?? 0} won · ${stats?.closedLost ?? 0} lost`}
            icon={FiCheckCircle}
            color="green"
          />
          <StatCard
            title="Total Revenue"
            value={formatCurrency(stats?.totalRevenue)}
            subtitle={`${stats?.conversionRate ?? 0}% close rate`}
            icon={FiDollarSign}
            color="purple"
          />
        </div>
      </section>

      {/* Charts row 1: Revenue + Monthly */}
      <section
        aria-label="Performance charts"
        className="grid grid-cols-1 gap-6 lg:grid-cols-3"
      >
        <ChartCard
          title="Revenue Overview"
          description="Revenue and closed deals — last 6 months"
          className="lg:col-span-2"
        >
          <RevenueChart data={revenueData} />
        </ChartCard>

        <ChartCard title="Monthly Performance" description="Current month snapshot">
          <MonthlyPerformance
            monthly={stats?.monthlyPerformance}
            teamCount={stats?.teamCount}
          />
        </ChartCard>
      </section>

      {/* Charts row 2: Funnel + Win rate + Activities */}
      <section
        aria-label="Pipeline and activity"
        className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
      >
        <ChartCard
          title="Lead Conversion by Stage"
          description="Distribution across pipeline stages"
          className="md:col-span-1 xl:col-span-1"
        >
          <ConversionChart data={funnelData} />
        </ChartCard>

        <ChartCard
          title="Conversion Statistics"
          description="Win / loss / in-progress breakdown"
          className="md:col-span-1 xl:col-span-1"
        >
          <ConversionRateChart summary={conversionSummary} />
        </ChartCard>

        <ChartCard
          title="Recent Activity"
          description="Latest updates in your workspace"
          className="md:col-span-2 xl:col-span-1"
          action={
            <Link
              to="/activities"
              className="text-xs font-medium text-brand-600 hover:text-brand-700"
            >
              View all →
            </Link>
          }
        >
          <RecentActivities activities={activities} compact />
        </ChartCard>
      </section>

      {/* Stage breakdown pills — full width on mobile */}
      {stats?.stageBreakdown && (
        <section aria-label="Stage breakdown" className="card">
          <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-semibold text-surface-900">Pipeline snapshot</h3>
              <p className="text-xs text-slate-500">Leads per stage right now</p>
            </div>
            <Link
              to="/pipeline"
              className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700"
            >
              Open kanban
              <FiArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {Object.entries(stats.stageBreakdown).map(([stage, count]) => (
              <div
                key={stage}
                className="rounded-xl border border-surface-200 bg-surface-50/80 px-3 py-3 text-center"
              >
                <p className="text-lg font-bold tabular-nums text-surface-900">{count}</p>
                <p className="mt-0.5 text-[10px] font-medium leading-tight text-slate-500 sm:text-xs">
                  {stage}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Secondary KPI strip */}
      <section
        aria-label="Additional metrics"
        className="grid grid-cols-2 gap-4 lg:grid-cols-4"
      >
        <StatCard
          title="Win Rate"
          value={`${conversionSummary?.winRate ?? stats?.conversionRate ?? 0}%`}
          icon={FiPercent}
          color="green"
          className="!p-4"
        />
        <StatCard
          title="In Progress"
          value={conversionSummary?.inProgress ?? stats?.activeDeals ?? 0}
          icon={FiTrendingUp}
          color="brand"
          className="!p-4"
        />
        <StatCard
          title="Deals Won"
          value={stats?.closedWon ?? 0}
          icon={FiCheckCircle}
          color="green"
          className="!p-4"
        />
        <StatCard
          title="Team Size"
          value={stats?.teamCount ?? 0}
          icon={FiTarget}
          color="purple"
          href="/team"
          className="!p-4"
        />
      </section>
    </div>
  );
};

export default Dashboard;
