import { useMemo } from 'react';
import { useFilteredData } from '../../hooks/useFilteredData';
import { directSalesSummary } from '../../utils/dataTransformers';
import { formatCurrency, formatPercent, formatDate } from '../../utils/formatters';
import { DirectSalesPieChart } from '../charts/DirectSalesPieChart';
import { StatCard } from '../cards/StatCard';
import { Target, DollarSign, TrendingUp } from 'lucide-react';

export function DirectSalesView() {
  const { contracts } = useFilteredData();
  const summary = useMemo(() => directSalesSummary(contracts), [contracts]);

  const brokerValue = summary.totalValue - summary.value;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Vendas Diretas</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Contratos Diretos"
          value={`${summary.count} de ${summary.total}`}
          subtitle={`${formatPercent(summary.percentCount)} dos contratos`}
          icon={Target}
          color="text-teal"
        />
        <StatCard
          title="Valor Direto"
          value={formatCurrency(summary.value)}
          subtitle={`${formatPercent(summary.percent)} do valor total`}
          icon={DollarSign}
          color="text-emerald"
        />
        <StatCard
          title="Ticket Médio Direto"
          value={formatCurrency(summary.count > 0 ? summary.value / summary.count : 0)}
          subtitle={`Geral: ${formatCurrency(summary.total > 0 ? summary.totalValue / summary.total : 0)}`}
          icon={TrendingUp}
          color="text-gold-400"
        />
      </div>

      <DirectSalesPieChart directValue={summary.value} brokerValue={brokerValue} />

      <div className="bg-navy-800 rounded-xl border border-navy-600 overflow-hidden">
        <div className="px-5 py-3 border-b border-navy-600">
          <h3 className="text-sm font-semibold text-white">Contratos de Vendas Diretas</h3>
        </div>
        {summary.contracts.length === 0 ? (
          <p className="text-gray-500 text-sm p-5">Nenhuma venda direta encontrada</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase">
                  <th className="px-5 py-2">Cliente</th>
                  <th className="px-5 py-2">Contrato</th>
                  <th className="px-5 py-2">Data</th>
                  <th className="px-5 py-2">Empreendimento</th>
                  <th className="px-5 py-2">Ano</th>
                  <th className="px-5 py-2 text-right">Valor</th>
                </tr>
              </thead>
              <tbody>
                {summary.contracts.map(c => (
                  <tr key={c.id} className="border-t border-navy-700 hover:bg-navy-700/50 transition-colors">
                    <td className="px-5 py-2.5 text-white">{c.clientName}</td>
                    <td className="px-5 py-2.5 text-gray-400">{c.contractNumber}</td>
                    <td className="px-5 py-2.5 text-gray-400">{formatDate(c.date)}</td>
                    <td className="px-5 py-2.5 text-gray-400">{c.empreendimento}</td>
                    <td className="px-5 py-2.5 text-gray-400">{c.year}</td>
                    <td className="px-5 py-2.5 text-right text-teal">{formatCurrency(c.totalValue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
