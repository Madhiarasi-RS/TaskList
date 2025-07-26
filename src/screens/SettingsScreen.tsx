import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useAppDispatch } from '../store/hooks';
import { logout } from '../store/authSlice';
import { CommonActions, useNavigation } from '@react-navigation/native';


export const SettingsScreen = () => {
  const dispatch = useAppDispatch();
const navigation = useNavigation();
const signOut = async () => {
  try {
    // If you had tokens saved in SecureStore or AsyncStorage, clear them here.

    dispatch(logout());
    Alert.alert('Signed out');

    // Reset navigation to Auth stack
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      })
    );
  } catch (error) {
    Alert.alert('Error signing out', (error as Error).message);
  }
};

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={{ marginBottom: 20 }}>Sign Out</Text>
      <Button mode="outlined" onPress={signOut} accessibilityLabel="Sign out">
        Sign Out
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});