import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { StatusChamado } from '../types';
import { colors, borderRadius, spacing, fontSize, fontWeight } from '../theme';

interface StatusBadgeProps {
  status: StatusChamado;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  style,
}) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'Aberto':
        return {
          bg: colors.status.aberto.bg,
          text: colors.status.aberto.text,
          border: colors.status.aberto.border,
          dot: colors.status.aberto.icon,
        };
      case 'Em Andamento':
        return {
          bg: colors.status.emAndamento.bg,
          text: colors.status.emAndamento.text,
          border: colors.status.emAndamento.border,
          dot: colors.status.emAndamento.icon,
        };
      case 'Resolvido':
      default:
        return {
          bg: colors.status.resolvido.bg,
          text: colors.status.resolvido.text,
          border: colors.status.resolvido.border,
          dot: colors.status.resolvido.icon,
        };
    }
  };

  const config = getBadgeConfig();
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.bg,
          borderColor: config.border,
          paddingVertical: isSmall ? 2 : spacing.xs,
          paddingHorizontal: isSmall ? spacing.xs + 2 : spacing.sm + 2,
        },
        style,
      ]}
    >
      <View style={[styles.dot, { backgroundColor: config.dot }]} />
      <Text
        style={[
          styles.text,
          {
            color: config.text,
            fontSize: isSmall ? fontSize.tiny : fontSize.caption,
          },
        ]}
      >
        {status}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  text: {
    fontWeight: fontWeight.bold,
    letterSpacing: 0.2,
  },
});

