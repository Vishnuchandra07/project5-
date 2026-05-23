import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#94a3b8', '#3b82f6', '#f59e0b', '#8b5cf6', '#10b981', '#f43f5e'];

const ConversionRateChart = ({ summary }) => {
  if (!summary) {
    return (
      <div className="flex h-[200px] items-center justify-center text-sm text-slate-500">
        No conversion data
      </div>
    );
  }

  const data = [
    { name: 'Won', value: summary.won, color: '#10b981' },
    { name: 'Lost', value: summary.lost, color: '#f43f5e' },
    { name: 'In progress', value: summary.inProgress, color: '#3b82f6' },
  ].filter((d) => d.value > 0);

  const total = summary.total || 0;

  if (total === 0) {
    return (
      <div className="flex h-[200px] flex-col items-center justify-center gap-2 text-center">
        <p className="text-3xl font-bold text-surface-900">0%</p>
        <p className="text-sm text-slate-500">Win rate — add leads to track</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-center">
      <div className="relative h-[180px] w-[180px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={72}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [value, name]}
              contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-surface-900">{summary.winRate}%</span>
          <span className="text-[10px] uppercase tracking-wide text-slate-500">Win rate</span>
        </div>
      </div>

      <ul className="w-full space-y-2 sm:w-auto">
        {data.map((item) => (
          <li key={item.name} className="flex items-center justify-between gap-6 text-sm">
            <span className="flex items-center gap-2 text-slate-600">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              {item.name}
            </span>
            <span className="font-semibold text-surface-900">{item.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConversionRateChart;
