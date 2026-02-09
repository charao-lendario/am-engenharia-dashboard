import type { Contract, AgencyRanking } from '../types';

export function groupByYear(contracts: Contract[]): Record<number, Contract[]> {
  return contracts.reduce((acc, c) => {
    (acc[c.year] ??= []).push(c);
    return acc;
  }, {} as Record<number, Contract[]>);
}

export function clientsByYear(contracts: Contract[]): Record<number, Set<string>> {
  const byYear = groupByYear(contracts);
  const result: Record<number, Set<string>> = {};
  for (const [year, cs] of Object.entries(byYear)) {
    result[Number(year)] = new Set(cs.map(c => c.clientId));
  }
  return result;
}

export function clientsInANotB(contracts: Contract[], yearA: number, yearB: number): Contract[] {
  const byYear = clientsByYear(contracts);
  const clientsA = byYear[yearA] ?? new Set();
  const clientsB = byYear[yearB] ?? new Set();
  const notReturned = new Set([...clientsA].filter(id => !clientsB.has(id)));

  // Return the contracts from yearA for clients that didn't return in yearB
  return contracts.filter(c => c.year === yearA && notReturned.has(c.clientId));
}

function shortenBrokerName(name: string): string {
  if (!name) return 'Direta';
  // Take only the first word/name
  const first = name.split(/[\s-]/)[0];
  // Capitalize first letter
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
}

export function agencyRanking(contracts: Contract[]): AgencyRanking[] {
  const active = contracts.filter(c => !c.cancelled);
  const brokerMap = new Map<string, { count: number; value: number }>();

  for (const c of active) {
    const name = c.isDirect || !c.broker ? 'Direta' : shortenBrokerName(c.broker);
    const entry = brokerMap.get(name) ?? { count: 0, value: 0 };
    entry.count++;
    entry.value += c.totalValue;
    brokerMap.set(name, entry);
  }

  return Array.from(brokerMap.entries())
    .map(([broker, { count, value }]) => ({
      broker,
      contractCount: count,
      totalValue: value,
      avgValue: value / count,
    }))
    .sort((a, b) => b.totalValue - a.totalValue);
}

export function directSalesSummary(contracts: Contract[]) {
  const active = contracts.filter(c => !c.cancelled);
  const direct = active.filter(c => c.isDirect);
  const totalValue = active.reduce((s, c) => s + c.totalValue, 0);
  const directValue = direct.reduce((s, c) => s + c.totalValue, 0);

  return {
    count: direct.length,
    total: active.length,
    value: directValue,
    totalValue,
    percent: totalValue > 0 ? (directValue / totalValue) * 100 : 0,
    percentCount: active.length > 0 ? (direct.length / active.length) * 100 : 0,
    contracts: direct,
  };
}

export function monthlyTrend(contracts: Contract[]) {
  const map = new Map<string, { month: number; year: number; count: number; value: number }>();

  for (const c of contracts) {
    const key = `${c.year}-${String(c.month).padStart(2, '0')}`;
    const entry = map.get(key) ?? { month: c.month, year: c.year, count: 0, value: 0 };
    entry.count++;
    entry.value += c.totalValue;
    map.set(key, entry);
  }

  return Array.from(map.values()).sort((a, b) =>
    a.year !== b.year ? a.year - b.year : a.month - b.month
  );
}

export function uniqueValues<T>(contracts: Contract[], key: keyof Contract): T[] {
  return [...new Set(contracts.map(c => c[key]))] as T[];
}
