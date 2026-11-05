import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useChamados } from '../hooks/useChamados';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { FeedbackModal } from '../components/FeedbackModal';
import { getCategoryIconName } from '../components/CategoryBadge';
import { colors, borderRadius, spacing, fontSize, fontWeight, shadows } from '../theme';
import { CategoriaChamado } from '../types';
import { RootStackParamList } from '../navigation/types';

type EditarChamadoRouteProp = RouteProp<RootStackParamList, 'EditarChamado'>;
type EditarChamadoNavProp = NativeStackNavigationProp<RootStackParamList>;

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

export const EditarChamadoScreen: React.FC = () => {
  const route = useRoute<EditarChamadoRouteProp>();
  const navigation = useNavigation<EditarChamadoNavProp>();
  const { id } = route.params;

  const { obterChamadoPorId, atualizarChamado } = useChamados();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Campos
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState<CategoriaChamado>('Buraco na Rua');
  const [descricao, setDescricao] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [pontoReferencia, setPontoReferencia] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successModal, setSuccessModal] = useState(false);

  useEffect(() => {
    async function carregar() {
      try {
        setLoading(true);
        const data = await obterChamadoPorId(id);
        setTitulo(data.titulo);
        setCategoria(data.categoria);
        setDescricao(data.descricao);
        setLogradouro(data.localizacao.logradouro);
        setNumero(data.localizacao.numero);
        setBairro(data.localizacao.bairro);
        setPontoReferencia(data.localizacao.pontoReferencia || '');
      } catch (err: any) {
        alert(err.message || 'Erro ao carregar chamado para edição.');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, [id, obterChamadoPorId, navigation]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!titulo.trim()) errs.titulo = 'Informe o título';
    if (!descricao.trim()) errs.descricao = 'Informe a descrição';
    if (!logradouro.trim()) errs.logradouro = 'Informe o logradouro';
    if (!numero.trim()) errs.numero = 'Informe o número';
    if (!bairro.trim()) errs.bairro = 'Informe o bairro';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSalvar = async () => {
    if (!validate()) return;
    try {
      setSaving(true);
      await atualizarChamado(id, {
        titulo: titulo.trim(),
        categoria,
        descricao: descricao.trim(),
        localizacao: {
          logradouro: logradouro.trim(),
          numero: numero.trim(),
          bairro: bairro.trim(),
          cidade: 'São Paulo',
          cep: '01310-100',
          pontoReferencia: pontoReferencia.trim(),
          latitude: -23.5629,
          longitude: -46.6544,
        },
      });
      setSuccessModal(true);
    } catch (err: any) {
      alert(err.message || 'Falha ao salvar alterações.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary[600]} />
        <Text style={styles.loadingText}>Carregando dados da ocorrência...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color={colors.secondary[900]} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Editar Chamado</Text>
            <Text style={styles.headerSubtitle}>Atualizar informações da ocorrência</Text>
          </View>
        </View>

        {/* Categoria */}
        <View style={[styles.sectionCard, shadows.sm]}>
          <Text style={styles.sectionTitle}>Categoria da Ocorrência</Text>
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
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Informações Básicas */}
        <View style={[styles.sectionCard, shadows.sm]}>
          <Text style={styles.sectionTitle}>Dados da Ocorrência</Text>
          <Input
            label="Título *"
            value={titulo}
            onChangeText={(text) => {
              setTitulo(text);
              if (errors.titulo) setErrors((prev) => ({ ...prev, titulo: '' }));
            }}
            error={errors.titulo}
          />

          <Input
            label="Descrição *"
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

        {/* Endereço */}
        <View style={[styles.sectionCard, shadows.sm]}>
          <Text style={styles.sectionTitle}>Localização</Text>
          <View style={styles.twoColumnRow}>
            <View style={{ flex: 3, marginRight: spacing.xs }}>
              <Input
                label="Logradouro *"
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
                value={numero}
                onChangeText={(text) => {
                  setNumero(text);
                  if (errors.numero) setErrors((prev) => ({ ...prev, numero: '' }));
                }}
                error={errors.numero}
              />
            </View>
          </View>

          <Input
            label="Bairro *"
            value={bairro}
            onChangeText={(text) => {
              setBairro(text);
              if (errors.bairro) setErrors((prev) => ({ ...prev, bairro: '' }));
            }}
            error={errors.bairro}
          />

          <Input
            label="Ponto de Referência"
            value={pontoReferencia}
            onChangeText={setPontoReferencia}
          />
        </View>

        <Button
          title="Salvar Alterações"
          variant="primary"
          size="lg"
          onPress={handleSalvar}
          loading={saving}
          leftIcon={<Ionicons name="save-outline" size={20} color={colors.surface} />}
        />
      </ScrollView>

      <FeedbackModal
        visible={successModal}
        type="success"
        title="Chamado Atualizado!"
        message="As informações da ocorrência foram atualizadas com sucesso no sistema de zeladoria."
        confirmText="Concluir"
        onConfirm={() => {
          setSuccessModal(false);
          navigation.goBack();
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: fontSize.body,
    color: colors.secondary[500],
    marginTop: spacing.md,
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
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs + 2,
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
  twoColumnRow: {
    flexDirection: 'row',
  },
});

