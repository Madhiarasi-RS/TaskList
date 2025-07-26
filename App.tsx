// App.tsx
import 'react-native-get-random-values'; 
import React, { useEffect } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as ReduxProvider } from 'react-redux';

import { store } from './src/store'; // Adjust if your store index is elsewhere
import RootNavigator from './src/navigation/RootNavigator'; // Adjust import path if needed
import { initDB } from './src/services/taskService';


export default function App() {
  useEffect(() => {
    initDB(); // <-- Ensure the database and tables are created on app start
  }, []);

  return (
  
  
    <ReduxProvider store={store}> 
  <PaperProvider>
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  </PaperProvider>
</ReduxProvider>


  );
}
