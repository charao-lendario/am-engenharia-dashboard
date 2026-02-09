import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { DashboardStats } from '../../types';
import { formatMonthYear, formatCurrency } from '../../utils/formatters';

interface Props {
  stats: DashboardStats;
}

export function MonthlyTrendChart({ stats }: Props) {
  const data = stats.monthlyTrend.map(d => ({
    ...d,
    label: formatMonthYear(d.month, d.year),
  }));

  if (data.length === 0) {
    return (
      <div className="bg-navy-800 rounded-xl border border-navy-600 p-5 flex items-center justify-center h-80">
        <p className="text-gray-500 text-sm">Nenhum dado para exibir</p>
      </div>
    );
  }

  return (
    <div className="bg-navy-800 rounded-xl border border-navy-600 p-5">
      <h3 className="text-sm font-semibold text-white mb-4">Tendência Mensal</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1d3a66" />
            <XAxis
              dataKey="label"
              stroke="#64748b"
              fontSize={10}
              angle={-45}
              textAnchor="end"
              height={50}
            />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip
              contentStyle={{ background: '#101e36', border: '1px solid #1d3a66', borderRadius: 8 }}
              labelStyle={{ color: '#e2e8f0' }}
              itemStyle={{ color: '#e2e8f0' }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any, name: any) => {
                if (name === 'value') return [formatCurrency(value), 'Valor'];
                return [value, 'Contratos'];
              }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#d4af37"
              strokeWidth={2}
              dot={{ fill: '#d4af37', r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
