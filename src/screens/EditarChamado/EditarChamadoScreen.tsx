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
import { useChamados } from '../../hooks/useChamados';
import { useChamadoForm } from '../../hooks/useChamadoForm';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { FeedbackModal } from '../../components/FeedbackModal';
import { CategoryGridSelector } from '../NovoChamado/components/CategoryGridSelector';
import { colors, borderRadius, spacing, fontSize, fontWeight, shadows } from '../../theme';
import { RootStackParamList } from '../../navigation/types';

type EditarChamadoRouteProp = RouteProp<RootStackParamList, 'EditarChamado'>;
type EditarChamadoNavProp = NativeStackNavigationProp<RootStackParamList>;

export const EditarChamadoScreen: React.FC = () => {
  const route = useRoute<EditarChamadoRouteProp>();
  const navigation = useNavigation<EditarChamadoNavProp>();
  const { id } = route.params;

  const { obterChamadoPorId, atualizarChamado } = useChamados();

  const {
    titulo,
    setTitulo,
    categoria,
    setCategoria,
    descricao,
    setDescricao,
    logradouro,
    setLogradouro,
    numero,
    setNumero,
    bairro,
    setBairro,
    pontoReferencia,
    setPontoReferencia,
    errors,
    validate,
    buildLocalizacao,
  } = useChamadoForm();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function carregar() {
      try {
        setLoading(true);
        const data = await obterChamadoPorId(id);
        if (isMounted) {
          setTitulo(data.titulo);
          setCategoria(data.categoria);
          setDescricao(data.descricao);
          setLogradouro(data.localizacao.logradouro);
          setNumero(data.localizacao.numero);
          setBairro(data.localizacao.bairro);
          setPontoReferencia(data.localizacao.pontoReferencia || '');
        }
      } catch (err: any) {
        if (isMounted) {
          alert(err.message || 'Erro ao carregar chamado para edição.');
          navigation.goBack();
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    carregar();
    return () => {
      isMounted = false;
    };
  }, [
    id,
    obterChamadoPorId,
    navigation,
    setTitulo,
    setCategoria,
    setDescricao,
    setLogradouro,
    setNumero,
    setBairro,
    setPontoReferencia,
  ]);

  const handleSalvar = async () => {
    if (!validate()) return;
    try {
      setSaving(true);
      await atualizarChamado(id, {
        titulo: titulo.trim(),
        categoria,
        descricao: descricao.trim(),
        localizacao: buildLocalizacao(),
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
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color={colors.secondary[900]} />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>Editar Relato</Text>
              <Text style={styles.headerSubtitle}>Atualizar informações da ocorrência</Text>
            </View>
          </View>

          <CategoryGridSelector
            categoria={categoria}
            onSelectCategoria={setCategoria}
            title="Categoria"
          />

          <View style={[styles.sectionCard, shadows.sm]}>
            <Text style={styles.sectionTitle}>Detalhes da Ocorrência</Text>
            <Input
              label="Título *"
              value={titulo}
              onChangeText={setTitulo}
              error={errors.titulo}
            />

            <Input
              label="Descrição *"
              value={descricao}
              onChangeText={setDescricao}
              multiline
              numberOfLines={4}
              style={styles.textArea}
              error={errors.descricao}
            />
          </View>

          <View style={[styles.sectionCard, shadows.sm]}>
            <Text style={styles.sectionTitle}>Localização</Text>
            <View style={styles.twoColumnRow}>
              <View style={{ flex: 1, marginRight: spacing.sm }}>
                <Input
                  label="Logradouro *"
                  value={logradouro}
                  onChangeText={setLogradouro}
                  error={errors.logradouro}
                />
              </View>
              <View style={{ width: 115 }}>
                <Input
                  label="Nº *"
                  value={numero}
                  onChangeText={setNumero}
                  error={errors.numero}
                  inputContainerStyle={{ paddingHorizontal: 10 }}
                />
              </View>
            </View>

            <Input
              label="Bairro *"
              value={bairro}
              onChangeText={setBairro}
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
            leftIcon={<Ionicons name="checkmark" size={20} color={colors.surface} />}
          />
        </ScrollView>

        <FeedbackModal
          visible={successModal}
          type="success"
          title="Relato Atualizado!"
          message="As informações da ocorrência foram atualizadas com sucesso."
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
    fontSize: fontSize.bodySmall,
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
    minHeight: 80,
    textAlignVertical: 'top',
  },
  twoColumnRow: {
    flexDirection: 'row',
  },
});
