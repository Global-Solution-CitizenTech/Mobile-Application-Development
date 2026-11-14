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
import { borderRadius, fontSize, fontWeight, spacing } from '@/theme';

type Props = NativeStackScreenProps<AppStackParamList, 'NovoChamado'>;

export const NovoChamadoScreen = ({ navigation }: Props) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();
  const form = useChamadoForm({ mode: 'create' });
  const [createdSuccess, setCreatedSuccess] = useState(false);

  const localizacaoResumo = form.localizacaoPreview
    ? [form.localizacaoPreview.bairro, form.localizacaoPreview.cidade].filter(Boolean).join(' • ') || 'Localização capturada'
    : null;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Header
        title="Reportar Ocorrência"
        subtitle="Envie a foto e o local; nossa IA preenche o restante"
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
            Basta anexar a foto e informar o endereço. Título, descrição, categoria, prioridade e órgão responsável serão definidos automaticamente pela IA.
          </Text>
        </View>

        <PhotoEvidencePicker
          fotoBase64={form.values.fotoBase64}
          onChangeFoto={(base64) => form.setFieldValue('fotoBase64', base64)}
          error={form.errors.fotoBase64}
        />

        <ChamadoFormFields
          hideDetails
          cep={form.values.cep}
          onChangeCep={(v) => form.setFieldValue('cep', v)}
          rua={form.values.rua}
          onChangeRua={(v) => form.setFieldValue('rua', v)}
          numero={form.values.numero}
          onChangeNumero={(v) => form.setFieldValue('numero', v)}
          referencia={form.values.referencia}
          onChangeReferencia={(v) => form.setFieldValue('referencia', v)}
          errors={form.errors}
          onUsarGps={form.handleUsarGps}
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
            onPress={() => {
              void form.submit(() => setCreatedSuccess(true));
            }}
          />
        </View>
      </ScrollView>

      <FeedbackModal
        visible={createdSuccess}
        type="success"
        title="Ocorrência em Triagem!"
        message="Sua foto e endereço foram recebidos. Nossa IA está analisando a ocorrência e ela aparecerá na lista em instantes."
        confirmText="Meus Chamados"
        cancelText="Início"
        onConfirm={() => {
          setCreatedSuccess(false);
          navigation.popTo('MainTabs', { screen: 'MeusChamadosTab' });
        }}
        onCancel={() => {
          setCreatedSuccess(false);
          navigation.popTo('MainTabs', { screen: 'HomeTab' });
        }}
      />

      <FeedbackModal
        visible={Boolean(form.erroModal)}
        type="error"
        title="Erro ao enviar"
        message={form.erroModal ?? ''}
        onConfirm={form.clearErroModal}
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
