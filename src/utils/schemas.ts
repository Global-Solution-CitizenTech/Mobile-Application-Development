import { z } from 'zod';
import { CategoriaChamado, StatusChamado } from '../types';

const NonEmptyString = (errorMsg: string) =>
  z
    .string()
    .transform((v) => v.trim())
    .pipe(z.string().min(1, errorMsg));

const EmailPipeline = z
  .string()
  .transform((v) => v.trim().toLowerCase())
  .pipe(
    z
      .email('O formato do e-mail é inválido.')
      .min(1, 'Informe seu e-mail.')
      .max(80, 'O e-mail deve ter no máximo 80 caracteres.')
  );

export const CATEGORIAS_VALIDAS: [CategoriaChamado, ...CategoriaChamado[]] = [
  'Buraco na Rua',
  'Bueiro Entupido',
  'Iluminação Pública',
  'Entulho e Descarte Irregular',
  'Poda de Árvore',
  'Sinalização e Trânsito',
  'Vazamento de Água',
  'Outros',
];

export const STATUS_VALIDOS: [StatusChamado, ...StatusChamado[]] = [
  'Aberto',
  'Em Andamento',
  'Resolvido',
];

// 1. Schema de Login
export const LoginSchema = z.object({
  email: EmailPipeline,
  senha: z.string().min(4, 'A senha deve ter no mínimo 4 caracteres.'),
});

// 2. Schema de Cadastro de Cidadão
export const RegisterSchema = z
  .object({
    nome: NonEmptyString('Informe seu nome completo.').refine(
      (val) => val.split(/\s+/).length >= 2,
      { message: 'Informe nome e sobrenome.' }
    ),
    email: EmailPipeline,
    cpf: NonEmptyString('Informe seu CPF.').refine(
      (val) => val.replace(/\D/g, '').length >= 11,
      { message: 'O CPF deve conter 11 dígitos.' }
    ),
    telefone: NonEmptyString('Informe seu telefone de contato.').refine(
      (val) => val.replace(/\D/g, '').length >= 10,
      { message: 'Informe um telefone válido com DDD.' }
    ),
    bairro: NonEmptyString('Informe seu bairro de residência.'),
    senha: z.string().min(6, 'A senha deve conter no mínimo 6 caracteres.'),
    confirmSenha: z.string().min(1, 'Confirme sua senha.'),
  })
  .refine((data) => data.senha === data.confirmSenha, {
    message: 'As senhas informadas não coincidem.',
    path: ['confirmSenha'],
  });

// 3. Schema de Edição de Perfil
export const ProfileEditSchema = z
  .object({
    nome: NonEmptyString('Informe seu nome completo.'),
    email: EmailPipeline,
    telefone: NonEmptyString('Informe seu telefone de contato.'),
    bairro: NonEmptyString('Informe seu bairro.'),
    alterarSenha: z.boolean().default(false),
    novaSenha: z.string().optional(),
    confirmarNovaSenha: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.alterarSenha) {
      if (!data.novaSenha || data.novaSenha.length < 6) {
        ctx.addIssue({
          code: 'custom',
          path: ['novaSenha'],
          message: 'A nova senha deve ter no mínimo 6 caracteres.',
        });
      }
      if (data.novaSenha !== data.confirmarNovaSenha) {
        ctx.addIssue({
          code: 'custom',
          path: ['confirmarNovaSenha'],
          message: 'As senhas informadas não conferem.',
        });
      }
    }
  });

// 4. Schema de Criação / Edição de Chamado de Zeladoria
export const ChamadoFormSchema = z.object({
  titulo: NonEmptyString('Informe um título objetivo para a ocorrência.').pipe(
    z
      .string()
      .min(5, 'O título deve ter no mínimo 5 caracteres.')
      .max(100, 'O título deve ter no máximo 100 caracteres.')
  ),
  categoria: z.enum(CATEGORIAS_VALIDAS, {
    error: 'Selecione uma categoria válida.',
  }),
  descricao: NonEmptyString('Descreva a ocorrência com detalhes.').pipe(
    z
      .string()
      .min(10, 'Forneça ao menos 10 caracteres para ajudar a prefeitura.')
      .max(600, 'A descrição deve ter no máximo 600 caracteres.')
  ),
  logradouro: NonEmptyString('Informe a rua ou avenida.'),
  numero: NonEmptyString('Informe o número.'),
  bairro: NonEmptyString('Informe o bairro.'),
  cidade: z.string().optional(),
  cep: z.string().optional(),
  pontoReferencia: z.string().optional(),
  fotoUrl: z.string().optional(),
});

// 5. Schema de Atualização de Status
export const StatusUpdateSchema = z.object({
  status: z.enum(STATUS_VALIDOS),
  feedbackResolucao: z.string().optional(),
});

export function formatZodError(error: z.ZodError): string {
  if (!error.issues || error.issues.length === 0) {
    return 'Dados inválidos no formulário.';
  }
  return error.issues[0].message;
}

export function extractZodFieldErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === 'string' && !fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
}

export type LoginFormData = z.infer<typeof LoginSchema>;
export type RegisterFormData = z.infer<typeof RegisterSchema>;
export type ProfileEditFormData = z.infer<typeof ProfileEditSchema>;
export type ChamadoFormData = z.infer<typeof ChamadoFormSchema>;
