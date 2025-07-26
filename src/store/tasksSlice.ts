// store/tasksSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTasksFromDB, insertTaskToDB, updateTaskInDB as updateTaskSQL, deleteTaskFromDB as deleteTaskSQL } from '../services/taskService';
import { v4 as uuidv4 } from 'uuid';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'Pending' | 'Completed';
   priority: 'Low' | 'Medium' | 'High';
}

interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  addLoading?: boolean;
  updateLoading?: boolean;
  deleteLoading?: boolean;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
  addLoading: false,
  updateLoading: false,
  deleteLoading: false,
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
      // Loads
      .addCase(loadTasks.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(loadTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load tasks';
      })

      // Adds
      .addCase(addTaskToDB.pending, state => { state.addLoading = true; state.error = null; })
      .addCase(addTaskToDB.fulfilled, (state, action) => {
        state.addLoading = false;
        state.tasks.push(action.payload);
      })
      .addCase(addTaskToDB.rejected, (state, action) => {
        state.addLoading = false;
        state.error = action.error.message || 'Failed to add task';
      })

      // Updates
      .addCase(updateTaskInDB.pending, state => { state.updateLoading = true; state.error = null; })
      .addCase(updateTaskInDB.fulfilled, (state, action) => {
        state.updateLoading = false;
        const index = state.tasks.findIndex(t => t.id === action.payload.id);
        if (index !== -1) state.tasks[index] = action.payload;
      })
      .addCase(updateTaskInDB.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.error.message || 'Failed to update task';
      })

      // Deletes
      .addCase(deleteTaskFromDB.pending, state => { state.deleteLoading = true; state.error = null; })
      .addCase(deleteTaskFromDB.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
      })
      .addCase(deleteTaskFromDB.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.error.message || 'Failed to delete task';
      });
  },
});

export default tasksSlice.reducer;
