import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@/components/Input';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import type { BoundFieldProps, StringFieldKeys } from '@/hooks/useZodForm';
import { borderRadius, fontSize, fontWeight, spacing } from '@/theme';
import type { AppTheme } from '@/theme/types';
import { maskCepInput } from '@/utils/formatters';
import type { ChamadoFormData } from '@/utils/schemas';

interface ChamadoFormFieldsProps {
  field: <K extends StringFieldKeys<ChamadoFormData>>(name: K) => BoundFieldProps;
  hideDetails?: boolean;
  onUsarGps?: () => void;
  capturandoGps?: boolean;
  erroGps?: string | null;
  localizacaoResumo?: string | null;
}

export const ChamadoFormFields = ({
  field,
  hideDetails = false,
  onUsarGps,
  capturandoGps,
  erroGps,
  localizacaoResumo,
}: ChamadoFormFieldsProps) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      {!hideDetails && (
        <>
          <Input
            label="Título da Ocorrência *"
            placeholder="Ex: Buraco fundo na faixa direita"
            maxLength={100}
            {...field('titulo')}
          />

          <Input
            label="Descrição Detalhada *"
            placeholder="Descreva o problema, riscos próximos e há quanto tempo ocorre..."
            multiline
            numberOfLines={4}
            maxLength={1000}
            style={styles.textArea}
            {...field('descricao')}
          />
        </>
      )}

      {onUsarGps && (
        <View style={styles.gpsSection}>
          <TouchableOpacity style={styles.gpsButton} onPress={onUsarGps} disabled={capturandoGps} activeOpacity={0.8}>
            {capturandoGps ? (
              <ActivityIndicator size="small" color={theme.primary} />
            ) : (
              <Ionicons name="navigate-outline" size={18} color={theme.primary} />
            )}
            <Text style={styles.gpsText}>
              {capturandoGps ? 'Obtendo endereço via GPS...' : 'Preencher Endereço pelo GPS'}
            </Text>
          </TouchableOpacity>
          {localizacaoResumo ? <Text style={styles.gpsSuccess}>{localizacaoResumo}</Text> : null}
          {erroGps ? <Text style={styles.gpsError}>{erroGps}</Text> : null}
        </View>
      )}

      <View style={styles.row}>
        <View style={styles.flexCep}>
          <Input
            label="CEP *"
            placeholder="00000-000"
            keyboardType="number-pad"
            mask={maskCepInput}
            maxLength={9}
            {...field('cep')}
          />
        </View>
        <View style={styles.flexNum}>
          <Input
            label="Número *"
            placeholder="Ex: 1100 ou S/N"
            maxLength={100}
            {...field('numero')}
          />
        </View>
      </View>

      <Input
        label="Rua / Logradouro (Opcional)"
        placeholder="Av. Paulista"
        maxLength={100}
        {...field('rua')}
      />

      <Input
        label="Ponto de Referência *"
        placeholder="Ex: Em frente à entrada do metrô"
        maxLength={50}
        {...field('referencia')}
      />
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: { gap: spacing.xs },
    textArea: { minHeight: 96, textAlignVertical: 'top', paddingTop: spacing.sm },
    gpsSection: { marginBottom: spacing.sm, gap: spacing.xs },
    gpsButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      paddingVertical: spacing.sm + 4,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: theme.primary,
      backgroundColor: theme.primaryLight,
    },
    gpsText: { fontSize: fontSize.bodySmall, fontWeight: fontWeight.bold, color: theme.primary },
    gpsSuccess: { fontSize: fontSize.caption, color: theme.primary, fontWeight: fontWeight.medium },
    gpsError: { fontSize: fontSize.caption, color: theme.danger },
    row: { flexDirection: 'row', gap: spacing.sm },
    flexCep: { flex: 1.2 },
    flexNum: { flex: 1 },
  });
