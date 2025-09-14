import { View, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { formStyles } from '@/components/styles/form_styles';

export type ThemedSubmitButtonProps = ViewProps & {
  onPress?: () => void;
  lightColor?: string;
  darkColor?: string;
  textType?: string;
  text?: string;
  textWaiting?: string;
  loading?: boolean;
};

export function ThemedSubmitButton({text, textWaiting, loading,  textType, disabled, onPress, style, lightColor, darkColor, ...otherProps }: ThemedSubmitButtonProps) {
  const type = textType ? textType : "subtitle";

  return(
   <TouchableOpacity 
     style={[styles.loginButton, loading && styles.disabledButton]} 
     onPress={onPress}
     disabled={loading}
   >
     {loading ? (
       <ThemedView style={styles.loadingContainer}>
         <ActivityIndicator size="small" color="#FFFFFF" />
         <ThemedText style={styles.loadingText}>{textWaiting}</ThemedText>
       </ThemedView>
     ) : (
       <ThemedText style={styles.buttonText}>{text}</ThemedText>
     )}
   </TouchableOpacity>
  );
}

const styles = StyleSheet.create(formStyles);

