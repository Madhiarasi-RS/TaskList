import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { MainStackParamList } from '../navigation/types';
import { TaskListScreen } from '../screens/tasks/TaskListScreen';
import {TaskDetailScreen}  from '../screens/tasks/TaskDetailScreen';
import {TaskAddEditScreen} from '../screens/tasks/TaskAddEditScreen';

const Stack = createNativeStackNavigator<MainStackParamList>();

const TasksStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="TaskList" component={TaskListScreen} options={{ title: 'Tasks' }} />
    <Stack.Screen name="TaskAddEdit" component={TaskAddEditScreen} options={{ title: 'Add/Edit Task' }} />
    <Stack.Screen name="TaskDetail" component={TaskDetailScreen} options={{ title: 'Task Detail' }} />
  </Stack.Navigator>
);

export default TasksStack;