import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { AgencyRanking } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface Props {
  data: AgencyRanking[];
}

export function AgencyRankingChart({ data }: Props) {
  const chartData = data.slice(0, 10);

  if (chartData.length === 0) {
    return (
      <div className="bg-navy-800 rounded-xl border border-navy-600 p-5 flex items-center justify-center h-80">
        <p className="text-gray-500 text-sm">Nenhuma imobiliária encontrada</p>
      </div>
    );
  }

  return (
    <div className="bg-navy-800 rounded-xl border border-navy-600 p-5">
      <h3 className="text-sm font-semibold text-white mb-4">Ranking por Valor Total</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1d3a66" />
            <XAxis type="number" stroke="#64748b" fontSize={10} tickFormatter={(v) => `R$${(v/1000).toFixed(0)}K`} />
            <YAxis
              type="category"
              dataKey="broker"
              stroke="#64748b"
              fontSize={11}
              width={100}
              tick={{ fill: '#94a3b8' }}
            />
            <Tooltip
              contentStyle={{ background: '#101e36', border: '1px solid #1d3a66', borderRadius: 8 }}
              labelStyle={{ color: '#e2e8f0' }}
              itemStyle={{ color: '#e2e8f0' }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => [formatCurrency(value), 'Valor Total']}
              labelFormatter={(label) => String(label)}
            />
            <Bar dataKey="totalValue" fill="#d4af37" radius={[0, 4, 4, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
