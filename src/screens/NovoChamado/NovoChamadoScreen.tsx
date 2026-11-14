import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { ChamadoFormFields } from '@/components/ChamadoFormFields';
import { FeedbackModal } from '@/components/FeedbackModal';
import { Header } from '@/components/Header';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import type { AppTheme } from '@/theme/types';
import { useChamadoForm } from '@/hooks/useChamadoForm';
import type { AppStackParamList } from '@/navigation/types';
import { PhotoEvidencePicker } from '@/screens/NovoChamado/components/PhotoEvidencePicker';
import type { Chamado } from '@/types/chamado';
import { borderRadius, fontSize, fontWeight, spacing } from '@/theme';

type Props = NativeStackScreenProps<AppStackParamList, 'NovoChamado'>;

export const NovoChamadoScreen = ({ navigation }: Props) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();
  const form = useChamadoForm({ mode: 'create' });
  const [createdChamado, setCreatedChamado] = useState<Chamado | null>(null);

  const localizacaoResumo = form.localizacaoPreview
    ? [form.localizacaoPreview.bairro, form.localizacaoPreview.cidade].filter(Boolean).join(' • ') || 'Localização capturada'
    : null;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Header
        title="Reportar Ocorrência"
        subtitle="Envie a foto e o local para análise automática da IA"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: Math.max(insets.bottom, spacing.xl) + spacing.lg,
            paddingLeft: Math.max(insets.left, spacing.md),
            paddingRight: Math.max(insets.right, spacing.md),
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.aiHintBox}>
          <Ionicons name="sparkles" size={16} color={theme.primary} />
          <Text style={styles.aiHintText}>
            Anexe a foto e informe o endereço. Nossa IA valida a imagem e define título, descrição, categoria, prioridade e órgão responsável.
          </Text>
        </View>

        <PhotoEvidencePicker
          foto={form.values.foto}
          onChangeFoto={(foto) => form.setFieldValue('foto', foto)}
          error={form.errors.foto}
        />

        <ChamadoFormFields
          hideDetails
          field={form.field}
          onUsarGps={() => {
            void form.handleUsarGps();
          }}
          capturandoGps={form.capturandoGps}
          erroGps={form.erroGps}
          localizacaoResumo={localizacaoResumo}
        />

        <View style={styles.submitWrapper}>
          <Button
            title="Enviar Ocorrência"
            leftIcon={<Ionicons name="send-outline" size={18} color={theme.inverseText} />}
            size="lg"
            loading={form.submitting}
            onPress={() => form.submit((chamado) => setCreatedChamado(chamado))}
          />
        </View>
      </ScrollView>

      <FeedbackModal
        visible={Boolean(createdChamado)}
        type="success"
        title="Chamado Criado!"
        message={
          createdChamado
            ? `"${createdChamado.titulo}" foi classificado pela IA e registrado com sucesso.`
            : ''
        }
        confirmText="Ver Chamado"
        cancelText="Meus Chamados"
        onConfirm={() => {
          const targetId = createdChamado?.idChamado;
          setCreatedChamado(null);
          if (targetId) {
            navigation.replace('ChamadoDetails', { id: targetId });
          }
        }}
        onCancel={() => {
          setCreatedChamado(null);
          navigation.popTo('MainTabs', { screen: 'MeusChamadosTab' });
        }}
      />
    </KeyboardAvoidingView>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    scrollContent: { padding: spacing.md, paddingBottom: spacing.xxxl, gap: spacing.xs },
    aiHintBox: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.xs + 2,
      padding: spacing.sm + 4,
      marginBottom: spacing.xs,
      borderRadius: borderRadius.md,
      backgroundColor: theme.primaryLight,
    },
    aiHintText: {
      flex: 1,
      fontSize: fontSize.caption,
      fontWeight: fontWeight.medium,
      color: theme.primary,
      lineHeight: 18,
    },
    submitWrapper: { marginTop: spacing.sm },
  });
