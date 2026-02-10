import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { CHART_COLORS } from '../../utils/colors';

interface EmpresaData {
  empresa: string;
  value: number;
}

interface Props {
  empresas: EmpresaData[];
}

export function EmpresaPieChart({ empresas }: Props) {
  const total = empresas.reduce((s, e) => s + e.value, 0);

  if (total === 0) {
    return (
      <div className="bg-navy-800 rounded-xl border border-navy-600 p-5 flex items-center justify-center h-80">
        <p className="text-gray-500 text-sm">Nenhum dado para exibir</p>
      </div>
    );
  }

  return (
    <div className="bg-navy-800 rounded-xl border border-navy-600 p-5">
      <h3 className="text-sm font-semibold text-white mb-4">Distribuição por Empresa</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={empresas}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
              nameKey="empresa"
              strokeWidth={0}
            >
              {empresas.map((_, i) => (
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
      <div className="flex justify-center gap-6 flex-wrap">
        {empresas.map((e, i) => (
          <div key={e.empresa} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
            <span className="text-xs text-gray-400">
              {e.empresa}: {formatPercent((e.value / total) * 100)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
