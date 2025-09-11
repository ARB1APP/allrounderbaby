import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  BackHandler,
  useColorScheme,
  StatusBar,
  Alert,
} from 'react-native';
import { VdoPlayerView } from 'vdocipher-rn-bridge';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";
const url = 'https://allrounderbaby-czh8hubjgpcxgrc7.canadacentral-01.azurewebsites.net/api/';
import Orientation from 'react-native-orientation-locker';

const VideoPlayerScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const {
    id: videoId,
    otp,
    playbackInfo,
    language,
    step,
    cameFrom,
    total_time,
  } = route.params || {};

  const isDarkMode = useColorScheme() === 'dark';
  const playerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(route.params.total_time || 0);
  const progressUpdated = useRef(false);

  const updateVideoProgress = useCallback(async (isFinished) => {
    if (progressUpdated.current) return;
    progressUpdated.current = true;

    const userId = await AsyncStorage.getItem('userId');
    const token = await AsyncStorage.getItem('token');
    if (!userId || !token) return;

    let currentViews = 0, previousFinishCount = 0;
    try {
        const savedProgress = await AsyncStorage.getItem('userProgress');
        if (savedProgress) {
            const progressData = JSON.parse(savedProgress);
            const videoProgress = progressData.find(p => p.video_id === videoId);
            if (videoProgress) {
                currentViews = videoProgress.total_views || 0;
                previousFinishCount = videoProgress.is_finished || 0;
            }
        }
    } catch (e) { console.error("Failed to get current video views:", e); }

    const currentTimeInSeconds = Math.round(currentTime / 1000);

  
    const isNowConsideredFinished = isFinished || (totalDuration > 0 && currentTimeInSeconds >= totalDuration - 10);

    const newFinishCount = isNowConsideredFinished ? previousFinishCount + 1 : previousFinishCount;

    const payload = {
      User_id: parseInt(userId, 10),
      video_id: videoId,
      last_watched_timestamp_seconds: currentTimeInSeconds,
      Language: language,
      is_finished: newFinishCount,
      level_step: step,
      total_time: totalDuration,
      total_views: currentViews + 1,
      otp: otp, 
      playback: playbackInfo, 
    };
    console.log("Updating video progress:", payload);
    try {
      const endpoint = `${url}User/User_Video_Data`;
      const response = await fetch(endpoint, { 
        method: 'POST', 
        headers: { 
          'Accept': 'application/json', 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        }, 
        body: JSON.stringify(payload) 
      });

      const responseData = await response.json();
      console.log('API Response from User_Video_Data:', responseData);

      if (!response.ok) {
        console.error("Failed to update video progress on server:", responseData.message || 'Unknown error');
        Alert.alert("Sync Error", "Could not save video progress to the server. Your progress may not be saved.");
      } else {
        try {
          const savedProgress = await AsyncStorage.getItem('userProgress');
          let progressData = savedProgress ? JSON.parse(savedProgress) : [];
          const videoIndex = progressData.findIndex(p => p.video_id === videoId);
          
          if (videoIndex > -1) {
            progressData[videoIndex].total_views = payload.total_views;
            progressData[videoIndex].is_finished = payload.is_finished;
            progressData[videoIndex].last_watched_timestamp_seconds = payload.last_watched_timestamp_seconds;
          } else {
            progressData.push({ video_id: videoId, total_views: payload.total_views, is_finished: payload.is_finished, level_step: payload.level_step });
          }
          await AsyncStorage.setItem('userProgress', JSON.stringify(progressData));
          console.log("Local userProgress cache updated.");
        } catch (e) { console.error("Failed to update local userProgress cache:", e); }
      }
    } catch (e) { 
      console.error("Failed to update video progress on back press:", e); 
      Alert.alert("Network Error", "A network error occurred while saving your progress.");
    }
  }, [progressUpdated, videoId, currentTime, language, step, totalDuration, otp, playbackInfo]);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      setError(null);
      progressUpdated.current = false; // Reset progress flag for new video

      return () => {
        // The backAction will handle the progress update on back press.
        if (playerRef.current) {
          try {
            if (typeof playerRef.current.pause === 'function') {
              playerRef.current.pause();
            }
            if (typeof playerRef.current.release === 'function') {
              playerRef.current.release();
            }
          } catch (e) {
            console.error('Cleanup: Error pausing or releasing VdoPlayerView:', e);
          } finally {
            playerRef.current = null;
          }
        }
      };
    }, [])
  );

  const handleLoaded = useCallback(() => {
    setIsLoading(false);
  }, []);

  const backAction = useCallback(async () => {
    await updateVideoProgress(false);
    Orientation.lockToPortrait();
    if (cameFrom === 'Dashboard') {
      navigation.navigate('Home');
    } else if (cameFrom) {
      navigation.navigate(cameFrom);
    } else {
      navigation.goBack();
    }
    return true;
  }, [navigation, cameFrom, updateVideoProgress]);

  const handleEnded = useCallback(async () => {
    await updateVideoProgress(true);
    if (cameFrom === 'Dashboard') {
      navigation.navigate('Home');
    } else if (cameFrom) {
      navigation.navigate(cameFrom);
    } else {
      navigation.goBack();
    }
  }, [navigation, cameFrom, updateVideoProgress]);

  const handleInitFailure = useCallback((err) => {
    setIsLoading(false);
    const errorMessage = err.errorDescription || "Video initialization failed. Please try again.";
    setError(errorMessage);
    Alert.alert("Video Error", errorMessage,
      [{ text: "OK", onPress: () => backAction() }],
      { cancelable: false }
    );
  }, [navigation, cameFrom, backAction]);

  const handleLoadError = useCallback(({ errorDescription }) => {
    setIsLoading(false);
    const errorMessage = errorDescription || "Video failed to load. Please try again.";
    setError(errorMessage);
    Alert.alert("Video Error", errorMessage,
      [{ text: "OK", onPress: () => backAction() }],
      { cancelable: false }
    );
  }, [navigation, cameFrom, backAction]);

  const handleError = useCallback(({ errorDescription }) => {
    setIsLoading(false);
    const errorMessage = errorDescription || "An unknown playback error occurred. Please try again.";
    setError(errorMessage);
    Alert.alert("Video Error", errorMessage,
      [{ text: "OK", onPress: () => backAction() }],
      { cancelable: false }
    );
  }, [navigation, cameFrom, backAction]);

  const handleInitializationSuccess = useCallback(() => {
    // Player is ready, but we wait for onLoaded to hide the spinner
  }, []);

  const handleProgress = useCallback((progress) => {
    setCurrentTime(progress.currentTime);
  }, []);

  const handlePlayerStateChange = useCallback((state) => {
    if (state.duration && state.duration > 0 && state.duration !== totalDuration) {
      setTotalDuration(state.duration);
    }
  }, [totalDuration, setTotalDuration]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => {
      backHandler.remove();
    };
  }, [backAction]);

  if (!otp || !playbackInfo) {
    return (
      <View style={[styles.container, { backgroundColor: isDarkMode ? Colors.darker : Colors.lighter, justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={isDarkMode ? Colors.darker : Colors.lighter} />
        <Text style={[styles.errorText, { color: isDarkMode ? Colors.light : Colors.dark }]}>
         The video details (OTP or playback information) are missing. Please back up and try restarting.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: 'black' }]}>
      <StatusBar barStyle='light-content' backgroundColor='black' />

      {/* {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Loading Video...</Text>
        </View>
      )} */}

      {error && !isLoading ? (
        <View style={[styles.errorContainer, { backgroundColor: isDarkMode ? Colors.darker : Colors.lighter }]}>
          <Text style={[styles.errorText, { color: isDarkMode ? Colors.light : Colors.dark }]}>
            Error: {error}
          </Text>
        </View>
      ) : (
        <VdoPlayerView
          ref={playerRef}
          style={styles.player}
          embedInfo={{
            otp: otp,
            playbackInfo: playbackInfo,
            id: videoId,
          }}
          onInitializationSuccess={handleInitializationSuccess}
          onInitializationFailure={handleInitFailure}
          onLoading={() => setIsLoading(true)}
          onLoaded={handleLoaded}
          onLoadError={handleLoadError}
          onError={handleError}
          onMediaEnded={handleEnded}
          onProgress={handleProgress}
          onPlayerStateChanged={handlePlayerStateChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  player: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 10,
  },
  loadingText: {
    marginTop: 10,
    color: '#FFFFFF',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default VideoPlayerScreen;