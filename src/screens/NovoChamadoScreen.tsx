import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useChamados } from '../hooks/useChamados';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { FeedbackModal } from '../components/FeedbackModal';
import { getCategoryIconName } from '../components/CategoryBadge';
import { getPriorityConfig } from '../components/ChamadoCard';
import { gerarTriagemIaAutomatica } from '../services/chamadoService';
import { colors, borderRadius, spacing, fontSize, fontWeight, shadows } from '../theme';
import { CategoriaChamado, Localizacao } from '../types';
import { RootStackParamList } from '../navigation/types';

type NovoChamadoNavProp = NativeStackNavigationProp<RootStackParamList>;

const CATEGORIAS_FORM: CategoriaChamado[] = [
  'Buraco na Rua',
  'Bueiro Entupido',
  'Iluminação Pública',
  'Entulho e Descarte Irregular',
  'Poda de Árvore',
  'Sinalização e Trânsito',
  'Vazamento de Água',
  'Outros',
];

// Imagens urbanas para simulação rápida de fotos pelo cidadão
const FOTOS_SIMULADAS = [
  {
    rotulo: 'Buraco',
    url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
  },
  {
    rotulo: 'Poste Apagado',
    url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
  },
  {
    rotulo: 'Bueiro',
    url: 'https://images.unsplash.com/photo-1584463699042-4541cb9154a4?auto=format&fit=crop&w=800&q=80',
  },
  {
    rotulo: 'Entulho',
    url: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
  },
  {
    rotulo: 'Árvore/Galho',
    url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
  },
];

export const NovoChamadoScreen: React.FC = () => {
  const navigation = useNavigation<NovoChamadoNavProp>();
  const { criarChamado } = useChamados();

  // Estados do formulário
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState<CategoriaChamado>('Buraco na Rua');
  const [descricao, setDescricao] = useState('');
  const [fotoUrl, setFotoUrl] = useState<string>(FOTOS_SIMULADAS[0].url);

  // Estados de localização
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('São Paulo');
  const [cep, setCep] = useState('');
  const [pontoReferencia, setPontoReferencia] = useState('');
  const [coordenadas, setCoordenadas] = useState<{ lat: number; lng: number }>({
    lat: -23.5629,
    lng: -46.6544,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sucessoModal, setSucessoModal] = useState<{ visivel: boolean; protocolo: string }>({
    visivel: false,
    protocolo: '',
  });

  // Prévia em tempo real da Triagem Inteligente IA (Visão Computacional + GenAI)
  const triagemPreview = useMemo(
    () => gerarTriagemIaAutomatica(categoria, titulo, descricao),
    [categoria, titulo, descricao]
  );
  const prioStyle = getPriorityConfig(triagemPreview.prioridade);

  const preencherLocalizacaoSimulada = () => {
    setLogradouro('Avenida Paulista');
    setNumero('1106');
    setBairro('Bela Vista');
    setCidade('São Paulo');
    setCep('01310-100');
    setPontoReferencia('Em frente ao Edifício FIESP e Metrô Trianon');
    setCoordenadas({ lat: -23.5629, lng: -46.6544 });
    setErrors((prev) => ({ ...prev, logradouro: '', numero: '', bairro: '' }));
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!titulo.trim()) {
      errs.titulo = 'Informe um título objetivo para a ocorrência';
    } else if (titulo.trim().length < 5) {
      errs.titulo = 'O título deve ter no mínimo 5 caracteres';
    }

    if (!descricao.trim()) {
      errs.descricao = 'Descreva a ocorrência com detalhes';
    } else if (descricao.trim().length < 10) {
      errs.descricao = 'Forneça ao menos 10 caracteres para ajudar a prefeitura';
    }

    if (!logradouro.trim()) {
      errs.logradouro = 'Informe a rua / logradouro';
    }

    if (!numero.trim()) {
      errs.numero = 'Informe o número ou aprox.';
    }

    if (!bairro.trim()) {
      errs.bairro = 'Informe o bairro';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      const loc: Localizacao = {
        logradouro: logradouro.trim(),
        numero: numero.trim(),
        bairro: bairro.trim(),
        cidade: cidade.trim() || 'São Paulo',
        cep: cep.trim() || '01310-100',
        pontoReferencia: pontoReferencia.trim(),
        latitude: coordenadas.lat,
        longitude: coordenadas.lng,
      };

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
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
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
              <Text style={styles.headerTitle}>Abrir Relato Urbano</Text>
              <Text style={styles.headerSubtitle}>Identifique um problema no seu bairro</Text>
            </View>
          </View>

          {/* Seção 1: Categoria */}
          <View style={[styles.sectionCard, shadows.sm]}>
            <Text style={styles.sectionTitle}>1. Categoria do Problema *</Text>
            <View style={styles.categoriesGrid}>
              {CATEGORIAS_FORM.map((cat) => {
                const isSelected = categoria === cat;
                const icon = getCategoryIconName(cat);
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.categoryOption, isSelected && styles.categoryOptionSelected]}
                    onPress={() => setCategoria(cat)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={icon}
                      size={18}
                      color={isSelected ? colors.surface : colors.primary[700]}
                    />
                    <Text
                      style={[
                        styles.categoryOptionText,
                        isSelected && styles.categoryOptionTextSelected,
                      ]}
                      numberOfLines={2}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Seção 2: Foto da Ocorrência */}
          <View style={[styles.sectionCard, shadows.sm]}>
            <Text style={styles.sectionTitle}>2. Foto da Ocorrência</Text>
            <Text style={styles.sectionDescription}>
              Tire ou selecione a foto do problema para análise visual:
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoPickerRow}>
              {FOTOS_SIMULADAS.map((item, idx) => {
                const isSelected = fotoUrl === item.url;
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.photoOption, isSelected && styles.photoOptionSelected]}
                    onPress={() => setFotoUrl(item.url)}
                  >
                    <Image source={{ uri: item.url }} style={styles.photoThumbnail} />
                    <Text style={styles.photoLabel}>{item.rotulo}</Text>
                    {isSelected && (
                      <View style={styles.checkBadge}>
                        <Ionicons name="checkmark" size={12} color={colors.surface} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {fotoUrl ? (
              <View style={styles.selectedPhotoPreview}>
                <Image source={{ uri: fotoUrl }} style={styles.previewImage} resizeMode="cover" />
              </View>
            ) : null}
          </View>

          {/* Seção 3: Dados Básicos */}
          <View style={[styles.sectionCard, shadows.sm]}>
            <Text style={styles.sectionTitle}>3. Descrição do Relato *</Text>

            <Input
              label="Título Resumido *"
              placeholder="Ex: Buraco profundo na faixa direita"
              value={titulo}
              onChangeText={(text) => {
                setTitulo(text);
                if (errors.titulo) setErrors((prev) => ({ ...prev, titulo: '' }));
              }}
              error={errors.titulo}
              leftIcon={
                <Ionicons name="create-outline" size={20} color={colors.secondary[400]} />
              }
            />

            <Input
              label="Detalhes e Riscos *"
              placeholder="Descreva o tamanho, risco de acidente ou alagamento..."
              value={descricao}
              onChangeText={(text) => {
                setDescricao(text);
                if (errors.descricao) setErrors((prev) => ({ ...prev, descricao: '' }));
              }}
              multiline
              numberOfLines={3}
              style={styles.textArea}
              error={errors.descricao}
            />

            {/* Card de Prévia da Triagem IA */}
            <View style={styles.aiPreviewBox}>
              <View style={styles.aiPreviewHeader}>
                <View style={styles.aiBadgeRow}>
                  <Ionicons name="sparkles" size={15} color={colors.primary[700]} />
                  <Text style={styles.aiPreviewTitle}>Triagem Automática IA</Text>
                </View>
                <View
                  style={[
                    styles.prioTag,
                    { backgroundColor: prioStyle.bg, borderColor: prioStyle.border },
                  ]}
                >
                  <Ionicons name={prioStyle.icon} size={11} color={prioStyle.text} />
                  <Text style={[styles.prioTagText, { color: prioStyle.text }]}>
                    Prioridade {triagemPreview.prioridade}
                  </Text>
                </View>
              </View>
              <Text style={styles.aiOrgaoText}>{triagemPreview.orgaoResponsavel}</Text>
              <Text style={styles.aiParecerText}>{triagemPreview.parecerIa}</Text>
            </View>
          </View>

          {/* Seção 4: Localização */}
          <View style={[styles.sectionCard, shadows.sm]}>
            <View style={styles.locationHeaderRow}>
              <Text style={styles.sectionTitle}>4. Localização *</Text>
              <TouchableOpacity
                style={styles.gpsSimulateBtn}
                onPress={preencherLocalizacaoSimulada}
                activeOpacity={0.7}
              >
                <Ionicons name="navigate" size={14} color={colors.primary[700]} />
                <Text style={styles.gpsSimulateText}>Usar GPS Atual (FIAP)</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.twoColumnRow}>
              <View style={{ flex: 3, marginRight: spacing.xs }}>
                <Input
                  label="Rua / Avenida *"
                  placeholder="Ex: Av. Paulista"
                  value={logradouro}
                  onChangeText={(text) => {
                    setLogradouro(text);
                    if (errors.logradouro) setErrors((prev) => ({ ...prev, logradouro: '' }));
                  }}
                  error={errors.logradouro}
                />
              </View>
              <View style={{ flex: 1, marginLeft: spacing.xs }}>
                <Input
                  label="Nº *"
                  placeholder="1106"
                  value={numero}
                  onChangeText={(text) => {
                    setNumero(text);
                    if (errors.numero) setErrors((prev) => ({ ...prev, numero: '' }));
                  }}
                  error={errors.numero}
                />
              </View>
            </View>

            <View style={styles.twoColumnRow}>
              <View style={{ flex: 1, marginRight: spacing.xs }}>
                <Input
                  label="Bairro *"
                  placeholder="Ex: Bela Vista"
                  value={bairro}
                  onChangeText={(text) => {
                    setBairro(text);
                    if (errors.bairro) setErrors((prev) => ({ ...prev, bairro: '' }));
                  }}
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

          {/* Botão de Envio */}
          <Button
            title="Publicar Relato no Bairro"
            variant="primary"
            size="lg"
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitButton}
            leftIcon={<Ionicons name="send" size={18} color={colors.surface} />}
          />
        </ScrollView>

        {/* Modal de Sucesso com Protocolo */}
        <FeedbackModal
          visible={sucessoModal.visivel}
          type="success"
          title="Relato Publicado!"
          message={`Sua solicitação foi classificada como Prioridade ${triagemPreview.prioridade} pela Triagem IA.\n\nProtocolo: ${sucessoModal.protocolo}\n\nMoradores do bairro já podem apoiar seu chamado!`}
          confirmText="Voltar ao Feed"
          onConfirm={() => {
            setSucessoModal({ visivel: false, protocolo: '' });
            navigation.navigate('Main', { screen: 'HomeTab' });
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
    fontWeight: fontWeight.bold,
    color: colors.secondary[900],
  },
  headerSubtitle: {
    fontSize: fontSize.caption,
    color: colors.secondary[500],
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.bold,
    color: colors.secondary[900],
    marginBottom: spacing.sm,
  },
  sectionDescription: {
    fontSize: fontSize.caption,
    color: colors.secondary[500],
    marginBottom: spacing.sm,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs + 2,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 4,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primary[50],
    borderWidth: 1,
    borderColor: colors.primary[200],
    marginBottom: spacing.xs,
  },
  categoryOptionSelected: {
    backgroundColor: colors.primary[600],
    borderColor: colors.primary[600],
  },
  categoryOptionText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    color: colors.primary[900],
  },
  categoryOptionTextSelected: {
    color: colors.surface,
    fontWeight: fontWeight.bold,
  },
  textArea: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  aiPreviewBox: {
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.sm,
    padding: spacing.sm + 2,
    borderWidth: 1,
    borderColor: colors.primary[200],
    marginTop: spacing.xs,
  },
  aiPreviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  aiBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  aiPreviewTitle: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    color: colors.primary[800],
  },
  prioTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  prioTagText: {
    fontSize: 10,
    fontWeight: fontWeight.bold,
  },
  aiOrgaoText: {
    fontSize: fontSize.tiny,
    fontWeight: fontWeight.bold,
    color: colors.secondary[700],
    marginBottom: 2,
  },
  aiParecerText: {
    fontSize: fontSize.tiny,
    color: colors.secondary[600],
    lineHeight: 16,
  },
  photoPickerRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  photoOption: {
    alignItems: 'center',
    marginRight: spacing.sm,
    position: 'relative',
  },
  photoOptionSelected: {
    transform: [{ scale: 1.03 }],
  },
  photoThumbnail: {
    width: 68,
    height: 68,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    borderColor: colors.border,
  },
  photoLabel: {
    fontSize: fontSize.tiny,
    color: colors.secondary[600],
    marginTop: 4,
  },
  checkBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.primary[600],
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedPhotoPreview: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginTop: spacing.xs,
  },
  previewImage: {
    width: '100%',
    height: 160,
    borderRadius: borderRadius.md,
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
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  gpsSimulateText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    color: colors.primary[700],
  },
  twoColumnRow: {
    flexDirection: 'row',
  },
  submitButton: {
    marginTop: spacing.sm,
  },
});
