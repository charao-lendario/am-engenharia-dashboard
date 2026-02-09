import { useFilterContext } from '../../context/FilterContext';
import { useFilteredData } from '../../hooks/useFilteredData';
import { YearFilter } from './YearFilter';
import { MultiSelectFilter } from './MultiSelectFilter';
import { RotateCcw, EyeOff, Eye } from 'lucide-react';

export function FilterBar() {
  const { state, dispatch } = useFilterContext();
  const { allYears, allEmpreendimentos, allBrokers } = useFilteredData();

  const hasFilters = state.years.length > 0 ||
    state.empreendimentos.length > 0 ||
    state.brokers.length > 0 ||
    state.includeCancelled;

  return (
    <div className="bg-navy-800/50 border-b border-navy-600 px-4 lg:px-6 py-3">
      <div className="flex flex-wrap items-center gap-3">
        <YearFilter years={allYears} selected={state.years} />
        <MultiSelectFilter
          label="Empreendimento"
          options={allEmpreendimentos}
          selected={state.empreendimentos}
          onToggle={(v) => dispatch({ type: 'TOGGLE_EMPREENDIMENTO', empreendimento: v })}
          onClear={() => dispatch({ type: 'SET_EMPREENDIMENTOS', empreendimentos: [] })}
        />
        <MultiSelectFilter
          label="Imobiliária"
          options={allBrokers}
          selected={state.brokers}
          onToggle={(v) => dispatch({ type: 'TOGGLE_BROKER', broker: v })}
          onClear={() => dispatch({ type: 'SET_BROKERS', brokers: [] })}
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
          Cancelados
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
