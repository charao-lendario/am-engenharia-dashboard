import { useMemo } from 'react';
import { useFilteredData } from '../../hooks/useFilteredData';
import { groupByYear } from '../../utils/dataTransformers';
import { formatCurrency, formatDate } from '../../utils/formatters';
import type { Invoice } from '../../types';

export function ClientAnalysisView() {
  const { invoices, allYears } = useFilteredData();

  const byYear = useMemo(() => {
    const grouped = groupByYear(invoices);
    return allYears.map(year => ({
      year,
      invoices: grouped[year] ?? [],
    }));
  }, [invoices, allYears]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Clientes por Ano</h2>
      {byYear.map(({ year, invoices: yearInvoices }) => (
        <div key={year} className="bg-navy-800 rounded-xl border border-navy-600 overflow-hidden">
          <div className="px-5 py-3 border-b border-navy-600 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">{year}</h3>
            <span className="text-xs text-gray-400">
              {yearInvoices.length} NFS-e
              {' | '}
              {formatCurrency(yearInvoices.reduce((s, i) => s + i.totalValue, 0))}
            </span>
          </div>
          {yearInvoices.length === 0 ? (
            <p className="text-gray-500 text-sm p-5">Nenhuma NFS-e neste período</p>
          ) : (
            <div className="overflow-x-auto">
              <InvoiceTable invoices={yearInvoices} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function InvoiceTable({ invoices }: { invoices: Invoice[] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-xs text-gray-500 uppercase">
          <th className="px-5 py-2">Cliente</th>
          <th className="px-5 py-2">NFS-e</th>
          <th className="px-5 py-2">Data</th>
          <th className="px-5 py-2">Empresa</th>
          <th className="px-5 py-2 text-right">Valor</th>
        </tr>
      </thead>
      <tbody>
        {invoices.map(i => (
          <tr key={i.id} className="border-t border-navy-700 hover:bg-navy-700/50 transition-colors">
            <td className="px-5 py-2.5 text-white">{i.clientName}</td>
            <td className="px-5 py-2.5 text-gray-400">{i.nfsNumber}</td>
            <td className="px-5 py-2.5 text-gray-400">{formatDate(i.date)}</td>
            <td className="px-5 py-2.5 text-gray-400">{i.empresa}</td>
            <td className="px-5 py-2.5 text-right text-gold-400">{formatCurrency(i.totalValue)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
