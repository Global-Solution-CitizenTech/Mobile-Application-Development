import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { FeedbackModal } from '@/components/FeedbackModal';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { useProfileData } from '@/hooks/useProfileData';
import { ProfileMenuCard } from '@/screens/Profile/components/ProfileMenuCard';
import { ProfileStatsCard } from '@/screens/Profile/components/ProfileStatsCard';
import { ProfileUserCard } from '@/screens/Profile/components/ProfileUserCard';
import { spacing } from '@/theme/spacing';
import { fontSize, fontWeight } from '@/theme/typography';
import type { ProfileTabNavigationProp } from '@/types/navigation';
import type { AppTheme } from '@/types/theme';

export const ProfileScreen = () => {
  const navigation = useNavigation<ProfileTabNavigationProp>();
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();

  const {
    usuario,
    userStats,
    statsLoading,
    themeMode,
    setThemeMode,
    logoutModalVisible,
    setLogoutModalVisible,
    refreshing,
    handleRefreshProfile,
    signOut,
  } = useProfileData();

  if (!usuario) {
    return (
      <View style={styles.fallbackContainer}>
        {statsLoading ? (
          <LoadingSpinner fullScreen message="Carregando perfil..." />
        ) : (
          <EmptyState
            icon="person-outline"
            title="Perfil indisponível"
            description="Não foi possível carregar os dados da sua conta no momento."
            actionTitle="Tentar novamente"
            onAction={() => {
              void handleRefreshProfile();
            }}
          />
        )}
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: Math.max(insets.top, spacing.md) + spacing.xs,
          paddingLeft: Math.max(insets.left, spacing.md),
          paddingRight: Math.max(insets.right, spacing.md),
        },
      ]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            void handleRefreshProfile();
          }}
          tintColor={theme.primary}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.screenTitle}>Meu Perfil</Text>

      <ProfileUserCard usuario={usuario} />

      <ProfileStatsCard
        total={userStats.total}
        emAndamento={userStats.emAndamento}
        concluidos={userStats.concluidos}
        apoiosRecebidos={userStats.apoiosRecebidos}
        loading={statsLoading}
        onPressVerChamados={() => navigation.navigate('MeusChamadosTab')}
      />

      <ProfileMenuCard
        themeMode={themeMode}
        onSelectThemeMode={setThemeMode}
        onPressEditarPerfil={() => navigation.navigate('EditarPerfil')}
        onPressZelaBot={() => navigation.navigate('ZelaBotTab')}
        onPressSobreApp={() => navigation.navigate('SobreApp')}
      />

      <Button
        title="Sair da Conta"
        variant="danger"
        leftIcon={<Ionicons name="log-out-outline" size={18} color={theme.inverseText} />}
        onPress={() => setLogoutModalVisible(true)}
      />

      <FeedbackModal
        visible={logoutModalVisible}
        type="warning"
        title="Sair da Conta?"
        message="Você precisará fazer login novamente para acompanhar e registrar chamados."
        confirmText="Sair"
        cancelText="Cancelar"
        onConfirm={() => {
          setLogoutModalVisible(false);
          void signOut();
        }}
        onCancel={() => setLogoutModalVisible(false)}
      />
    </ScrollView>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    fallbackContainer: {
      flex: 1,
      backgroundColor: theme.background,
      justifyContent: 'center',
    },
    content: {
      paddingBottom: spacing.xxxl,
      gap: spacing.lg - 4,
    },
    screenTitle: {
      fontSize: fontSize.heading,
      fontWeight: fontWeight.extrabold,
      color: theme.text,
    },
  });
