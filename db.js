import * as SQLite from 'expo-sqlite';


let db;


const initializeDatabase = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('tasks.db');

      // // Drop the existing table if it exists
      // await db.execAsync(`
      //   DROP TABLE IF EXISTS tasks;
      // `);

    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        title TEXT NOT NULL, 
        due_date TEXT,
        start_time TEXT,
        repeat TEXT,
        status TEXT,
        reminder INTEGER,
        category TEXT, 
        time_spent INTEGER DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now')), 
        updated_at TEXT DEFAULT (datetime('now'))
      );
    `);
  }
};

const fetchTasks = async () => {
  try {
    const allRows = await db.getAllAsync('SELECT * FROM tasks;');
    return allRows;
  } catch (error) {
    console.error('Error fetching tasks: ', error);
    return [];
  }
};

const addTask = async (taskData) => {
  const { title, due_date, start_time,  status, category } = taskData;

  try {
    await db.runAsync(
      'INSERT INTO tasks (title,  due_date, start_time, status, category) VALUES (?, ?, ?, ?, ? );',
      [title, due_date, start_time,  status, category]
    );
  } catch (error) {
    console.error('Error adding task: ', error);
  }
};

const updateTask = async (id, taskData) => {
    const { title, due_date, start_time, status, category } = taskData;
  
    try {
      await db.runAsync(
        `UPDATE tasks 
         SET title = ?,  due_date = ?, start_time = ?, status = ?, category = ?, updated_at = datetime('now')
         WHERE id = ?;`,
        [title, due_date, start_time, status, category, id]
      );
    } catch (error) {
      console.error('Error updating task: ', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await db.runAsync('DELETE FROM tasks WHERE id = ?;', [id]);
    } catch (error) {
      console.error('Error deleting task: ', error);
    }
  };

  const fetchTaskById = async (id) => {
    try {
      const task = await db.getFirstAsync('SELECT * FROM tasks WHERE id = ?;', [id]);
      return task;
    } catch (error) {
      console.error('Error fetching task by ID: ', error);
      return null;
    }
  };

  const getTaskById = async (taskId) => {
    try {
      const db = await SQLite.openDatabaseAsync('tasks.db');
      const task = await db.getFirstAsync('SELECT * FROM tasks WHERE id = ?;', [taskId]);
      return task;
    } catch (error) {
      console.error('Error fetching task by ID: ', error);
      return null;
    }
  };


// Update task time using `runAsync`
const updateTaskTime = async (taskId, timeSpent) => {
  try {
    const db = await SQLite.openDatabaseAsync('tasks.db');
    await db.runAsync('UPDATE tasks SET time_spent = ? WHERE id = ?;', [timeSpent, taskId]);
  } catch (error) {
    console.error('Error updating task time spent: ', error);
  }
};

const updateTaskStatus = async (id, status) => {
  await db.runAsync(`
    UPDATE tasks
    SET status = ?, updated_at = datetime('now')
    WHERE id = ?
  `, [status, id]);
};

export default {
  initializeDatabase,
  fetchTasks,
  addTask,
  updateTask,
  deleteTask,
  fetchTaskById,
  updateTaskTime,
  getTaskById,
  updateTaskStatus
};
