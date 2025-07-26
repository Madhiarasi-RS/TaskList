import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import * as SQLite from 'expo-sqlite';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string; // ISO Date string yyyy-MM-dd
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'Completed';
}

interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const db = SQLite.openDatabase('tasks.db');

const createTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS tasks (
          id TEXT PRIMARY KEY NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          dueDate TEXT,
          priority TEXT,
          status TEXT
        );`
    );
  });
};

createTable();

export const loadTasks = createAsyncThunk('tasks/load', async () => {
  return new Promise<Task[]>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tasks;',
        [],
        (_, { rows }) => {
          const result: Task[] = [];
          for (let i = 0; i < rows.length; i++) {
            result.push(rows.item(i));
          }
          resolve(result);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
});

export const addTaskToDB = createAsyncThunk('tasks/add', async (task: Task) => {
  return new Promise<Task>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO tasks (id, title, description, dueDate, priority, status)
         VALUES (?, ?, ?, ?, ?, ?);`,
        [task.id, task.title, task.description, task.dueDate, task.priority, task.status],
        () => resolve(task),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
});

export const updateTaskInDB = createAsyncThunk('tasks/update', async (task: Task) => {
  return new Promise<Task>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `UPDATE tasks SET title = ?, description = ?, dueDate = ?, priority = ?, status = ? WHERE id = ?;`,
        [task.title, task.description, task.dueDate, task.priority, task.status, task.id],
        () => resolve(task),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
});

export const deleteTaskFromDB = createAsyncThunk('tasks/delete', async (id: string) => {
  return new Promise<string>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `DELETE FROM tasks WHERE id = ?;`,
        [id],
        () => resolve(id),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
});

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
};

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(loadTasks.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.tasks = action.payload;
        state.loading = false;
      })
      .addCase(loadTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load tasks';
      })
      .addCase(addTaskToDB.fulfilled, (state, action: PayloadAction<Task>) => {
        state.tasks.push(action.payload);
      })
      .addCase(updateTaskInDB.fulfilled, (state, action: PayloadAction<Task>) => {
        const index = state.tasks.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(deleteTaskFromDB.fulfilled, (state, action: PayloadAction<string>) => {
        state.tasks = state.tasks.filter(t => t.id !== action.payload);
      });
  },
});