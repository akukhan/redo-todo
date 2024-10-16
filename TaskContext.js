import React, { createContext, useState, useEffect } from 'react';
import dataService from './db';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
        await dataService.initializeDatabase(); // Ensure DB is initialized
        const data = await dataService.fetchTasks(); // Fetch tasks after DB init
        setTasks(data);
      } catch (error) {
        console.error('Error initializing database or fetching tasks: ', error);
      }
  };

  useEffect(() => {
    fetchTasks(); // Load tasks initially
  }, []);

  const addTask = async (newTask) => {
    await dataService.addTask(newTask);
    const updatedTasks = await dataService.fetchTasks();
    setTasks(updatedTasks) // Fetch updated tasks
  };

  const deleteTask = async (id) => {
    await dataService.deleteTask(id);
    fetchTasks(); // Fetch updated tasks
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, deleteTask, fetchTasks }}>
      {children}
    </TaskContext.Provider>
  );
};
