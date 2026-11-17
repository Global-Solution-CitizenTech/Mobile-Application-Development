import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/Button';
import { EnderecoFormFields } from '@/components/EnderecoFormFields';
import { Header } from '@/components/Header';
import { KeyboardScreenLayout } from '@/components/KeyboardScreenLayout';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { useNovoChamadoForm } from '@/hooks/useNovoChamadoForm';
import { AiTriageBanner } from '@/screens/NovoChamado/components/AiTriageBanner';
import { NovoChamadoSuccessModal } from '@/screens/NovoChamado/components/NovoChamadoSuccessModal';
import { PhotoEvidencePicker } from '@/screens/NovoChamado/components/PhotoEvidencePicker';
import { spacing } from '@/theme/spacing';
import type { Chamado } from '@/types/chamado';
import type { AppStackScreenProps } from '@/types/navigation';
import type { AppTheme } from '@/types/theme';

export const NovoChamadoScreen = ({ navigation }: AppStackScreenProps<'NovoChamado'>) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const form = useNovoChamadoForm();
  const [createdChamado, setCreatedChamado] = useState<Chamado | null>(null);

  return (
    <>
      <KeyboardScreenLayout
        header={
          <Header
            title="Reportar Ocorrência"
            subtitle="Envie a foto e o local para análise automática da IA"
            showBack
            onBack={() => navigation.goBack()}
          />
        }
      >
        <AiTriageBanner />

        <PhotoEvidencePicker
          foto={form.values.foto}
          onChangeFoto={(foto) => form.setFieldValue('foto', foto)}
          error={form.errors.foto}
          disabled={form.submitting}
        />

        <EnderecoFormFields
          field={form.field}
          disabled={form.submitting}
          onUsarGps={() => {
            void form.handleUsarGps();
          }}
          capturandoGps={form.capturandoGps}
          erroGps={form.erroGps}
          localizacaoResumo={form.localizacaoResumo}
        />

        <View style={styles.submitWrapper}>
          <Button
            title={form.submitting ? 'Enviando...' : 'Enviar Ocorrência'}
            leftIcon={<Ionicons name="send-outline" size={18} color={theme.inverseText} />}
            size="lg"
            loading={form.submitting}
            onPress={() => form.submit((chamado) => setCreatedChamado(chamado))}
          />
        </View>
      </KeyboardScreenLayout>

      <NovoChamadoSuccessModal
        chamado={createdChamado}
        onViewChamado={(targetId) => {
          setCreatedChamado(null);
          navigation.replace('ChamadoDetails', { id: targetId });
        }}
        onGoToMeusChamados={() => {
          setCreatedChamado(null);
          navigation.navigate('MainTabs', { screen: 'MeusChamadosTab' });
        }}
      />
    </>
  );
};

const createStyles = (_theme: AppTheme) =>
  StyleSheet.create({
    submitWrapper: {
      marginTop: spacing.xs,
    },
  });
