import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserX,
  Trophy,
  Building2,
  Package,
  X,
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Visão Geral' },
  { to: '/clientes', icon: Users, label: 'Clientes por Ano' },
  { to: '/nao-retornaram', icon: UserX, label: 'Não Retornaram' },
  { to: '/ranking', icon: Trophy, label: 'Ranking de Clientes' },
  { to: '/empresas', icon: Building2, label: 'Por Empresa' },
  { to: '/produtos', icon: Package, label: 'Produtos' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-navy-800 border-r border-navy-600
          transform transition-transform duration-200
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        <div className="flex items-center justify-between p-4 lg:hidden">
          <span className="text-gold-500 font-bold">Menu</span>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gold-500/15 text-gold-400'
                    : 'text-gray-400 hover:text-white hover:bg-navy-700'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
