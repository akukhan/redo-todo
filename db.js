import * as SQLite from 'expo-sqlite';


let db;
let dbsessions ;


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

  if (!dbsessions) {
    dbsessions = await SQLite.openDatabaseAsync('sessions.db');


    await dbsessions.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        focus_duration INTEGER,
        break_duration INTEGER,
        time_spent INTEGER,
        is_completed BOOLEAN,
        session_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TEXT DEFAULT (datetime('now')), 
        updated_at TEXT DEFAULT (datetime('now'))
      );
    `);
  }

};

// adds a new Pomodoro session 
export const addSession = async (sessionData) => {
  const { focus_duration, break_duration, time_spent, is_completed } = sessionData;

  try {
    await dbsessions.runAsync(
      `INSERT INTO sessions (focus_duration, break_duration, time_spent, is_completed) 
       VALUES (?, ?, ?, ?);`,
      [focus_duration, break_duration, time_spent, is_completed ? 1 : 0]
    );
    console.log('Session added successfully');
  } catch (error) {
    console.error('Error adding session: ', error);
  }
};

//get all Sessions

export const allSessions = async() =>{
  try {
    const allRows = await dbsessions.getAllAsync(
      `SELECT * FROM sessions;`,      
    );
 
    return allRows;
  } catch (error) {
    console.error('Error fetching All sessions: ', error);
    return [];
  }
}

//Get Sessions by Date
export const getSessionsByDate = async (date) => {
  try {
    const allRows = await dbsessions.getAllAsync(
      `SELECT * FROM sessions WHERE date(session_date) = ? ORDER BY session_date DESC;`,
      [date]
    );
    return allRows;
  } catch (error) {
    console.error('Error fetching sessions: ', error);
    return [];
  }
};

//Update Session
export const updateSession = async (id, sessionData) => {
  const { time_spent, is_completed } = sessionData;

  try {
    await dbsessions.runAsync(
      `UPDATE sessions 
       SET time_spent = ?, is_completed = ?, updated_at = datetime('now')
       WHERE id = ?;`,
      [time_spent, is_completed ? 1 : 0, id]
    );
    console.log('Session updated successfully');
  } catch (error) {
    console.error('Error updating session: ', error);
  }
};

// Get Total Focus Time
export const getTotalFocusTime = async () => {
  try {
    const result = await dbsessions.getAllAsync(
      `SELECT SUM(time_spent) AS total_focus_time FROM sessions WHERE is_completed = 1;`
    );
    return result[0]?.total_focus_time || 0;
  } catch (error) {
    console.error('Error fetching total focus time: ', error);
    return 0;
  }
};

// Delete Old Sessions (Optional)
export const deleteOldSessions = async (days) => {
  try {
    await dbsessions.runAsync(
      `DELETE FROM sessions WHERE session_date <= date('now', ?);`,
      [`-${days} days`]
    );
    console.log(`Sessions older than ${days} days deleted.`);
  } catch (error) {
    console.error('Error deleting old sessions: ', error);
  }
};

export const getFocusStreak = async () => {
  try {
    const result = await dbsessions.getAllAsync(`
      SELECT COUNT(DISTINCT date(session_date)) AS streak
      FROM sessions
      WHERE session_date >= date('now', '-7 days');
    `);
    return result[0]?.streak || 0;
  } catch (error) {
    console.error('Error fetching streak: ', error);
    return 0;
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
  updateTaskStatus,
  addSession,
  getSessionsByDate,
  updateSession,
  getTotalFocusTime,
  deleteOldSessions,
  getFocusStreak,
  allSessions
};
