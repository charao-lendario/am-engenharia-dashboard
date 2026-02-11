export interface Sale {
  id: string;
  date: string;
  year: number;
  month: number;
  clientCnpj: string;
  clientName: string;
  productId: string;
  productName: string;
  productCategory: string;
  quantity: number;
  unitPrice: number;
  totalValue: number;
  empresa: string;
  cancelled: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  unitPrice: number;
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
  produtos: string[];
  includeCancelled: boolean;
}

export type FilterAction =
  | { type: 'TOGGLE_YEAR'; year: number }
  | { type: 'SET_YEARS'; years: number[] }
  | { type: 'TOGGLE_EMPRESA'; empresa: string }
  | { type: 'SET_EMPRESAS'; empresas: string[] }
  | { type: 'TOGGLE_CLIENTE'; cliente: string }
  | { type: 'SET_CLIENTES'; clientes: string[] }
  | { type: 'TOGGLE_PRODUTO'; produto: string }
  | { type: 'SET_PRODUTOS'; produtos: string[] }
  | { type: 'TOGGLE_CANCELLED' }
  | { type: 'RESET' };

export interface DashboardStats {
  totalSales: number;
  totalValue: number;
  totalQuantity: number;
  cancelledCount: number;
  salesByYear: Record<number, number>;
  valueByYear: Record<number, number>;
  byEmpresa: { empresa: string; count: number; value: number }[];
  byProduct: { productName: string; category: string; count: number; quantity: number; value: number }[];
  byCategory: { category: string; count: number; quantity: number; value: number }[];
  monthlyTrend: { month: number; year: number; count: number; value: number }[];
}

export interface ClientRanking {
  client: string;
  cnpj: string;
  salesCount: number;
  totalValue: number;
  avgValue: number;
}
