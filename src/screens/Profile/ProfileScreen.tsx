import { RefreshControl, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { FeedbackModal } from '@/components/FeedbackModal';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { useProfileData } from '@/hooks/useProfileData';
import type { ProfileTabNavigationProp } from '@/navigation/types';
import { EditProfileModal } from '@/screens/Profile/components/EditProfileModal';
import { ProfileStatsCard } from '@/screens/Profile/components/ProfileStatsCard';
import { ProfileUserCard } from '@/screens/Profile/components/ProfileUserCard';
import { borderRadius, fontSize, fontWeight, spacing } from '@/theme';
import type { AppTheme } from '@/theme/types';

export const ProfileScreen = () => {
  const navigation = useNavigation<ProfileTabNavigationProp>();
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();

  const {
    usuario,
    userStats,
    statsLoading,
    isDark,
    toggleTheme,
    form,
    editModalVisible,
    setEditModalVisible,
    logoutModalVisible,
    setLogoutModalVisible,
    saving,
    refreshing,
    errorModal,
    clearErrorModal,
    successMessage,
    clearSuccessMessage,
    openEditModal,
    handleRefreshProfile,
    handleSaveProfile,
    signOut,
  } = useProfileData();

  if (!usuario) return null;

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

      <View style={styles.sectionCard}>
        <TouchableOpacity style={styles.menuRow} onPress={openEditModal} activeOpacity={0.75}>
          <View style={styles.menuLeft}>
            <Ionicons name="create-outline" size={20} color={theme.primary} />
            <Text style={styles.menuText}>Editar Meus Dados</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
        </TouchableOpacity>

        <View style={styles.divider} />

        <View style={styles.menuRow}>
          <View style={styles.menuLeft}>
            <Ionicons name={isDark ? 'moon' : 'sunny-outline'} size={20} color={theme.primary} />
            <Text style={styles.menuText}>Modo Escuro</Text>
          </View>
          <Switch value={isDark} onValueChange={toggleTheme} trackColor={{ true: theme.primary }} />
        </View>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.menuRow} onPress={() => navigation.navigate('ZelaBotTab')} activeOpacity={0.75}>
          <View style={styles.menuLeft}>
            <Ionicons name="sparkles-outline" size={20} color={theme.primary} />
            <Text style={styles.menuText}>ZelaBot IA</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.menuRow} onPress={() => navigation.navigate('SobreApp')} activeOpacity={0.75}>
          <View style={styles.menuLeft}>
            <Ionicons name="information-circle-outline" size={20} color={theme.primary} />
            <Text style={styles.menuText}>Sobre o Aplicativo</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
        </TouchableOpacity>
      </View>

      <Button
        title="Sair da Conta"
        variant="danger"
        leftIcon={<Ionicons name="log-out-outline" size={18} color={theme.inverseText} />}
        onPress={() => setLogoutModalVisible(true)}
      />

      <EditProfileModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        values={form.values}
        errors={form.errors}
        onChangeField={form.setFieldValue}
        onSave={handleSaveProfile}
        saving={saving}
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

      <FeedbackModal visible={Boolean(errorModal)} type="error" title="Ops!" message={errorModal ?? ''} onConfirm={clearErrorModal} />
      <FeedbackModal visible={Boolean(successMessage)} type="success" title="Perfil Atualizado" message={successMessage ?? ''} onConfirm={clearSuccessMessage} />
    </ScrollView>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    content: { paddingBottom: spacing.xxl, gap: spacing.md },
    screenTitle: { fontSize: fontSize.heading, fontWeight: fontWeight.extrabold, color: theme.text },
    sectionCard: {
      backgroundColor: theme.surface,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.border,
      overflow: 'hidden',
    },
    menuRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.md },
    menuLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm + 4 },
    menuText: { fontSize: fontSize.body, fontWeight: fontWeight.semibold, color: theme.text },
    divider: { height: 1, backgroundColor: theme.border },
  });
