import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { FilterBar } from '../filters/FilterBar';

const ROUTES_WITH_FILTERS = ['/', '/clientes', '/ranking', '/empresas', '/notas'];

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const showFilters = ROUTES_WITH_FILTERS.includes(pathname);

  return (
    <div className="h-screen flex flex-col bg-navy-900">
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-y-auto">
          {showFilters && <FilterBar />}
          <div className="p-4 lg:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
