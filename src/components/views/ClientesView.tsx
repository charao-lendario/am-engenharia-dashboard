import { useMemo } from 'react';
import { useFilteredData } from '../../hooks/useFilteredData';
import { clientRanking, clientsByYear } from '../../utils/dataTransformers';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { ClientRankingChart } from '../charts/AgencyRankingChart';
import { StatCard } from '../cards/StatCard';
import { Trophy, Users, UserPlus, UserX } from 'lucide-react';

export function ClientesView() {
  const { invoices, allInvoices } = useFilteredData();
  const ranking = useMemo(() => clientRanking(invoices), [invoices]);

  const totalValue = ranking.reduce((s, r) => s + r.totalValue, 0);
  const totalInvoices = ranking.reduce((s, r) => s + r.invoiceCount, 0);

  // Client evolution by year
  const active = useMemo(() => allInvoices.filter(i => !i.cancelled), [allInvoices]);
  const yearClients = useMemo(() => clientsByYear(active), [active]);
  const years = useMemo(() => Object.keys(yearClients).map(Number).sort(), [yearClients]);

  // New clients per year (didn't appear in previous year)
  const clientEvolution = useMemo(() => {
    return years.map((year, idx) => {
      const current = yearClients[year] ?? new Set();
      const previous = idx > 0 ? (yearClients[years[idx - 1]] ?? new Set()) : new Set<string>();
      const newClients = [...current].filter(c => !previous.has(c));
      const lost = idx > 0 ? [...previous].filter(c => !current.has(c)) : [];
      return {
        year,
        total: current.size,
        new: newClients.length,
        lost: lost.length,
      };
    });
  }, [years, yearClients]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Clientes</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total de Clientes"
          value={String(ranking.length)}
          icon={Users}
          color="text-gold-400"
        />
        <StatCard
          title="NFS-e Emitidas"
          value={String(totalInvoices)}
          subtitle={`Média: ${ranking.length > 0 ? (totalInvoices / ranking.length).toFixed(1) : 0} por cliente`}
          icon={Trophy}
          color="text-teal"
        />
        <StatCard
          title={`Novos em ${years[years.length - 1] ?? '-'}`}
          value={String(clientEvolution[clientEvolution.length - 1]?.new ?? 0)}
          icon={UserPlus}
          color="text-emerald"
        />
        <StatCard
          title={`Perdidos em ${years[years.length - 1] ?? '-'}`}
          value={String(clientEvolution[clientEvolution.length - 1]?.lost ?? 0)}
          icon={UserX}
          color="text-coral"
        />
      </div>

      {/* Client evolution table */}
      <div className="bg-navy-800 rounded-xl border border-navy-600 overflow-hidden">
        <div className="px-5 py-3 border-b border-navy-600">
          <h3 className="text-sm font-semibold text-white">Evolução de Clientes por Ano</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase border-b border-navy-600">
                <th className="px-5 py-3">Ano</th>
                <th className="px-5 py-3 text-center">Clientes Ativos</th>
                <th className="px-5 py-3 text-center">Novos</th>
                <th className="px-5 py-3 text-center">Perdidos</th>
              </tr>
            </thead>
            <tbody>
              {clientEvolution.map(({ year, total, new: newC, lost }) => (
                <tr key={year} className="border-t border-navy-700 hover:bg-navy-700/50 transition-colors">
                  <td className="px-5 py-2.5 text-white font-medium">{year}</td>
                  <td className="px-5 py-2.5 text-center text-gold-400">{total}</td>
                  <td className="px-5 py-2.5 text-center text-emerald">+{newC}</td>
                  <td className="px-5 py-2.5 text-center text-coral">{lost > 0 ? `-${lost}` : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ClientRankingChart data={ranking} />

      {/* Full ranking table */}
      <div className="bg-navy-800 rounded-xl border border-navy-600 overflow-hidden">
        <div className="px-5 py-3 border-b border-navy-600">
          <h3 className="text-sm font-semibold text-white">Ranking Completo</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase border-b border-navy-600">
                <th className="px-5 py-3">#</th>
                <th className="px-5 py-3">Cliente</th>
                <th className="px-5 py-3 text-center">NFS-e</th>
                <th className="px-5 py-3 text-right">Valor Total</th>
                <th className="px-5 py-3 text-right">Ticket Médio</th>
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
                    {totalValue > 0 ? formatPercent((r.totalValue / totalValue) * 100) : '0%'}
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
