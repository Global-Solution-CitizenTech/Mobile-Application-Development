import type { z } from 'zod';
import type {
  ChamadoCreateSchema,
  ChamadoFormSchema,
  LoginSchema,
  ProfileEditSchema,
  RegisterSchema,
  StatusUpdateSchema,
} from '@/utils/schemas';

export type FormErrors<T> = Partial<Record<keyof T, string>>;

export type StringFieldKeys<T> = {
  [K in keyof T]-?: T[K] extends string | undefined ? K : never;
}[keyof T];

export interface BoundFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  editable: boolean;
}

export type FieldBinder<T> = <K extends StringFieldKeys<T>>(name: K) => BoundFieldProps;

export interface UseZodFormOptions {
  /** Trava todos os campos vinculados via `field()` (ex.: enquanto o envio está em andamento). */
  disabled?: boolean;
}

export interface UseZodFormReturn<T extends Record<string, unknown>> {
  values: T;
  errors: FormErrors<T>;
  isDirty: boolean;
  setFieldValue: <K extends keyof T>(field: K, value: T[K]) => void;
  field: FieldBinder<T>;
  syncValues: (nextValues: T) => void;
  reset: (nextValues?: T) => void;
  validate: () => T | null;
}

export type LoginFormData = z.infer<typeof LoginSchema>;
export type RegisterFormData = z.infer<typeof RegisterSchema>;
export type EditarPerfilFormData = z.infer<typeof ProfileEditSchema>;
export type ChamadoFormData = z.infer<typeof ChamadoFormSchema>;
export type ChamadoCreateFormData = z.infer<typeof ChamadoCreateSchema>;
export type EditarChamadoFormData = ChamadoFormData;
export type StatusUpdateFormData = z.infer<typeof StatusUpdateSchema>;
