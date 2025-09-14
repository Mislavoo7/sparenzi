import { View, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedDestroyButtonProps = ViewProps & {
  onPress?: () => void;
  lightColor?: string;
  darkColor?: string;
  text?: string;
};

export function ThemedDestroyButton({text, disabled, onPress, style, lightColor, darkColor, ...otherProps }: ThemedDestroyButtonProps) {
  return(
      <TouchableOpacity
        style={ disabled ? styles.disabled : styles.button}
        onPress={onPress}
        hitSlop={8}
        >
        <ThemedText type={"defaultSemiBold"}> X </ThemedText>
      </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

