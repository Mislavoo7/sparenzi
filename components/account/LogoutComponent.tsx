import React, { useState } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { AuthContext } from '@./AuthContext'; 
import { formStyles } from '@/components/styles/form_styles';
import { ThemedButton } from '@/components/ThemedButton';
import apiRoutes from '@/components/helpers/apiRoutes';
import { t } from '@/components/helpers/translations';

const LogoutComponent = ({user, token, onLogoutSuccess }) => {
  const [loading, setLoading] = useState(false);
  const handleLogout = async () => {

    setLoading(true);
    try {
      const response = await fetch(`${apiRoutes.baseUrl}/${apiRoutes.logout}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      Alert.alert(t("auth.network_error"));
      onLogoutSuccess(user);
    } finally {
      setLoading(false);
      onLogoutSuccess(user);
    }
  };

  return (
    <ThemedButton 
        onPress={handleLogout}
        text = {t("auth.bttn_title.logout")}
      >
    </ThemedButton>
  );
};

export default LogoutComponent;
