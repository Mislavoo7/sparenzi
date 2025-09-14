import React from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet } from 'react-native';

export default function WebScreen() {
  return (
    <WebView
      source={{ uri: 'https://sparenzi.eu' }}
      style={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
