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
import { Chip } from 'react-native-paper';


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
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | 'All'>('All');

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
const filteredTasks = tasks
  .filter(task =>
    task.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
  )
  .filter(task => priorityFilter === 'All' || task.priority === priorityFilter)
  .sort((a, b) => {
    if (a.status === b.status) return 0;
    if (a.status === 'Completed') return 1;   // put completed tasks at end
    if (b.status === 'Completed') return -1;
    return 0;
  });

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
  setSelectedTaskId(null);

};
  const deleteTask = (taskId: string) => {
  Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
    { text: 'Cancel', style: 'cancel' },
    {
      text: 'Delete',
      style: 'destructive',
      onPress: () => {
        setSelectedTaskId(null); // Close action buttons
        dispatch(deleteTaskFromDB(taskId));
      },
    },
  ]);
};

 const renderItem = ({ item }: { item: Task }) => {
  const isSelected = selectedTaskId === item.id;
 const isCompleted = item.status === 'Completed';
  return (
   <Animated.View
      entering={FadeInLeft.duration(300)}
      exiting={FadeOutRight.duration(300)}
      style={[
        styles.rowFront,
isCompleted ? { backgroundColor: '#4CAF50' } : { backgroundColor: 'white' },      ]}
    >
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, isCompleted && { textDecorationLine: 'line-through', color: 'white' }]}>
          {item.title}
        </Text>
        <Text numberOfLines={1} style={[styles.description, isCompleted && { color: '#e0e0e0' }]}>
          {item.description}
        </Text>
      </View>
      <IconButton
  icon="dots-vertical"
  size={24}
  iconColor="#010201ff" // or any color you prefer
  onPress={() => setSelectedTaskId(isSelected ? null : item.id)}
  accessibilityLabel="More options"
/>
      {/* Status circle: green when completed */}
      {/* <IconButton
        icon={isCompleted ? 'check-square' : 'checkbox-blank-square-outline'}
        size={24}
        iconColor={isCompleted ? 'white' : '#4CAF50'} // white icon on green, green icon on white
        onPress={() => setSelectedTaskId(isSelected ? null : item.id)}
        accessibilityLabel={isCompleted ? 'Mark incomplete' : 'More actions'}
      /> */}
      {/* Toggle Mark complete / undo button */}
<IconButton
  icon={isCompleted ? 'undo-variant' : 'check-circle-outline'}
  size={24}
  iconColor={isCompleted ? 'yellow' : '#4CAF50'}
  onPress={() => {
    toggleTaskStatus(item);
    setSelectedTaskId(null);
  }}
  accessibilityLabel={isCompleted ? 'Mark as Pending' : 'Mark as Complete'}
/>


      {/* Show actions only if pending; no dustbin icon when completed */}
      {isSelected && (
        <View style={styles.actionIconsContainer}>
          {!isCompleted && (
            <IconButton
              icon={isCompleted ? 'undo-variant' : 'check-circle-outline'}
              size={24}
              iconColor={isCompleted ? 'white' : '#4CAF50'}
              onPress={() => {
                setSelectedTaskId(null);
                toggleTaskStatus(item);
              }}
 accessibilityLabel={isCompleted ? 'Mark as Pending' : 'Mark as Complete'}           
  />
       )}
          <IconButton
            icon="pencil-outline"
            size={24}
            iconColor={isCompleted ? 'white' : undefined}
            onPress={() => {
              setSelectedTaskId(null);
              navigation.navigate('TaskAddEdit', { task: item });
            }}
            accessibilityLabel="Edit task"
          />
          {!isCompleted && (
            <IconButton
              icon="delete-outline"
              size={24}
              iconColor="#b00020"
              onPress={() => {
                setSelectedTaskId(null);
                deleteTask(item.id);
              }}
              accessibilityLabel="Delete task"
            />
          )}
          <IconButton
            icon="information-outline"
            size={24}
            iconColor={isCompleted ? 'white' : '#2196F3'}
            onPress={() => Alert.alert('Task Priority', `Priority: ${item.priority}`)}
            accessibilityLabel="Task info"
          />

          <IconButton
            icon="close"
            size={24}
            iconColor={isCompleted ? 'white' : undefined}
            onPress={() => setSelectedTaskId(null)}
            accessibilityLabel="Cancel"
          />
        </View>
      )}
    </Animated.View>
  );
};

const renderHiddenItem = ({ item }: { item: Task }) => (
  <View style={styles.rowBack}>
    {item.status !== 'Completed' && (
      <IconButton
        icon="delete"
        iconColor="white"
        size={28}
        onPress={() => deleteTask(item.id)}
        accessibilityLabel="Delete task"
      />
    )}
  </View>
);

  return (
    <>
    <View style={styles.filterContainer}>
  {['All', 'Low', 'Medium', 'High'].map(priority => (
    <Chip
      key={priority}
      mode={priorityFilter === priority ? 'flat' : 'outlined'}
      onPress={() => setPriorityFilter(priority as any)}
      style={{ marginHorizontal: 4 }}
    >
      {priority}
    </Chip>
  ))}
</View>
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
          <Text>No tasks found. Add a new task.</Text>
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
    </>
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
  actionIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#ce7664ff',
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
  filterContainer: {
  flexDirection: 'row',
  justifyContent: 'center',
  paddingHorizontal: 8,
  paddingBottom: 8,
},
});