import { useMemo } from 'react';
import { useFilteredData } from '../../hooks/useFilteredData';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { CHART_COLORS } from '../../utils/colors';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function ProductsView() {
  const { sales } = useFilteredData();
  const stats = useDashboardStats(sales);

  const productsByCount = useMemo(() =>
    [...stats.byProduct].sort((a, b) => b.count - a.count),
    [stats.byProduct]
  );

  const totalValue = stats.totalValue;
  const totalCount = stats.totalSales;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Produtos</h2>
        <div className="text-xs text-gray-400">
          {stats.byProduct.length} produtos | {totalCount} vendas | {formatCurrency(totalValue)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-navy-800 rounded-xl border border-navy-600 p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Faturamento por Produto</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.byProduct.slice(0, 10)}
                layout="vertical"
                margin={{ left: 20, right: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1d3a66" />
                <XAxis
                  type="number"
                  stroke="#64748b"
                  fontSize={11}
                  tickFormatter={(v: number) => v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : `${(v / 1_000).toFixed(0)}K`}
                />
                <YAxis
                  type="category"
                  dataKey="productName"
                  stroke="#64748b"
                  fontSize={10}
                  width={160}
                  tickFormatter={(v: string) => v.length > 25 ? v.slice(0, 25) + '...' : v}
                />
                <Tooltip
                  contentStyle={{ background: '#101e36', border: '1px solid #1d3a66', borderRadius: 8 }}
                  labelStyle={{ color: '#e2e8f0', fontSize: 12 }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any) => [formatCurrency(value), 'Faturamento']}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {stats.byProduct.slice(0, 10).map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-navy-800 rounded-xl border border-navy-600 p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Distribuição por Categoria</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.byCategory}
                  dataKey="value"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                >
                  {stats.byCategory.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#101e36', border: '1px solid #1d3a66', borderRadius: 8 }}
                  labelStyle={{ color: '#e2e8f0' }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any) => [formatCurrency(value), 'Valor']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2 flex-wrap">
            {stats.byCategory.map((cat, i) => (
              <div key={cat.category} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                <span className="text-xs text-gray-400">{cat.category}</span>
                <span className="text-xs text-gray-500">({formatPercent(totalValue > 0 ? (cat.value / totalValue) * 100 : 0)})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-navy-800 rounded-xl border border-navy-600 overflow-hidden">
        <div className="px-5 py-3 border-b border-navy-600">
          <h3 className="text-sm font-semibold text-white">Todos os Produtos</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase border-b border-navy-600">
                <th className="px-5 py-3">#</th>
                <th className="px-5 py-3">Produto</th>
                <th className="px-5 py-3">Categoria</th>
                <th className="px-5 py-3 text-center">Vendas</th>
                <th className="px-5 py-3 text-center">Qtd Total</th>
                <th className="px-5 py-3 text-right">Faturamento</th>
                <th className="px-5 py-3 text-right">Ticket Médio</th>
                <th className="px-5 py-3 text-right">% do Total</th>
              </tr>
            </thead>
            <tbody>
              {productsByCount.map((p, i) => (
                <tr key={p.productName} className="border-t border-navy-700 hover:bg-navy-700/50 transition-colors">
                  <td className="px-5 py-2.5 text-gray-500">{i + 1}</td>
                  <td className="px-5 py-2.5 text-white font-medium">{p.productName}</td>
                  <td className="px-5 py-2.5">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-navy-700 text-gray-300">
                      {p.category}
                    </span>
                  </td>
                  <td className="px-5 py-2.5 text-center text-gray-400">{p.count}</td>
                  <td className="px-5 py-2.5 text-center text-gray-400">{p.quantity}</td>
                  <td className="px-5 py-2.5 text-right text-gold-400">{formatCurrency(p.value)}</td>
                  <td className="px-5 py-2.5 text-right text-gray-400">{formatCurrency(p.count > 0 ? p.value / p.count : 0)}</td>
                  <td className="px-5 py-2.5 text-right text-gray-400">
                    {totalValue > 0 ? ((p.value / totalValue) * 100).toFixed(1) : 0}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
