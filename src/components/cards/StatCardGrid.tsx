import { FileText, DollarSign, Target, ShoppingCart, Building } from 'lucide-react';
import { StatCard } from './StatCard';
import { formatCurrency } from '../../utils/formatters';
import type { DashboardStats } from '../../types';

interface StatCardGridProps {
  stats: DashboardStats;
}

export function StatCardGrid({ stats }: StatCardGridProps) {
  const brokerSalesCount = stats.totalContracts - stats.directSalesCount;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatCard
        title="Total de Contratos"
        value={String(stats.totalContracts)}
        icon={FileText}
        color="text-gold-400"
      />
      <StatCard
        title="Valor Total"
        value={formatCurrency(stats.totalValue)}
        icon={DollarSign}
        color="text-emerald"
      />
      <StatCard
        title="Vendas Diretas"
        value={String(stats.directSalesCount)}
        icon={Target}
        color="text-teal"
      />
      <StatCard
        title="Total de Vendas"
        value={String(stats.totalContracts)}
        icon={ShoppingCart}
        color="text-amber"
      />
      <StatCard
        title="Vendas por Imobiliária"
        value={String(brokerSalesCount)}
        icon={Building}
        color="text-blue-400"
      />
    </div>
  );
}
