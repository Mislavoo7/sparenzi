import React, { useState, useEffect } from 'react';
import { StyleSheet, ViewProps } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedButton } from '@/components/ThemedButton';
export type PaginationProps = ViewProps & {
  onPageChange?: (newPage: number) => void; // Changed from onPress to onPageChange for clarity
  page: number; 
  totalPages: number;
};

export function Pagination({ page, totalPages, onPageChange, ...otherProps }: PaginationProps) {
  const handleDecrease = () => {
    const newPage = page > 1 ? page - 1 : page;
    if (onPageChange && newPage !== page) {
      onPageChange(newPage);
    }
  };
  
  const handleIncrease = () => {
    const newPage = page < totalPages ? page + 1 : page;
    if (onPageChange && newPage !== page) {
      onPageChange(newPage);
    }
  };
  
  return (
    <ThemedView style={styles.container} {...otherProps}>
      <ThemedButton 
        onPress={handleDecrease} 
        text={"<"}
        style={{disabled: page <= 1}} 
        disabled={page <= 1} 
      />
      <ThemedText type={"default"} style={styles.pageText}>
        {page} / {totalPages}
      </ThemedText>
      <ThemedButton 
        onPress={handleIncrease} 
        style={{disabled: page >= totalPages}} 
        text={">"}
        disabled={page >= totalPages} 
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  pageText: {
    marginHorizontal: 15,
    minWidth: 50,
    textAlign: 'center',
  },
});

