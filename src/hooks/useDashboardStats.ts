import { useMemo } from 'react';
import type { Sale, DashboardStats } from '../types';
import { monthlyTrend } from '../utils/dataTransformers';

export function useDashboardStats(sales: Sale[]): DashboardStats {
  return useMemo(() => {
    const active = sales.filter(s => !s.cancelled);
    const totalValue = active.reduce((s, i) => s + i.totalValue, 0);
    const totalQuantity = active.reduce((s, i) => s + i.quantity, 0);

    const salesByYear: Record<number, number> = {};
    const valueByYear: Record<number, number> = {};
    for (const s of active) {
      salesByYear[s.year] = (salesByYear[s.year] ?? 0) + 1;
      valueByYear[s.year] = (valueByYear[s.year] ?? 0) + s.totalValue;
    }

    const empresaMap: Record<string, { count: number; value: number }> = {};
    for (const s of active) {
      if (!empresaMap[s.empresa]) empresaMap[s.empresa] = { count: 0, value: 0 };
      empresaMap[s.empresa].count += 1;
      empresaMap[s.empresa].value += s.totalValue;
    }
    const byEmpresa = Object.entries(empresaMap)
      .map(([empresa, data]) => ({ empresa, ...data }))
      .sort((a, b) => b.value - a.value);

    const productMap: Record<string, { category: string; count: number; quantity: number; value: number }> = {};
    for (const s of active) {
      if (!productMap[s.productName]) {
        productMap[s.productName] = { category: s.productCategory, count: 0, quantity: 0, value: 0 };
      }
      productMap[s.productName].count += 1;
      productMap[s.productName].quantity += s.quantity;
      productMap[s.productName].value += s.totalValue;
    }
    const byProduct = Object.entries(productMap)
      .map(([productName, data]) => ({ productName, ...data }))
      .sort((a, b) => b.value - a.value);

    const categoryMap: Record<string, { count: number; quantity: number; value: number }> = {};
    for (const s of active) {
      if (!categoryMap[s.productCategory]) {
        categoryMap[s.productCategory] = { count: 0, quantity: 0, value: 0 };
      }
      categoryMap[s.productCategory].count += 1;
      categoryMap[s.productCategory].quantity += s.quantity;
      categoryMap[s.productCategory].value += s.totalValue;
    }
    const byCategory = Object.entries(categoryMap)
      .map(([category, data]) => ({ category, ...data }))
      .sort((a, b) => b.value - a.value);

    return {
      totalSales: active.length,
      totalValue,
      totalQuantity,
      cancelledCount: sales.length - active.length,
      salesByYear,
      valueByYear,
      byEmpresa,
      byProduct,
      byCategory,
      monthlyTrend: monthlyTrend(active),
    };
  }, [sales]);
}
