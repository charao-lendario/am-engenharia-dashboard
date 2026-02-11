# AM Engenharia Dashboard

## Regras

- Não peça permissão para ações rotineiras (criar, editar, mover arquivos, rodar comandos, instalar dependências). Apenas peça confirmação quando for **excluir algo** ou executar ações extremamente relevantes/destrutivas.
- Sempre execute as tarefas solicitadas diretamente.

## Stack

- React + TypeScript + Vite
- Tailwind CSS v4
- Recharts (gráficos)
- TanStack Table (tabelas)
- React Router DOM (rotas)
- date-fns (formatação de datas)
- Lucide React (ícones)

## Estrutura

- `src/data/invoices.json` - Dados de NFS-e das empresas A.M Segurança do Trabalho e A.M Engenharia
- `src/data/clients.json` - Lista de clientes cadastrados
- `src/components/views/` - Views do dashboard (OverviewView, ClientAnalysisView, etc.)
- `src/components/charts/` - Componentes de gráficos
- `src/components/layout/` - Layout (Sidebar, Header, DashboardLayout)
- `src/hooks/` - Custom hooks (useFilteredData, useDashboardStats)
- `src/utils/` - Utilitários (formatters, dataTransformers, colors)
- `src/context/FilterContext.tsx` - Contexto de filtros globais
