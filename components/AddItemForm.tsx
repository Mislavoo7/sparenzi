import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedButton } from '@/components/ThemedButton';
import { t } from './helpers/translations';
import config from './helpers/config';
import { formStyles } from '@/components/styles/form_styles';

interface AddItemFormProps {
  price: string;
  productName: string;
  company: string;
  currency: string;
  onPriceChange: (price: string) => void;
  onProductNameChange: (productName: string) => void;
  onCompanyChange: (company: string) => void;
  onAddRow: () => void;
}

export const AddItemForm: React.FC<AddItemFormProps> = ({
  price,
  productName,
  company,
  currency,
  onPriceChange,
  onProductNameChange,
  onCompanyChange,
  onAddRow,
}) => {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <TextInput
          style={styles.inputEuro}
          onChangeText={onPriceChange}
          placeholder="0.00"
          placeholderTextColor="#aaa"
          value={price}
          keyboardType="numeric"
        />
        <ThemedText type="subtitle">{currency || global.currency}</ThemedText>
        <TextInput
          style={styles.inputProductName}
          onChangeText={onProductNameChange}
          placeholder={t("fields.product")}
          value={productName}
          placeholderTextColor="#aaa"
          keyboardType="default"
        />
        <TextInput
          style={styles.inputProductName}
          placeholder={t("fields.company")}
          onChangeText={onCompanyChange}
          value={company}
          placeholderTextColor="#aaa"
          keyboardType="default"
        />
      </ThemedView>
      <ThemedButton 
        onPress={onAddRow} 
        text={t("buttons.add_to_list")} 
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create(formStyles);
