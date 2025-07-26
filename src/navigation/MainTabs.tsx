import React from 'react';
import { StyleSheet} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TasksStack from './TasksStack';
import { SettingsScreen } from '../screens/SettingsScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppSelector } from '../store/hooks';
const Tab = createBottomTabNavigator();

export const MainTabs = () => {
const tasks = useAppSelector(state => state.tasks.tasks);
  const hasCompleted = tasks.some(t => t.status === 'Completed');

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = 'format-list-checks';
          let iconColor = color;
          if (route.name === 'Tasks') {
            iconColor = hasCompleted ? '#5fd863ff' : color;  // green if any completed
          }
          if (route.name === 'Settings') iconName = 'cog-outline';
          return <MaterialCommunityIcons name={iconName} size={size} color={iconColor} />;
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
      <Tab.Screen name="Sign Out" component={SettingsScreen} />
    </Tab.Navigator>
  );
};
const styles = StyleSheet.create({
actionIconsContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-end',
},
});
