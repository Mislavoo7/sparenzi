import { View, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import useTheme from '@/components/styles/colors';

export type ThemedButtonProps = ViewProps & {
  onPress?: () => void;
  lightColor?: string;
  darkColor?: string;
  textType?: string;
  text?: string;
};

export function ThemedButton({text, textType, disabled, onPress, style, lightColor, darkColor, ...otherProps }: ThemedButtonProps) {
  const type = textType ? textType : "subtitle";
  let usedStlye = styles.button;

  if (style) {
    if (style.selected) {
      usedStlye = styles.selected
    } else if (style.disabled) {
      usedStlye = styles.disabled
    }
  }

  return(
    <View style={[
        useTheme("color"),
        useTheme("backgroundColor"),
      styles.container
    ]}>
      <TouchableOpacity
       style={[
        useTheme("backgroundColor"),
        useTheme("borderColor"),
        usedStlye
       ]}
       onPress={onPress}
       >
        <ThemedText type={type}> {text} </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 8,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
  },
  disabled: {
    padding: 4,
    width: '100%',
    minHeight: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    opacity: 0.2,
  },
  selected: {
    padding: 4,
    width: '100%',
    minHeight: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: '#0a7ea4', 
  },
  button: {
    padding: 4,
    width: '100%',
    minHeight: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
  },
  buttonText: {
    fontWeight: 'bold',
  },
});

