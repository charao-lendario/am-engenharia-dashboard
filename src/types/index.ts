export interface Contract {
  id: string;
  contractNumber: string;
  date: string;
  clientId: string;
  clientName: string;
  broker: string;
  totalValue: number;
  area: number;
  pricePerM2: number;
  unit: string;
  saleCategory: string;
  financingStatus: string;
  keyDelivery: string;
  empresa: string;
  empreendimento: string;
  cancelled: boolean;
  isDirect: boolean;
  year: number;
  month: number;
}

export interface FilterState {
  years: number[];
  empreendimentos: string[];
  brokers: string[];
  includeCancelled: boolean;
}

export type FilterAction =
  | { type: 'TOGGLE_YEAR'; year: number }
  | { type: 'SET_YEARS'; years: number[] }
  | { type: 'TOGGLE_EMPREENDIMENTO'; empreendimento: string }
  | { type: 'SET_EMPREENDIMENTOS'; empreendimentos: string[] }
  | { type: 'TOGGLE_BROKER'; broker: string }
  | { type: 'SET_BROKERS'; brokers: string[] }
  | { type: 'TOGGLE_CANCELLED' }
  | { type: 'RESET' };

export interface DashboardStats {
  totalContracts: number;
  totalValue: number;
  directSalesCount: number;
  directSalesValue: number;
  directSalesPercent: number;
  totalArea: number;
  avgPricePerM2: number;
  contractsByYear: Record<number, number>;
  valueByYear: Record<number, number>;
  monthlyTrend: { month: number; year: number; count: number; value: number }[];
}

export interface AgencyRanking {
  broker: string;
  contractCount: number;
  totalValue: number;
  avgValue: number;
}
