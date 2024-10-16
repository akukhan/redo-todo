// App.js
import React, { useEffect } from 'react';
import TabNavigator from './navigation/TabNavigator';
import { TaskProvider } from './TaskContext';

import db from './db';

export default function App() {
  useEffect(() => {
    const setupDatabase = async () => {
      await db.initializeDatabase();
    };
    setupDatabase();
  }, []);

  return(
    <TaskProvider>
      <TabNavigator />
    </TaskProvider>
  ) 
}
