import { useMemo } from 'react';
import { useFilteredData } from '../../hooks/useFilteredData';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { CHART_COLORS } from '../../utils/colors';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const ATIVIDADE_LABELS: Record<string, string> = {
  '7.01': 'Engenharia / Elaboração de projetos',
  '14.01': 'Limpeza / Manutenção / Conservação',
  '14.06': 'Instalação e montagem',
  '17.01': 'Assessoria e consultoria',
  '17.09': 'Perícias / Laudos / Exames técnicos',
  '8.02': 'Instrução / Treinamento',
};

export function AtividadesView() {
  const { invoices } = useFilteredData();

  const atividades = useMemo(() => {
    const active = invoices.filter(i => !i.cancelled);
    const map = new Map<string, { count: number; value: number; iss: number }>();

    for (const i of active) {
      const entry = map.get(i.atividade) ?? { count: 0, value: 0, iss: 0 };
      entry.count++;
      entry.value += i.totalValue;
      entry.iss += i.valorISS;
      map.set(i.atividade, entry);
    }

    const totalValue = active.reduce((s, i) => s + i.totalValue, 0);

    return Array.from(map.entries())
      .map(([code, data]) => ({
        code,
        label: ATIVIDADE_LABELS[code] ?? code,
        shortLabel: code,
        ...data,
        percent: totalValue > 0 ? (data.value / totalValue) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value);
  }, [invoices]);

  const totalValue = atividades.reduce((s, a) => s + a.value, 0);
  const totalCount = atividades.reduce((s, a) => s + a.count, 0);

  // Data for pie chart
  const pieData = atividades.map(a => ({ name: a.code, value: a.value }));

  // Data for bar chart
  const barData = atividades.map(a => ({ name: a.code, count: a.count, value: a.value }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Atividades</h2>
        <span className="text-xs text-gray-400">
          {atividades.length} atividades | {totalCount} NFS-e | {formatCurrency(totalValue)}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie chart - distribuição por valor */}
        <div className="bg-navy-800 rounded-xl border border-navy-600 p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Distribuição por Valor</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  strokeWidth={0}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#101e36', border: '1px solid #1d3a66', borderRadius: 8 }}
                  itemStyle={{ color: '#e2e8f0' }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any) => [formatCurrency(value), 'Valor']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {atividades.map((a, i) => (
              <div key={a.code} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                <span className="text-xs text-gray-400">{a.code}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar chart - quantidade por atividade */}
        <div className="bg-navy-800 rounded-xl border border-navy-600 p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Quantidade de NFS-e por Atividade</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barSize={30}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1d3a66" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: '#101e36', border: '1px solid #1d3a66', borderRadius: 8 }}
                  labelStyle={{ color: '#e2e8f0' }}
                  itemStyle={{ color: '#e2e8f0' }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any) => [value, 'NFS-e']}
                  labelFormatter={(label) => `Atividade ${label}`}
                />
                <Bar dataKey="count" fill="#d4af37" radius={[4, 4, 0, 0]}>
                  {barData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tabela detalhada */}
      <div className="bg-navy-800 rounded-xl border border-navy-600 overflow-hidden">
        <div className="px-5 py-3 border-b border-navy-600">
          <h3 className="text-sm font-semibold text-white">Detalhamento por Atividade</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase border-b border-navy-600">
                <th className="px-5 py-3">Código</th>
                <th className="px-5 py-3">Descrição</th>
                <th className="px-5 py-3 text-center">NFS-e</th>
                <th className="px-5 py-3 text-right">Faturamento</th>
                <th className="px-5 py-3 text-right">Ticket Médio</th>
                <th className="px-5 py-3 text-right">ISS</th>
                <th className="px-5 py-3 text-right">% do Total</th>
              </tr>
            </thead>
            <tbody>
              {atividades.map((a, i) => (
                <tr key={a.code} className="border-t border-navy-700 hover:bg-navy-700/50 transition-colors">
                  <td className="px-5 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                      <span className="text-white font-medium">{a.code}</span>
                    </div>
                  </td>
                  <td className="px-5 py-2.5 text-gray-300">{a.label}</td>
                  <td className="px-5 py-2.5 text-center text-gray-400">{a.count}</td>
                  <td className="px-5 py-2.5 text-right text-gold-400">{formatCurrency(a.value)}</td>
                  <td className="px-5 py-2.5 text-right text-gray-400">{a.count > 0 ? formatCurrency(a.value / a.count) : '-'}</td>
                  <td className="px-5 py-2.5 text-right text-gray-400">{formatCurrency(a.iss)}</td>
                  <td className="px-5 py-2.5 text-right text-gray-400">{formatPercent(a.percent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
