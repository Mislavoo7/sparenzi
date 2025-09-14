import { Tabs } from 'expo-router';
import React from 'react';
import { useContext } from 'react';
import { Platform } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { t } from '@/components/helpers/translations';
import { AuthContext } from '@/components/account/AuthContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { token, user, login, logout } = useContext(AuthContext);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      {token ? (
        <Tabs.Screen
          name="lists"
          options={{
            title: t("buttons.lists"),
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="checklist" color={color} />,
          }}
        />
      ) : (
        <Tabs.Screen
          name="lists"
          options={{
            href: null,
          }}
        />
      
      )}
      <Tabs.Screen
        name="lists/[id]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="web"
        options={{
          title: 'Web',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="language.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="legals"
        options={{
          title: t("buttons.legals"),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="policy" color={color} />,
        }}
      />
    </Tabs>
  );
}
