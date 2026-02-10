import { useMemo } from 'react';
import { useFilteredData } from '../../hooks/useFilteredData';
import { empresaSummary } from '../../utils/dataTransformers';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { EmpresaPieChart } from '../charts/DirectSalesPieChart';
import { StatCard } from '../cards/StatCard';
import { Building2, DollarSign, Receipt, FileText } from 'lucide-react';
import { CHART_COLORS } from '../../utils/colors';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function EmpresasView() {
  const { invoices } = useFilteredData();
  const summary = useMemo(() => empresaSummary(invoices), [invoices]);
  const totalValue = summary.reduce((s, e) => s + e.value, 0);
  const totalCount = summary.reduce((s, e) => s + e.count, 0);
  const totalISS = summary.reduce((s, e) => s + e.iss, 0);

  // By year comparison
  const yearComparison = useMemo(() => {
    const active = invoices.filter(i => !i.cancelled);
    const map = new Map<number, Record<string, number>>();

    for (const i of active) {
      if (!map.has(i.year)) map.set(i.year, {});
      const yearData = map.get(i.year)!;
      yearData[i.empresa] = (yearData[i.empresa] ?? 0) + i.totalValue;
    }

    const empresas = [...new Set(active.map(i => i.empresa))].sort();

    return {
      empresas,
      data: Array.from(map.entries())
        .map(([year, values]) => ({ year, ...values }))
        .sort((a, b) => a.year - b.year),
    };
  }, [invoices]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Empresas</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total NFS-e"
          value={String(totalCount)}
          icon={FileText}
          color="text-gold-400"
        />
        <StatCard
          title="Faturamento Total"
          value={formatCurrency(totalValue)}
          icon={DollarSign}
          color="text-emerald"
        />
        <StatCard
          title="ISS Total"
          value={formatCurrency(totalISS)}
          icon={Receipt}
          color="text-teal"
        />
        <StatCard
          title="Empresas Ativas"
          value={String(summary.length)}
          icon={Building2}
          color="text-amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EmpresaPieChart
          empresas={summary.map(e => ({ empresa: e.empresa, value: e.value }))}
        />

        {/* Stacked bar chart by year */}
        <div className="bg-navy-800 rounded-xl border border-navy-600 p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Faturamento por Ano e Empresa</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearComparison.data} barSize={30}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1d3a66" />
                <XAxis dataKey="year" stroke="#64748b" fontSize={12} />
                <YAxis
                  stroke="#64748b"
                  fontSize={10}
                  tickFormatter={(v: number) => `${(v / 1_000_000).toFixed(1)}M`}
                />
                <Tooltip
                  contentStyle={{ background: '#101e36', border: '1px solid #1d3a66', borderRadius: 8 }}
                  labelStyle={{ color: '#e2e8f0' }}
                  itemStyle={{ color: '#e2e8f0' }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any) => [formatCurrency(value), '']}
                />
                <Legend
                  wrapperStyle={{ fontSize: 11, color: '#94a3b8' }}
                />
                {yearComparison.empresas.map((empresa, i) => (
                  <Bar
                    key={empresa}
                    dataKey={empresa}
                    stackId="a"
                    fill={CHART_COLORS[i % CHART_COLORS.length]}
                    radius={i === yearComparison.empresas.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Cards per empresa */}
      {summary.map((emp, i) => (
        <div key={emp.empresa} className="bg-navy-800 rounded-xl border border-navy-600 overflow-hidden">
          <div className="px-5 py-4 border-b border-navy-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                <h3 className="text-base font-semibold text-white">{emp.empresa}</h3>
              </div>
              <span className="text-xs text-gray-400">
                {emp.count} NFS-e | {formatCurrency(emp.value)} | {formatPercent(totalValue > 0 ? (emp.value / totalValue) * 100 : 0)}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5">
            <div>
              <p className="text-xs text-gray-500">NFS-e</p>
              <p className="text-lg font-bold text-white">{emp.count}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Faturamento</p>
              <p className="text-lg font-bold text-gold-400">{formatCurrency(emp.value)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">ISS</p>
              <p className="text-lg font-bold text-teal">{formatCurrency(emp.iss)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Ticket Médio</p>
              <p className="text-lg font-bold text-gray-300">
                {emp.count > 0 ? formatCurrency(emp.value / emp.count) : '-'}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
