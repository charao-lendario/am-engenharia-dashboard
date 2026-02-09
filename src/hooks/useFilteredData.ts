import { useMemo } from 'react';
import { useFilterContext } from '../context/FilterContext';
import contractsData from '../data/contracts.json';
import type { Contract } from '../types';

const allContracts = contractsData as Contract[];

export function useFilteredData() {
  const { state } = useFilterContext();

  const filtered = useMemo(() => {
    let result = allContracts;

    if (!state.includeCancelled) {
      result = result.filter(c => !c.cancelled);
    }

    if (state.years.length > 0) {
      result = result.filter(c => state.years.includes(c.year));
    }

    if (state.empreendimentos.length > 0) {
      result = result.filter(c => state.empreendimentos.includes(c.empreendimento));
    }

    if (state.brokers.length > 0) {
      result = result.filter(c => state.brokers.includes(c.broker));
    }

    return result;
  }, [state]);

  const allYears = useMemo(() =>
    [...new Set(allContracts.map(c => c.year))].sort(),
    []
  );

  const allEmpreendimentos = useMemo(() =>
    [...new Set(allContracts.map(c => c.empreendimento))].sort(),
    []
  );

  const allBrokers = useMemo(() =>
    [...new Set(allContracts.filter(c => !c.isDirect && c.broker).map(c => c.broker))].sort(),
    []
  );

  return { contracts: filtered, allContracts, allYears, allEmpreendimentos, allBrokers };
}
