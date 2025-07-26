import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TasksStack from './TasksStack';
import { SettingsScreen } from '../screens/SettingsScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName = 'format-list-checks';
        if (route.name === 'Settings') iconName = 'cog-outline';
        return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#6200ee',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen
      name="Tasks"
      component={TasksStack}
      options={{ headerShown: false }}
    />
    <Tab.Screen name="Settings" component={SettingsScreen} />
  </Tab.Navigator>
);