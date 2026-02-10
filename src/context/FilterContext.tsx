import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { FilterState, FilterAction } from '../types';

const initialState: FilterState = {
  years: [],
  empresas: [],
  clientes: [],
  includeCancelled: false,
};

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'TOGGLE_YEAR': {
      const years = state.years.includes(action.year)
        ? state.years.filter(y => y !== action.year)
        : [...state.years, action.year];
      return { ...state, years };
    }
    case 'SET_YEARS':
      return { ...state, years: action.years };
    case 'TOGGLE_EMPRESA': {
      const empresas = state.empresas.includes(action.empresa)
        ? state.empresas.filter(e => e !== action.empresa)
        : [...state.empresas, action.empresa];
      return { ...state, empresas };
    }
    case 'SET_EMPRESAS':
      return { ...state, empresas: action.empresas };
    case 'TOGGLE_CLIENTE': {
      const clientes = state.clientes.includes(action.cliente)
        ? state.clientes.filter(c => c !== action.cliente)
        : [...state.clientes, action.cliente];
      return { ...state, clientes };
    }
    case 'SET_CLIENTES':
      return { ...state, clientes: action.clientes };
    case 'TOGGLE_CANCELLED':
      return { ...state, includeCancelled: !state.includeCancelled };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const FilterContext = createContext<{
  state: FilterState;
  dispatch: React.Dispatch<FilterAction>;
} | null>(null);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(filterReducer, initialState);
  return (
    <FilterContext.Provider value={{ state, dispatch }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilterContext() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilterContext must be used within FilterProvider');
  return ctx;
}
