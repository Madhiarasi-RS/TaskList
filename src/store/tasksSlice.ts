// store/tasksSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTasksFromDB, insertTaskToDB, updateTaskSQL, deleteTaskFromDB as deleteTaskSQL } from '../services/taskService';
import { v4 as uuidv4 } from 'uuid';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'Pending' | 'Completed';
   priority: 'Low' | 'Medium' | 'High';
}

interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
};

export const loadTasks = createAsyncThunk('tasks/load', async () => {
  const tasks = await fetchTasksFromDB();
  return tasks;
});

export const addTaskToDB = createAsyncThunk('tasks/add', async (task: Omit<Task, 'id'>) => {
  const newTask: Task = { ...task, id: uuidv4() };
  await insertTaskToDB(newTask);
  return newTask;
});

export const updateTaskInDB = createAsyncThunk('tasks/update', async (task: Task) => {
  await updateTaskSQL(task);
  return task;
});

export const deleteTaskFromDB = createAsyncThunk('tasks/delete', async (id: string) => {
  await deleteTaskSQL(id);
  return id;
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loadTasks.pending, state => {
        state.loading = true;
      })
      .addCase(loadTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(loadTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load tasks';
      })
      .addCase(addTaskToDB.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(updateTaskInDB.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(t => t.id === action.payload.id);
        if (index !== -1) state.tasks[index] = action.payload;
      })
      .addCase(deleteTaskFromDB.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
      });
  },
});

export default tasksSlice.reducer;
