import type { Sale, ClientRanking } from '../types';

export function groupByYear(sales: Sale[]): Record<number, Sale[]> {
  return sales.reduce((acc, s) => {
    (acc[s.year] ??= []).push(s);
    return acc;
  }, {} as Record<number, Sale[]>);
}

export function clientsByYear(sales: Sale[]): Record<number, Set<string>> {
  const byYear = groupByYear(sales);
  const result: Record<number, Set<string>> = {};
  for (const [year, items] of Object.entries(byYear)) {
    result[Number(year)] = new Set(items.map(s => s.clientCnpj));
  }
  return result;
}

export function clientsInANotB(sales: Sale[], yearA: number, yearB: number): Sale[] {
  const byYear = clientsByYear(sales);
  const clientsA = byYear[yearA] ?? new Set();
  const clientsB = byYear[yearB] ?? new Set();
  const notReturned = new Set([...clientsA].filter(cnpj => !clientsB.has(cnpj)));

  return sales.filter(s => s.year === yearA && notReturned.has(s.clientCnpj));
}

export function clientRanking(sales: Sale[]): ClientRanking[] {
  const active = sales.filter(s => !s.cancelled);
  const clientMap = new Map<string, { cnpj: string; count: number; value: number }>();

  for (const s of active) {
    const name = s.clientName || 'Desconhecido';
    const entry = clientMap.get(name) ?? { cnpj: s.clientCnpj, count: 0, value: 0 };
    entry.count++;
    entry.value += s.totalValue;
    clientMap.set(name, entry);
  }

  return Array.from(clientMap.entries())
    .map(([client, { cnpj, count, value }]) => ({
      client,
      cnpj,
      salesCount: count,
      totalValue: value,
      avgValue: value / count,
    }))
    .sort((a, b) => b.totalValue - a.totalValue);
}

export function empresaSummary(sales: Sale[]) {
  const active = sales.filter(s => !s.cancelled);
  const empresaMap = new Map<string, { count: number; value: number; sales: Sale[] }>();

  for (const s of active) {
    const entry = empresaMap.get(s.empresa) ?? { count: 0, value: 0, sales: [] };
    entry.count++;
    entry.value += s.totalValue;
    entry.sales.push(s);
    empresaMap.set(s.empresa, entry);
  }

  return Array.from(empresaMap.entries())
    .map(([empresa, data]) => ({ empresa, ...data }))
    .sort((a, b) => b.value - a.value);
}

export function monthlyTrend(sales: Sale[]) {
  const map = new Map<string, { month: number; year: number; count: number; value: number }>();

  for (const s of sales) {
    const key = `${s.year}-${String(s.month).padStart(2, '0')}`;
    const entry = map.get(key) ?? { month: s.month, year: s.year, count: 0, value: 0 };
    entry.count++;
    entry.value += s.totalValue;
    map.set(key, entry);
  }

  return Array.from(map.values()).sort((a, b) =>
    a.year !== b.year ? a.year - b.year : a.month - b.month
  );
}
