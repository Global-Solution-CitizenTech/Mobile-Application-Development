import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@/components/Input';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import type { AppTheme } from '@/theme/types';
import { borderRadius, fontSize, fontWeight, spacing } from '@/theme';
import { maskCepInput } from '@/utils/formatters';
import type { ChamadoFormData, FormErrors } from '@/utils/schemas';

interface ChamadoFormFieldsProps {
  titulo: string;
  onChangeTitulo: (v: string) => void;
  descricao: string;
  onChangeDescricao: (v: string) => void;
  cep: string;
  onChangeCep: (v: string) => void;
  rua?: string;
  onChangeRua: (v: string) => void;
  numero: string;
  onChangeNumero: (v: string) => void;
  referencia: string;
  onChangeReferencia: (v: string) => void;
  errors: FormErrors<ChamadoFormData>;
  onUsarGps?: () => void;
  capturandoGps?: boolean;
  erroGps?: string | null;
  localizacaoResumo?: string | null;
}

export const ChamadoFormFields = ({
  titulo,
  onChangeTitulo,
  descricao,
  onChangeDescricao,
  cep,
  onChangeCep,
  rua,
  onChangeRua,
  numero,
  onChangeNumero,
  referencia,
  onChangeReferencia,
  errors,
  onUsarGps,
  capturandoGps,
  erroGps,
  localizacaoResumo,
}: ChamadoFormFieldsProps) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      <Input
        label="Título da Ocorrência *"
        placeholder="Ex: Buraco fundo na faixa direita"
        value={titulo}
        onChangeText={onChangeTitulo}
        maxLength={100}
        error={errors.titulo}
      />

      <Input
        label="Descrição Detalhada *"
        placeholder="Descreva o problema, riscos próximos e há quanto tempo ocorre..."
        value={descricao}
        onChangeText={onChangeDescricao}
        multiline
        numberOfLines={4}
        maxLength={1000}
        style={styles.textArea}
        error={errors.descricao}
      />

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
            value={cep}
            onChangeText={(text) => onChangeCep(maskCepInput(text))}
            maxLength={9}
            error={errors.cep}
          />
        </View>
        <View style={styles.flexNum}>
          <Input
            label="Número *"
            placeholder="Ex: 1100 ou S/N"
            value={numero}
            onChangeText={onChangeNumero}
            maxLength={100}
            error={errors.numero}
          />
        </View>
      </View>

      <Input
        label="Rua / Logradouro (Opcional)"
        placeholder="Av. Paulista"
        value={rua ?? ''}
        onChangeText={onChangeRua}
        maxLength={100}
        error={errors.rua}
      />

      <Input
        label="Ponto de Referência *"
        placeholder="Ex: Em frente à entrada do metrô"
        value={referencia}
        onChangeText={onChangeReferencia}
        maxLength={50}
        error={errors.referencia}
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
