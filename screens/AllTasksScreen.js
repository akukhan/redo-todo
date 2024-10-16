// screens/AllTasksScreen.js
import React, {useContext, useCallback, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { TaskContext } from '../TaskContext';
import { useFocusEffect } from '@react-navigation/native';
import db from '../db';

export default function AllTasksScreen() {
  const { tasks, deleteTask, fetchTasks } = useContext(TaskContext);
 

  useFocusEffect(
    useCallback(() => {
      fetchTasks();  // Fetch tasks when the screen is focused
    }, [])
  );

  const renderItem = ({ item }) => (
    <View style={styles.taskContainer}>
      <Text style={styles.taskTitle}>{item.title}</Text>
      <Button title="Delete" onPress={() => deleteTask(item.id)} />
    </View>
  );

  // const handleDeleteTask = async (id) => {
  //   await db.deleteTask(id);
  //   const updatedTasks = tasks.filter((task) => task.id !== id);
  //   setTasks(updatedTasks);
  // };

  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  taskTitle: {
    fontSize: 18,
  },
});

