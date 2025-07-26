import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SignInScreen } from '../screens/auth/SignInScreen';

const Stack = createNativeStackNavigator();

export const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="SignIn" component={SignInScreen} options={{ title: 'Sign In' }} />
  </Stack.Navigator>
);