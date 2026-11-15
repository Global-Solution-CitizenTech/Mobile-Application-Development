import type {
  ChamadoCreateFormData,
  ChamadoFormData,
  LoginFormData,
  ProfileEditFormData,
  RegisterFormData,
  StatusUpdateFormData,
} from '@/utils/schemas';

export type FormErrors<T> = Partial<Record<keyof T, string>>;

export type StringFieldKeys<T> = {
  [K in keyof T]-?: T[K] extends string | undefined ? K : never;
}[keyof T];

export interface BoundFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
}

export type {
  LoginFormData,
  RegisterFormData,
  ProfileEditFormData,
  ChamadoFormData,
  ChamadoCreateFormData,
  StatusUpdateFormData,
};
