import type { IoniconName } from '@/theme/types';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface PilarItem {
  icon: IoniconName;
  titulo: string;
  descricao: string;
}
