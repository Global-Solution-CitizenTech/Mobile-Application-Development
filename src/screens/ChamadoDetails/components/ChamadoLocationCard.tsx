import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { type AppTheme, useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { borderRadius, fontSize, fontWeight, spacing } from '@/theme';
import type { EnderecoResponse } from '@/types/auth';
import { formatCep } from '@/utils/formatters';

interface ChamadoLocationCardProps {
  endereco: EnderecoResponse;
}

export const ChamadoLocationCard: React.FC<ChamadoLocationCardProps> = ({ endereco }) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  const linhaRua = [endereco.rua, endereco.numero].filter(Boolean).join(', ');
  const linhaRegiao = [endereco.bairro, endereco.cidade, endereco.estado].filter(Boolean).join(' • ');

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Ionicons name="location" size={18} color={theme.primary} />
        <Text style={styles.title}>Localização da Ocorrência</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.mainAddress}>{linhaRua || 'Endereço registrado'}</Text>
        {linhaRegiao ? <Text style={styles.sub}>{linhaRegiao}</Text> : null}
        <Text style={styles.sub}>CEP {formatCep(endereco.cep)}</Text>
        {endereco.referencia ? <Text style={styles.ref}>Ponto de Referência: {endereco.referencia}</Text> : null}
      </View>
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: theme.border,
      gap: spacing.sm,
    },
    headerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs + 2 },
    title: { fontSize: fontSize.body, fontWeight: fontWeight.bold, color: theme.text },
    body: { gap: 4 },
    mainAddress: { fontSize: fontSize.body, fontWeight: fontWeight.semibold, color: theme.text },
    sub: { fontSize: fontSize.bodySmall, color: theme.textSecondary },
    ref: { fontSize: fontSize.caption, color: theme.primary, fontWeight: fontWeight.medium, marginTop: 2 },
  });
