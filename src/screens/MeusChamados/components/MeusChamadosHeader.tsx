import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing, fontSize, fontWeight } from '../../../theme';
import { StatusChamado } from '../../../types';

const STATUS_TABS: (StatusChamado | 'Todos')[] = [
  'Todos',
  'Aberto',
  'Em Andamento',
  'Resolvido',
];

interface MeusChamadosHeaderProps {
  totalMeus: number;
  statusFiltro: StatusChamado | 'Todos';
  statusCounts: Record<StatusChamado | 'Todos', number>;
  onSelectStatus: (st: StatusChamado | 'Todos') => void;
  onNovoRelato: () => void;
}

export const MeusChamadosHeader: React.FC<MeusChamadosHeaderProps> = ({
  totalMeus,
  statusFiltro,
  statusCounts,
  onSelectStatus,
  onNovoRelato,
}) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.titleRow}>
        <View style={{ flex: 1, paddingRight: spacing.sm }}>
          <Text style={styles.pageTitle}>Meus Relatos</Text>
          <Text style={styles.pageSubtitle} numberOfLines={1}>
            {totalMeus} {totalMeus === 1 ? 'protocolo registrado' : 'protocolos registrados'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={onNovoRelato}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={18} color={colors.surface} />
          <Text style={styles.addBtnText}>Novo</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.statusPillsRow}
      >
        {STATUS_TABS.map((st) => {
          const isSelected = statusFiltro === st;
          return (
            <TouchableOpacity
              key={st}
              style={[styles.statusPill, isSelected && styles.statusPillActive]}
              onPress={() => onSelectStatus(st)}
              activeOpacity={0.75}
            >
              <Text
                style={[
                  styles.statusPillText,
                  isSelected && styles.statusPillTextActive,
                ]}
                numberOfLines={1}
              >
                {st} ({statusCounts[st]})
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  pageTitle: {
    fontSize: fontSize.heading,
    fontWeight: fontWeight.extrabold,
    color: colors.secondary[900],
    letterSpacing: -0.3,
  },
  pageSubtitle: {
    fontSize: fontSize.caption,
    color: colors.secondary[500],
    marginTop: 2,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary[600],
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: borderRadius.full,
  },
  addBtnText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    color: colors.surface,
  },
  statusPillsRow: {
    flexDirection: 'row',
    gap: spacing.xs + 2,
    paddingVertical: 4,
    paddingRight: spacing.xl,
  },
  statusPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.secondary[200],
  },
  statusPillActive: {
    backgroundColor: colors.secondary[900],
    borderColor: colors.secondary[900],
  },
  statusPillText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.medium,
    color: colors.secondary[600],
  },
  statusPillTextActive: {
    color: colors.surface,
    fontWeight: fontWeight.semibold,
  },
});
