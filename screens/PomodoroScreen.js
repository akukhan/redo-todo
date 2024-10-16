// screens/PomodoroScreen.js
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import db from '../db';

export default function PomodoroScreen() {
  const [taskId, setTaskId] = useState(null);
  const [timeSpent, setTimeSpent] = useState(0);

  const startPomodoro = (id) => {
    setTaskId(id);
    setTimeSpent(0); // Reset timer for the task
  };

  const updateTimeSpent = async () => {
    await db.updateTaskTime(taskId, timeSpent);
    alert('Time spent updated!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pomodoro Timer</Text>
      <Button title="Start Task 1" onPress={() => startPomodoro(1)} />
      <Text>Time Spent: {timeSpent} mins</Text>
      <Button title="Update Time" onPress={updateTimeSpent} />
      <Button title="Add 25 mins" onPress={() => setTimeSpent(timeSpent + 25)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
