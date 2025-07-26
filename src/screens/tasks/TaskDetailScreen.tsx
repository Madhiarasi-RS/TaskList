import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { ScrollView } from 'react-native';
type Props = NativeStackScreenProps<RootStackParamList, 'TaskDetail'>;

export const TaskDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const theme = useTheme();
  const task = route.params.task;

  if (!task) {
    return (
      <View style={styles.centered}>
        <Text>No task data available.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="titleLarge">{task.title}</Text>
      <Text variant="bodyMedium" style={{ marginVertical: 8 }}>{task.description}</Text>
      <Text variant="bodySmall" style={{ marginBottom: 4 }}>
        Due Date: {new Date(task.dueDate).toLocaleDateString()}
      </Text>
      <Text variant="bodySmall" style={{ marginBottom: 4 }}>
        Priority: {task.priority}
      </Text>
      <Text variant="bodySmall" style={{ marginBottom: 4 }}>
        Status: {task.status}
      </Text>
      <Button
        mode="outlined"
        onPress={() => navigation.navigate('TaskAddEdit', { task })}
        style={{ marginTop: 20 }}
        accessibilityLabel="Edit task"
      >
        Edit Task
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
