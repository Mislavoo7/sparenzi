import React, { useState } from 'react';
import { TextInput, StyleSheet, Alert, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedDestroyButton } from '@/components/ThemedDestroyButton';
import { ThemedSubmitButton } from '@/components/ThemedSubmitButton';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import apiRoutes from '@/components/helpers/apiRoutes';
import { t } from '@/components/helpers/translations';
import { formStyles } from '@/components/styles/form_styles';

const LoginComponent = ({ onLoginSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOpen = () => {
    setIsOpen(!isOpen);
  } 

  const handleLogin = async () => {
    // Validation
    if (!email.trim()) {
      Alert.alert('Error', t("auth.errors.email"));
      return;
    }
    if (!password.trim()) {
      Alert.alert('Error', t("auth.errors.password"));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${apiRoutes.baseUrl}/${apiRoutes.login}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password
        })
      });

      const data = await response.json();

      if (data.success) {
        // Clear form
        setEmail('');
        setPassword('');

        // Close modal
        setIsOpen(false);
        Alert.alert(`${t("auth.login_successful")}!`);

        if (onLoginSuccess) {
          onLoginSuccess(data.token, data.user);
        }
      } else {
        Alert.alert(t("auth.login_failed"), data.message || t("auth.login_failed"));
//        console.log("Login failed:", data);
      }
    } catch (error) {
      Alert.alert(t("auth.network_error"));
 //     console.log("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView>
      <ThemedButton 
        onPress={handleOpen}
        text={t("auth.bttn_title.login")}
      >
      </ThemedButton>

      <Modal
       visible={isOpen}
       animationType="slide"
       transparent={true}
       onRequestClose={handleOpen}
      >
      <ThemedView style={styles.modalOverlay}>
        <KeyboardAvoidingView 
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
        <ThemedView style={styles.loginForm}>
          <ThemedView style={styles.titleContainer}>
            <ThemedText type={"subtitle"}> {t("auth.fields.login_title")}</ThemedText>
            <ThemedDestroyButton onPress={handleOpen} />
          </ThemedView>

          <ThemedView style={styles.inputContainer}>
            <ThemedText type={"default"}>{t("auth.fields.email")}</ThemedText>
            <TextInput
             style={styles.inputLogin}
             placeholder={t("auth.fields.placeholder_email")}
             value={email}
             onChangeText={setEmail}
             keyboardType="email-address"
             autoCapitalize="none"
             autoCorrect={false}
             editable={!loading}
             />
          </ThemedView>

          <ThemedView style={styles.inputContainer}>
            <ThemedText type={"default"}>{t("auth.fields.password")}</ThemedText>
            <TextInput
             style={styles.inputLogin}
             placeholder={t("auth.fields.placeholder_password")}
             value={password}
             onChangeText={setPassword}
             secureTextEntry
             autoCapitalize="none"
             autoCorrect={false}
             editable={!loading}
            />
          </ThemedView>

          <ThemedSubmitButton 
           textWaiting = {`${t("auth.fields.wait")}...`}
           text = {t("auth.bttn_title.login")}
           onPress={handleLogin}
           loading={loading}
          />

          </ThemedView>
        </KeyboardAvoidingView>
      </ThemedView>
    </Modal>
  </ThemedView>
  );
};

const styles = StyleSheet.create(formStyles);

export default LoginComponent;
