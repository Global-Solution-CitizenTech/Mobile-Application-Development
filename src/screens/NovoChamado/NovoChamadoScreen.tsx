import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { type CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button } from '@/components/Button';
import { ChamadoFormFields } from '@/components/ChamadoFormFields';
import { FeedbackModal } from '@/components/FeedbackModal';
import { Header } from '@/components/Header';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { type AppTheme, useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { useChamadoForm } from '@/hooks/useChamadoForm';
import type { AppStackParamList, AppTabParamList } from '@/navigation/types';
import { CategoryGridSelector } from '@/screens/NovoChamado/components/CategoryGridSelector';
import { PhotoEvidencePicker } from '@/screens/NovoChamado/components/PhotoEvidencePicker';
import { spacing } from '@/theme';

type NavProp = CompositeNavigationProp<
  BottomTabNavigationProp<AppTabParamList, 'NovoChamadoTab'>,
  NativeStackNavigationProp<AppStackParamList>
>;

export const NovoChamadoScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const form = useChamadoForm({ mode: 'create' });
  const [createdId, setCreatedId] = useState<number | null>(null);

  const localizacaoResumo = form.localizacaoPreview
    ? [form.localizacaoPreview.bairro, form.localizacaoPreview.cidade].filter(Boolean).join(' • ') || 'Localização capturada'
    : null;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Header title="Reportar Ocorrência" subtitle="Envie para a zeladoria municipal" />

      {form.loadingCategorias && form.categorias.length === 0 ? (
        <LoadingSpinner message="Carregando categorias..." />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <CategoryGridSelector
            categorias={form.categorias}
            selectedCategoriaId={form.values.categoriaId}
            onSelectCategoriaId={(id) => form.setFieldValue('categoriaId', id)}
            error={form.errors.categoriaId}
          />

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
          />

          <View style={styles.submitWrapper}>
            <Button
              title="Enviar Ocorrência"
              leftIcon={<Ionicons name="send-outline" size={18} color={theme.inverseText} />}
              size="lg"
              loading={form.submitting}
              onPress={() => form.submit((chamado) => setCreatedId(chamado.idChamado))}
            />
          </View>
        </ScrollView>
      )}

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
          if (targetId) navigation.navigate('ChamadoDetails', { id: targetId });
        }}
        onCancel={() => {
          setCreatedId(null);
          navigation.navigate('HomeTab');
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
