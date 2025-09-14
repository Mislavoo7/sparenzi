import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { t } from './helpers/translations';
import { humanizePrice } from './helpers/humanizePrice';
import config from './helpers/config';

export type PriceListProps = ViewProps & {
  data: Array<{ id: string; price: number; productName: string; company: string ; currency: string}>;
  lightColor?: string;
  darkColor?: string;
};


export function TotalPrice({data, currency, style, lightColor, darkColor, ...otherProps }: TotalPriceProps) {
  return (
    <ThemedText style={styles.total}> {t("total")}: {humanizePrice(data, currency)} </ThemedText>
  );
}

const styles = StyleSheet.create({
  total: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0a7ea4',
  },
});
