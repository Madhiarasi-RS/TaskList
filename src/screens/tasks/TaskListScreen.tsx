import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, RefreshControl, Alert } from 'react-native';
import { FAB, Searchbar, Text, IconButton, useTheme } from 'react-native-paper';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  loadTasks,
  deleteTaskFromDB,
  updateTaskInDB,
  Task,
} from '../../store/tasksSlice';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import Animated, { FadeInLeft, FadeOutRight } from 'react-native-reanimated';
import { TextInput } from 'react-native';


type Props = NativeStackScreenProps<RootStackParamList, 'TaskList'>;

export const TaskListScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(state => state.tasks.tasks);
  const loading = useAppSelector(state => state.tasks.loading);
  const error = useAppSelector(state => state.tasks.error);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const [refreshing, setRefreshing] = useState(false);


    useEffect(() => {
  const handler = setTimeout(() => {
    setDebouncedSearchQuery(searchQuery);
  }, 300); // 300ms debounce

  return () => {
    clearTimeout(handler);
  };
}, [searchQuery]);


  useEffect(() => {
    dispatch(loadTasks());
  }, [dispatch]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(loadTasks()).finally(() => setRefreshing(false));
  }, [dispatch]);

  // Filter tasks by search query
  const filteredTasks = tasks.filter(task =>
  task.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
  task.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
);

  useEffect(() => {
  if (error) {
    Alert.alert('Error loading tasks', error);
  }
  }, [error]);

  const toggleTaskStatus = (task: Task) => {
    const updatedTask: Task = {
      ...task,
      status: task.status === 'Pending' ? 'Completed' : 'Pending',
    };
    dispatch(updateTaskInDB(updatedTask));
  };

  const deleteTask = (taskId: string) => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: () => {
          dispatch(deleteTaskFromDB(taskId));
        }
      },
    ]);
  };

  const renderItem = ({ item }: { item: Task }) => (
    <Animated.View
      entering={FadeInLeft.duration(300)}
      exiting={FadeOutRight.duration(300)}
      style={[
        styles.rowFront,
        item.status === 'Completed' ? { backgroundColor: colors.onSurfaceDisabled } : null,
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, item.status === 'Completed' && { textDecorationLine: 'line-through' }]}>
          {item.title}
        </Text>
        <Text numberOfLines={1} style={styles.description}>
          {item.description}
        </Text>
      </View>
      <IconButton
        icon={item.status === 'Completed' ? 'check-circle-outline' : 'checkbox-blank-circle-outline'}
        size={24}
        onPress={() => toggleTaskStatus(item)}
        accessibilityLabel={item.status === 'Completed' ? 'Mark incomplete' : 'Mark complete'}
      />
    </Animated.View>
  );

  const renderHiddenItem = (data: { item: Task }) => (
    <View style={styles.rowBack}>
      <IconButton
        icon="delete"
        iconColor="white"
        size={28}
        onPress={() => deleteTask(data.item.id)}
        accessibilityLabel="Delete task"
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search tasks"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={{ margin: 8 }}
        accessibilityLabel="Search tasks"
      />
      {filteredTasks.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Text>No tasks found. Pull down to refresh or add a new task.</Text>
        </View>
      ) : (
        <SwipeListView
          useFlatList
          data={filteredTasks}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-75}
          disableRightSwipe
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          accessibilityLabel="Task list"
        />
      )}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('TaskAddEdit')}
        accessibilityLabel="Add new task"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  rowFront: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    padding: 16,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: 'red',
    flex: 1,
    justifyContent: 'flex-end',
    paddingRight: 20,
  },
  title: { fontSize: 16, fontWeight: '600' },
  description: { fontSize: 14, color: '#666' },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
});