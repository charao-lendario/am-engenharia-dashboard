import { useMemo } from 'react';
import type { Invoice, DashboardStats } from '../types';
import { monthlyTrend } from '../utils/dataTransformers';

export function useDashboardStats(invoices: Invoice[]): DashboardStats {
  return useMemo(() => {
    const active = invoices.filter(i => !i.cancelled);
    const totalValue = active.reduce((s, i) => s + i.totalValue, 0);
    const totalISS = active.reduce((s, i) => s + i.valorISS, 0);

    const invoicesByYear: Record<number, number> = {};
    const valueByYear: Record<number, number> = {};
    for (const i of active) {
      invoicesByYear[i.year] = (invoicesByYear[i.year] ?? 0) + 1;
      valueByYear[i.year] = (valueByYear[i.year] ?? 0) + i.totalValue;
    }

    const empresaMap: Record<string, { count: number; value: number }> = {};
    for (const i of active) {
      if (!empresaMap[i.empresa]) empresaMap[i.empresa] = { count: 0, value: 0 };
      empresaMap[i.empresa].count += 1;
      empresaMap[i.empresa].value += i.totalValue;
    }
    const byEmpresa = Object.entries(empresaMap)
      .map(([empresa, data]) => ({ empresa, ...data }))
      .sort((a, b) => b.value - a.value);

    return {
      totalInvoices: active.length,
      totalValue,
      totalISS,
      cancelledCount: invoices.length - active.length,
      invoicesByYear,
      valueByYear,
      byEmpresa,
      monthlyTrend: monthlyTrend(active),
    };
  }, [invoices]);
}
