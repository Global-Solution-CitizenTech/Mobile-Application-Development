import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Chamado, PrioridadeChamado } from '../types';
import { StatusBadge } from './StatusBadge';
import { CategoryBadge, getCategoryIconName } from './CategoryBadge';
import { colors, borderRadius, spacing, fontSize, fontWeight, shadows } from '../theme';

interface ChamadoCardProps {
  chamado: Chamado;
  onPress: () => void;
  style?: ViewStyle;
}

export function getPriorityConfig(prioridade?: PrioridadeChamado) {
  switch (prioridade) {
    case 'Crítica':
      return {
        bg: '#FEF2F2',
        text: '#DC2626',
        border: '#FECACA',
        icon: 'flame' as const,
      };
    case 'Alta':
      return {
        bg: '#FFFBEB',
        text: '#D97706',
        border: '#FDE68A',
        icon: 'warning' as const,
      };
    case 'Média':
      return {
        bg: '#EFF6FF',
        text: '#2563EB',
        border: '#BFDBFE',
        icon: 'alert-circle' as const,
      };
    default:
      return {
        bg: '#F8FAFC',
        text: '#475569',
        border: '#E2E8F0',
        icon: 'information-circle' as const,
      };
  }
}

export const ChamadoCard: React.FC<ChamadoCardProps> = ({ chamado, onPress, style }) => {
  const [imageError, setImageError] = useState(false);

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const prio = getPriorityConfig(chamado.prioridade);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[styles.card, shadows.sm, style]}
      onPress={onPress}
    >
      {/* Top Header do Card: Protocolo, Prioridade e Status */}
      <View style={styles.topRow}>
        <View style={styles.leftBadges}>
          <Text style={styles.protocolText}>{chamado.protocolo}</Text>
          <View
            style={[
              styles.priorityPill,
              { backgroundColor: prio.bg, borderColor: prio.border },
            ]}
          >
            <Ionicons name={prio.icon} size={11} color={prio.text} />
            <Text style={[styles.priorityText, { color: prio.text }]}>
              {chamado.prioridade || 'Média'}
            </Text>
          </View>
        </View>
        <StatusBadge status={chamado.status} size="sm" />
      </View>

      {/* Conteúdo Principal */}
      <View style={styles.mainContent}>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {chamado.titulo}
          </Text>

          <View style={styles.categoryRow}>
            <CategoryBadge categoria={chamado.categoria} />
          </View>

          {/* Endereço */}
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color={colors.secondary[500]} />
            <Text style={styles.locationText} numberOfLines={1}>
              {chamado.localizacao.logradouro}, {chamado.localizacao.numero} • {chamado.localizacao.bairro}
            </Text>
          </View>
        </View>

        {/* Thumbnail da foto com fallback para ícone da categoria se não houver foto ou erro de carregamento */}
        {chamado.fotoUrl && !imageError ? (
          <Image
            source={{ uri: chamado.fotoUrl }}
            style={styles.thumbnail}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <View style={styles.thumbnailFallback}>
            <Ionicons
              name={getCategoryIconName(chamado.categoria)}
              size={24}
              color={colors.primary[600]}
            />
          </View>
        )}
      </View>

      {/* Rodapé: Apoio Comunitário e Data */}
      <View style={styles.footerRow}>
        <View style={styles.supportBadge}>
          <Ionicons
            name={chamado.apoiadoPeloUsuario ? 'people' : 'people-outline'}
            size={14}
            color={colors.primary[700]}
          />
          <Text style={styles.supportText}>
            {chamado.apoiosCount || 1} {chamado.apoiosCount === 1 ? 'morador apoiou' : 'apoios no bairro'}
          </Text>
        </View>

        <View style={styles.metaRight}>
          <Text style={styles.authorText} numberOfLines={1}>
            {chamado.autorNome.split(' ')[0]} • {formatDate(chamado.dataAbertura)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  leftBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  protocolText: {
    fontSize: fontSize.tiny,
    fontWeight: fontWeight.bold,
    color: colors.secondary[500],
    letterSpacing: 0.3,
  },
  priorityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: fontWeight.bold,
  },
  mainContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.sm + 2,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  categoryRow: {
    marginBottom: spacing.xs + 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: fontSize.caption,
    color: colors.secondary[600],
    flex: 1,
  },
  thumbnail: {
    width: 68,
    height: 68,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.secondary[100],
  },
  thumbnailFallback: {
    width: 68,
    height: 68,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.xs + 4,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  supportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.primary[50],
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  supportText: {
    fontSize: fontSize.tiny,
    fontWeight: fontWeight.bold,
    color: colors.primary[700],
  },
  metaRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorText: {
    fontSize: fontSize.tiny,
    color: colors.secondary[400],
  },
});
