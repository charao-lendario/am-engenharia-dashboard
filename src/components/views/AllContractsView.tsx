import { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table';
import { useFilteredData } from '../../hooks/useFilteredData';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Invoice } from '../../types';

const col = createColumnHelper<Invoice>();

const columns = [
  col.accessor('nfsNumber', {
    header: 'NFS-e',
    cell: info => <span className="text-white font-medium">{info.getValue()}</span>,
  }),
  col.accessor('date', {
    header: 'Data',
    cell: info => formatDate(info.getValue()),
  }),
  col.accessor('clientName', {
    header: 'Cliente',
    cell: info => <span className="text-white">{info.getValue()}</span>,
  }),
  col.accessor('empresa', {
    header: 'Empresa',
  }),
  col.accessor('atividade', {
    header: 'Atividade',
  }),
  col.accessor('totalValue', {
    header: 'Valor NF',
    cell: info => <span className="text-gold-400">{formatCurrency(info.getValue())}</span>,
  }),
  col.accessor('valorISS', {
    header: 'ISS',
    cell: info => formatCurrency(info.getValue()),
  }),
  col.accessor('retido', {
    header: 'Retido',
    cell: info => info.getValue()
      ? <span className="text-teal text-xs font-medium">SIM</span>
      : <span className="text-gray-500 text-xs">NÃO</span>,
  }),
  col.accessor('year', {
    header: 'Ano',
  }),
  col.accessor('cancelled', {
    header: 'Status',
    cell: info => info.getValue()
      ? <span className="text-coral text-xs font-medium bg-coral/10 px-2 py-0.5 rounded">Cancelada</span>
      : <span className="text-emerald text-xs font-medium bg-emerald/10 px-2 py-0.5 rounded">Normal</span>,
  }),
];

export function AllContractsView() {
  const { invoices } = useFilteredData();
  const [sorting, setSorting] = useState<SortingState>([{ id: 'date', desc: true }]);

  const table = useReactTable({
    data: invoices,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 20 } },
  });

  const totalValue = useMemo(() => invoices.reduce((s, i) => s + i.totalValue, 0), [invoices]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Todas as NFS-e</h2>
        <div className="text-xs text-gray-400">
          {invoices.length} NFS-e | {formatCurrency(totalValue)}
        </div>
      </div>

      <div className="bg-navy-800 rounded-xl border border-navy-600 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              {table.getHeaderGroups().map(hg => (
                <tr key={hg.id} className="border-b border-navy-600">
                  {hg.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-xs text-gray-500 uppercase cursor-pointer hover:text-white transition-colors select-none"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        <ArrowUpDown size={12} className="opacity-50" />
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="border-t border-navy-700 hover:bg-navy-700/50 transition-colors">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-4 py-2.5 text-gray-400 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-navy-600">
          <span className="text-xs text-gray-500">
            Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-1.5 rounded bg-navy-700 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-1.5 rounded bg-navy-700 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
