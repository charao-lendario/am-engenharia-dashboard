import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency, formatPercent } from '../../utils/formatters';

interface Props {
  directValue: number;
  brokerValue: number;
}

export function DirectSalesPieChart({ directValue, brokerValue }: Props) {
  const data = [
    { name: 'Vendas Diretas', value: directValue },
    { name: 'Via Imobiliária', value: brokerValue },
  ];

  const colors = ['#2dd4bf', '#d4af37'];

  return (
    <div className="bg-navy-800 rounded-xl border border-navy-600 p-5">
      <h3 className="text-sm font-semibold text-white mb-4">Distribuição de Vendas</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={colors[i]} />
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
      <div className="flex justify-center gap-6">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: colors[i] }} />
            <span className="text-xs text-gray-400">
              {d.name}: {formatPercent((d.value / (directValue + brokerValue)) * 100)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
