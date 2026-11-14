import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BaseModal } from '@/components/BaseModal';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { borderRadius, fontSize, fontWeight, spacing } from '@/theme';
import type { AppTheme, IoniconName } from '@/theme/types';
import type { SelectPickerOption } from '@/types/filters';

interface PickerTriggerButtonProps {
  icon?: IoniconName;
  label?: string;
  valueLabel: string;
  active?: boolean;
  onPress: () => void;
  fullWidth?: boolean;
}

export const PickerTriggerButton = ({
  icon,
  label,
  valueLabel,
  active = false,
  onPress,
  fullWidth = false,
}: PickerTriggerButtonProps) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <TouchableOpacity
      style={[
        styles.triggerBtn,
        active && styles.triggerBtnActive,
        fullWidth && styles.triggerBtnFull,
      ]}
      onPress={onPress}
      activeOpacity={0.78}
    >
      {icon ? (
        <Ionicons
          name={icon}
          size={15}
          color={active ? theme.primary : theme.textSecondary}
        />
      ) : null}
      <View style={fullWidth ? styles.triggerTextCol : styles.triggerTextInline}>
        {label ? (
          <Text style={styles.triggerLabel} numberOfLines={1}>
            {label}
          </Text>
        ) : null}
        <Text
          style={[styles.triggerValue, active && styles.triggerValueActive]}
          numberOfLines={1}
        >
          {valueLabel}
        </Text>
      </View>
      <Ionicons
        name="chevron-down"
        size={15}
        color={active ? theme.primary : theme.textMuted}
      />
    </TouchableOpacity>
  );
};

interface PickerTabItem {
  key: string;
  label: string;
}

interface SelectPickerModalProps<T extends string = string> {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  options: readonly SelectPickerOption<T>[];
  selectedValue: T | null;
  onSelect: (value: T) => void;
  tabs?: readonly PickerTabItem[];
  activeTab?: string;
  onChangeTab?: (tabKey: string) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  quickAction?: {
    label: string;
    onPress: () => void;
  };
}

export function SelectPickerModal<T extends string = string>({
  visible,
  onClose,
  title,
  subtitle,
  options,
  selectedValue,
  onSelect,
  tabs,
  activeTab,
  onChangeTab,
  searchable = false,
  searchPlaceholder = 'Filtrar opções...',
  emptyMessage = 'Nenhuma opção encontrada.',
  quickAction,
}: SelectPickerModalProps<T>) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [search, setSearch] = useState('');

  const query = search.trim().toLowerCase();
  const filteredOptions = !query
    ? options
    : options.filter(
        (opt) =>
          opt.label.toLowerCase().includes(query) ||
          (opt.subtitle && opt.subtitle.toLowerCase().includes(query))
      );

  const handleClose = () => {
    setSearch('');
    onClose();
  };

  const handlePick = (val: T) => {
    setSearch('');
    onSelect(val);
    onClose();
  };

  return (
    <BaseModal visible={visible} title={title} subtitle={subtitle} onClose={handleClose}>
      <View style={styles.modalBody}>
        {tabs && tabs.length > 0 && onChangeTab ? (
          <View style={styles.tabsRow}>
            {tabs.map((tab) => {
              const isSelected = tab.key === activeTab;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.tabPill, isSelected && styles.tabPillActive]}
                  onPress={() => {
                    setSearch('');
                    onChangeTab(tab.key);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.tabText, isSelected && styles.tabTextActive]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : null}

        {quickAction ? (
          <TouchableOpacity
            style={styles.quickActionBtn}
            onPress={() => {
              setSearch('');
              quickAction.onPress();
              onClose();
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="navigate-outline" size={16} color={theme.primary} />
            <Text style={styles.quickActionText}>{quickAction.label}</Text>
          </TouchableOpacity>
        ) : null}

        {searchable ? (
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={16} color={theme.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder={searchPlaceholder}
              placeholderTextColor={theme.textMuted}
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 ? (
              <TouchableOpacity onPress={() => setSearch('')} hitSlop={8}>
                <Ionicons name="close-circle" size={16} color={theme.textMuted} />
              </TouchableOpacity>
            ) : null}
          </View>
        ) : null}

        {filteredOptions.length === 0 ? (
          <Text style={styles.emptyText}>{emptyMessage}</Text>
        ) : (
          <View style={styles.optionsList}>
            {filteredOptions.map((option) => {
              const isSelected = option.value === selectedValue;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[styles.optionRow, isSelected && styles.optionRowActive]}
                  onPress={() => handlePick(option.value)}
                  activeOpacity={0.78}
                >
                  <View style={styles.optionTextCol}>
                    <Text
                      style={[styles.optionLabel, isSelected && styles.optionLabelActive]}
                      numberOfLines={2}
                    >
                      {option.label}
                    </Text>
                    {option.subtitle ? (
                      <Text style={styles.optionSubtitle} numberOfLines={1}>
                        {option.subtitle}
                      </Text>
                    ) : null}
                  </View>
                  <Ionicons
                    name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                    size={20}
                    color={isSelected ? theme.primary : theme.textMuted}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    </BaseModal>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    triggerBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: spacing.sm + 4,
      paddingVertical: spacing.xs + 3,
      borderRadius: borderRadius.md,
      backgroundColor: theme.cardSubtle,
      borderWidth: 1,
      borderColor: theme.border,
    },
    triggerBtnActive: {
      backgroundColor: theme.primaryLight,
      borderColor: theme.primaryBorder,
    },
    triggerBtnFull: {
      justifyContent: 'space-between',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm + 2,
      backgroundColor: theme.surface,
    },
    triggerTextInline: {
      flexShrink: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    triggerTextCol: {
      flex: 1,
      gap: 2,
    },
    triggerLabel: {
      fontSize: fontSize.tiny,
      color: theme.textMuted,
      fontWeight: fontWeight.semibold,
    },
    triggerValue: {
      fontSize: fontSize.caption,
      color: theme.text,
      fontWeight: fontWeight.semibold,
      flexShrink: 1,
    },
    triggerValueActive: {
      color: theme.primaryDark,
      fontWeight: fontWeight.bold,
    },
    modalBody: {
      gap: spacing.sm + 2,
    },
    tabsRow: {
      flexDirection: 'row',
      backgroundColor: theme.cardSubtle,
      borderRadius: borderRadius.md,
      padding: 4,
      gap: 4,
    },
    tabPill: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: spacing.xs + 3,
      borderRadius: borderRadius.sm,
    },
    tabPillActive: {
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
    },
    tabText: {
      fontSize: fontSize.caption,
      fontWeight: fontWeight.semibold,
      color: theme.textSecondary,
    },
    tabTextActive: {
      color: theme.primary,
      fontWeight: fontWeight.bold,
    },
    quickActionBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs + 2,
      backgroundColor: theme.primaryLight,
      borderWidth: 1,
      borderColor: theme.primaryBorder,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.sm + 4,
      paddingVertical: spacing.sm,
    },
    quickActionText: {
      fontSize: fontSize.bodySmall,
      fontWeight: fontWeight.bold,
      color: theme.primaryDark,
      flex: 1,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs + 2,
      backgroundColor: theme.inputBg,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.sm + 4,
      height: 40,
    },
    searchInput: {
      flex: 1,
      fontSize: fontSize.bodySmall,
      color: theme.text,
    },
    optionsList: {
      gap: spacing.xs + 2,
    },
    optionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.sm,
      paddingHorizontal: spacing.sm + 4,
      paddingVertical: spacing.sm + 2,
      borderRadius: borderRadius.md,
      backgroundColor: theme.cardSubtle,
      borderWidth: 1,
      borderColor: theme.border,
    },
    optionRowActive: {
      backgroundColor: theme.primaryLight,
      borderColor: theme.primaryBorder,
    },
    optionTextCol: {
      flex: 1,
      gap: 2,
    },
    optionLabel: {
      fontSize: fontSize.body,
      fontWeight: fontWeight.medium,
      color: theme.text,
    },
    optionLabelActive: {
      fontWeight: fontWeight.bold,
      color: theme.primaryDark,
    },
    optionSubtitle: {
      fontSize: fontSize.caption,
      color: theme.textSecondary,
    },
    emptyText: {
      textAlign: 'center',
      fontSize: fontSize.bodySmall,
      color: theme.textMuted,
      paddingVertical: spacing.lg,
    },
  });
