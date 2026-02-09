import { FileText, DollarSign, Target, Ruler } from 'lucide-react';
import { StatCard } from './StatCard';
import { formatCurrency, formatNumber, formatPercent, formatArea } from '../../utils/formatters';
import type { DashboardStats } from '../../types';

interface StatCardGridProps {
  stats: DashboardStats;
}

export function StatCardGrid({ stats }: StatCardGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total de Contratos"
        value={String(stats.totalContracts)}
        subtitle={`${Object.entries(stats.contractsByYear).map(([y, c]) => `${y}: ${c}`).join(' | ')}`}
        icon={FileText}
        color="text-gold-400"
      />
      <StatCard
        title="Valor Total"
        value={formatCurrency(stats.totalValue)}
        subtitle={`Média: ${formatCurrency(stats.totalValue / (stats.totalContracts || 1))}`}
        icon={DollarSign}
        color="text-emerald"
      />
      <StatCard
        title="Vendas Diretas"
        value={`${stats.directSalesCount}`}
        subtitle={`${formatPercent(stats.directSalesPercent)} dos contratos`}
        icon={Target}
        color="text-teal"
      />
      <StatCard
        title="Área Total"
        value={formatArea(stats.totalArea)}
        subtitle={`R$/m² médio: ${formatNumber(stats.avgPricePerM2)}`}
        icon={Ruler}
        color="text-amber"
      />
    </div>
  );
}
