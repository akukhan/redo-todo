// screens/SingleTodoScreen.js
// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
// import db from '../db';

// const SingleTodoScreen = ({ navigation }) => {
//   const [title, setTitle] = useState('');
 
//   const [category, setCategory] = useState('');

//   const handleAddTask = async () => {
//     if (!title) {
//       Alert.alert('Error', 'Please enter a task title.');
//       return;
//     }

//     await db.addTask({ title, category, status: 'Pending' });
//     Alert.alert('Success', 'Task added!');
//     navigation.goBack(); // Return to HomeScreen
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.label}>Title</Text>
//       <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Enter task title" />

//       <Text style={styles.label}>Category</Text>
//       <TextInput style={styles.input} value={category} onChangeText={setCategory} placeholder="Enter category" />

//       <Button title="Add Task" onPress={handleAddTask} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   label: {
//     fontWeight: 'bold',
//     marginTop: 10,
//   },
//   input: {
//     borderBottomWidth: 1,
//     marginBottom: 15,
//   },
// });

// export default SingleTodoScreen;


// screens/SingleTodoScreen.js

import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import dataService from '../db';

const SingleTodoScreen = ({ route, navigation }) => {
  const { task } = route.params || {};

  const [title, setTitle] = useState(task?.title || '');
  const [category, setCategory] = useState(task?.category || '');
  const [status, setStatus] = useState(task?.status || 'Pending');
  const [dueDateInput, setDueDateInput] = useState(task?.due_date || '');
  const [showDatePicker, setShowDatePicker] = useState(false);

 const [startTime, setStartTime] = useState(task?.start_time || '');
 const [showStartTimePicker, setShowStartTimePicker] = useState(false);


  const isEditing = !!task;

  const handleAddTask = async () => {
    if (title) {
      if (isEditing) {
        //update the existing task
        await dataService.updateTask(task.id,{
          id: task.id,
          title,
          category,
          status,
          due_date: dueDateInput || null,
          start_time: startTime ? startTime : null,
        })
        navigation.goBack()
      } else {
        //add a new task
        await dataService.addTask({
          title,
          category,
          status,
          due_date: dueDateInput ? dueDateInput : null,
          start_time: startTime ? startTime : null,
        });
        navigation.goBack(); // Go back to the Home screen
      }
    }
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || dueDateInput;
    setShowDatePicker(false);
    setDueDateInput(currentDate.toISOString().split('T')[0]);  // Store the date in YYYY-MM-DD format
  };

  const onChangeStartTime = (event, selectedTime) => {
    setShowStartTimePicker(false);
    if (selectedTime) {
      const formattedTime = selectedTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })    
      setStartTime(formattedTime)
    }
  };

  const formatDate = (dateString) => {
  const date = new Date(dateString);
  
  const day = date.toLocaleDateString('en-US', { weekday: 'short' }); // e.g., "Wed"
  const month = date.toLocaleDateString('en-US', { month: 'short' }); // e.g., "Oct"
  const dayOfMonth = date.getDate(); // e.g., "16"
  const year = date.getFullYear(); // e.g., "2024"
  
  const dayWithSuffix = addOrdinalSuffix(dayOfMonth); // Adds the "th", "st", "nd", "rd"

  return `${day}, ${month} ${dayWithSuffix}, ${year}`;
};

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Task Title:</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter task title"
      />
      <Text style={styles.label}>due_date:</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
         <TextInput
           style={styles.input}
           placeholder="Due Date (YYYY-MM-DD)..."
           value={dueDateInput}
           // onChangeText={setDueDateInput}
           editable={false}
         />
       </TouchableOpacity>

       {showDatePicker && (
         <DateTimePicker
           value={new Date()}
           mode="date"
           display="default"
           onChange={onChangeDate}
         />
       )}

      <TouchableOpacity onPress={() => setShowStartTimePicker(true)}>
        <TextInput
          style={styles.input}
          placeholder="Start Time (HH:MM)"
          value={startTime}
          editable={false}
        />
      </TouchableOpacity>
      {showStartTimePicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          display="default"
          onChange={onChangeStartTime}
        />
      )}

      <Text style={styles.label}>Category:</Text>
      <RNPickerSelect
        onValueChange={(value) => setCategory(value)}
        items={[
          { label: 'Work', value: 'Work' },
          { label: 'Personal', value: 'Personal' },
          { label: 'Home', value: 'Home' },
          { label: 'Shopping', value: 'Shopping' },
        ]}
        value={category}
        style={pickerSelectStyles}
        placeholder={{ label: 'Select Category', value: null }}
      />

   
      <Button title={isEditing ? "Save Changes" : "Add Task"} onPress={handleAddTask} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
  },
};

export default SingleTodoScreen;
