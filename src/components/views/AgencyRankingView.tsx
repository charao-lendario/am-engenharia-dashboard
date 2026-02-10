import { useMemo } from 'react';
import { useFilteredData } from '../../hooks/useFilteredData';
import { clientRanking } from '../../utils/dataTransformers';
import { formatCurrency } from '../../utils/formatters';
import { ClientRankingChart } from '../charts/AgencyRankingChart';
import { Trophy } from 'lucide-react';

export function AgencyRankingView() {
  const { invoices } = useFilteredData();
  const ranking = useMemo(() => clientRanking(invoices), [invoices]);

  const totalValue = ranking.reduce((s, r) => s + r.totalValue, 0);
  const totalInvoices = ranking.reduce((s, r) => s + r.invoiceCount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Ranking de Clientes</h2>
        <div className="text-xs text-gray-400">
          {ranking.length} cliente{ranking.length !== 1 ? 's' : ''} | {totalInvoices} NFS-e | {formatCurrency(totalValue)}
        </div>
      </div>

      <ClientRankingChart data={ranking} />

      <div className="bg-navy-800 rounded-xl border border-navy-600 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase border-b border-navy-600">
                <th className="px-5 py-3">#</th>
                <th className="px-5 py-3">Cliente</th>
                <th className="px-5 py-3 text-center">NFS-e</th>
                <th className="px-5 py-3 text-right">Valor Total</th>
                <th className="px-5 py-3 text-right">Valor Médio</th>
                <th className="px-5 py-3 text-right">% do Total</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((r, i) => (
                <tr key={r.client} className="border-t border-navy-700 hover:bg-navy-700/50 transition-colors">
                  <td className="px-5 py-2.5">
                    {i < 3 ? (
                      <Trophy size={14} className={i === 0 ? 'text-gold-400' : i === 1 ? 'text-gray-300' : 'text-amber'} />
                    ) : (
                      <span className="text-gray-500">{i + 1}</span>
                    )}
                  </td>
                  <td className="px-5 py-2.5 text-white font-medium">{r.client}</td>
                  <td className="px-5 py-2.5 text-center text-gray-400">{r.invoiceCount}</td>
                  <td className="px-5 py-2.5 text-right text-gold-400">{formatCurrency(r.totalValue)}</td>
                  <td className="px-5 py-2.5 text-right text-gray-400">{formatCurrency(r.avgValue)}</td>
                  <td className="px-5 py-2.5 text-right text-gray-400">
                    {totalValue > 0 ? ((r.totalValue / totalValue) * 100).toFixed(1) : 0}%
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
