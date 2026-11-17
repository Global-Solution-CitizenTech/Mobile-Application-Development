import type { CargoUsuario, Usuario } from '@/types/auth';
import type { Chamado } from '@/types/chamado';
import type { StatusChamado } from '@/types/categoria';

function isGestor(usuario?: Usuario | null): boolean {
  return usuario?.cargo === 'GESTOR';
}

export function canAccessMobileApp(usuario?: Usuario | null): boolean {
  return usuario?.cargo === 'CIDADAO' || usuario?.cargo === 'GESTOR';
}

export function getCargoLabel(cargo?: CargoUsuario): string {
  return cargo === 'GESTOR' ? 'Gestor Público' : 'Cidadão';
}

export function canEditChamado(usuario?: Usuario | null, chamado?: Chamado | null): boolean {
  return Boolean(chamado) && isGestor(usuario);
}

export function canChangeChamadoStatus(usuario?: Usuario | null): boolean {
  return isGestor(usuario);
}

export function canDeleteChamado(usuario?: Usuario | null, chamado?: Chamado | null): boolean {
  return Boolean(chamado) && isGestor(usuario);
}

export function isStatusFinal(status: StatusChamado): boolean {
  return status === 'CONCLUIDO' || status === 'REJEITADO';
}

export function canSupportChamado(status: StatusChamado): boolean {
  return !isStatusFinal(status);
}
