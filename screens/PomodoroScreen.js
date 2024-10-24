
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  View, Text, Button, StyleSheet, Alert, FlatList, ScrollView, TextInput , 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProgressBar } from 'react-native-paper';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { WebView } from 'react-native-webview'; // For YouTube music playback
import dataService from '../db';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';


const screenWidth = Dimensions.get('window').width;

const PomodoroScreen = ({ taskTitle, taskId }) => {
  const [time, setTime] = useState(1800); // Default 30 mins
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [focusDuration, setFocusDuration] = useState(1800);
  const [breakDuration, setBreakDuration] = useState(300);
  const [timeSpentToday, setTimeSpentToday] = useState(0);
  const [sessions, setSessions] = useState([]);
  const [focusStreak, setFocusStreak] = useState(0);
  const [musicLink, setMusicLink] = useState('');
  const webviewRef = useRef(null);
  const sessionEndedRef = useRef(false);

  const [graphLabels, setGraphLabels] = useState([]);
const [graphData, setGraphData] = useState([]);

 

  useEffect(() => {
    fetchData();
    loadTodaySessions();
    getFocusTime();
    loadSavedMusicLink();
    loadFocusStreak();
    
  }, []);

  useEffect(() => {
    let interval = null;
  
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      handleSessionEnd();  // End session when time reaches 0
    }
  
    return () => clearInterval(interval);  // Cleanup interval on unmount or pause
  }, [isRunning, time, isBreak]);
 

  const getStartOfWeek = () => {
    const today = new Date();
    const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); // Sunday as start of the week
    firstDayOfWeek.setHours(0, 0, 0, 0); // Reset time to midnight
    return firstDayOfWeek;
  };
  
  const formatDateLabel = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Ensure 2-digit day
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure 2-digit month
    return `${day}/${month}`; // Format as "dd/MM"
  };
  
  const formatSessionsForGraph = async () => {
    await dataService.initializeDatabase();
    const allData = await dataService.allSessions();
    const startOfWeek = getStartOfWeek();
  
    // Group sessions by date and filter for the current week
    const groupedData = allData.reduce((acc, session) => {
      const date = session.session_date.split(' ')[0]; // Extract only the date part
      const sessionDate = new Date(date);
  
      // Only include sessions from the current week
      if (sessionDate >= startOfWeek) {
        acc[date] = (acc[date] || 0) + session.time_spent;
      }
      console.log(acc,"date")
      return acc;
    }, {});
  
    // Ensure labels are sorted by date
    const sortedDates = Object.keys(groupedData).sort((a, b) => new Date(a) - new Date(b));
    const labels = sortedDates.map(formatDateLabel); 
    const data = sortedDates.map((date) => groupedData[date]);
  
    console.log(labels, data, 'all data');
    return { labels, data };
  };
  

  const fetchData = async () => {
    await dataService.initializeDatabase();
    const today = new Date().toISOString().slice(0, 10);
    const fetchedTasks = await dataService.getSessionsByDate(today);
    const { labels, data } = await formatSessionsForGraph();
    setGraphLabels(labels);
    setGraphData(data);
    setSessions(fetchedTasks);
  };

  const loadTodaySessions = async () => {
    const today = new Date().toISOString().slice(0, 10);
    const data = await dataService.getSessionsByDate(today);
    
    setSessions(data);
  };

  const getFocusTime = async () => {
    const totalTime = await dataService.getTotalFocusTime(); // this need to be corrected.
    setTimeSpentToday(totalTime);
  };

  const loadFocusStreak = async () => {
    const streak = await dataService.getFocusStreak();
    setFocusStreak(streak);
  };

  const loadSavedMusicLink = async () => {
    const savedLink = await AsyncStorage.getItem('musicLink');
    if (savedLink) setMusicLink(savedLink);
  };

  const saveMusicLink = async () => {
    await AsyncStorage.setItem('musicLink', musicLink);
    Alert.alert('Music link saved!');
  };

  const removeMusicLink = async () => {
    await AsyncStorage.removeItem('musicLink');
    setMusicLink('');
    Alert.alert('Music link removed!');
  };

  const handleSessionEnd = async () => {

    if (sessionEndedRef.current) return; // Prevent multiple calls
    sessionEndedRef.current = true;
    setIsRunning(false);
    if (!isBreak) {
      await dataService.addSession({
        focus_duration: focusDuration,
        break_duration: breakDuration,
        time_spent: focusDuration,
        is_completed: true,
      });
      Alert.alert('Great job!', 'You’ve completed a focus session!');
    }
    setTime(isBreak ? focusDuration : breakDuration);
    setIsBreak(!isBreak);
    loadTodaySessions();

    // Reset the ref after switching to break or focus
  sessionEndedRef.current = false;
  };

  const startTimer = () => {
    setIsRunning(true);
  
    if (webviewRef.current) {
      webviewRef.current.injectJavaScript(`
        (function() {
          const video = document.querySelector('video');
          if (video && video.paused) {  // Play only if paused
            video.play()
              .then(() => window.ReactNativeWebView.postMessage("Video playing playtimer"))
              .catch(err => window.ReactNativeWebView.postMessage("Play blocked: " + err.message));
          }
        })();
      `);
    }
  };
  
  const pauseTimer = () => {
    setIsRunning(false);
    console.log('Pauser timer is called')
    if (webviewRef.current) {
      webviewRef.current.injectJavaScript(`
        (function() {
        const video = document.querySelector('video');
        if (video && !video.paused) {  // Pause only if playing
          video.pause();
          window.ReactNativeWebView.postMessage("Video paused from React Native pause timer");
        }
      })();
      `);
    }
  };  
  
  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTime(focusDuration);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const formatDate = (label) => {
    const date = new Date(label);  // Assuming the label is a timestamp
    return `${date.getDate()}/${date.getMonth() + 1}`;  // Returns 'DD/MM'
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>      
      <Picker
        selectedValue={focusDuration}
        onValueChange={(value) => {
          setFocusDuration(value); // Update duration
          setTime(value); // Reset time to the new focus duration
          
          setIsRunning(false);
        }}
        style={styles.picker}
      >
        <Picker.Item label="15 minutes" value={30} />
        <Picker.Item label="30 minutes" value={1800} />
        <Picker.Item label="45 minutes" value={2700} />
        <Picker.Item label="60 minutes" value={3600} />
      </Picker>


      <AnimatedCircularProgress
        size={200}
        width={10}
        fill={(1 - time / focusDuration) * 100}
        tintColor="#4CAF50"
        backgroundColor="#e0e0e0"
        rotation={0}
        style={{ marginVertical: 20 }}
      >
        {() => <Text style={styles.timer}>{formatTime(time)}</Text>}
      </AnimatedCircularProgress>

      <ProgressBar progress={1 - time / focusDuration} color="#4CAF50" style={styles.progressBar} />

      <View style={styles.buttonRow}>
        {!isRunning ? (
          <Button title="Start" onPress={startTimer} color="#4CAF50" />
        ) : (
          <Button title="Pause" onPress={pauseTimer} color="#FF5722" />
        )}
        <Button title="Reset" onPress={resetTimer} color="#9E9E9E" />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter YouTube music link"
        value={musicLink}
        onChangeText={setMusicLink}
      />
      <View style={styles.buttonRow}>
        <Button title="Save Link" onPress={saveMusicLink} />
        <Button title="Remove Link" onPress={removeMusicLink} color="#FF5722" />
      </View>

      {musicLink ? (
          <WebView
          ref={webviewRef}
          source={{ uri: musicLink }}
          onLoadEnd={() => {
            console.log("WebView loaded");
            webviewRef.current?.injectJavaScript(`
              const video = document.querySelector('video');
              if (video) {
                video.pause();  // Ensure it's paused on load
                video.onpause = () => window.ReactNativeWebView.postMessage("Video paused");
                video.onplay = () => window.ReactNativeWebView.postMessage("Video playing");
              }
            `);
          }}
          style={{ height: 300, width: 300, marginTop: 10 }}
          onMessage={(event) => console.log("Message from WebView:", event.nativeEvent.data)}
        />
      ) : null}

{/* 
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={styles.sessionItem}>
            Focus: {formatTime(item.focus_duration)}, Spent: {formatTime(item.time_spent)}
          </Text>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No sessions yet!</Text>}
        contentContainerStyle={{ paddingBottom: 100 }} // Prevents overlapping with floating button
        nestedScrollEnabled // Ensures smooth nested scrolling
      /> */}

      <Text style={styles.totalTime}>Total Focus : {formatTime(timeSpentToday)}</Text>

      {graphData.length > 0 && graphLabels.length > 0 ? (
        <View style={styles.graphContainer}>
          <LineChart
            data={{
              labels: graphLabels,
              datasets: [{ data: graphData }],
            }}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#f5f5f5',
              backgroundGradientFrom: '#66bb6a',
              backgroundGradientTo: '#43a047',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 150, 136, ${opacity})`,  // Softer green
              labelColor: (opacity = 1) => `rgba(50, 50, 50, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#4CAF50',  // Accent color for dots
              },
            }}
            style={{ borderRadius: 16 }}
            bezier           
            fromZero
            verticalLabelRotation={10}  // Rotate labels for better readability
            renderDotContent={({ x, y, index }) => (
              <Text
                key={index}
                style={{
                  position: 'absolute',
                  top: y - 15,  // Adjust to position the label slightly above the dot
                  left: x - 10,
                  fontSize: 12,
                  color: '#000',
                  fontWeight: 'bold',
                }}
              >
                {graphData[index]}  {/* Show the time spent on each day */}
              </Text>
            )}
          />
        </View>
      ) : (
        <Text style={styles.emptyText}>No graph data available</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  picker: { width: 250, height: 50, marginVertical: 10 },
  timer: { fontSize: 38, marginVertical: 10 },
  progressBar: { width: '100%', height: 10, marginVertical: 10 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', width: '80%', marginVertical: 10 },
  input: { borderColor: '#ddd', borderWidth: 1, padding: 8, marginVertical: 10, width: '100%' },
  sessionItem: { paddingVertical: 5 },
  totalTime: { fontSize: 18, marginTop: 20 },
});

export default PomodoroScreen;
