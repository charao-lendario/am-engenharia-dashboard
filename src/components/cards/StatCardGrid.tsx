import { FileText, DollarSign, Receipt, Building2, XCircle } from 'lucide-react';
import { StatCard } from './StatCard';
import { formatCurrency } from '../../utils/formatters';
import type { DashboardStats } from '../../types';

interface StatCardGridProps {
  stats: DashboardStats;
}

export function StatCardGrid({ stats }: StatCardGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatCard
        title="Total de NFS-e"
        value={String(stats.totalInvoices)}
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
        title="ISS Total"
        value={formatCurrency(stats.totalISS)}
        icon={Receipt}
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
        title="Canceladas"
        value={String(stats.cancelledCount)}
        icon={XCircle}
        color="text-coral"
      />
    </div>
  );
}
