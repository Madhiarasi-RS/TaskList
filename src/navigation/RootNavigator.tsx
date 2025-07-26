import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { AuthStack } from './AuthStack';
import { MainTabs } from './MainTabs';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  const user = useSelector((state: RootState) => state.auth?.user); // Placeholder, auth slice to be created

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : (
        <Stack.Screen name="Main" component={MainTabs} />
      )}
    </Stack.Navigator>
  );
};