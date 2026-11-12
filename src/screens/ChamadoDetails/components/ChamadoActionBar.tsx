import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/Button';
import { type AppTheme, useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { borderRadius, spacing } from '@/theme';
import type { Chamado } from '@/types/chamado';

interface ChamadoActionBarProps {
  chamado: Chamado;
  podeApoiar: boolean;
  podeEditar: boolean;
  podeAlterarStatus: boolean;
  podeExcluir: boolean;
  isSupporting: boolean;
  onApoiar: () => void;
  onEditar: () => void;
  onAlterarStatus: () => void;
  onExcluir: () => void;
}

export const ChamadoActionBar: React.FC<ChamadoActionBarProps> = ({
  chamado,
  podeApoiar,
  podeEditar,
  podeAlterarStatus,
  podeExcluir,
  isSupporting,
  onApoiar,
  onEditar,
  onAlterarStatus,
  onExcluir,
}) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      {podeApoiar && (
        <Button
          title={chamado.apoiadoPorMim ? `Apoiado (${chamado.totalVotos})` : `Apoiar Ocorrência (${chamado.totalVotos})`}
          variant={chamado.apoiadoPorMim ? 'primary' : 'outline'}
          leftIcon={
            <Ionicons
              name={chamado.apoiadoPorMim ? 'thumbs-up' : 'thumbs-up-outline'}
              size={18}
              color={chamado.apoiadoPorMim ? theme.inverseText : theme.primary}
            />
          }
          loading={isSupporting}
          onPress={onApoiar}
        />
      )}

      {(podeEditar || podeAlterarStatus) && (
        <View style={styles.row}>
          {podeEditar && (
            <Button
              title="Editar"
              variant="outline"
              leftIcon={<Ionicons name="create-outline" size={18} color={theme.primary} />}
              onPress={onEditar}
              style={styles.flexBtn}
            />
          )}
          {podeAlterarStatus && (
            <Button
              title="Atualizar Status"
              variant="secondary"
              leftIcon={<Ionicons name="sync-outline" size={18} color={theme.inverseText} />}
              onPress={onAlterarStatus}
              style={styles.flexBtn}
            />
          )}
        </View>
      )}

      {podeExcluir && (
        <Button
          title="Excluir Ocorrência"
          variant="danger"
          leftIcon={<Ionicons name="trash-outline" size={18} color={theme.inverseText} />}
          onPress={onExcluir}
        />
      )}
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: theme.border,
      gap: spacing.sm,
    },
    row: { flexDirection: 'row', gap: spacing.sm },
    flexBtn: { flex: 1 },
  });
