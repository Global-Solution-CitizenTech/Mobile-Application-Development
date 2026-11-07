import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing, fontSize, fontWeight, shadows } from '../../../theme';
import { HistoricoChamado } from '../../../types';

interface ChamadoTimelineCardProps {
  historico: HistoricoChamado[];
  formatDate: (isoString: string) => string;
}

export const ChamadoTimelineCard: React.FC<ChamadoTimelineCardProps> = ({
  historico,
  formatDate,
}) => {
  return (
    <View style={[styles.mainCard, shadows.sm]}>
      <View style={[styles.sectionHeaderInline, { marginBottom: spacing.sm }]}>
        <Ionicons name="time-outline" size={18} color={colors.secondary[700]} />
        <Text style={styles.sectionHeading}>Andamento do Protocolo</Text>
      </View>

      {historico && historico.length > 0 ? (
        historico.map((item, index) => {
          const isLast = index === (historico?.length || 1) - 1;
          return (
            <View key={item.id || index} style={styles.timelineItem}>
              <View style={styles.timelineIndicator}>
                <View
                  style={[
                    styles.timelineDot,
                    index === 0 && { backgroundColor: colors.primary[600] },
                  ]}
                />
                {!isLast && <View style={styles.timelineLine} />}
              </View>
              <View style={[styles.timelineBody, !isLast && { paddingBottom: spacing.md }]}>
                <View style={styles.timelineStatusRow}>
                  <Text style={styles.timelineStatusTitle}>{item.novoStatus}</Text>
                  <Text style={styles.timelineDate}>{formatDate(item.data)}</Text>
                </View>
                <Text style={styles.timelineObs}>{item.observacao}</Text>
                <Text style={styles.timelineAuthor}>{item.autorNome}</Text>
              </View>
            </View>
          );
        })
      ) : (
        <Text style={styles.emptyTimelineText}>
          Nenhuma movimentação registrada até o momento.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md + 2,
    borderWidth: 1,
    borderColor: colors.secondary[100],
    marginBottom: spacing.md,
  },
  sectionHeaderInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionHeading: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    color: colors.secondary[900],
  },
  timelineItem: {
    flexDirection: 'row',
  },
  timelineIndicator: {
    alignItems: 'center',
    marginRight: spacing.sm + 2,
    width: 14,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.secondary[300],
    marginTop: 4,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.secondary[100],
    marginVertical: 4,
  },
  timelineBody: {
    flex: 1,
  },
  timelineStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timelineStatusTitle: {
    fontSize: fontSize.bodySmall,
    fontWeight: fontWeight.bold,
    color: colors.secondary[900],
  },
  timelineDate: {
    fontSize: fontSize.tiny,
    color: colors.secondary[400],
  },
  timelineObs: {
    fontSize: fontSize.caption,
    color: colors.secondary[600],
    marginTop: 2,
    lineHeight: 18,
  },
  timelineAuthor: {
    fontSize: fontSize.tiny,
    color: colors.secondary[400],
    marginTop: 2,
  },
  emptyTimelineText: {
    fontSize: fontSize.caption,
    color: colors.secondary[400],
  },
});
