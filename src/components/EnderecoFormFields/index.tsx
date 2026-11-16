import { useRef } from 'react';
import type { Ref } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { TextInputInstance } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@/components/Input';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { borderRadius, spacing } from '@/theme/spacing';
import { fontSize, fontWeight } from '@/theme/typography';
import type { AppTheme } from '@/types/theme';
import type { EnderecoFormFieldsProps } from '@/types/ui';
import { maskCepInput } from '@/utils/formatters';

function assignRef(
  targetRef: Ref<TextInputInstance> | undefined,
  instance: TextInputInstance | null,
): void {
  if (typeof targetRef === 'function') {
    targetRef(instance);
    return;
  }
  if (targetRef && 'current' in targetRef) {
    targetRef.current = instance;
  }
}

export function EnderecoFormFields({
  field,
  onUsarGps,
  capturandoGps = false,
  erroGps,
  localizacaoResumo,
  cepRef,
  numeroRef,
  ruaRef,
  referenciaRef,
  onSubmitReferencia,
  referenciaReturnKeyType,
}: EnderecoFormFieldsProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  const internalNumeroRef = useRef<TextInputInstance>(null);
  const internalRuaRef = useRef<TextInputInstance>(null);
  const internalReferenciaRef = useRef<TextInputInstance>(null);

  return (
    <View style={styles.container}>
      {onUsarGps ? (
        <View style={styles.gpsSection}>
          <TouchableOpacity
            style={styles.gpsButton}
            onPress={onUsarGps}
            disabled={capturandoGps}
            activeOpacity={0.8}
          >
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
      ) : null}

      <View style={styles.row}>
        <View style={styles.flexCep}>
          <Input
            ref={cepRef}
            label="CEP *"
            placeholder="00000-000"
            keyboardType="number-pad"
            mask={maskCepInput}
            maxLength={9}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => internalNumeroRef.current?.focus()}
            {...field('cep')}
          />
        </View>
        <View style={styles.flexNum}>
          <Input
            ref={(instance) => {
              internalNumeroRef.current = instance;
              assignRef(numeroRef, instance);
            }}
            label="Número *"
            placeholder="Ex: 1100 ou S/N"
            maxLength={100}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => internalRuaRef.current?.focus()}
            {...field('numero')}
          />
        </View>
      </View>

      <Input
        ref={(instance) => {
          internalRuaRef.current = instance;
          assignRef(ruaRef, instance);
        }}
        label="Rua / Logradouro (Opcional)"
        placeholder="Av. Paulista"
        maxLength={100}
        returnKeyType="next"
        blurOnSubmit={false}
        onSubmitEditing={() => internalReferenciaRef.current?.focus()}
        {...field('rua')}
      />

      <Input
        ref={(instance) => {
          internalReferenciaRef.current = instance;
          assignRef(referenciaRef, instance);
        }}
        label="Ponto de Referência *"
        placeholder="Ex: Em frente à entrada do metrô"
        maxLength={50}
        returnKeyType={referenciaReturnKeyType ?? (onSubmitReferencia ? 'done' : 'next')}
        onSubmitEditing={onSubmitReferencia}
        {...field('referencia')}
      />
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      gap: spacing.xs,
    },
    gpsSection: {
      marginBottom: spacing.sm,
      gap: spacing.xs,
    },
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
    gpsText: {
      fontSize: fontSize.bodySmall,
      fontWeight: fontWeight.bold,
      color: theme.primary,
    },
    gpsSuccess: {
      fontSize: fontSize.caption,
      color: theme.primary,
      fontWeight: fontWeight.medium,
    },
    gpsError: {
      fontSize: fontSize.caption,
      color: theme.danger,
    },
    row: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    flexCep: {
      flex: 1.2,
    },
    flexNum: {
      flex: 1,
    },
  });
