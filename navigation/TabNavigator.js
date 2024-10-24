// navigation/TabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import HomeScreen from '../screens/HomeScreen';
import AllTasksScreen from '../screens/AllTasksScreen';
import PomodoroScreen from '../screens/PomodoroScreen';
import SingleTodoScreen from '../screens/SingleTodoScreen';
import { format } from 'date-fns';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const currentDate = format(new Date(), 'EEE, MMM do, yyyy');

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
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            switch (route.name) {
              case 'All Lists':
                iconName = 'list-alt';
                break;
              case 'Tasks/Groups':
                iconName = 'category';
                break;
              case 'Pomodore':
                iconName = 'timer';
                break;
              default:
                iconName = 'help-outline';
            }

            return <MaterialIcons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#099c5f',
          tabBarInactiveTintColor: '#d29191',
          tabBarStyle: {
            height: 60,
            paddingBottom: 5,
          },
          headerRight: () => (
            <View style={styles.headerRightContainer}>
              <Text style={styles.headerText}>{currentDate}</Text>
            </View>
          ),
        })}
      >
        <Tab.Screen name="All Lists" component={HomeStack} />
        <Tab.Screen name="Tasks/Groups" component={AllTasksScreen} />
        <Tab.Screen name="Pomodore" component={PomodoroScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  headerRightContainer: {
    marginRight: 18, // Adds spacing to the right
  },
  headerText: {
    fontSize: 14,
    color: '#099c5f',
    fontWeight: 'bold',
  },
});