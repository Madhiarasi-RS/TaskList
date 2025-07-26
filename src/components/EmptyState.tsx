// src/components/EmptyState.tsx
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import LottieView from 'lottie-react-native';

interface EmptyStateProps {
  message?: string;
  animationSource?: any; // require('path/to/lottie.json')
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = 'No data available',
  animationSource,
}) => {
  const { colors } = useTheme();
  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={styles.container} accessibilityRole="image" accessibilityLabel={message}>
      {animationSource ? (
        <LottieView
          source={animationSource}
          autoPlay
          loop
          style={{ width: screenWidth * 0.6, height: screenWidth * 0.6 }}
        />
      ) : null}
      <Text style={[styles.message, { color: colors.onSurfaceDisabled }]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 50,
  },
  message: {
    fontSize: 16,
    marginTop: 8,
  },
});