import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing, fontSize, fontWeight, shadows } from '../../../theme';

export const HomeAiInfoCard: React.FC = () => {
  return (
    <>
      <View style={[styles.infoCard, shadows.sm]}>
        <View style={styles.infoCardHeader}>
          <Ionicons name="sparkles" size={18} color={colors.primary[600]} />
          <Text style={styles.infoCardTitle}>Triagem Inteligente & Impacto Coletivo</Text>
        </View>
        <Text style={styles.infoCardText}>
          O ZelaFix utiliza inteligência computacional para analisar o risco das fotos e descrições,
          calculando a urgência e despachando diretamente aos órgãos responsáveis (CET, Subprefeitura,
          Ilumina SP e Sabesp).
        </Text>

        <View style={styles.infoPillRow}>
          <View style={styles.infoPill}>
            <Ionicons name="shield-checkmark-outline" size={14} color={colors.primary[700]} />
            <Text style={styles.infoPillText}>Triagem IA em Tempo Real</Text>
          </View>
          <View style={styles.infoPill}>
            <Ionicons name="people-outline" size={14} color={colors.primary[700]} />
            <Text style={styles.infoPillText}>Priorização Coletiva (+1 Morador)</Text>
          </View>
        </View>
      </View>

      <View style={styles.operationalStatusRow}>
        <View style={styles.operationalDot} />
        <Text style={styles.operationalText}>
          Equipes de Zeladoria e Manutenção Viária Ativas Hoje na Região
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.secondary[100],
    marginBottom: spacing.md,
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.xs,
  },
  infoCardTitle: {
    fontSize: fontSize.bodySmall,
    fontWeight: fontWeight.bold,
    color: colors.secondary[900],
  },
  infoCardText: {
    fontSize: fontSize.caption,
    color: colors.secondary[600],
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  infoPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  infoPillText: {
    fontSize: fontSize.tiny,
    color: colors.primary[700],
    fontWeight: fontWeight.semibold,
  },
  operationalStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: spacing.sm,
    justifyContent: 'center',
  },
  operationalDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#16A34A',
  },
  operationalText: {
    fontSize: fontSize.tiny,
    color: colors.secondary[500],
    fontWeight: fontWeight.medium,
  },
});
