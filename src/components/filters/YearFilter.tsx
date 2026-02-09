import { useFilterContext } from '../../context/FilterContext';

interface YearFilterProps {
  years: number[];
  selected: number[];
}

export function YearFilter({ years, selected }: YearFilterProps) {
  const { dispatch } = useFilterContext();
  const allSelected = selected.length === 0;

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-gray-500 mr-1">Ano:</span>
      <button
        onClick={() => dispatch({ type: 'SET_YEARS', years: [] })}
        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
          allSelected
            ? 'bg-gold-500 text-navy-900'
            : 'bg-navy-700 text-gray-400 hover:text-white'
        }`}
      >
        Todos
      </button>
      {years.map(year => {
        const isActive = selected.includes(year);
        return (
          <button
            key={year}
            onClick={() => dispatch({ type: 'TOGGLE_YEAR', year })}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              isActive
                ? 'bg-gold-500 text-navy-900'
                : 'bg-navy-700 text-gray-400 hover:text-white'
            }`}
          >
            {year}
          </button>
        );
      })}
    </div>
  );
}
