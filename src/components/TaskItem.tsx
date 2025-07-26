// src/components/TaskItem.tsx
import React from 'react';
import { StyleSheet, View, Text as RNText } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { IconButton } from 'react-native-paper';
import Animated, { FadeInLeft, FadeOutRight } from 'react-native-reanimated';

export interface TaskItemProps {
  task: {
    id: string;
    title: string;
    description: string;
    status: 'Pending' | 'Completed';
  };
  onToggleStatus: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onPress?: () => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleStatus,
  onDelete,
  onPress,
}) => {
  const { colors } = useTheme();

  return (
    <Animated.View
      entering={FadeInLeft.duration(250)}
      exiting={FadeOutRight.duration(250)}
      style={[
        styles.container,
        task.status === 'Completed' ? { backgroundColor: colors.onSurfaceDisabled } : {},
      ]}
    >
      <View style={styles.textContainer}>
        <RNText
          onPress={onPress}
          style={[
            styles.title,
            task.status === 'Completed' && { textDecorationLine: 'line-through', color: colors.onSurfaceDisabled },
          ]}
          accessibilityRole="button"
          accessibilityState={{ disabled: false }}
        >
          {task.title}
        </RNText>
        {task.description ? (
          <Text numberOfLines={1} style={styles.description}>
            {task.description}
          </Text>
        ) : null}
      </View>

      <View style={styles.actions}>
        <IconButton
          icon={task.status === 'Completed' ? 'check-circle-outline' : 'checkbox-blank-circle-outline'}
          size={24}
          onPress={() => onToggleStatus(task.id)}
          accessibilityLabel={task.status === 'Completed' ? 'Mark incomplete' : 'Mark complete'}
        />
        <IconButton
          icon="delete"
          size={24}
          onPress={() => onDelete(task.id)}
          accessibilityLabel="Delete task"
          color="#b00020"
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});