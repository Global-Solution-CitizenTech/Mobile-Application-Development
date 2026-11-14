import type { EnderecoResumo } from '@/types/endereco';

export function onlyDigits(value?: string | null): string {
  return (value ?? '').replace(/\D/g, '');
}

function parseApiDate(value?: string | null): Date | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  // Normaliza timestamps UTC retornados pelo SQLite (YYYY-MM-DD HH:MM:SS) para ISO UTC.
  const normalized = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(trimmed)
    ? `${trimmed.replace(' ', 'T')}Z`
    : trimmed;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(dateValue?: string | null): string {
  const date = parseApiDate(dateValue);
  if (!date) return '--';
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatShortDate(dateValue?: string | null): string {
  const date = parseApiDate(dateValue);
  if (!date) return '--';
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatMessageTime(dateValue?: string | null): string {
  const date = parseApiDate(dateValue);
  if (!date) return '--:--';
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export function formatCep(cep?: string | null): string {
  const digits = onlyDigits(cep);
  if (digits.length !== 8) return cep?.trim() || '--';
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export function maskCepInput(text: string): string {
  const digits = onlyDigits(text).slice(0, 8);
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
}

export function splitPhoneDigits(phone?: string | null): { ddd: string; numeroTelefone: string } {
  const digits = onlyDigits(phone).slice(0, 11);
  return {
    ddd: digits.slice(0, 2),
    numeroTelefone: digits.slice(2, 11),
  };
}

export function formatTelefone(ddd?: string | null, numero?: string | null): string {
  const d = onlyDigits(ddd).slice(0, 2);
  const n = onlyDigits(numero).slice(0, 9);
  if (!d && !n) return 'Não informado';
  if (n.length === 9) return `(${d}) ${n.slice(0, 5)}-${n.slice(5)}`;
  if (n.length === 8) return `(${d}) ${n.slice(0, 4)}-${n.slice(4)}`;
  return d ? `(${d}) ${n}` : n;
}

export function maskPhoneInput(text: string): string {
  const digits = onlyDigits(text).slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function getInitials(name?: string | null): string {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
  const first = parts[0];
  if (!first) return 'ZF';
  const last = parts[parts.length - 1] ?? first;
  if (parts.length === 1) return first.slice(0, 2).toUpperCase();
  return `${first[0] ?? ''}${last[0] ?? ''}`.toUpperCase();
}

export function getFirstName(name?: string | null): string {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
  return parts[0] || 'Cidadão';
}

export function getShortEndereco(endereco?: EnderecoResumo | null): string {
  if (!endereco) return 'Região não informada';
  if (endereco.bairro && endereco.cidade) return `${endereco.bairro}, ${endereco.cidade}`;
  if (endereco.bairro) return endereco.bairro;
  if (endereco.rua) return endereco.rua;
  if (endereco.referencia) return endereco.referencia;
  return 'Região não informada';
}
