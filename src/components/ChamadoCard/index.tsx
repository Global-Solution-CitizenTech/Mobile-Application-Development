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
import { Chamado, PrioridadeChamado } from '../../types';
import { getCategoryIconName } from '../CategoryBadge';
import { colors, borderRadius, spacing, fontSize, fontWeight, shadows } from '../../theme';

interface ChamadoCardProps {
  chamado: Chamado;
  onPress: () => void;
  onSupportPress?: () => void;
  rankNumber?: number;
  style?: ViewStyle;
}

export function getPriorityConfig(prioridade?: PrioridadeChamado) {
  switch (prioridade) {
    case 'Crítica':
      return {
        bg: '#FEF2F2',
        text: '#DC2626',
        border: '#FECACA',
        dot: '#DC2626',
        icon: 'flame' as const,
      };
    case 'Alta':
      return {
        bg: '#FFFBEB',
        text: '#D97706',
        border: '#FDE68A',
        dot: '#D97706',
        icon: 'warning' as const,
      };
    case 'Média':
      return {
        bg: '#EFF6FF',
        text: '#2563EB',
        border: '#BFDBFE',
        dot: '#2563EB',
        icon: 'alert-circle' as const,
      };
    default:
      return {
        bg: '#F8FAFC',
        text: '#475569',
        border: '#E2E8F0',
        dot: '#64748B',
        icon: 'information-circle' as const,
      };
  }
}

function getStatusColor(status: Chamado['status']) {
  switch (status) {
    case 'Aberto':
      return { dot: '#F59E0B', text: '#B45309' };
    case 'Em Andamento':
      return { dot: '#3B82F6', text: '#1D4ED8' };
    case 'Resolvido':
    default:
      return { dot: '#10B981', text: '#047857' };
  }
}

export const ChamadoCard: React.FC<ChamadoCardProps> = ({
  chamado,
  onPress,
  onSupportPress,
  rankNumber,
  style,
}) => {
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
  const statusColor = getStatusColor(chamado.status);
  const categoriaCurta =
    chamado.categoria === 'Entulho e Descarte Irregular'
      ? 'Descarte Irregular'
      : chamado.categoria;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[styles.card, shadows.sm, style]}
      onPress={onPress}
    >
      <View style={styles.mainRow}>
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

        <View style={styles.contentColumn}>
          <View style={styles.metaTopRow}>
            <Text style={styles.categoryMetaText} numberOfLines={1}>
              {categoriaCurta} • {chamado.localizacao.bairro}
            </Text>

            <View style={styles.statusInline}>
              <View style={[styles.statusDot, { backgroundColor: statusColor.dot }]} />
              <Text style={[styles.statusInlineText, { color: statusColor.text }]}>
                {chamado.status}
              </Text>
            </View>
          </View>

          <Text style={styles.title} numberOfLines={2}>
            {chamado.titulo}
          </Text>

          <Text style={styles.addressText} numberOfLines={1}>
            {chamado.localizacao.logradouro}, {chamado.localizacao.numero}
          </Text>
        </View>
      </View>

      <View style={styles.footerRow}>
        <View style={styles.footerLeft}>
          {typeof rankNumber === 'number' && (
            <View style={styles.rankBadge}>
              <Text style={styles.rankBadgeText}>#{rankNumber}</Text>
            </View>
          )}

          <View style={styles.priorityInline}>
            <View style={[styles.priorityDot, { backgroundColor: prio.dot }]} />
            <Text style={[styles.priorityLabel, { color: prio.text }]}>
              Urgência {chamado.prioridade || 'Média'}
            </Text>
          </View>

          <Text style={styles.dotSeparator}>•</Text>

          <Text style={styles.supportCountText}>
            {chamado.apoiosCount || 1} {chamado.apoiosCount === 1 ? 'apoio' : 'apoios'}
          </Text>
        </View>

        {onSupportPress && chamado.status !== 'Resolvido' ? (
          <TouchableOpacity
            style={[
              styles.supportBtn,
              chamado.apoiadoPeloUsuario && styles.supportBtnActive,
            ]}
            onPress={onSupportPress}
            activeOpacity={0.75}
          >
            <Ionicons
              name={chamado.apoiadoPeloUsuario ? 'checkmark' : 'add'}
              size={14}
              color={chamado.apoiadoPeloUsuario ? colors.surface : colors.primary[700]}
            />
            <Text
              style={[
                styles.supportBtnText,
                chamado.apoiadoPeloUsuario && styles.supportBtnTextActive,
              ]}
            >
              {chamado.apoiadoPeloUsuario ? 'Apoiado' : 'Apoiar'}
            </Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.dateText}>{formatDate(chamado.dataAbertura)}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm + 4,
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm + 4,
  },
  thumbnail: {
    width: 68,
    height: 68,
    borderRadius: 14,
    backgroundColor: colors.secondary[100],
  },
  thumbnailFallback: {
    width: 68,
    height: 68,
    borderRadius: 14,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentColumn: {
    flex: 1,
    minHeight: 68,
    justifyContent: 'space-between',
  },
  metaTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 3,
  },
  categoryMetaText: {
    flex: 1,
    fontSize: 11.5,
    fontWeight: fontWeight.medium,
    color: colors.secondary[500],
  },
  statusInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusInlineText: {
    fontSize: 11.5,
    fontWeight: fontWeight.semibold,
  },
  title: {
    fontSize: 15,
    fontWeight: fontWeight.semibold,
    color: colors.secondary[900],
    lineHeight: 20,
    marginBottom: 3,
  },
  addressText: {
    fontSize: fontSize.caption,
    color: colors.secondary[400],
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm + 2,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  rankBadge: {
    backgroundColor: colors.secondary[900],
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 6,
  },
  rankBadgeText: {
    color: colors.surface,
    fontSize: 10,
    fontWeight: fontWeight.bold,
  },
  priorityInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  priorityLabel: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
  },
  dotSeparator: {
    marginHorizontal: 6,
    color: colors.secondary[300],
    fontSize: fontSize.caption,
  },
  supportCountText: {
    fontSize: fontSize.caption,
    color: colors.secondary[500],
    fontWeight: fontWeight.medium,
  },
  supportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary[50],
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
  },
  supportBtnActive: {
    backgroundColor: colors.primary[600],
  },
  supportBtnText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    color: colors.primary[700],
  },
  supportBtnTextActive: {
    color: colors.surface,
  },
  dateText: {
    fontSize: fontSize.caption,
    color: colors.secondary[400],
  },
});
