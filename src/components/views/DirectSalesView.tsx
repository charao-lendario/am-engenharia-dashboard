import { useMemo } from 'react';
import { useFilteredData } from '../../hooks/useFilteredData';
import { empresaSummary } from '../../utils/dataTransformers';
import { formatCurrency, formatPercent, formatDate } from '../../utils/formatters';
import { EmpresaPieChart } from '../charts/DirectSalesPieChart';
import { StatCard } from '../cards/StatCard';
import { Building2, DollarSign, ShoppingCart } from 'lucide-react';

export function DirectSalesView() {
  const { sales } = useFilteredData();
  const summary = useMemo(() => empresaSummary(sales), [sales]);
  const totalValue = summary.reduce((s, e) => s + e.value, 0);
  const totalCount = summary.reduce((s, e) => s + e.count, 0);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Por Empresa</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total de Vendas"
          value={String(totalCount)}
          subtitle={`${summary.length} empresa${summary.length !== 1 ? 's' : ''}`}
          icon={Building2}
          color="text-teal"
        />
        <StatCard
          title="Faturamento"
          value={formatCurrency(totalValue)}
          icon={DollarSign}
          color="text-emerald"
        />
        <StatCard
          title="Média por Venda"
          value={formatCurrency(totalCount > 0 ? totalValue / totalCount : 0)}
          icon={ShoppingCart}
          color="text-gold-400"
        />
      </div>

      <EmpresaPieChart
        empresas={summary.map(e => ({ empresa: e.empresa, value: e.value }))}
      />

      {summary.map(({ empresa, count, value, sales: empSales }) => (
        <div key={empresa} className="bg-navy-800 rounded-xl border border-navy-600 overflow-hidden">
          <div className="px-5 py-3 border-b border-navy-600 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">{empresa}</h3>
            <span className="text-xs text-gray-400">
              {count} vendas | {formatCurrency(value)} | {formatPercent(totalValue > 0 ? (value / totalValue) * 100 : 0)}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase">
                  <th className="px-5 py-2">Cliente</th>
                  <th className="px-5 py-2">Produto</th>
                  <th className="px-5 py-2">Data</th>
                  <th className="px-5 py-2">Ano</th>
                  <th className="px-5 py-2 text-right">Valor</th>
                </tr>
              </thead>
              <tbody>
                {empSales.slice(0, 20).map(s => (
                  <tr key={s.id} className="border-t border-navy-700 hover:bg-navy-700/50 transition-colors">
                    <td className="px-5 py-2.5 text-white">{s.clientName}</td>
                    <td className="px-5 py-2.5 text-gray-400">{s.productName}</td>
                    <td className="px-5 py-2.5 text-gray-400">{formatDate(s.date)}</td>
                    <td className="px-5 py-2.5 text-gray-400">{s.year}</td>
                    <td className="px-5 py-2.5 text-right text-teal">{formatCurrency(s.totalValue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {empSales.length > 20 && (
              <p className="text-xs text-gray-500 p-3 text-center">
                Mostrando 20 de {empSales.length} vendas
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
