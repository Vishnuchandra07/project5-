import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';

const RevenueChart = ({ data }) => {
  if (!data?.length) {
    return (
      <div className="flex h-[240px] items-center justify-center rounded-lg border border-dashed border-surface-200 bg-surface-50/50 text-sm text-slate-500 sm:h-[280px]">
        No revenue data yet — close deals to see trends
      </div>
    );
  }

  return (
    <div className="h-[240px] w-full sm:h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0d9488" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
            dy={8}
          />
          <YAxis
            yAxisId="revenue"
            tick={{ fontSize: 11, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => (v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`)}
            width={48}
          />
          <YAxis
            yAxisId="deals"
            orientation="right"
            tick={{ fontSize: 11, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
            width={32}
          />
          <Tooltip
            contentStyle={{
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 12px rgb(0 0 0 / 0.08)',
              fontSize: '12px',
            }}
            formatter={(value, name) => {
              if (name === 'revenue') return [formatCurrency(value), 'Revenue'];
              if (name === 'deals') return [value, 'Deals closed'];
              if (name === 'newLeads') return [value, 'New leads'];
              return [value, name];
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
            iconType="circle"
            iconSize={8}
          />
          <Area
            yAxisId="revenue"
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke="#0f766e"
            strokeWidth={2}
            fill="url(#revenueGradient)"
          />
          <Area
            yAxisId="deals"
            type="monotone"
            dataKey="deals"
            name="Deals closed"
            stroke="#10b981"
            strokeWidth={2}
            fill="transparent"
            strokeDasharray="4 4"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
