import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
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
import { spacing } from '@/theme';

type Props = NativeStackScreenProps<AppStackParamList, 'NovoChamado'>;

export const NovoChamadoScreen = ({ navigation }: Props) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();
  const form = useChamadoForm({ mode: 'create' });
  const [createdId, setCreatedId] = useState<number | null>(null);

  const localizacaoResumo = form.localizacaoPreview
    ? [form.localizacaoPreview.bairro, form.localizacaoPreview.cidade].filter(Boolean).join(' • ') || 'Localização capturada'
    : null;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Header
        title="Reportar Ocorrência"
        subtitle="Envie para a zeladoria municipal"
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
        <ChamadoFormFields
          titulo={form.values.titulo}
          onChangeTitulo={(v) => form.setFieldValue('titulo', v)}
          descricao={form.values.descricao}
          onChangeDescricao={(v) => form.setFieldValue('descricao', v)}
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

        <PhotoEvidencePicker
          fotoBase64={form.values.fotoBase64}
          onChangeFoto={(base64) => form.setFieldValue('fotoBase64', base64)}
          error={form.errors.fotoBase64}
        />

        <View style={styles.submitWrapper}>
          <Button
            title={form.analisandoIa ? 'Analisando com Spring AI...' : 'Enviar Ocorrência'}
            leftIcon={<Ionicons name="send-outline" size={18} color={theme.inverseText} />}
            size="lg"
            loading={form.submitting || form.analisandoIa}
            onPress={() => {
              void form.submit((chamado) => setCreatedId(chamado.idChamado));
            }}
          />
        </View>
      </ScrollView>

      <FeedbackModal
        visible={Boolean(createdId)}
        type="success"
        title="Ocorrência Registrada!"
        message={`Seu chamado foi enviado com sucesso.\n\nProtocolo #${createdId ?? ''}`}
        confirmText="Ver Chamado"
        cancelText="Início"
        onConfirm={() => {
          const targetId = createdId;
          setCreatedId(null);
          if (targetId) navigation.replace('ChamadoDetails', { id: targetId });
        }}
        onCancel={() => {
          setCreatedId(null);
          navigation.navigate('MainTabs', { screen: 'HomeTab' });
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
    submitWrapper: { marginTop: spacing.sm },
  });
