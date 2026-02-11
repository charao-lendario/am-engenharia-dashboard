import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FilterProvider } from './context/FilterContext';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { OverviewView } from './components/views/OverviewView';
import { ClientAnalysisView } from './components/views/ClientAnalysisView';
import { ClientsNotReturningView } from './components/views/ClientsNotReturningView';
import { AgencyRankingView } from './components/views/AgencyRankingView';
import { DirectSalesView } from './components/views/DirectSalesView';
import { ProductsView } from './components/views/ProductsView';
import { ClientLifecycleView } from './components/views/ClientLifecycleView';

export default function App() {
  return (
    <BrowserRouter>
      <FilterProvider>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<OverviewView />} />
            <Route path="/clientes" element={<ClientAnalysisView />} />
            <Route path="/historico" element={<ClientLifecycleView />} />
            <Route path="/nao-retornaram" element={<ClientsNotReturningView />} />
            <Route path="/ranking" element={<AgencyRankingView />} />
            <Route path="/empresas" element={<DirectSalesView />} />
            <Route path="/produtos" element={<ProductsView />} />
          </Route>
        </Routes>
      </FilterProvider>
    </BrowserRouter>
  );
}
