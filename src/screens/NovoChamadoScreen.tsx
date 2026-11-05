import React, { useState } from 'react';
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
            <Text style={styles.headerTitle}>Novo Chamado</Text>
            <Text style={styles.headerSubtitle}>Zeladoria Urbana Colaborativa</Text>
          </View>
        </View>

        {/* Seção 1: Categoria */}
        <View style={[styles.sectionCard, shadows.sm]}>
          <Text style={styles.sectionTitle}>1. Escolha a Categoria do Problema *</Text>
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
                    size={20}
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

        {/* Seção 2: Dados Básicos */}
        <View style={[styles.sectionCard, shadows.sm]}>
          <Text style={styles.sectionTitle}>2. Detalhes da Ocorrência *</Text>

          <Input
            label="Título do Chamado *"
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
            label="Descrição Detalhada *"
            placeholder="Descreva o tamanho, impacto no trânsito ou pedestres e riscos..."
            value={descricao}
            onChangeText={(text) => {
              setDescricao(text);
              if (errors.descricao) setErrors((prev) => ({ ...prev, descricao: '' }));
            }}
            multiline
            numberOfLines={4}
            style={styles.textArea}
            error={errors.descricao}
          />
        </View>

        {/* Seção 3: Foto da Ocorrência (Simulação) */}
        <View style={[styles.sectionCard, shadows.sm]}>
          <Text style={styles.sectionTitle}>3. Evidência Visual (Foto do Problema)</Text>
          <Text style={styles.sectionDescription}>
            Selecione uma foto simulada representativa do problema urbano:
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

          {fotoUrl && (
            <View style={styles.selectedPhotoPreview}>
              <Image source={{ uri: fotoUrl }} style={styles.previewImage} resizeMode="cover" />
              <TouchableOpacity
                style={styles.removePhotoButton}
                onPress={() => setFotoUrl('')}
              >
                <Ionicons name="trash-outline" size={16} color={colors.surface} />
                <Text style={styles.removePhotoText}>Remover Foto</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Seção 4: Localização */}
        <View style={[styles.sectionCard, shadows.sm]}>
          <View style={styles.locationHeaderRow}>
            <Text style={styles.sectionTitle}>4. Localização do Problema *</Text>
            <TouchableOpacity
              style={styles.gpsSimulateBtn}
              onPress={preencherLocalizacaoSimulada}
              activeOpacity={0.7}
            >
              <Ionicons name="navigate" size={14} color={colors.primary[700]} />
              <Text style={styles.gpsSimulateText}>Usar Minha Localização (FIAP)</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.twoColumnRow}>
            <View style={{ flex: 3, marginRight: spacing.xs }}>
              <Input
                label="Logradouro / Rua / Avenida *"
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
                label="Número *"
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
            placeholder="Ex: Em frente à farmácia ou próximo ao semáforo"
            value={pontoReferencia}
            onChangeText={setPontoReferencia}
          />
        </View>

        {/* Botão de Envio */}
        <Button
          title="Registrar Ocorrência de Zeladoria"
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
        title="Chamado Registrado!"
        message={`Sua solicitação de zeladoria foi encaminhada com sucesso.\n\nProtocolo: ${sucessoModal.protocolo}\n\nAcompanhe as atualizações e o status de resolução no seu feed.`}
        confirmText="Ver Chamados"
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
    minHeight: 80,
    textAlignVertical: 'top',
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
    transform: [{ scale: 1.05 }],
  },
  photoThumbnail: {
    width: 72,
    height: 72,
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
    position: 'relative',
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginTop: spacing.xs,
  },
  previewImage: {
    width: '100%',
    height: 180,
    borderRadius: borderRadius.md,
  },
  removePhotoButton: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(239, 68, 68, 0.85)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  removePhotoText: {
    color: colors.surface,
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
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

