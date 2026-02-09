import XLSX from 'xlsx';
import { fileURLToPath } from 'url';
import * as path from 'path';
import * as fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.resolve(__dirname, '../../Vendas_Consolidado_Corrigido.xlsx');
const buf = fs.readFileSync(filePath);
const workbook = XLSX.read(buf);

const sheet = workbook.Sheets['Vendas por Empreendimento'];
const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

interface RawContract {
  id: string;
  contractNumber: string;
  date: string;
  clientId: string;
  clientName: string;
  broker: string;
  totalValue: number;
  area: number;
  pricePerM2: number;
  unit: string;
  saleCategory: string;
  financingStatus: string;
  keyDelivery: string;
  empresa: string;
  empreendimento: string;
  cancelled: boolean;
  isDirect: boolean;
  year: number;
  month: number;
}

const HEADERS = [
  'N. do contrato', 'Data do contrato', 'Cliente', 'Corretor',
  'Valor Geral de Venda', 'Área (m2)', 'R$ / m2', 'Unidades',
  'Categoria de venda', 'Status financiamento', 'Entrega de chaves',
  'Contrato com a I.F.', 'Data com a I.F.', 'Registro imóvel'
];

let currentEmpresa = '';
let currentEmpreendimento = '';
const contracts: RawContract[] = [];
let contractId = 1;

function parseDate(dateStr: string): { date: string; year: number; month: number } {
  if (!dateStr) return { date: '', year: 0, month: 0 };
  // Format: DD/MM/YYYY
  const parts = dateStr.split('/');
  if (parts.length !== 3) return { date: dateStr, year: 0, month: 0 };
  const [day, month, year] = parts.map(Number);
  return {
    date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    year,
    month,
  };
}

function extractClientId(clientStr: string): string {
  const match = clientStr.match(/^(\d+)\s*-/);
  return match ? match[1] : clientStr;
}

function extractClientName(clientStr: string): string {
  const match = clientStr.match(/^\d+\s*-\s*(.+)/);
  return match ? match[1].trim() : clientStr;
}

function extractBrokerName(brokerStr: string): string {
  if (!brokerStr) return '';
  const match = brokerStr.match(/^\d+\s*-\s*(.+)/);
  return match ? match[1].trim() : brokerStr.trim();
}

function cleanEmpreendimento(raw: string): string {
  // "Empreendimento 7 - Gran Tower - Custo indireto/receitas" -> "Gran Tower"
  const match = raw.match(/Empreendimento\s+\d+\s*-\s*(.+?)(\s*-\s*Custo.*)?$/);
  return match ? match[1].trim() : raw;
}

function cleanEmpresa(raw: string): string {
  // "Empresa 1 - Grandezza Construtora e Incorporadora Ltda" -> "Grandezza Construtora"
  const match = raw.match(/Empresa\s+\d+\s*-\s*(.+)/);
  if (!match) return raw;
  let name = match[1].trim();
  // Shorten common suffixes
  name = name.replace(/\s+(SPE\s+)?LTDA\.?$/i, '').trim();
  return name;
}

for (let i = 0; i < data.length; i++) {
  const row = data[i];
  if (!row || row.length === 0) continue;

  const firstCell = String(row[0] || '').trim();

  // Detect Empresa
  if (firstCell.startsWith('Empresa ')) {
    currentEmpresa = cleanEmpresa(firstCell);
    continue;
  }

  // Detect Empreendimento
  if (firstCell.startsWith('Empreendimento ')) {
    currentEmpreendimento = cleanEmpreendimento(firstCell);
    continue;
  }

  // Skip header rows, total rows, etc.
  if (firstCell === 'N. do contrato' || firstCell.startsWith('Total') ||
      firstCell === 'Contratos' || firstCell === 'Propostas' ||
      firstCell === 'Distratos' || firstCell === 'Saldo' ||
      firstCell.startsWith('Área total') || firstCell.startsWith('Valor médio') ||
      firstCell.startsWith('Estoque') || firstCell.startsWith('**Estoque') ||
      firstCell.startsWith('Período') || firstCell.startsWith('Vendas por') ||
      firstCell === 'Consolidado' || firstCell.startsWith('Total Geral') ||
      firstCell.startsWith('Indexador')) {
    continue;
  }

  // Check if this is a data row (must have at least a date and client)
  if (row.length >= 5 && row[1] && row[2] && row[4]) {
    const dateStr = String(row[1]);
    const { date, year, month } = parseDate(dateStr);
    if (year < 2020) continue; // Skip invalid dates

    const clientStr = String(row[2]);
    const brokerStr = String(row[3] || '');
    const unitStr = String(row[7] || '');
    const cancelled = unitStr.includes('CANCELADO');
    const isDirect = brokerStr.toLowerCase().trim() === 'direta' || brokerStr.trim() === '';

    contracts.push({
      id: String(contractId++),
      contractNumber: firstCell,
      date,
      clientId: extractClientId(clientStr),
      clientName: extractClientName(clientStr),
      broker: extractBrokerName(brokerStr),
      totalValue: Number(row[4]) || 0,
      area: Number(row[5]) || 0,
      pricePerM2: Number(row[6]) || 0,
      unit: unitStr.replace('## CANCELADO ##', '').trim(),
      saleCategory: String(row[8] || ''),
      financingStatus: String(row[9] || ''),
      keyDelivery: String(row[10] || ''),
      empresa: currentEmpresa,
      empreendimento: currentEmpreendimento,
      cancelled,
      isDirect,
      year,
      month,
    });
  }
}

// Write output
const outputPath = path.resolve(__dirname, '../src/data/contracts.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(contracts, null, 2));

console.log(`Extracted ${contracts.length} contracts`);
console.log(`Empresas: ${[...new Set(contracts.map(c => c.empresa))].join(', ')}`);
console.log(`Empreendimentos: ${[...new Set(contracts.map(c => c.empreendimento))].join(', ')}`);
console.log(`Years: ${[...new Set(contracts.map(c => c.year))].sort().join(', ')}`);
console.log(`Cancelled: ${contracts.filter(c => c.cancelled).length}`);
console.log(`Direct sales: ${contracts.filter(c => c.isDirect).length}`);
console.log(`Brokers: ${[...new Set(contracts.map(c => c.broker))].join(', ')}`);
