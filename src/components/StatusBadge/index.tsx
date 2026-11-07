import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { StatusChamado } from '../../types';
import { colors, borderRadius, fontSize, fontWeight } from '../../theme';

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
          dot: colors.status.aberto.icon,
        };
      case 'Em Andamento':
        return {
          bg: colors.status.emAndamento.bg,
          text: colors.status.emAndamento.text,
          dot: colors.status.emAndamento.icon,
        };
      case 'Resolvido':
      default:
        return {
          bg: colors.status.resolvido.bg,
          text: colors.status.resolvido.text,
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
          paddingVertical: isSmall ? 3 : 5,
          paddingHorizontal: isSmall ? 8 : 10,
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
            fontSize: isSmall ? 11 : fontSize.caption,
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
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  text: {
    fontWeight: fontWeight.semibold,
  },
});
