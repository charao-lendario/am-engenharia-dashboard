import { useFilteredData } from '../../hooks/useFilteredData';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { StatCardGrid } from '../cards/StatCardGrid';
import { SalesByYearChart } from '../charts/SalesByYearChart';
import { ValueByYearChart } from '../charts/ValueByYearChart';
import { MonthlyTrendChart } from '../charts/MonthlyTrendChart';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { CHART_COLORS } from '../../utils/colors';

export function OverviewView() {
  const { sales } = useFilteredData();
  const stats = useDashboardStats(sales);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Visão Geral</h2>
      <StatCardGrid stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesByYearChart stats={stats} />
        <ValueByYearChart stats={stats} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-navy-800 rounded-xl border border-navy-600 p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Top 10 Produtos por Faturamento</h3>
          <div className="space-y-3">
            {stats.byProduct.slice(0, 10).map((p, i) => {
              const maxValue = stats.byProduct[0]?.value ?? 1;
              return (
                <div key={p.productName} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-5 text-right">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-white truncate">{p.productName}</span>
                      <span className="text-xs text-gold-400 ml-2 shrink-0">{formatCurrency(p.value)}</span>
                    </div>
                    <div className="h-1.5 bg-navy-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(p.value / maxValue) * 100}%`,
                          background: CHART_COLORS[i % CHART_COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-navy-800 rounded-xl border border-navy-600 p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Vendas por Categoria</h3>
          <div className="space-y-4">
            {stats.byCategory.map((cat, i) => {
              const pct = stats.totalValue > 0 ? (cat.value / stats.totalValue) * 100 : 0;
              return (
                <div key={cat.category}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                      <span className="text-sm text-white">{cat.category}</span>
                    </div>
                    <span className="text-xs text-gray-400">{cat.count} vendas | {formatPercent(pct)}</span>
                  </div>
                  <div className="h-2 bg-navy-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        background: CHART_COLORS[i % CHART_COLORS.length],
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{formatCurrency(cat.value)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <MonthlyTrendChart stats={stats} />
    </div>
  );
}
