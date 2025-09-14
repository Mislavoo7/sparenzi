import { StyleSheet, ViewProps} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedDestroyButton } from '@/components/ThemedDestroyButton';
import { ThemedView } from '@/components/ThemedView';

export type PriceItemProps = ViewProps & {
  id: number;
  price: number;
  productName: string;
  company: string;
  currency: string;
  lightColor?: string;
  darkColor?: string;
  onDelete?: (id: number) => void;
};

export function PriceItem({
  onDelete,
  id,
  price,
  productName,
  company,
  currency,
  style,
  lightColor,
  darkColor,
  ...otherProps
}: PriceItemProps) {
  return (
    <ThemedView style={[styles.container, style]} {...otherProps}>
      <ThemedView style={styles.column}>
        <ThemedText> {`${price} ${currency}`} </ThemedText>
      </ThemedView>
      <ThemedView style={styles.column}>
        <ThemedText > {`${productName}`} </ThemedText>
      </ThemedView>
      <ThemedView style={styles.column}>
        <ThemedText> {`${company}`} </ThemedText>
      </ThemedView>
      <ThemedView style={styles.column}>
      { onDelete ? (
         <ThemedDestroyButton onPress={() => onDelete?.(id)} />
      ) : (null)}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  column: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
