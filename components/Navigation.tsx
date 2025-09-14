import { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedView } from '@/components/ThemedView';
import { ThemedButton } from '@/components/ThemedButton';
import { AuthContext } from '@/components/account/AuthContext';
import LoginComponent from '@/components/account/LoginComponent';
import RegisterComponent from '@/components/account/RegisterComponent';
import Settings from '@/components/Settings';
import { t } from '@/components/helpers/translations';

export type NavigationProps = {
  style?: any;
  lightColor?: string;
  darkColor?: string;
};

export function Navigation({ style, lightColor, darkColor, ...rest }: NavigationProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const backgroundColor = useThemeColor({ light: '#f8f9fa', dark: '#1a1a1a' }, 'background');
  const borderColor = useThemeColor({ light: '#e9ecef', dark: '#333' }, 'border');
  const { token, user, login, logout } = useContext(AuthContext);
  
  return (
    <ThemedView style={[styles.container, { backgroundColor, borderBottomColor: borderColor }, style]}>
      <ThemedView style={styles.navigationContent}>
        {token ? (
          <ThemedView style={styles.buttonRow}>
            <ThemedButton 
              onPress={() => router.push('/')}
              text={t("buttons.home")}
              style={styles.navButton}
            />
            <ThemedButton 
              onPress={() => router.push('/lists')}
              text={t("buttons.lists")}
              style={styles.navButton}
            />
            <Settings style={styles.settingsButton} />
          </ThemedView>
        ) : (
          <ThemedView style={styles.authButtonRow}>
            <LoginComponent 
              onLoginSuccess={async (token, user) => {
                await login(token, user);
              }}
              style={styles.authButton}
            />
            <RegisterComponent 
              onLoginSuccess={async (token, user) => {
                await login(token, user);
              }}
              style={styles.authButton}
            />
          </ThemedView>
        )}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 2,
  },
  navigationContent: {
    maxWidth: 800, 
    alignSelf: 'center',
    width: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  authButtonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    flexWrap: 'wrap',
  },
  navButton: {
    minWidth: 80,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  authButton: {
    minWidth: 100,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  settingsButton: {
    minWidth: 80,
  },
});
