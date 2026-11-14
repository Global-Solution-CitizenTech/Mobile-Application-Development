import { z } from 'zod';
import { CATEGORIA_CATALOG } from '@/theme/semanticConfig';
import type { StatusChamado } from '@/types/categoria';
import type { FotoUpload } from '@/types/chamado';
import { onlyDigits, splitPhoneDigits } from '@/utils/formatters';

export type FormErrors<T> = Partial<Record<keyof T, string>>;

/**
 * Converte erros de validação do Zod em um mapa plano campo -> primeira mensagem
 * usando `z.flattenError` nativo do Zod v4.
 */
export function extractFieldErrors<T extends Record<string, unknown>>(error: z.ZodError<T>): FormErrors<T> {
  const { fieldErrors } = z.flattenError(error);
  const result: FormErrors<T> = {};

  for (const [key, messages] of Object.entries(fieldErrors)) {
    const first = messages?.[0];
    if (first) {
      result[key as keyof T] = first;
    }
  }

  return result;
}

export const StoredUsuarioSchema = z.object({
  id: z.number(),
  nome: z.string(),
  email: z.string(),
  cargo: z.enum(['CIDADAO', 'GESTOR', 'ADMIN']),
  ddd: z.string(),
  numeroTelefone: z.string(),
  endereco: z.object({
    id: z.number(),
    cep: z.string(),
    numero: z.string(),
    rua: z.string(),
    referencia: z.string(),
    bairro: z.string(),
    cidade: z.string(),
    estado: z.string(),
  }),
});

const VALID_CATEGORIA_IDS = new Set(CATEGORIA_CATALOG.map((c) => c.id));
const STATUS_CHAMADO_VALUES = ['PENDENTE', 'EM_ANALISE', 'EM_EXECUCAO', 'CONCLUIDO', 'REJEITADO'] as const satisfies readonly StatusChamado[];

const DDDS_VALIDOS = new Set([
  '11', '12', '13', '14', '15', '16', '17', '18', '19',
  '21', '22', '24', '27', '28',
  '31', '32', '33', '34', '35', '37', '38',
  '41', '42', '43', '44', '45', '46', '47', '48', '49',
  '51', '53', '54', '55',
  '61', '62', '63', '64', '65', '66', '67', '68', '69',
  '71', '73', '74', '75', '77', '79',
  '81', '82', '83', '84', '85', '86', '87', '88', '89',
  '91', '92', '93', '94', '95', '96', '97', '98', '99',
]);

const nomeField = z.string().trim().min(3, 'Informe seu nome completo').max(100, 'Máximo de 100 caracteres');
const emailField = z.string().trim().pipe(z.email('E-mail inválido')).pipe(z.string().max(100, 'Máximo de 100 caracteres'));
const senhaField = z.string().min(6, 'A senha deve ter no mínimo 6 caracteres').max(60, 'Máximo de 60 caracteres');

const telefoneField = z
  .string()
  .refine((val) => {
    const digits = onlyDigits(val);
    return digits.length === 10 || digits.length === 11;
  }, 'Informe o telefone com DDD (10 ou 11 dígitos)')
  .refine((val) => {
    const { ddd } = splitPhoneDigits(val);
    return DDDS_VALIDOS.has(ddd);
  }, 'DDD brasileiro inválido');

const enderecoFields = {
  cep: z.string().refine((val) => onlyDigits(val).length === 8, 'CEP deve conter 8 dígitos'),
  rua: z.string().trim().max(100, 'Máximo de 100 caracteres').optional(),
  numero: z.string().trim().min(1, 'Informe o número (ou S/N)').max(100, 'Máximo de 100 caracteres'),
  referencia: z.string().trim().min(1, 'Informe um ponto de referência').max(50, 'Máximo de 50 caracteres'),
};

export const LoginSchema = z.object({
  email: emailField,
  senha: z.string().min(1, 'Informe sua senha'),
});

export const RegisterSchema = z
  .object({
    nome: nomeField,
    email: emailField,
    telefone: telefoneField,
    ...enderecoFields,
    senha: senhaField,
    confirmarSenha: z.string().min(1, 'Confirme sua senha'),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: 'As senhas não coincidem',
    path: ['confirmarSenha'],
  });

export const ProfileEditSchema = z.object({
  nome: nomeField,
  email: emailField,
  telefone: telefoneField,
  ...enderecoFields,
  senha: senhaField,
});

export const ChamadoFormSchema = z.object({
  titulo: z.string().trim().min(5, 'Descreva o problema em pelo menos 5 caracteres').max(100, 'Máximo de 100 caracteres'),
  categoriaId: z
    .number()
    .int()
    .refine((id) => VALID_CATEGORIA_IDS.has(id), 'Selecione uma categoria'),
  descricao: z.string().trim().min(15, 'Detalhe a ocorrência (mínimo 15 caracteres)').max(1000, 'Máximo de 1000 caracteres'),
  ...enderecoFields,
});

export const ChamadoCreateSchema = z.object({
  ...enderecoFields,
  foto: z.custom<FotoUpload>(
    (val) =>
      Boolean(
        val &&
          typeof val === 'object' &&
          'uri' in val &&
          typeof val.uri === 'string' &&
          val.uri.trim().length > 0
      ),
    { message: 'Envie uma foto da ocorrência' }
  ),
});

export const StatusUpdateSchema = z.object({
  status: z.enum(STATUS_CHAMADO_VALUES),
  observacao: z.string().trim().min(1, 'Informe uma observação ou parecer').max(255, 'Máximo de 255 caracteres'),
});

export type LoginFormData = z.infer<typeof LoginSchema>;
export type RegisterFormData = z.infer<typeof RegisterSchema>;
export type ProfileEditFormData = z.infer<typeof ProfileEditSchema>;
export type ChamadoFormData = z.infer<typeof ChamadoFormSchema>;
export type ChamadoCreateFormData = z.infer<typeof ChamadoCreateSchema>;
export type StatusUpdateFormData = z.infer<typeof StatusUpdateSchema>;
