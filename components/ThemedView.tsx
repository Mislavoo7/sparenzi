import { View, type ViewProps } from 'react-native';
import useTheme from '@/components/styles/colors';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {


  return <View style={[
    useTheme("backgroundColor"), 
    style]} {...otherProps} />;
}
