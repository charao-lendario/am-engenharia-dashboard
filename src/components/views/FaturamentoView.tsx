import { useMemo } from 'react';
import { useFilteredData } from '../../hooks/useFilteredData';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { formatCurrency, formatPercent, formatMonthYear } from '../../utils/formatters';
import { StatCard } from '../cards/StatCard';
import { ValueByYearChart } from '../charts/ValueByYearChart';
import { MonthlyTrendChart } from '../charts/MonthlyTrendChart';
import { TrendingUp, DollarSign, BarChart3, Calendar } from 'lucide-react';
import { YEAR_COLORS } from '../../utils/colors';

export function FaturamentoView() {
  const { invoices } = useFilteredData();
  const stats = useDashboardStats(invoices);

  const years = useMemo(() =>
    Object.keys(stats.valueByYear).map(Number).sort(),
    [stats.valueByYear]
  );

  const growth = useMemo(() => {
    if (years.length < 2) return null;
    const last = stats.valueByYear[years[years.length - 1]] ?? 0;
    const prev = stats.valueByYear[years[years.length - 2]] ?? 0;
    return prev > 0 ? ((last - prev) / prev) * 100 : null;
  }, [stats.valueByYear, years]);

  const avgPerMonth = useMemo(() => {
    if (stats.monthlyTrend.length === 0) return 0;
    const total = stats.monthlyTrend.reduce((s, m) => s + m.value, 0);
    return total / stats.monthlyTrend.length;
  }, [stats.monthlyTrend]);

  const bestMonth = useMemo(() => {
    if (stats.monthlyTrend.length === 0) return null;
    return stats.monthlyTrend.reduce((best, m) => m.value > best.value ? m : best);
  }, [stats.monthlyTrend]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Faturamento</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Faturamento Total"
          value={formatCurrency(stats.totalValue)}
          icon={DollarSign}
          color="text-emerald"
        />
        <StatCard
          title="Média Mensal"
          value={formatCurrency(avgPerMonth)}
          icon={Calendar}
          color="text-teal"
        />
        <StatCard
          title="Melhor Mês"
          value={bestMonth ? formatCurrency(bestMonth.value) : '-'}
          subtitle={bestMonth ? formatMonthYear(bestMonth.month, bestMonth.year) : ''}
          icon={BarChart3}
          color="text-gold-400"
        />
        <StatCard
          title="Crescimento Anual"
          value={growth !== null ? formatPercent(growth) : '-'}
          subtitle={years.length >= 2 ? `${years[years.length - 2]} → ${years[years.length - 1]}` : ''}
          icon={TrendingUp}
          color={growth !== null && growth >= 0 ? 'text-emerald' : 'text-coral'}
        />
      </div>

      <ValueByYearChart stats={stats} />
      <MonthlyTrendChart stats={stats} />

      <div className="bg-navy-800 rounded-xl border border-navy-600 overflow-hidden">
        <div className="px-5 py-3 border-b border-navy-600">
          <h3 className="text-sm font-semibold text-white">Faturamento por Ano</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase border-b border-navy-600">
                <th className="px-5 py-3">Ano</th>
                <th className="px-5 py-3 text-center">NFS-e</th>
                <th className="px-5 py-3 text-right">Faturamento</th>
                <th className="px-5 py-3 text-right">Ticket Médio</th>
                <th className="px-5 py-3 text-right">Variação</th>
              </tr>
            </thead>
            <tbody>
              {years.map((year, idx) => {
                const count = stats.invoicesByYear[year] ?? 0;
                const value = stats.valueByYear[year] ?? 0;
                const prevValue = idx > 0 ? (stats.valueByYear[years[idx - 1]] ?? 0) : null;
                const yoyGrowth = prevValue && prevValue > 0 ? ((value - prevValue) / prevValue) * 100 : null;

                return (
                  <tr key={year} className="border-t border-navy-700 hover:bg-navy-700/50 transition-colors">
                    <td className="px-5 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ background: YEAR_COLORS[year] ?? '#d4af37' }} />
                        <span className="text-white font-medium">{year}</span>
                      </div>
                    </td>
                    <td className="px-5 py-2.5 text-center text-gray-400">{count}</td>
                    <td className="px-5 py-2.5 text-right text-gold-400">{formatCurrency(value)}</td>
                    <td className="px-5 py-2.5 text-right text-gray-400">
                      {count > 0 ? formatCurrency(value / count) : '-'}
                    </td>
                    <td className="px-5 py-2.5 text-right">
                      {yoyGrowth !== null ? (
                        <span className={yoyGrowth >= 0 ? 'text-emerald' : 'text-coral'}>
                          {yoyGrowth >= 0 ? '+' : ''}{formatPercent(yoyGrowth)}
                        </span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
