import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { PILARES } from '@/config/sobreAppData';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { borderRadius, spacing } from '@/theme/spacing';
import { fontSize, fontWeight } from '@/theme/typography';
import type { AuthStackNavigationProp } from '@/types/navigation';
import type { AppTheme } from '@/types/theme';
import { shadows } from '@/utils/shadow';

export const WelcomeScreen = () => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<AuthStackNavigationProp<'Welcome'>>();

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(insets.top, spacing.xl),
            paddingBottom: Math.max(insets.bottom, spacing.xl),
            paddingLeft: Math.max(insets.left, spacing.lg),
            paddingRight: Math.max(insets.right, spacing.lg),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.odsPill}>
          <Ionicons name="globe-outline" size={14} color={theme.primaryDark} />
          <Text style={styles.odsPillText}>ONU ODS 11 • Cidades Sustentáveis</Text>
        </View>

        <View style={styles.heroBlock}>
          <View style={styles.logoCircle}>
            <Image
              source={require('../../../assets/logo-mark.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
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

        <View style={[styles.featuresCard, shadows.sm]}>
          {PILARES.map((pilar, idx) => (
            <View
              key={pilar.titulo}
              style={[
                styles.featureRow,
                idx === PILARES.length - 1 && styles.lastFeatureRow,
              ]}
            >
              <View style={styles.featureIconBox}>
                <Ionicons name={pilar.icon} size={20} color={theme.primary} />
              </View>
              <View style={styles.featureTextContent}>
                <Text style={styles.featureTitle}>{pilar.titulo}</Text>
                <Text style={styles.featureDesc}>{pilar.descricao}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.actionsBlock}>
          <Button
            title="Entrar na Plataforma"
            variant="primary"
            size="lg"
            onPress={() => navigation.navigate('Login')}
            rightIcon={<Ionicons name="arrow-forward" size={18} color={theme.inverseText} />}
          />

          <Button
            title="Criar nova conta de cidadão"
            variant="outline"
            size="lg"
            onPress={() => navigation.navigate('Register')}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'space-between',
    },
    odsPill: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'center',
      gap: 6,
      backgroundColor: theme.primaryLight,
      paddingHorizontal: spacing.md,
      paddingVertical: 6,
      borderRadius: borderRadius.full,
      borderWidth: 1,
      borderColor: theme.primaryBorder,
    },
    odsPillText: {
      fontSize: fontSize.caption,
      fontWeight: fontWeight.semibold,
      color: theme.primaryDark,
    },
    heroBlock: {
      alignItems: 'center',
      marginVertical: spacing.lg,
    },
    logoCircle: {
      width: 80,
      height: 80,
      borderRadius: 24,
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
      ...shadows.md,
    },
    logoImage: {
      width: 36,
      height: 55,
    },
    brandName: {
      fontSize: fontSize.display,
      fontWeight: fontWeight.extrabold,
      color: theme.text,
      letterSpacing: -0.5,
    },
    headline: {
      fontSize: fontSize.title,
      fontWeight: fontWeight.bold,
      color: theme.text,
      textAlign: 'center',
      marginTop: spacing.xs,
      lineHeight: 26,
    },
    subheadline: {
      fontSize: fontSize.bodySmall,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
      marginTop: spacing.xs + 2,
      paddingHorizontal: spacing.xs,
    },
    featuresCard: {
      backgroundColor: theme.card,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: theme.cardBorder,
      marginBottom: spacing.xl,
    },
    featureRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.md,
      paddingBottom: spacing.md,
      marginBottom: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.divider,
    },
    lastFeatureRow: {
      borderBottomWidth: 0,
      paddingBottom: 0,
      marginBottom: 0,
    },
    featureIconBox: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: theme.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    featureTextContent: {
      flex: 1,
    },
    featureTitle: {
      fontSize: fontSize.body,
      fontWeight: fontWeight.bold,
      color: theme.text,
      marginBottom: 2,
    },
    featureDesc: {
      fontSize: fontSize.caption,
      color: theme.textSecondary,
      lineHeight: 17,
    },
    actionsBlock: {
      gap: spacing.sm + 2,
    },
  });
