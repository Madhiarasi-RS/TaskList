import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Title } from 'react-native-paper';

import { useAuthRequest, makeRedirectUri, ResponseType } from 'expo-auth-session';

const CLIENT_ID = '671503456983-qtqg86vgj0qdb7iiv88pra02cud3d3al.apps.googleusercontent.com';
export const SignInScreen = () => {
  const [loading, setLoading] = useState(false);

  const redirectUri = makeRedirectUri();
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: CLIENT_ID,
      redirectUri,
      responseType: ResponseType.Token,
      scopes: ['profile', 'email'],
    },
    { authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth' }
  );
  React.useEffect(() => {
    if (request) {
      console.log('Auth URL:', request.url);
    }
  }, [request]);
  React.useEffect(() => {
    const handleAuthResponse = async () => {
      if (response?.type === 'success' && response.params.access_token) {
        try {
          setLoading(true);
          const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
            headers: { Authorization: `Bearer ${response.params.access_token}` },
          });
          if (!res.ok) throw new Error('Failed to fetch user info');
          const userInfo = await res.json();
          console.log('User Info:', userInfo);
          Alert.alert('Signed In', `Welcome ${userInfo.name}`);
          // TODO: Save user info in Redux or Context and proceed with navigation
        } catch (error: any) {
          Alert.alert('Error', error.message);
        } finally {
          setLoading(false);
        }
      } else if (response?.type === 'error') {
        
        Alert.alert('Sign in error');
      }
    };
    handleAuthResponse();
  }, [response]);

  return (
    <View style={styles.container}>
      <Title>Welcome, please sign in</Title>
      <Button
        mode="contained"
        icon="google"
        onPress={() => {
          setLoading(true);
          promptAsync();
        }}
        loading={loading}
        disabled={loading}
        accessibilityLabel="Sign in with Google"
      >
        Sign in with Google
      </Button>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});
