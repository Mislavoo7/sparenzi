import React from 'react';
import { FlatList, StyleSheet, ViewProps } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { PriceItem } from '@/components/PriceItem';
import useTheme from '@/components/styles/colors';

export type PriceListProps = ViewProps & {
  data: Array<{ id: string; price: number; productName: string; company: string }>;
  lightColor?: string;
  darkColor?: string;
};

export function PriceList({onDelete, data, style, lightColor, darkColor, currency = global.currency }: PriceListProps) {
  return (
    <ThemedView
style={[styles.container, useTheme("backgroundColor")]} >
      <FlatList
        data={data}
        renderItem={({ item }) => 
          <PriceItem 
            id={item.id} 
            price={item.price} 
            productName = {item.productName} 
            company={item.company} 
            currency={currency}
            onDelete={onDelete}
          />
        }
        keyExtractor={item => item.id}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
});
