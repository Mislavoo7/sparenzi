import { View, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import useTheme from '@/components/styles/colors';

export type ThemedListButtonProps = ViewProps & {
  onPress?: () => void;
  textType?: string;
  text?: string;
  textColor?: string;
};

export function ThemedListButton({text, textColor, textType, disabled, onPress, style, ...otherProps }: ThemedListButtonProps) {
  const type = textType ? textType : "subtitle";
  const color = useTheme("color");
  const borderColor = useTheme("borderColor");



  return(
    <TouchableOpacity 
      style={{...styles.button, ...borderColor}} 
      onPress={onPress}
    >
      <ThemedText type="default" style={{...styles.buttonText, ...color}}> {text} </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1.5,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

