import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button } from '../../components/Button';
import { colors, borderRadius, spacing, fontSize, fontWeight, shadows } from '../../theme';
import { AuthStackParamList } from '../../navigation/types';

type WelcomeNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;

const PILARES = [
  {
    icon: 'camera-outline' as const,
    titulo: 'Relato Fotográfico Rápido',
    descricao: 'Registre buracos, bueiros ou postes apagados com localização GPS automática.',
  },
  {
    icon: 'sparkles-outline' as const,
    titulo: 'Triagem Inteligente com IA',
    descricao: 'Classificação automática de severidade e encaminhamento para o órgão competente.',
  },
  {
    icon: 'people-outline' as const,
    titulo: 'Priorização Comunitária',
    descricao: 'Apoie demandas dos seus vizinhos para elevar o ranking de urgência do bairro.',
  },
];

export const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<WelcomeNavigationProp>();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Tag ODS 11 */}
        <View style={styles.odsPill}>
          <Ionicons name="globe-outline" size={14} color={colors.primary[700]} />
          <Text style={styles.odsPillText}>ONU ODS 11 • Cidades Sustentáveis</Text>
        </View>

        {/* Marca Principal */}
        <View style={styles.heroBlock}>
          <View style={styles.logoCircle}>
            <Ionicons name="leaf" size={44} color={colors.surface} />
          </View>
          <Text style={styles.brandName}>ZelaFix</Text>
          <Text style={styles.headline}>
            Zeladoria colaborativa para transformar o seu bairro
          </Text>
          <Text style={styles.subheadline}>
            Identifique, priorize em comunidade e acompanhe a resolução de problemas nos espaços
            públicos da sua cidade.
          </Text>
        </View>

        {/* Pilares da Plataforma */}
        <View style={[styles.featuresCard, shadows.sm]}>
          {PILARES.map((pilar, idx) => (
            <View
              key={pilar.titulo}
              style={[
                styles.featureRow,
                idx === PILARES.length - 1 && { borderBottomWidth: 0, paddingBottom: 0 },
              ]}
            >
              <View style={styles.featureIconBox}>
                <Ionicons name={pilar.icon} size={20} color={colors.primary[600]} />
              </View>
              <View style={styles.featureTextContent}>
                <Text style={styles.featureTitle}>{pilar.titulo}</Text>
                <Text style={styles.featureDesc}>{pilar.descricao}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Ações de Acesso */}
        <View style={styles.actionsBlock}>
          <Button
            title="Entrar na Plataforma"
            variant="primary"
            size="lg"
            onPress={() => navigation.navigate('Login')}
            rightIcon={<Ionicons name="arrow-forward" size={18} color={colors.surface} />}
          />

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => navigation.navigate('Register')}
            activeOpacity={0.75}
          >
            <Text style={styles.secondaryBtnText}>Criar nova conta de cidadão</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  odsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 6,
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.primary[100],
  },
  odsPillText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    color: colors.primary[700],
  },
  heroBlock: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    ...shadows.md,
  },
  brandName: {
    fontSize: fontSize.display,
    fontWeight: fontWeight.extrabold,
    color: colors.secondary[900],
    letterSpacing: -0.5,
  },
  headline: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
    color: colors.secondary[800],
    textAlign: 'center',
    marginTop: spacing.xs,
    lineHeight: 26,
  },
  subheadline: {
    fontSize: fontSize.bodySmall,
    color: colors.secondary[500],
    textAlign: 'center',
    lineHeight: 20,
    marginTop: spacing.xs + 2,
    paddingHorizontal: spacing.xs,
  },
  featuresCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.secondary[100],
    marginBottom: spacing.xl,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingBottom: spacing.md,
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary[100],
  },
  featureIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTextContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    color: colors.secondary[900],
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: fontSize.caption,
    color: colors.secondary[500],
    lineHeight: 17,
  },
  actionsBlock: {
    gap: spacing.sm + 2,
  },
  secondaryBtn: {
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.secondary[200],
    backgroundColor: colors.surface,
  },
  secondaryBtnText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    color: colors.secondary[800],
  },
});
