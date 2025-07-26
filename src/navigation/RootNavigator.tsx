import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { AuthStack } from './AuthStack';
import { MainTabs } from './MainTabs';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { user, accessToken } = useSelector((state: RootState) => state.auth);

const isLoggedIn = user !== null && accessToken !== null;

return (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    {/* {!isLoggedIn ? (
      <Stack.Screen name="Auth" component={AuthStack} />
    ) : ( */}
      <Stack.Screen name="Main" component={MainTabs} />
    {/* )} */}
  </Stack.Navigator>
);
};

export default RootNavigator;