// App.tsx
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as ReduxProvider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';

import { store } from './src/store'; // Adjust if your store index is elsewhere
import RootNavigator from './src/navigation/RootNavigator'; // Adjust import path if needed

export default function App() {
  return (
    // Redux store for state management
    <ReduxProvider store={store}> 
      {/* React Native Paper theme provider */}
      <PaperProvider>
        {/* Navigation container for React Navigation */}
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
        <StatusBar style="auto" />
      </PaperProvider>
    </ReduxProvider>
  );
}
