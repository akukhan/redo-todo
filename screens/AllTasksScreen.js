
import React, { useContext, useCallback, useState } from 'react';
import { 
  View, Text, FlatList, Button, StyleSheet, SafeAreaView, Alert, 
  TouchableOpacity, ScrollView 
} from 'react-native';
import { TaskContext } from '../TaskContext';
import { useFocusEffect } from '@react-navigation/native';

export default function AllTasksScreen() {
  const { tasks, categories, deleteTask, fetchTasks, deleteCategory } = useContext(TaskContext);
  const [selectedCategory, setSelectedCategory] = useState('All'); 

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [])
  );

  const confirmDeleteTask = (id) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => deleteTask(id) },
      ]
    );
  };

  const confirmDeleteCategory = (value) => {
    Alert.alert(
      'Delete Category',
      'Are you sure you want to delete this category?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => deleteCategory(value) },
      ]
    );
  };

  const renderTask = ({ item }) => (
    <View style={styles.taskCard}>
      <View>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <Text style={styles.taskCategory}>{item.category}</Text>
      </View>
      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={() => confirmDeleteTask(item.id)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const filteredTasks =
    selectedCategory === 'All'
      ? tasks
      : tasks.filter((task) =>
        task.category === selectedCategory || task.status === selectedCategory
      );


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mainContainer}>
        
        {/* Tasks Section: 70% of the screen */}
        <View style={styles.taskSection}>
          <Text style={styles.sectionHeader}>Tasks</Text>
          <FlatList
            data={filteredTasks}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderTask}
            contentContainerStyle={styles.taskList}
            ListEmptyComponent={<Text style={styles.emptyText}>No tasks available</Text>}
          />
        </View>

        {/* Categories Section: 30% of the screen with scroll */}
        <ScrollView style={styles.categorySection}>
          <Text style={styles.sectionHeader}>Categories</Text>
          <View style={styles.categoriesContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.value}
                style={[
                  styles.categoryCard,
                  selectedCategory === category.value && styles.selectedCategoryCard,
                ]}
                onPress={() => setSelectedCategory(category.value)}
              >
                <Text style={styles.categoryLabel}>{category.label}</Text>
                <TouchableOpacity 
                  style={styles.deleteButton} 
                  onPress={() => confirmDeleteCategory(category.value)}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EAF4F4',
    paddingHorizontal: 16,
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'vertical', // Split horizontally
  },
  taskSection: {
    flex:1.5, // 70% of the screen
    paddingRight: 8,
  },
  categorySection: {
    flex: 3, // 30% of the screen
    paddingLeft: 8,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 8,
    color: '#333',
  },
  taskList: {
    paddingBottom: 16,
  },
  taskCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  taskCategory: {
    fontSize: 13,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 15,
    color: '#999',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  categoryCard: {
    width: '30%', // Allows 3 cards per row
    backgroundColor: '#D1E8E4',
    padding: 10,
    marginVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    position: 'relative',
  },
  selectedCategoryCard: {
    backgroundColor: '#4CAF50',
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 4,
  },
  deleteButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
