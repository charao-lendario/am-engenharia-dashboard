import { useMemo } from 'react';
import { useFilterContext } from '../context/FilterContext';
import invoicesData from '../data/invoices.json';
import type { Invoice } from '../types';

const allInvoices = invoicesData as Invoice[];

export function useFilteredData() {
  const { state } = useFilterContext();

  const filtered = useMemo(() => {
    let result = allInvoices;

    if (!state.includeCancelled) {
      result = result.filter(i => !i.cancelled);
    }

    if (state.years.length > 0) {
      result = result.filter(i => state.years.includes(i.year));
    }

    if (state.empresas.length > 0) {
      result = result.filter(i => state.empresas.includes(i.empresa));
    }

    if (state.clientes.length > 0) {
      result = result.filter(i => state.clientes.includes(i.clientName));
    }

    return result;
  }, [state]);

  const allYears = useMemo(() =>
    [...new Set(allInvoices.map(i => i.year))].sort(),
    []
  );

  const allEmpresas = useMemo(() =>
    [...new Set(allInvoices.map(i => i.empresa))].sort(),
    []
  );

  const allClientes = useMemo(() =>
    [...new Set(allInvoices.map(i => i.clientName))].sort(),
    []
  );

  return { invoices: filtered, allInvoices, allYears, allEmpresas, allClientes };
}
