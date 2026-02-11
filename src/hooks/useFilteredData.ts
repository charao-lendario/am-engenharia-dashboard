import { useMemo } from 'react';
import { useFilterContext } from '../context/FilterContext';
import salesData from '../data/sales.json';
import type { Sale } from '../types';

const allSales = salesData as Sale[];

export function useFilteredData() {
  const { state } = useFilterContext();

  const filtered = useMemo(() => {
    let result = allSales;

    if (!state.includeCancelled) {
      result = result.filter(s => !s.cancelled);
    }

    if (state.years.length > 0) {
      result = result.filter(s => state.years.includes(s.year));
    }

    if (state.empresas.length > 0) {
      result = result.filter(s => state.empresas.includes(s.empresa));
    }

    if (state.clientes.length > 0) {
      result = result.filter(s => state.clientes.includes(s.clientName));
    }

    if (state.produtos.length > 0) {
      result = result.filter(s => state.produtos.includes(s.productName));
    }

    return result;
  }, [state]);

  const allYears = useMemo(() =>
    [...new Set(allSales.map(s => s.year))].sort(),
    []
  );

  const allEmpresas = useMemo(() =>
    [...new Set(allSales.map(s => s.empresa))].sort(),
    []
  );

  const allClientes = useMemo(() =>
    [...new Set(allSales.map(s => s.clientName))].sort(),
    []
  );

  const allProdutos = useMemo(() =>
    [...new Set(allSales.map(s => s.productName))].sort(),
    []
  );

  return { sales: filtered, allSales, allYears, allEmpresas, allClientes, allProdutos };
}
