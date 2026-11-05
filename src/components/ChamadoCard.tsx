import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Chamado } from '../types';
import { StatusBadge } from './StatusBadge';
import { CategoryBadge } from './CategoryBadge';
import { colors, borderRadius, spacing, fontSize, fontWeight, shadows } from '../theme';

interface ChamadoCardProps {
  chamado: Chamado;
  onPress: () => void;
  style?: ViewStyle;
}

export const ChamadoCard: React.FC<ChamadoCardProps> = ({ chamado, onPress, style }) => {
  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[styles.card, shadows.sm, style]}
      onPress={onPress}
    >
      {/* Top Header do Card: Protocolo e Status */}
      <View style={styles.topRow}>
        <View style={styles.protocolContainer}>
          <Ionicons name="document-text-outline" size={14} color={colors.secondary[500]} />
          <Text style={styles.protocolText}>{chamado.protocolo}</Text>
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
              {chamado.localizacao.logradouro}, {chamado.localizacao.numero} - {chamado.localizacao.bairro}
            </Text>
          </View>
        </View>

        {/* Thumbnail da foto simulada (se houver) */}
        {chamado.fotoUrl && (
          <Image
            source={{ uri: chamado.fotoUrl }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        )}
      </View>

      {/* Rodapé: Autor e Data */}
      <View style={styles.footerRow}>
        <View style={styles.authorRow}>
          <Ionicons name="person-circle-outline" size={16} color={colors.secondary[400]} />
          <Text style={styles.authorText} numberOfLines={1}>
            {chamado.autorNome}
          </Text>
        </View>

        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={13} color={colors.secondary[400]} />
          <Text style={styles.dateText}>{formatDate(chamado.dataAbertura)}</Text>
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
  protocolContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  protocolText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    color: colors.secondary[600],
    letterSpacing: 0.3,
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
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    lineHeight: 22,
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
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.xs + 4,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    marginRight: spacing.sm,
  },
  authorText: {
    fontSize: fontSize.caption,
    color: colors.secondary[500],
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: fontSize.caption,
    color: colors.secondary[500],
  },
});

