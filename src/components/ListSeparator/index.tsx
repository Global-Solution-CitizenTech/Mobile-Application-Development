import { View } from 'react-native';

export function ListSeparator({ height = 12 }: { height?: number }) {
  return <View style={{ height }} />;
}

export const ChamadoListSeparator = () => <ListSeparator height={12} />;
export const MessageListSeparator = () => <ListSeparator height={4} />;
