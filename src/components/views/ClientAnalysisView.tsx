import { useMemo } from 'react';
import { useFilteredData } from '../../hooks/useFilteredData';
import { groupByYear } from '../../utils/dataTransformers';
import { formatCurrency, formatDate } from '../../utils/formatters';
import type { Sale } from '../../types';

export function ClientAnalysisView() {
  const { sales, allYears } = useFilteredData();

  const byYear = useMemo(() => {
    const grouped = groupByYear(sales);
    return allYears.map(year => ({
      year,
      sales: grouped[year] ?? [],
    }));
  }, [sales, allYears]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Clientes por Ano</h2>
      {byYear.map(({ year, sales: yearSales }) => (
        <div key={year} className="bg-navy-800 rounded-xl border border-navy-600 overflow-hidden">
          <div className="px-5 py-3 border-b border-navy-600 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">{year}</h3>
            <span className="text-xs text-gray-400">
              {yearSales.length} vendas
              {' | '}
              {formatCurrency(yearSales.reduce((s, i) => s + i.totalValue, 0))}
            </span>
          </div>
          {yearSales.length === 0 ? (
            <p className="text-gray-500 text-sm p-5">Nenhuma venda neste período</p>
          ) : (
            <div className="overflow-x-auto">
              <SalesTable sales={yearSales} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function SalesTable({ sales }: { sales: Sale[] }) {
  return (
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
            <td className="px-5 py-2.5 text-right text-gold-400">{formatCurrency(s.totalValue)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
