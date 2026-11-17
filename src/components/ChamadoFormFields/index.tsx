import { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import type { TextInputInstance } from 'react-native';
import { EnderecoFormFields } from '@/components/EnderecoFormFields';
import { Input } from '@/components/Input';
import { useThemedStyles } from '@/contexts/ThemeContext';
import { spacing } from '@/theme/spacing';
import type { AppTheme } from '@/types/theme';
import type { ChamadoFormFieldsProps } from '@/types/ui';

export const ChamadoFormFields = ({
  field,
  disabled = false,
  hideDetails = false,
  onUsarGps,
  capturandoGps,
  erroGps,
  localizacaoResumo,
}: ChamadoFormFieldsProps) => {
  const styles = useThemedStyles(createStyles);
  const descricaoRef = useRef<TextInputInstance>(null);

  return (
    <View style={styles.container}>
      {!hideDetails && (
        <>
          <Input
            label="Título da Ocorrência *"
            placeholder="Ex: Buraco fundo na faixa direita"
            maxLength={100}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => descricaoRef.current?.focus()}
            {...field('titulo')}
          />

          <Input
            ref={descricaoRef}
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

      <EnderecoFormFields
        field={field}
        disabled={disabled}
        onUsarGps={onUsarGps}
        capturandoGps={capturandoGps}
        erroGps={erroGps}
        localizacaoResumo={localizacaoResumo}
      />
    </View>
  );
};

const createStyles = (_theme: AppTheme) =>
  StyleSheet.create({
    container: {
      gap: spacing.xs,
    },
    textArea: {
      minHeight: 96,
      textAlignVertical: 'top',
      paddingTop: spacing.sm,
    },
  });
