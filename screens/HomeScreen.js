// screens/HomeScreen.js

// import React, { useEffect, useState , useCallback } from 'react';
// import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';

// import { useNavigation, useFocusEffect  } from '@react-navigation/native';
// import { format, startOfWeek, addDays } from 'date-fns';
// // import PomodoroTimer from './PomodoroTimer';
// import dataService from '../db';

// const HomeScreen = () => {
//   const [selectedTask, setSelectedTask] = useState(null);
//   const [totalTasks, setTotalTasks] = useState(0);
//   const [completedTasks, setCompletedTasks] = useState(0);
//   const [tasks, setTasks] = useState([]);
//   // const navigation = useNavigation();
//   const currentDate = format(new Date(), 'EEEE, MMMM do, yyyy');



//   const fetchData = async () => {
//     await dataService.initializeDatabase();
//     const fetchedTasks = await dataService.fetchTasks();
//     setTasks(fetchedTasks);
//     setTotalTasks(fetchedTasks.length);

//     // Count completed tasks
//     const completed = fetchedTasks.filter((task) => task.status === 'Completed').length;
//     setCompletedTasks(completed);
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);
  

//   useFocusEffect(
//     useCallback(() => {
//       // fetchData();
//       const interval = setInterval(() => {
//         fetchData(); // Continuously re-fetch data to update task times when switching tabs
//       }, 1000);
//     }, [])
//   );

//   const formatTime = (seconds) => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <ScrollView style={styles.scrollView}>
//         <Text style={styles.date}>{currentDate}</Text>    
      

//         <Text style={styles.title}>Your Tasks</Text>
//         <FlatList
//           data={tasks}
//           keyExtractor={(item) => item.id.toString()}
//           renderItem={({ item }) => (
//             <TouchableOpacity onPress={() => setSelectedTask(item)}>
//               <View style={styles.card}>
//                 <Text style={styles.taskTitle}>{item.title}</Text>
//                 <Text style={styles.taskDescription}>{item.description}</Text>
//                 <Text>Total Time Spent: {formatTime(item.time_spent)}</Text>
//               </View>
//             </TouchableOpacity>
//           )}
//           nestedScrollEnabled
//           scrollEnabled={false}
//         />
//       </ScrollView>
//       {/* <View style={styles.buttonContainer}>
//         <Button title="Clear Selected Task" onPress={() => setSelectedTask(null)} />
//       </View> */}
//     </SafeAreaView>
//   );
// };


// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#f8f9fa', // Soft background color
//   },
//   date: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#888',
//     marginVertical: 10,
//     textAlign: 'center',
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 15,
//   },
//   summaryContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     backgroundColor: '#ffffff',
//     padding: 15,
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 5,
//     marginBottom: 20,
//   },
//   buttonContainer: {
//     padding: 15,
//     backgroundColor: '#f1f1f1',
//     borderTopWidth: 1,
//     borderTopColor: '#ddd',
//   },
//   button: {
//     backgroundColor: '#00BFA6',
//     padding: 15,
//     borderRadius: 30,
//     alignItems: 'center',
//     marginVertical: 10,
//   },
//   buttonText: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   card: {
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 15,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     elevation: 5,
//   },
//   taskTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   taskDescription: {
//     fontSize: 14,
//     color: '#777',
//     marginTop: 5,
//   },
// });


// export default HomeScreen;

// screens/HomeScreen.js

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,    
} from 'react-native';
import Checkbox from 'expo-checkbox';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import RNPickerSelect from 'react-native-picker-select';
import dataService from '../db';
import CustomHeader from './CustomHeader';

const HomeScreen = () => {
  const [tasks, setTasks] = useState([]);
  // const [totalTasks, setTotalTasks] = useState(0);
  // const [completedTasks, setCompletedTasks] = useState(0);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredTasks, setFilteredTasks] = useState([]);

  const navigation = useNavigation();
  const currentDate = format(new Date(), 'EEEE, MMMM do, yyyy');

  const fetchData = async () => {
    await dataService.initializeDatabase();
    const fetchedTasks = await dataService.fetchTasks();
    
    setTasks(fetchedTasks);
    filterTasks(fetchedTasks, selectedCategory);
  };

  const filterTasks = (tasks, category) => {
    if (category === 'All') {
      const filtered = tasks.filter((task) => task.status !== "Completed");  
      setFilteredTasks(filtered);
    } else if(category === 'Completed') {
      const filtered = tasks.filter((task) => task.status === category );      
      setFilteredTasks(filtered);
    }  else {      
      const filtered = tasks.filter((task) => task.category === category && task.status ==='Pending');      
      setFilteredTasks(filtered);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      // const interval = setInterval(() => {
        fetchData();
      // }, 5000);

      // return () => clearInterval(interval);
    }, [])
  );

  useEffect(() => {
    console.log('Selected Category Changed:', selectedCategory);
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
    console.log(updatedStatus,"status")
    await dataService.updateTaskStatus(task.id, updatedStatus);
   
    fetchData();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    const day = date.toLocaleDateString('en-US', { weekday: 'short' }); // e.g., "Wed"
    const month = date.toLocaleDateString('en-US', { month: 'short' }); // e.g., "Oct"
    const dayOfMonth = date.getDate(); // e.g., "16"
    const year = date.getFullYear(); // e.g., "2024"
     
  
    return `${day}, ${month}, ${year}`;
  };  

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.date}>{currentDate}</Text>

        <CustomHeader
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      

        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('SingleTodoScreen', { task: item })}>
              <View style={styles.taskContainer}>
                <Checkbox
                  style={styles.checkbox}
                  value={item.status === 'Completed'}
                  onValueChange={() => toggleTaskCompletion(item)}
                  color={item.status === 'Completed' ? '#11398e' : undefined}
                />
              
                  <View style={styles.card}>
                    <Text style={styles.taskTitle}>{item.title}</Text>
                    {item.due_date ? <Text>due_date: {formatDate(item.due_date)}</Text> : null}
                    {item.start_time ? <Text>{item.start_time}</Text>: null}
                    <Text>{item.category}</Text>

                  </View>

              
              </View>
            </TouchableOpacity>
          )}
          nestedScrollEnabled
          scrollEnabled={false}
        />
      </ScrollView>

      <View style={styles.quickAddContainer}>
        <TextInput
          style={styles.quickAddInput}
          value={newTaskTitle}
          onChangeText={setNewTaskTitle}
          placeholder="Add a quick task"
        />
        <Button title="Add" onPress={handleQuickAddTask} />
      </View>

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
    backgroundColor: '#7fdbb5',
  },
  date: {
    fontSize: 15,
    fontWeight: '600',
    color: '#06145c',
    textAlign: 'center',
    marginVertical: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 19,
    fontWeight: 'bold',
  },
  taskContainer: { 
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3fb2d8',
   
    borderRadius: 12,
    marginBottom: 10,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  card: {
    backgroundColor: '#3fb2d8',
    padding: 10,
    borderRadius: 15,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    elevation: 5,
    flex: 1,
    
  },
  taskTitle: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  
  checkbox: {
     marginRight: 10,
     borderColor: '#fff'
  },
  quickAddContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  quickAddInput: {
    flex: 1,
    borderBottomWidth: 1,
    marginRight: 10,
  },
   floatingButton: {
    position: 'absolute',
    bottom: 60,
    right: 10,
    backgroundColor: '#3498db',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    color:'#605d5d'
  },
  floatingButtonText: {
    color: '#fff',
    fontSize: 30,
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
  },
};

export default HomeScreen;
