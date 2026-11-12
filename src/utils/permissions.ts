import type { CargoUsuario, Usuario } from '@/types/auth';
import type { Chamado } from '@/types/chamado';

export function isGestorOuAdmin(usuario?: Usuario | null): boolean {
  return usuario?.cargo === 'GESTOR' || usuario?.cargo === 'ADMIN';
}

export function isAdminUsuario(usuario?: Usuario | null): boolean {
  return usuario?.cargo === 'ADMIN';
}

export function getCargoLabel(cargo?: CargoUsuario): string {
  switch (cargo) {
    case 'ADMIN':
      return 'Administrador';
    case 'GESTOR':
      return 'Gestor Público';
    default:
      return 'Cidadão';
  }
}

export function canEditChamado(usuario?: Usuario | null, chamado?: Chamado | null): boolean {
  if (!usuario || !chamado) return false;
  return chamado.usuarioId === usuario.id || isGestorOuAdmin(usuario);
}

export function canChangeChamadoStatus(usuario?: Usuario | null): boolean {
  return isGestorOuAdmin(usuario);
}

export function canDeleteChamado(usuario?: Usuario | null): boolean {
  return isAdminUsuario(usuario);
}
