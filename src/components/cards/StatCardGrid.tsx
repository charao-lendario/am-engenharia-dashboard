import { ShoppingCart, DollarSign, Package, Building2, TrendingUp } from 'lucide-react';
import { StatCard } from './StatCard';
import { formatCurrency } from '../../utils/formatters';
import type { DashboardStats } from '../../types';

interface StatCardGridProps {
  stats: DashboardStats;
}

export function StatCardGrid({ stats }: StatCardGridProps) {
  const topProduct = stats.byProduct[0];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatCard
        title="Total de Vendas"
        value={String(stats.totalSales)}
        icon={ShoppingCart}
        color="text-gold-400"
      />
      <StatCard
        title="Faturamento"
        value={formatCurrency(stats.totalValue)}
        icon={DollarSign}
        color="text-emerald"
      />
      <StatCard
        title="Produtos Vendidos"
        value={String(stats.byProduct.length)}
        subtitle={`${stats.totalQuantity} unidades`}
        icon={Package}
        color="text-teal"
      />
      <StatCard
        title="Empresas"
        value={String(stats.byEmpresa.length)}
        subtitle={stats.byEmpresa.map(e => `${e.empresa}: ${e.count}`).join(' | ')}
        icon={Building2}
        color="text-amber"
      />
      <StatCard
        title="Mais Vendido"
        value={topProduct ? String(topProduct.count) : '0'}
        subtitle={topProduct?.productName ?? '-'}
        icon={TrendingUp}
        color="text-coral"
      />
    </div>
  );
}
