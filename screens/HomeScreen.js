
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Checkbox from 'expo-checkbox';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import dataService from '../db';
import CustomHeader from './CustomHeader';

const HomeScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredTasks, setFilteredTasks] = useState([]);

  const navigation = useNavigation();

  const fetchData = async () => {
    await dataService.initializeDatabase();
    const fetchedTasks = await dataService.fetchTasks();
    setTasks(fetchedTasks);
    filterTasks(fetchedTasks, selectedCategory);
  };

  const filterTasks = (tasks, category) => {
    if (category === 'All') {
      setFilteredTasks(tasks.filter((task) => task.status !== 'Completed'));
    } else if (category === 'Completed') {
      setFilteredTasks(tasks.filter((task) => task.status === 'Completed'));
    } else {
      setFilteredTasks(tasks.filter((task) => task.category === category && task.status === 'Pending'));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  useEffect(() => {
    filterTasks(tasks, selectedCategory);
  }, [selectedCategory, tasks]);

  const handleQuickAddTask = async () => {
    if (!newTaskTitle) return;
    await dataService.addTask({ title: newTaskTitle, status: 'Pending' });
    setNewTaskTitle('');
    fetchData();
  };

  const toggleTaskCompletion = async (task) => {
    const updatedStatus = task.status === 'Pending' ? 'Completed' : 'Pending';
    await dataService.updateTaskStatus(task.id, updatedStatus);
    fetchData();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'EEE, MMM d, yyyy');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomHeader
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Main Task List */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('SingleTodoScreen', { task: item })}
          >
            <View style={styles.taskContainer}>
              <Checkbox
                style={styles.checkbox}
                value={item.status === 'Completed'}
                onValueChange={() => toggleTaskCompletion(item)}
                color={item.status === 'Completed' ? '#4CAF50' : undefined}
              />
              <View style={styles.card}>
                <Text style={styles.taskTitle}>{item.title}</Text>
                {item.due_date && (
                  <Text style={styles.taskDetails}>
                    Due: {formatDate(item.due_date)}, {item.start_time || ''}
                  </Text>
                )}
                <Text style={styles.taskDetails}>{item.category}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 100 }} // Prevents overlapping with floating button
        nestedScrollEnabled // Ensures smooth nested scrolling
      />

      {/* Quick Add Task Section */}
      <View style={styles.quickAddContainer}>
        <TextInput
          style={styles.quickAddInput}
          value={newTaskTitle}
          onChangeText={setNewTaskTitle}
          placeholder="Add a quick task"
        />
        <TouchableOpacity style={styles.addButton} onPress={handleQuickAddTask}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Floating Button for Navigation */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('SingleTodoScreen')}
      >
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginVertical: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 3,
  },
  card: {
    flex: 1,
    marginLeft: 10,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskDetails: {
    fontSize: 14,
    color: '#6c757d',
  },
  checkbox: {
    marginRight: 10,
  },
  quickAddContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#DDDDDD',
  },
  quickAddInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#CCCCCC',
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 65,
    right: 5,
    backgroundColor: '#28A745',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    elevation: 5,
  },
  floatingButtonText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
