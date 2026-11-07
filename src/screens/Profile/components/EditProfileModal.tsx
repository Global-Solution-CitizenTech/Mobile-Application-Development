import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { colors, borderRadius, spacing, fontSize, fontWeight, shadows } from '../../../theme';

interface EditProfileModalProps {
  visible: boolean;
  nome: string;
  email: string;
  telefone: string;
  bairro: string;
  alterarSenha: boolean;
  novaSenha: string;
  confirmarNovaSenha: string;
  editErrors: Record<string, string>;
  isSavingProfile: boolean;
  onNomeChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onTelefoneChange: (v: string) => void;
  onBairroChange: (v: string) => void;
  onToggleAlterarSenha: () => void;
  onNovaSenhaChange: (v: string) => void;
  onConfirmarNovaSenhaChange: (v: string) => void;
  onSave: () => void;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  nome,
  email,
  telefone,
  bairro,
  alterarSenha,
  novaSenha,
  confirmarNovaSenha,
  editErrors,
  isSavingProfile,
  onNomeChange,
  onEmailChange,
  onTelefoneChange,
  onBairroChange,
  onToggleAlterarSenha,
  onNovaSenhaChange,
  onConfirmarNovaSenhaChange,
  onSave,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.modalCard, shadows.lg]}>
          <View style={styles.modalHeaderRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.modalTitle}>Editar Dados Pessoais</Text>
              <Text style={styles.modalSubtitle}>Atualize seus dados cadastrais e senha</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.modalCloseBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close" size={24} color={colors.secondary[600]} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.modalScrollContent}
          >
            <Input
              label="Nome Completo *"
              value={nome}
              onChangeText={onNomeChange}
              error={editErrors.nome}
              leftIcon={<Ionicons name="person-outline" size={18} color={colors.secondary[400]} />}
            />

            <Input
              label="E-mail *"
              value={email}
              onChangeText={onEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"
              error={editErrors.email}
              leftIcon={<Ionicons name="mail-outline" size={18} color={colors.secondary[400]} />}
            />

            <Input
              label="Telefone *"
              value={telefone}
              onChangeText={onTelefoneChange}
              keyboardType="phone-pad"
              error={editErrors.telefone}
              leftIcon={<Ionicons name="call-outline" size={18} color={colors.secondary[400]} />}
            />

            <Input
              label="Bairro de Residência *"
              value={bairro}
              onChangeText={onBairroChange}
              error={editErrors.bairro}
              leftIcon={<Ionicons name="business-outline" size={18} color={colors.secondary[400]} />}
            />

            <TouchableOpacity
              style={styles.passwordToggleRow}
              onPress={onToggleAlterarSenha}
              activeOpacity={0.7}
            >
              <Ionicons
                name={alterarSenha ? 'checkbox' : 'square-outline'}
                size={22}
                color={alterarSenha ? colors.primary[600] : colors.secondary[400]}
              />
              <Text style={styles.passwordToggleText}>Desejo alterar minha senha de acesso</Text>
            </TouchableOpacity>

            {alterarSenha && (
              <View style={styles.passwordBox}>
                <Input
                  label="Nova Senha *"
                  placeholder="Mínimo 6 caracteres"
                  value={novaSenha}
                  onChangeText={onNovaSenhaChange}
                  isPassword
                  error={editErrors.novaSenha}
                  leftIcon={
                    <Ionicons name="lock-closed-outline" size={18} color={colors.secondary[400]} />
                  }
                />

                <Input
                  label="Confirmar Nova Senha *"
                  placeholder="Repita a nova senha"
                  value={confirmarNovaSenha}
                  onChangeText={onConfirmarNovaSenhaChange}
                  isPassword
                  error={editErrors.confirmarNovaSenha}
                  leftIcon={
                    <Ionicons
                      name="checkmark-done-outline"
                      size={18}
                      color={colors.secondary[400]}
                    />
                  }
                />
              </View>
            )}

            <View style={styles.modalButtonsRow}>
              <Button
                title="Cancelar"
                variant="ghost"
                onPress={onClose}
                style={{ flex: 1 }}
                disabled={isSavingProfile}
              />
              <Button
                title="Salvar"
                variant="primary"
                onPress={onSave}
                loading={isSavingProfile}
                style={{ flex: 1 }}
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
    maxHeight: '90%',
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
    color: colors.secondary[900],
  },
  modalSubtitle: {
    fontSize: fontSize.caption,
    color: colors.secondary[500],
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalScrollContent: {
    paddingBottom: spacing.xl,
  },
  passwordToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: spacing.sm,
    paddingVertical: spacing.xs,
  },
  passwordToggleText: {
    fontSize: fontSize.bodySmall,
    fontWeight: fontWeight.semibold,
    color: colors.secondary[800],
  },
  passwordBox: {
    backgroundColor: colors.secondary[50],
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
});
