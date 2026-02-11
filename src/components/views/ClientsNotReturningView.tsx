import { useMemo } from 'react';
import { useFilteredData } from '../../hooks/useFilteredData';
import { clientsInANotB } from '../../utils/dataTransformers';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { UserX } from 'lucide-react';
import type { Sale } from '../../types';

export function ClientsNotReturningView() {
  const { allSales } = useFilteredData();

  const active = useMemo(() => allSales.filter(s => !s.cancelled), [allSales]);

  const years = useMemo(() =>
    [...new Set(active.map(s => s.year))].sort(),
    [active]
  );

  const pairs = useMemo(() => {
    const result = [];
    for (let idx = 0; idx < years.length - 1; idx++) {
      result.push({ yearA: years[idx], yearB: years[idx + 1] });
    }
    return result;
  }, [years]);

  const sections = useMemo(() =>
    pairs.map(({ yearA, yearB }) => ({
      title: `Clientes de ${yearA} que não retornaram em ${yearB}`,
      sales: clientsInANotB(active, yearA, yearB),
    })),
    [pairs, active]
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Clientes que Não Retornaram</h2>

      {sections.map(({ title, sales }) => (
        <Section key={title} title={title} sales={sales} />
      ))}
    </div>
  );
}

function Section({ title, sales }: { title: string; sales: Sale[] }) {
  const uniqueClients = [...new Set(sales.map(s => s.clientCnpj))].length;

  return (
    <div className="bg-navy-800 rounded-xl border border-navy-600 overflow-hidden">
      <div className="px-5 py-3 border-b border-navy-600 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserX size={16} className="text-coral" />
          <h3 className="text-sm font-semibold text-white">{title}</h3>
        </div>
        <span className="text-xs text-gray-400">
          {uniqueClients} cliente{uniqueClients !== 1 ? 's' : ''}
          {' | '}
          {sales.length} vendas
        </span>
      </div>
      {sales.length === 0 ? (
        <p className="text-gray-500 text-sm p-5">Todos os clientes retornaram!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase">
                <th className="px-5 py-2">Cliente</th>
                <th className="px-5 py-2">Produto</th>
                <th className="px-5 py-2">Data</th>
                <th className="px-5 py-2">Empresa</th>
                <th className="px-5 py-2 text-right">Valor</th>
              </tr>
            </thead>
            <tbody>
              {sales.map(s => (
                <tr key={s.id} className="border-t border-navy-700 hover:bg-navy-700/50 transition-colors">
                  <td className="px-5 py-2.5 text-white">{s.clientName}</td>
                  <td className="px-5 py-2.5 text-gray-400">{s.productName}</td>
                  <td className="px-5 py-2.5 text-gray-400">{formatDate(s.date)}</td>
                  <td className="px-5 py-2.5 text-gray-400">{s.empresa}</td>
                  <td className="px-5 py-2.5 text-right text-coral">{formatCurrency(s.totalValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
