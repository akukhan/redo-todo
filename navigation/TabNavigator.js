// navigation/TabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import AllTasksScreen from '../screens/AllTasksScreen';
import PomodoroScreen from '../screens/PomodoroScreen';
import { NavigationContainer } from '@react-navigation/native';
import SingleTodoScreen from '../screens/SingleTodoScreen';
import { createStackNavigator } from '@react-navigation/stack';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="SingleTodoScreen" component={SingleTodoScreen} />
    </Stack.Navigator>
  );
}

export default function TabNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="All Lists" component={HomeStack} />
        <Tab.Screen name="Tasks" component={AllTasksScreen} />
        <Tab.Screen name="Pomodoro" component={PomodoroScreen} />
 
      </Tab.Navigator>
    </NavigationContainer>
  );
}
