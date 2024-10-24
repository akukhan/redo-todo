import React, { createContext, useState, useEffect, useCallback } from 'react';
import dataService from './db';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { INITIAL_CATEGORIES } from './constants';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);

  const fetchTasks = async () => {
    try {
        await dataService.initializeDatabase(); // Ensure DB is initialized
        const data = await dataService.fetchTasks(); // Fetch tasks after DB init
        setTasks(data);
      } catch (error) {
        console.error('Error initializing database or fetching tasks: ', error);
      }
  };

    // Helper to ensure protected categories are always present
    const ensureProtectedCategories = (loadedCategories) => {
      const missingProtected = INITIAL_CATEGORIES.filter(
        (cat) => cat.protected && !loadedCategories.some((c) => c.value === cat.value)
      );
      return [...loadedCategories, ...missingProtected];
    }

  // Load categories from AsyncStorage or use defaults
  const loadCategories = useCallback(async () => {
    try {
      const storedCategories = await AsyncStorage.getItem('categories');
      let loadedCategories = storedCategories ? JSON.parse(storedCategories) : INITIAL_CATEGORIES;
      loadedCategories = ensureProtectedCategories(loadedCategories);
      setCategories(loadedCategories);
      await AsyncStorage.setItem('categories', JSON.stringify(loadedCategories));
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }, []);

    // Add a new category and save it to AsyncStorage
  const addCategory = async (newCategory) => {
    const exists = categories.some((cat) => cat.value === newCategory);
    if (!exists) {
      const updatedCategories = [...categories, { label: newCategory, value: newCategory }];
      setCategories(updatedCategories);
      await AsyncStorage.setItem('categories', JSON.stringify(updatedCategories));
    }
  };

   // Delete a category
   const deleteCategory = async (categoryValue) => {
    const category = categories.find((cat) => cat.value === categoryValue);

    if (category?.protected) {
      console.warn(`Protected category "${categoryValue}" cannot be deleted.`);
      
      return; // Do nothing for protected categories
    }

    const updatedCategories = categories.filter((cat) => cat.value !== categoryValue);
    setCategories(updatedCategories);
    await AsyncStorage.setItem('categories', JSON.stringify(updatedCategories));
  };



  useEffect(() => {
    fetchTasks(); // Load tasks initially
    loadCategories();
  }, [loadCategories]);

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
    <TaskContext.Provider value={{ tasks, categories, addTask, deleteTask, fetchTasks, addCategory, deleteCategory }}>
      {children}
    </TaskContext.Provider>
  );
};
