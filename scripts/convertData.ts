import XLSX from 'xlsx';
import { fileURLToPath } from 'url';
import * as path from 'path';
import * as fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Encoding fix for clientes.xlsx (broken UTF-8 chars) ──
function fixEncoding(str: string): string {
  if (!str) return str;
  const map: Record<string, string> = {
    '√á': 'Ç', '√ß': 'ç', '√â': 'É', '√™': 'ê',
    '√©': 'é', '√£': 'ã', '√°': 'á', '√≠': 'í',
    '√≥': 'ó', '√É': 'Ã', '√Å': 'Á', '√ì': 'Ó',
    '√ç': 'Í', '√º': 'ú', '√ü': 'ü', '√î': 'Ô',
    '√ö': 'Ú', '√ê': 'è', '√ë': 'ë', '√ï': 'ï',
    '√µ': 'õ',
  };
  let result = str;
  for (const [broken, fixed] of Object.entries(map)) {
    result = result.replaceAll(broken, fixed);
  }
  return result;
}

// ── Parse NFS-e file ──
interface RawInvoice {
  nfsNumber: string;
  date: string;
  year: number;
  month: number;
  atividade: string;
  clientCnpj: string;
  clientName: string;
  totalValue: number;
  valorDeducao: number;
  valorBase: number;
  aliquota: number;
  valorISS: number;
  retido: boolean;
  status: string;
  localRecolhimento: string;
  empresa: string;
  cancelled: boolean;
}

function parseDate(dateStr: string): { date: string; year: number; month: number } {
  if (!dateStr) return { date: '', year: 0, month: 0 };
  const parts = dateStr.split('/');
  if (parts.length !== 3) return { date: dateStr, year: 0, month: 0 };
  const [day, month, year] = parts.map(Number);
  return {
    date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    year,
    month,
  };
}

function parseNfseFile(filePath: string, empresa: string): RawInvoice[] {
  const buf = fs.readFileSync(filePath);
  const workbook = XLSX.read(buf);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

  const invoices: RawInvoice[] = [];

  // Data starts at row 19 (0-indexed), header is at row 18
  for (let i = 19; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length === 0) continue;

    const firstCell = String(row[0] || '').trim();

    // Skip summary rows at the end
    if (firstCell.startsWith('Quantidade') || firstCell.startsWith('Total')) continue;
    // Skip if not a number (NFS-e number)
    if (isNaN(Number(firstCell))) continue;

    const dateStr = String(row[3] || '');
    const { date, year, month } = parseDate(dateStr);
    if (year < 2020) continue;

    const status = String(row[15] || 'NORMAL').trim();

    invoices.push({
      nfsNumber: firstCell,
      date,
      year,
      month,
      atividade: String(row[4] || '').trim(),
      clientCnpj: String(row[7] || '').trim(),
      clientName: String(row[8] || '').trim(),
      totalValue: Number(row[9]) || 0,
      valorDeducao: Number(row[10]) || 0,
      valorBase: Number(row[11]) || 0,
      aliquota: Number(row[12]) || 0,
      valorISS: Number(row[13]) || 0,
      retido: String(row[14] || '').trim().toUpperCase() === 'SIM',
      status,
      localRecolhimento: String(row[16] || '').trim(),
      empresa,
      cancelled: status !== 'NORMAL',
    });
  }

  return invoices;
}

// ── Parse Clientes file ──
interface RawClient {
  razao: string;
  descricao: string;
  cnpj: string;
}

function parseClientes(filePath: string): RawClient[] {
  const buf = fs.readFileSync(filePath);
  const workbook = XLSX.read(buf);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

  const clients: RawClient[] = [];

  // Row 0 is header, data starts at row 1
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row || !row[0]) continue;

    clients.push({
      razao: fixEncoding(String(row[0]).trim()),
      descricao: fixEncoding(String(row[1] || '').trim()),
      cnpj: String(row[2] || '').trim(),
    });
  }

  return clients;
}

// ── Main ──
const downloadsDir = path.resolve(__dirname, '../../Downloads');

const nfse1 = parseNfseFile(
  path.join(downloadsDir, '43487379000119 NFS-E EMITIDAS - 16_12_2025.xls'),
  'A.M Segurança do Trabalho'
);
const nfse2 = parseNfseFile(
  path.join(downloadsDir, '55603277000109 NFS-E EMITIDAS - 16_12_2025.xls'),
  'A.M Engenharia Inspeções'
);

// Merge and assign IDs
const allInvoices = [...nfse1, ...nfse2].map((inv, i) => ({
  id: String(i + 1),
  ...inv,
}));

const clients = parseClientes(path.join(downloadsDir, 'clientes.xlsx'));

// Write outputs
const outputDir = path.resolve(__dirname, '../src/data');
fs.mkdirSync(outputDir, { recursive: true });

fs.writeFileSync(
  path.join(outputDir, 'invoices.json'),
  JSON.stringify(allInvoices, null, 2)
);
fs.writeFileSync(
  path.join(outputDir, 'clients.json'),
  JSON.stringify(clients, null, 2)
);

// Stats
console.log(`NFS-e Segurança: ${nfse1.length} notas`);
console.log(`NFS-e Inspeções: ${nfse2.length} notas`);
console.log(`Total invoices: ${allInvoices.length}`);
console.log(`Clientes: ${clients.length}`);
console.log(`Anos: ${[...new Set(allInvoices.map(i => i.year))].sort().join(', ')}`);
console.log(`Canceladas: ${allInvoices.filter(i => i.cancelled).length}`);
console.log(`Empresas: ${[...new Set(allInvoices.map(i => i.empresa))].join(', ')}`);
console.log(`Atividades: ${[...new Set(allInvoices.map(i => i.atividade))].join(', ')}`);
