import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const SettingsScreen = () => {
  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      Alert.alert('Signed out');
      // Dispatch redux auth logout and navigate to Auth stack
    } catch (error) {
      Alert.alert('Error signing out', (error as Error).message);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={{ marginBottom: 20 }}>Settings</Text>
      <Button mode="outlined" onPress={signOut} accessibilityLabel="Sign out">
        Sign Out
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});