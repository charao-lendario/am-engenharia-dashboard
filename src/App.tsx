import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FilterProvider } from './context/FilterContext';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { OverviewView } from './components/views/OverviewView';
import { FaturamentoView } from './components/views/FaturamentoView';
import { ClientesView } from './components/views/ClientesView';
import { AtividadesView } from './components/views/AtividadesView';
import { EmpresasView } from './components/views/EmpresasView';
import { AllContractsView } from './components/views/AllContractsView';

export default function App() {
  return (
    <BrowserRouter>
      <FilterProvider>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<OverviewView />} />
            <Route path="/faturamento" element={<FaturamentoView />} />
            <Route path="/clientes" element={<ClientesView />} />
            <Route path="/atividades" element={<AtividadesView />} />
            <Route path="/empresas" element={<EmpresasView />} />
            <Route path="/notas" element={<AllContractsView />} />
          </Route>
        </Routes>
      </FilterProvider>
    </BrowserRouter>
  );
}
