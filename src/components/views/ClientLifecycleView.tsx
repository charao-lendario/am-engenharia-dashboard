import { useMemo, useState } from 'react';
import { useFilteredData } from '../../hooks/useFilteredData';
import { clientLifecycleTable, type ClientYearStatus } from '../../utils/dataTransformers';
import { formatCurrency } from '../../utils/formatters';
import { Search, ArrowUpDown } from 'lucide-react';

const STATUS_CONFIG: Record<
  Exclude<ClientYearStatus, null>,
  { label: string; short: string; bg: string; text: string; border: string }
> = {
  novo: {
    label: 'Novo',
    short: 'N',
    bg: 'bg-blue-500/20',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
  },
  ativo: {
    label: 'Ativo',
    short: 'A',
    bg: 'bg-emerald-500/20',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
  },
  reativado: {
    label: 'Reativado',
    short: 'R',
    bg: 'bg-gold-500/20',
    text: 'text-gold-400',
    border: 'border-gold-500/30',
  },
  inativo: {
    label: 'Inativo',
    short: 'I',
    bg: 'bg-coral/10',
    text: 'text-coral',
    border: 'border-coral/20',
  },
};

type SortField = 'name' | 'firstYear' | 'lastYear';

export function ClientLifecycleView() {
  const { allSales, allYears } = useFilteredData();
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ClientYearStatus | 'all'>('all');

  const rows = useMemo(
    () => clientLifecycleTable(allSales, allYears),
    [allSales, allYears],
  );

  const filtered = useMemo(() => {
    let result = rows;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        r => r.clientName.toLowerCase().includes(q) || r.clientCnpj.includes(q),
      );
    }

    if (statusFilter !== 'all') {
      const lastYear = allYears[allYears.length - 1];
      result = result.filter(r => r.statuses[lastYear] === statusFilter);
    }

    result = [...result].sort((a, b) => {
      let cmp = 0;
      if (sortField === 'name') cmp = a.clientName.localeCompare(b.clientName);
      else if (sortField === 'firstYear') cmp = a.firstYear - b.firstYear;
      else cmp = a.lastYear - b.lastYear;
      return sortAsc ? cmp : -cmp;
    });

    return result;
  }, [rows, search, sortField, sortAsc, statusFilter, allYears]);

  const summary = useMemo(() => {
    const lastYear = allYears[allYears.length - 1];
    const counts = { novo: 0, ativo: 0, reativado: 0, inativo: 0 };
    for (const r of rows) {
      const s = r.statuses[lastYear];
      if (s && s in counts) counts[s as keyof typeof counts]++;
    }
    return counts;
  }, [rows, allYears]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const lastYear = allYears[allYears.length - 1];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Histórico de Atividade</h2>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {(Object.keys(STATUS_CONFIG) as Array<Exclude<ClientYearStatus, null>>).map(key => {
          const cfg = STATUS_CONFIG[key];
          return (
            <button
              key={key}
              onClick={() => setStatusFilter(statusFilter === key ? 'all' : key)}
              className={`${cfg.bg} border ${cfg.border} rounded-xl p-4 text-left transition-all ${
                statusFilter === key ? 'ring-2 ring-white/30 scale-[1.02]' : 'hover:scale-[1.01]'
              }`}
            >
              <p className={`text-2xl font-bold ${cfg.text}`}>{summary[key]}</p>
              <p className="text-xs text-gray-400 mt-1">
                {cfg.label} em {lastYear}
              </p>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs">
        <span className="text-gray-500">Legenda:</span>
        {(Object.keys(STATUS_CONFIG) as Array<Exclude<ClientYearStatus, null>>).map(key => {
          const cfg = STATUS_CONFIG[key];
          return (
            <span key={key} className="flex items-center gap-1.5">
              <span className={`inline-flex items-center justify-center w-6 h-6 rounded ${cfg.bg} ${cfg.text} text-[10px] font-bold border ${cfg.border}`}>
                {cfg.short}
              </span>
              <span className="text-gray-400">{cfg.label}</span>
            </span>
          );
        })}
        <span className="flex items-center gap-1.5">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-navy-700 text-gray-600 text-[10px] font-bold border border-navy-600">
            -
          </span>
          <span className="text-gray-400">Sem histórico</span>
        </span>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Buscar cliente por nome ou CNPJ..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-navy-800 border border-navy-600 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold-500 transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-navy-800 rounded-xl border border-navy-600 overflow-hidden">
        <div className="px-5 py-3 border-b border-navy-600 flex items-center justify-between">
          <p className="text-sm text-gray-400">
            {filtered.length} de {rows.length} clientes
            {statusFilter !== 'all' && (
              <button
                onClick={() => setStatusFilter('all')}
                className="ml-2 text-gold-400 hover:underline"
              >
                Limpar filtro
              </button>
            )}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase">
                <th className="px-5 py-2 sticky left-0 bg-navy-800 z-10 min-w-[250px]">
                  <button onClick={() => toggleSort('name')} className="flex items-center gap-1 hover:text-white transition-colors">
                    Cliente
                    <ArrowUpDown size={12} />
                  </button>
                </th>
                {allYears.map(year => (
                  <th key={year} className="px-3 py-2 text-center min-w-[80px]">{year}</th>
                ))}
                <th className="px-5 py-2 text-right">
                  <button onClick={() => toggleSort('lastYear')} className="flex items-center gap-1 hover:text-white transition-colors ml-auto">
                    Última Compra
                    <ArrowUpDown size={12} />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => (
                <tr key={row.clientCnpj} className="border-t border-navy-700 hover:bg-navy-700/30 transition-colors">
                  <td className="px-5 py-2.5 sticky left-0 bg-navy-800 z-10">
                    <p className="text-white truncate max-w-[250px]" title={row.clientName}>{row.clientName}</p>
                    <p className="text-[10px] text-gray-600">{row.clientCnpj}</p>
                  </td>
                  {allYears.map(year => {
                    const status = row.statuses[year];
                    if (!status) {
                      return (
                        <td key={year} className="px-3 py-2.5 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded bg-navy-700/50 text-gray-600 text-[10px]">
                            -
                          </span>
                        </td>
                      );
                    }
                    const cfg = STATUS_CONFIG[status];
                    const value = row.totalValue[year];
                    const count = row.salesCount[year];
                    return (
                      <td key={year} className="px-3 py-2.5 text-center">
                        <div
                          className={`inline-flex flex-col items-center justify-center w-8 h-8 rounded ${cfg.bg} border ${cfg.border} cursor-default`}
                          title={`${cfg.label}${value ? ` | ${count} venda(s) | ${formatCurrency(value)}` : ''}`}
                        >
                          <span className={`text-[11px] font-bold ${cfg.text}`}>{cfg.short}</span>
                        </div>
                      </td>
                    );
                  })}
                  <td className="px-5 py-2.5 text-right text-gray-400 text-xs">{row.lastYear}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="text-gray-500 text-sm p-5 text-center">Nenhum cliente encontrado.</p>
        )}
      </div>
    </div>
  );
}
