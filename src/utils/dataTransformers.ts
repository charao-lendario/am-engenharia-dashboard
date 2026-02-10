import type { Invoice, ClientRanking } from '../types';

export function groupByYear(invoices: Invoice[]): Record<number, Invoice[]> {
  return invoices.reduce((acc, i) => {
    (acc[i.year] ??= []).push(i);
    return acc;
  }, {} as Record<number, Invoice[]>);
}

export function clientsByYear(invoices: Invoice[]): Record<number, Set<string>> {
  const byYear = groupByYear(invoices);
  const result: Record<number, Set<string>> = {};
  for (const [year, invs] of Object.entries(byYear)) {
    result[Number(year)] = new Set(invs.map(i => i.clientCnpj));
  }
  return result;
}

export function clientsInANotB(invoices: Invoice[], yearA: number, yearB: number): Invoice[] {
  const byYear = clientsByYear(invoices);
  const clientsA = byYear[yearA] ?? new Set();
  const clientsB = byYear[yearB] ?? new Set();
  const notReturned = new Set([...clientsA].filter(cnpj => !clientsB.has(cnpj)));

  return invoices.filter(i => i.year === yearA && notReturned.has(i.clientCnpj));
}

export function clientRanking(invoices: Invoice[]): ClientRanking[] {
  const active = invoices.filter(i => !i.cancelled);
  const clientMap = new Map<string, { cnpj: string; count: number; value: number }>();

  for (const i of active) {
    const name = i.clientName || 'Desconhecido';
    const entry = clientMap.get(name) ?? { cnpj: i.clientCnpj, count: 0, value: 0 };
    entry.count++;
    entry.value += i.totalValue;
    clientMap.set(name, entry);
  }

  return Array.from(clientMap.entries())
    .map(([client, { cnpj, count, value }]) => ({
      client,
      cnpj,
      invoiceCount: count,
      totalValue: value,
      avgValue: value / count,
    }))
    .sort((a, b) => b.totalValue - a.totalValue);
}

export function empresaSummary(invoices: Invoice[]) {
  const active = invoices.filter(i => !i.cancelled);
  const empresaMap = new Map<string, { count: number; value: number; iss: number; invoices: Invoice[] }>();

  for (const i of active) {
    const entry = empresaMap.get(i.empresa) ?? { count: 0, value: 0, iss: 0, invoices: [] };
    entry.count++;
    entry.value += i.totalValue;
    entry.iss += i.valorISS;
    entry.invoices.push(i);
    empresaMap.set(i.empresa, entry);
  }

  return Array.from(empresaMap.entries())
    .map(([empresa, data]) => ({ empresa, ...data }))
    .sort((a, b) => b.value - a.value);
}

export function monthlyTrend(invoices: Invoice[]) {
  const map = new Map<string, { month: number; year: number; count: number; value: number }>();

  for (const i of invoices) {
    const key = `${i.year}-${String(i.month).padStart(2, '0')}`;
    const entry = map.get(key) ?? { month: i.month, year: i.year, count: 0, value: 0 };
    entry.count++;
    entry.value += i.totalValue;
    map.set(key, entry);
  }

  return Array.from(map.values()).sort((a, b) =>
    a.year !== b.year ? a.year - b.year : a.month - b.month
  );
}

export function uniqueValues<T>(invoices: Invoice[], key: keyof Invoice): T[] {
  return [...new Set(invoices.map(i => i[key]))] as T[];
}
