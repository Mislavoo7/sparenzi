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

const RegisterComponent = ({ onLoginSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOpen = () => {
    setIsOpen(!isOpen);
  } 

  const handleSignup = async () => {
    // Validation
    if (!email.trim()) {
      Alert.alert('Error', t("auth.errors.email"));
      return;
    }
    if (!password.trim()) {
      Alert.alert('Error', t("auth.errors.password"));
      return;
    }

    if (!passwordConfirmation.trim()) {
      Alert.alert('Error', t("auth.errors.password_confirmation"));
      return;
    }

    if (passwordConfirmation.trim() !== password.trim()) {
      Alert.alert('Error', t("auth.errors.password_and_password_confirmation"));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${apiRoutes.baseUrl}/${apiRoutes.signup}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
          password_confirmation: passwordConfirmation
        })
      });

      const data = await response.json();

      if (data.success) {
        // Clear form
        setEmail('');
        setPassword('');
        setPasswordConfirmation('');

        // Close modal
        setIsOpen(false);
        Alert.alert(`${t("auth.registration_successful")}!`);
        if (onLoginSuccess) {
          onLoginSuccess(data.token, data.user);
        }

        console.log('Registration successful:', data.user);
        console.log('Token:', data.token);
      } else {
        Alert.alert(t("auth.registration_failed"), data.message || t("auth.registration_failed"));
        console.log("Registration failed:", data);
      }
    } catch (error) {
      Alert.alert(t("auth.network_error"));
      console.log("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView>
      <ThemedButton 
        onPress={handleOpen}
        text={t("auth.bttn_title.signup")}
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
            <ThemedText type={"subtitle"}> {t("auth.fields.signup_title")}</ThemedText>
            <ThemedDestroyButton 
              onPress={handleOpen}>
            </ThemedDestroyButton>
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

          <ThemedView style={styles.inputContainer}>
            <ThemedText type={"default"}>{t("auth.fields.password_confirmation")}</ThemedText>
            <TextInput
             style={styles.inputLogin}
             placeholder={t("auth.fields.placeholder_confirmation")}
             value={passwordConfirmation}
             onChangeText={setPasswordConfirmation}
             secureTextEntry
             autoCapitalize="none"
             autoCorrect={false}
             editable={!loading}
             />
          </ThemedView>

          <ThemedSubmitButton 
           textWaiting = {`${t("auth.fields.wait")}...`}
           text = {t("auth.bttn_title.signup")}
           onPress={handleSignup}
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

export default RegisterComponent;
