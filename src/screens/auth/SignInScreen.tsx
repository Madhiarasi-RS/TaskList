import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Text, Title } from 'react-native-paper';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

export const SignInScreen = () => {
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      // Here you would store user in Redux/Context and proceed to app
      Alert.alert('Signed In', `Welcome ${userInfo.user.name}`);
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Cancelled', 'Sign in was cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('In Progress', 'Sign in already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Play Services', 'Play Services not available');
      } else {
        Alert.alert('Error', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Title style={{ marginBottom: 20 }}>Welcome, please sign in</Title>
      <Button
        mode="contained"
        icon="google"
        onPress={signIn}
        loading={loading}
        disabled={loading}
      >
        Sign in with Google
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
});