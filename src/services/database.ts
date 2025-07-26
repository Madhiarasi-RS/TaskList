// src/services/database.ts
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('tasks.db');

export default db;
