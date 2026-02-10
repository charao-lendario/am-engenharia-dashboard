export interface Invoice {
  id: string;
  nfsNumber: string;
  date: string;
  year: number;
  month: number;
  atividade: string;
  clientCnpj: string;
  clientName: string;
  totalValue: number;
  valorDeducao: number;
  valorBase: number;
  aliquota: number;
  valorISS: number;
  retido: boolean;
  status: string;
  localRecolhimento: string;
  empresa: string;
  cancelled: boolean;
}

export interface Client {
  razao: string;
  descricao: string;
  cnpj: string;
}

export interface FilterState {
  years: number[];
  empresas: string[];
  clientes: string[];
  includeCancelled: boolean;
}

export type FilterAction =
  | { type: 'TOGGLE_YEAR'; year: number }
  | { type: 'SET_YEARS'; years: number[] }
  | { type: 'TOGGLE_EMPRESA'; empresa: string }
  | { type: 'SET_EMPRESAS'; empresas: string[] }
  | { type: 'TOGGLE_CLIENTE'; cliente: string }
  | { type: 'SET_CLIENTES'; clientes: string[] }
  | { type: 'TOGGLE_CANCELLED' }
  | { type: 'RESET' };

export interface DashboardStats {
  totalInvoices: number;
  totalValue: number;
  totalISS: number;
  cancelledCount: number;
  invoicesByYear: Record<number, number>;
  valueByYear: Record<number, number>;
  byEmpresa: { empresa: string; count: number; value: number }[];
  monthlyTrend: { month: number; year: number; count: number; value: number }[];
}

export interface ClientRanking {
  client: string;
  cnpj: string;
  invoiceCount: number;
  totalValue: number;
  avgValue: number;
}
