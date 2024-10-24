
import React, { useContext, useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import dataService from '../db';
import { TaskContext } from '../TaskContext';

const SingleTodoScreen = ({ route, navigation }) => {
  const { task } = route.params || {};
  const { categories, addCategory } = useContext(TaskContext);

  const [title, setTitle] = useState(task?.title || '');
  const [category, setCategory] = useState(task?.category || '');
  const [status, setStatus] = useState(task?.status || 'Pending');
  const [dueDateInput, setDueDateInput] = useState(task?.due_date || '');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startTime, setStartTime] = useState(task?.start_time || '');
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  const isEditing = !!task;

  const handleAddTask = async () => {
    if (!title.trim()) {
      Alert.alert('Validation', 'Please enter a task title.');
      return;
    }

    const taskData = {
      title,
      category,
      status,
      due_date: dueDateInput || null,
      start_time: startTime || null,
    };

    if (isEditing) {
      await dataService.updateTask(task.id, { ...taskData, id: task.id });
    } else {
      await dataService.addTask(taskData);
    }

    navigation.goBack(); // Navigate back to the task list.
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      addCategory(newCategory);
      setCategory(newCategory);
      setNewCategory('');
    } else {
      Alert.alert('Validation', 'Please enter a category name.');
    }
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDateInput(selectedDate.toISOString().split('T')[0]);
    }
  };

  const onChangeStartTime = (event, selectedTime) => {
    setShowStartTimePicker(false);
    if (selectedTime) {
      const formattedTime = selectedTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      setStartTime(formattedTime);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>
        {isEditing ? 'Edit Task' : 'Add New Task'}
      </Text>

      <Text style={styles.label}>Task Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter task title"
      />

      <Text style={styles.label}>Due Date</Text>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.datePicker}>
        <Text style={styles.dateText}>
          {dueDateInput || 'Select Due Date'}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}

      <Text style={styles.label}>Start Time</Text>
      <TouchableOpacity
        onPress={() => setShowStartTimePicker(true)}
        style={styles.datePicker}>
        <Text style={styles.dateText}>
          {startTime || 'Select Start Time'}
        </Text>
      </TouchableOpacity>
      {showStartTimePicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          display="default"
          onChange={onChangeStartTime}
        />
      )}

      <Text style={styles.label}>Category</Text>
      <RNPickerSelect
        onValueChange={(value) => setCategory(value)}
        items={categories}
        value={category}
        style={pickerSelectStyles}
        placeholder={{ label: 'Select Category', value: null }}
      />

      <View style={styles.categoryInputContainer}>
        <TextInput
          style={styles.input}
          value={newCategory}
          onChangeText={setNewCategory}
          placeholder="Add New Category"
        />
        <TouchableOpacity
          onPress={handleAddCategory}
          style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleAddTask}>
        <Text style={styles.saveButtonText}>
          {isEditing ? 'Save Changes' : 'Add Task'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  headerText: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  label: {
    fontSize: 15,
    marginVertical: 5,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 10,
    marginBottom: 13,
    backgroundColor: '#FFF',
  },
  datePicker: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    backgroundColor: '#FFF',
    marginBottom: 13,
  },
  dateText: {
    color: '#333',
  },
  categoryInputContainer: {
    flexDirection: 'row',
    marginTop: 5,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    marginLeft: 5,
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    padding: 12,
    borderColor: '#DDD',
    borderRadius: 8,
    color: 'black',
    marginBottom: 16,
    backgroundColor: '#FFF',
  },
  inputAndroid: {
    fontSize: 16,
    padding: 10,
    borderColor: '#DDD',
    borderRadius: 8,
    color: 'black',
    backgroundColor: '#FFF',
  },
};

export default SingleTodoScreen;

