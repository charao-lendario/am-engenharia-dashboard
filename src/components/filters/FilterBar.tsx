import { useFilterContext } from '../../context/FilterContext';
import { useFilteredData } from '../../hooks/useFilteredData';
import { YearFilter } from './YearFilter';
import { MultiSelectFilter } from './MultiSelectFilter';
import { RotateCcw, EyeOff, Eye } from 'lucide-react';

export function FilterBar() {
  const { state, dispatch } = useFilterContext();
  const { allYears, allEmpresas, allClientes, allProdutos } = useFilteredData();

  const hasFilters = state.years.length > 0 ||
    state.empresas.length > 0 ||
    state.clientes.length > 0 ||
    state.produtos.length > 0 ||
    state.includeCancelled;

  return (
    <div className="bg-navy-800/50 border-b border-navy-600 px-4 lg:px-6 py-3">
      <div className="flex flex-wrap items-center gap-3">
        <YearFilter years={allYears} selected={state.years} />
        <MultiSelectFilter
          label="Empresa"
          options={allEmpresas}
          selected={state.empresas}
          onToggle={(v) => dispatch({ type: 'TOGGLE_EMPRESA', empresa: v })}
          onClear={() => dispatch({ type: 'SET_EMPRESAS', empresas: [] })}
        />
        <MultiSelectFilter
          label="Cliente"
          options={allClientes}
          selected={state.clientes}
          onToggle={(v) => dispatch({ type: 'TOGGLE_CLIENTE', cliente: v })}
          onClear={() => dispatch({ type: 'SET_CLIENTES', clientes: [] })}
        />
        <MultiSelectFilter
          label="Produto"
          options={allProdutos}
          selected={state.produtos}
          onToggle={(v) => dispatch({ type: 'TOGGLE_PRODUTO', produto: v })}
          onClear={() => dispatch({ type: 'SET_PRODUTOS', produtos: [] })}
        />
        <button
          onClick={() => dispatch({ type: 'TOGGLE_CANCELLED' })}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            state.includeCancelled
              ? 'bg-coral/20 text-coral'
              : 'bg-navy-700 text-gray-400 hover:text-white'
          }`}
        >
          {state.includeCancelled ? <Eye size={14} /> : <EyeOff size={14} />}
          Canceladas
        </button>
        {hasFilters && (
          <button
            onClick={() => dispatch({ type: 'RESET' })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-navy-700 text-gray-400 hover:text-white transition-colors"
          >
            <RotateCcw size={14} />
            Limpar
          </button>
        )}
      </div>
    </div>
  );
}
