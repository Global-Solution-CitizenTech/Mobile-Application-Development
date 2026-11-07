import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useChamados } from '../../hooks/useChamados';
import { useChamadoForm } from '../../hooks/useChamadoForm';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { FeedbackModal } from '../../components/FeedbackModal';
import { getPriorityConfig } from '../../components/ChamadoCard';
import { PhotoEvidencePicker } from './components/PhotoEvidencePicker';
import { CategoryGridSelector } from './components/CategoryGridSelector';
import { colors, borderRadius, spacing, fontSize, fontWeight, shadows } from '../../theme';
import { RootStackParamList } from '../../navigation/types';

type NovoChamadoNavProp = NativeStackNavigationProp<RootStackParamList>;

export const NovoChamadoScreen: React.FC = () => {
  const navigation = useNavigation<NovoChamadoNavProp>();
  const { criarChamado } = useChamados();

  const {
    titulo,
    setTitulo,
    categoria,
    setCategoria,
    descricao,
    setDescricao,
    fotoUrl,
    setFotoUrl,
    logradouro,
    setLogradouro,
    numero,
    setNumero,
    bairro,
    setBairro,
    cep,
    setCep,
    pontoReferencia,
    setPontoReferencia,
    errors,
    triagemPreview,
    preencherLocalizacaoSimulada,
    validate,
    buildLocalizacao,
  } = useChamadoForm();

  const [loading, setLoading] = useState(false);
  const [sucessoModal, setSucessoModal] = useState<{ visivel: boolean; protocolo: string }>({
    visivel: false,
    protocolo: '',
  });

  const prioStyle = getPriorityConfig(triagemPreview.prioridade);

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      const loc = buildLocalizacao();

      const novo = await criarChamado({
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        categoria,
        prioridade: triagemPreview.prioridade,
        parecerIa: triagemPreview.parecerIa,
        orgaoResponsavel: triagemPreview.orgaoResponsavel,
        localizacao: loc,
        fotoUrl,
      });

      setSucessoModal({ visivel: true, protocolo: novo.protocolo });
    } catch (err: any) {
      alert(err.message || 'Erro ao registrar chamado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Top Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color={colors.secondary[900]} />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>Novo Relato</Text>
              <Text style={styles.headerSubtitle}>Fotografe e descreva o problema urbano</Text>
            </View>
          </View>

          {/* 1. Foto da Ocorrência */}
          <PhotoEvidencePicker fotoUrl={fotoUrl} onSelectFoto={setFotoUrl} />

          {/* 2. Categoria */}
          <CategoryGridSelector categoria={categoria} onSelectCategoria={setCategoria} />

          {/* 3. Descrição e Triagem IA Compacta */}
          <View style={[styles.sectionCard, shadows.sm]}>
            <Text style={styles.sectionTitle}>Detalhes da Ocorrência *</Text>

            <Input
              label="Título Resumido *"
              placeholder="Ex: Buraco profundo na faixa direita"
              value={titulo}
              onChangeText={setTitulo}
              error={errors.titulo}
            />

            <Input
              label="Descrição *"
              placeholder="Descreva o problema ou risco observado no local..."
              value={descricao}
              onChangeText={setDescricao}
              multiline
              numberOfLines={3}
              style={styles.textArea}
              error={errors.descricao}
            />

            <View style={styles.aiCompactBanner}>
              <View style={styles.aiBannerTop}>
                <View style={styles.aiBadgeRow}>
                  <Ionicons name="sparkles" size={14} color={colors.primary[700]} />
                  <Text style={styles.aiBannerTitle}>Triagem IA:</Text>
                  <Text style={[styles.aiPriorityInline, { color: prioStyle.text }]}>
                    Urgência {triagemPreview.prioridade}
                  </Text>
                </View>
              </View>
              <Text style={styles.aiOrgaoText} numberOfLines={1}>
                Destino: {triagemPreview.orgaoResponsavel}
              </Text>
            </View>
          </View>

          {/* 4. Localização */}
          <View style={[styles.sectionCard, shadows.sm]}>
            <View style={styles.locationHeaderRow}>
              <Text style={styles.sectionTitle}>Localização *</Text>
              <TouchableOpacity
                style={styles.gpsSimulateBtn}
                onPress={preencherLocalizacaoSimulada}
                activeOpacity={0.7}
              >
                <Ionicons name="navigate" size={13} color={colors.primary[700]} />
                <Text style={styles.gpsSimulateText}>Usar GPS Atual</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.twoColumnRow}>
              <View style={{ flex: 1, marginRight: spacing.sm }}>
                <Input
                  label="Rua / Avenida *"
                  placeholder="Ex: Av. Paulista"
                  value={logradouro}
                  onChangeText={setLogradouro}
                  error={errors.logradouro}
                />
              </View>
              <View style={{ width: 115 }}>
                <Input
                  label="Nº *"
                  placeholder="1106"
                  value={numero}
                  onChangeText={setNumero}
                  error={errors.numero}
                  inputContainerStyle={{ paddingHorizontal: 10 }}
                />
              </View>
            </View>

            <View style={styles.twoColumnRow}>
              <View style={{ flex: 1, marginRight: spacing.xs }}>
                <Input
                  label="Bairro *"
                  placeholder="Ex: Bela Vista"
                  value={bairro}
                  onChangeText={setBairro}
                  error={errors.bairro}
                />
              </View>
              <View style={{ flex: 1, marginLeft: spacing.xs }}>
                <Input
                  label="CEP"
                  placeholder="00000-000"
                  value={cep}
                  onChangeText={setCep}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <Input
              label="Ponto de Referência"
              placeholder="Ex: Próximo à estação de metrô"
              value={pontoReferencia}
              onChangeText={setPontoReferencia}
            />
          </View>

          <Button
            title="Publicar Relato"
            variant="primary"
            size="lg"
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitButton}
            leftIcon={<Ionicons name="send" size={18} color={colors.surface} />}
          />
        </ScrollView>

        <FeedbackModal
          visible={sucessoModal.visivel}
          type="success"
          title="Relato Publicado!"
          message={`Sua solicitação foi classificada como Urgência ${triagemPreview.prioridade} pela Triagem IA.\n\nProtocolo: ${sucessoModal.protocolo}`}
          confirmText="Ver em Demandas"
          onConfirm={() => {
            setSucessoModal({ visivel: false, protocolo: '' });
            navigation.navigate('Main', { screen: 'RadarTab' });
          }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.extrabold,
    color: colors.secondary[900],
  },
  headerSubtitle: {
    fontSize: fontSize.caption,
    color: colors.secondary[500],
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.secondary[100],
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    color: colors.secondary[900],
    marginBottom: spacing.sm + 2,
  },
  textArea: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  aiCompactBanner: {
    backgroundColor: colors.secondary[50],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderWidth: 1,
    borderColor: colors.secondary[100],
    marginTop: 2,
  },
  aiBannerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aiBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  aiBannerTitle: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    color: colors.secondary[700],
  },
  aiPriorityInline: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.extrabold,
  },
  aiOrgaoText: {
    fontSize: fontSize.tiny,
    color: colors.secondary[500],
    marginTop: 2,
  },
  locationHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  gpsSimulateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
  },
  gpsSimulateText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    color: colors.primary[700],
  },
  twoColumnRow: {
    flexDirection: 'row',
  },
  submitButton: {
    marginTop: spacing.xs,
  },
});
