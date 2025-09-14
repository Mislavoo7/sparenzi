import { useColorScheme as useSystemColorScheme } from 'react-native';
import { useState, useEffect } from 'react';

// Global theme change notifier
let themeChangeListeners: (() => void)[] = [];

export function notifyThemeChange() {
  themeChangeListeners.forEach(listener => listener());
}

export function useColorScheme() {
  const systemColorScheme = useSystemColorScheme();
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const listener = () => forceUpdate({});
    themeChangeListeners.push(listener);
    
    return () => {
      themeChangeListeners = themeChangeListeners.filter(l => l !== listener);
    };
  }, []);

  // Return global.theme if set, otherwise return system theme
  return global.theme || systemColorScheme;
}

// Helper function to set the global theme
export function setGlobalTheme(theme: 'light' | 'dark' | null) {
  global.theme = theme;
  notifyThemeChange();
}
