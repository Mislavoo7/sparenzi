import React, { useState, useContext } from 'react';
import { router } from 'expo-router';
import { StyleSheet, Alert, KeyboardAvoidingView, Platform, Modal, Switch } from 'react-native';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedDestroyButton } from '@/components/ThemedDestroyButton';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { AuthContext } from '@/components/account/AuthContext';
import LogoutComponent from '@/components/account/LogoutComponent';
import apiRoutes from '@/components/helpers/apiRoutes';
import { t } from '@/components/helpers/translations';
import languages  from '@/components/helpers/translations';
import { formStyles } from '@/components/styles/form_styles';
import * as SecureStore from 'expo-secure-store';
import useTheme from '@/components/styles/colors';

const Settings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(global.theme=="dark");
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedCurrency, setSelectedCurrency] = useState('$');
  const [loading, setLoading] = useState(false);

  const { token, user, login, logout } = useContext(AuthContext);

  const currencies = [
    { code: '$', label: 'USD ($)' },
    { code: '€', label: 'EUR (€)' }
  ];

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = async (settingType, value) => {
    setLoading(true);

    try {
      const response = await fetch(`${apiRoutes.baseUrl}/${apiRoutes.settings}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: settingType,
          value: value
        })
      });

      const data = await response.json();

      if (!data.success) {
        Alert.alert('Error', data.message || 'Failed to update setting');
      } else {
        let oldUser = await SecureStore.getItemAsync('user');
        oldUser = JSON.parse(oldUser); 
        oldUser[data.setting.type] = data.setting.value;

        await SecureStore.deleteItemAsync('user');
        await SecureStore.setItemAsync('user', JSON.stringify(oldUser));
      }
    } catch (error) {
      Alert.alert('Network Error', 'Failed to update setting');
      console.log("Settings update error:", error);
    } finally {
      setLoading(false);
      setIsOpen(false);
      router.push(`/`) // used as refresh so I don't have to deal with stat and context
    }
  };

  const handleThemeChange = async (value) => {
    setIsDarkTheme(value);
    global.theme = value ? 'dark' : 'light';
    await handleSubmit('theme', value ? 'dark' : 'light');
  };

  const handleLanguageChange = async (languageCode) => {
    setSelectedLanguage(languageCode);
    global.language = languageCode;
    await handleSubmit('language', languageCode);
  };

  const handleCurrencyChange = async (currencyCode) => {
    setSelectedCurrency(currencyCode);
    global.currency = currencyCode;
    await handleSubmit('currency', currencyCode);
  };

  const renderLanguageOptions = () => {
    return languages.map((language) => (
      <ThemedButton
      style={{selected: global.language.toUpperCase() == language.code.toUpperCase()}}
      key={language.code}
      onPress={() => handleLanguageChange(language.code)}
      disabled={loading}
      text = {language.label}
      />
    ));
  };

  const renderCurrencyOptions = () => {
    return currencies.map((currency) => (
      <ThemedButton
      style={{selected: global.currency.toUpperCase() == currency.code.toUpperCase()}}
      key={currency.code}
      onPress={() => handleCurrencyChange(currency.code)}
      disabled={loading}
      text = {currency.label}
      />
    ));
  };

  return (
    <ThemedView>
      <ThemedButton 
      onPress={handleOpen}
      text={t("settings.bttn_title.settings")}
      />

      <Modal
      visible={isOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={handleOpen}
      >
        <ThemedView style={styles.modalOverlay} >
          <KeyboardAvoidingView 
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <ThemedView style={{...styles.loginForm, ...useTheme("borderColor")}}>
              <ThemedView style={styles.titleContainer}>
                <ThemedText type={"subtitle"}>{t("settings.title")}</ThemedText>
                <ThemedDestroyButton onPress={handleOpen} />
              </ThemedView>

              {/* Theme Section */}
              <ThemedView style={styles.sectionContainer}>
                <ThemedText type={"default"} style={styles.sectionTitle}>
                  {t("settings.theme.title")}
                </ThemedText>
                <ThemedView style={styles.switchContainer}>
                  <ThemedText type={"default"}>
                    {isDarkTheme ? t("settings.theme.dark") : t("settings.theme.light")}
                  </ThemedText>
                  <Switch
                  value={isDarkTheme}
                  onValueChange={handleThemeChange}
                  disabled={loading}
                  />
                </ThemedView>
              </ThemedView>

              {/* Language Section */}
              <ThemedView style={styles.sectionContainer}>
                <ThemedText type={"default"} style={styles.sectionTitle}>
                  {t("settings.language.title")}
                </ThemedText>
                <ThemedView style={styles.optionsContainer}>
                  {renderLanguageOptions()}
                </ThemedView>
              </ThemedView>

              {/* Currency Section */}
              <ThemedView style={styles.sectionContainer}>
                <ThemedText type={"default"} style={styles.sectionTitle}>
                  {t("settings.currency.title")}
                </ThemedText>
                <ThemedView style={styles.optionsContainer}>
                  {renderCurrencyOptions()}
                </ThemedView>
              </ThemedView>

              <ThemedView style={styles.sectionContainer}>
                <LogoutComponent 
                user={user}
                token={token}
                onLogoutSuccess={async (token, user) => {
                  await logout(token, user);
                }} 
                />
              </ThemedView>

            </ThemedView>
          </KeyboardAvoidingView>
        </ThemedView>
      </Modal>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  ...formStyles,
  sectionContainer: {
    marginBottom: 10,
    paddingTop: 4,
    minHeight: 100,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  optionsContainer: {
    flex: 1,
    gap: 6,
    flexDirection: "row",
    maxHeight: 50,
  },
  modalOverlay: {
    minWidth: 400,
    minHeight: 350,
    flex: 1,
    top: 210,
  },
  container: {
    gap: 8
  },
});

export default Settings;
