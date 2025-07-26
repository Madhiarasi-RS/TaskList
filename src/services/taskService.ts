import { Task } from '../store/tasksSlice';
import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabaseSync('tasks.db');
export const initDB = () => {
  db.withTransactionSync(() => {
    db.execSync(
      `CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT,
        description TEXT,
        dueDate TEXT,
        status TEXT,
        priority TEXT 
      );`
    );
  });
};
export const fetchTasksFromDB = (): Promise<Task[]> => {
  return new Promise((resolve, reject) => {
    try {
      db.withTransactionSync(() => {
        const rows = db.getAllSync('SELECT * FROM tasks', []);
        resolve(rows as Task[]);
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const insertTaskToDB = (task: Task): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      db.withTransactionSync(() => {
        db.runSync(
         'INSERT INTO tasks (id, title, description, dueDate, status, priority) VALUES (?, ?, ?, ?, ?, ?)',
          task.id, task.title, task.description, task.dueDate, task.status, task.priority
        );
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
};
export const updateTaskInDB = (task: Task): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      db.withTransactionSync(() => {
        db.runSync(
         'UPDATE tasks SET title = ?, description = ?, dueDate = ?, status = ?, priority = ? WHERE id = ?',
          task.title, task.description, task.dueDate, task.status, task.priority, task.id
        );
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
};
export const deleteTaskFromDB = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      db.withTransactionSync(() => {
        db.runSync(
          'DELETE FROM tasks WHERE id = ?',
          id
        );
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
};
