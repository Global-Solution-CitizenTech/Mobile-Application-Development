import { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BaseModal } from '@/components/BaseModal';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { borderRadius, spacing } from '@/theme/spacing';
import { fontSize, fontWeight } from '@/theme/typography';
import type { AppTheme } from '@/types/theme';
import type { SelectPickerModalProps } from '@/types/ui';

export function SelectPickerModal<
  T extends string = string,
  TabKey extends string = string,
>({
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
}: SelectPickerModalProps<T, TabKey>) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [search, setSearch] = useState('');
  const [prevVisible, setPrevVisible] = useState(visible);

  if (visible !== prevVisible) {
    setPrevVisible(visible);
    if (!visible) {
      setSearch('');
    }
  }

  const query = search.trim().toLowerCase();
  const filteredOptions = !query
    ? options
    : options.filter(
        (opt) =>
          opt.label.toLowerCase().includes(query) ||
          (opt.subtitle && opt.subtitle.toLowerCase().includes(query)),
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
    <BaseModal visible={visible} title={title} subtitle={subtitle} onClose={handleClose} scrollable={false}>
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
          <FlatList
            data={filteredOptions}
            keyExtractor={(item) => item.value}
            style={styles.optionsFlatList}
            contentContainerStyle={styles.optionsList}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const isSelected = item.value === selectedValue;
              return (
                <TouchableOpacity
                  style={[styles.optionRow, isSelected && styles.optionRowActive]}
                  onPress={() => handlePick(item.value)}
                  activeOpacity={0.78}
                >
                  <View style={styles.optionTextCol}>
                    <Text
                      style={[styles.optionLabel, isSelected && styles.optionLabelActive]}
                      numberOfLines={2}
                    >
                      {item.label}
                    </Text>
                    {item.subtitle ? (
                      <Text style={styles.optionSubtitle} numberOfLines={1}>
                        {item.subtitle}
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
            }}
          />
        )}
      </View>
    </BaseModal>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    modalBody: {
      gap: spacing.sm + 2,
      flexShrink: 1,
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
    optionsFlatList: {
      flexGrow: 0,
      flexShrink: 1,
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
