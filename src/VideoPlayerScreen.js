import { StatusBar } from 'react-native';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useIsFocused } from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  View,
  BackHandler,
  AppState,
  useColorScheme,
  Alert,
  NativeModules,
  Dimensions,
} from 'react-native';
import { VdoPlayerView } from 'vdocipher-rn-bridge';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './config/api';

const url = BASE_URL;
import Orientation from 'react-native-orientation-locker';

const VideoPlayerScreen = (props) => {
      const isFocused = useIsFocused();
      useEffect(() => {
        if (isFocused) {
          StatusBar.setBarStyle('light-content');
        }
      }, [isFocused]);
    useEffect(() => {
      StatusBar.setBarStyle('light-content');
    }, []);
  const route = useRoute();
  const navigation = useNavigation();
  const [orientation, setOrientation] = useState('PORTRAIT');

  const {
    id: videoId,
    otp,
    playbackInfo,
    language,
    step,
    cameFrom,
    total_time,
    stage_name,
    displayStep,
  } = route.params || {};

  const isDarkMode = useColorScheme() === 'dark';
  const playerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(route.params?.total_time || 0);
  const progressUpdated = useRef(false);

  useFocusEffect(
    useCallback(() => {
      Orientation.unlockAllOrientations();

      const orientationListener = (o) => {
        setOrientation(o);
        navigation.setOptions({
          headerShown: !(o && o.includes && o.includes('LANDSCAPE')),
        });
      };

      Orientation.addOrientationListener(orientationListener);

      Orientation.getOrientation((o) => {
        setOrientation(o);
        navigation.setOptions({
          headerShown: !(o && o.includes && o.includes('LANDSCAPE')),
        });
      });

      return () => {
        Orientation.removeOrientationListener(orientationListener);
        Orientation.lockToPortrait();
      };
    }, [navigation])
  );

  const updateVideoProgress = useCallback(async (isFinished) => {
    if (progressUpdated.current) return;
    progressUpdated.current = true;

    const userId = await AsyncStorage.getItem('userId');
    const token = await AsyncStorage.getItem('token');
    const deviceKey = await AsyncStorage.getItem('deviceKey');
    if (!userId || !token) {
      return;
    }

    let currentViews = 0;
    let previousFinishCount = 0;
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
    } catch (e) { console.error("Failed to get local video progress:", e); }

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
      stage_name: (stage_name ? stage_name : '') + " " + (typeof displayStep !== 'undefined' && displayStep !== null ? displayStep : step),
      deviceKey: deviceKey,
    };

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
      if (response.ok && responseData.code === 200) {
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
        } catch (e) {
          console.error("Failed to update local userProgress cache:", e);
        }
      } else {
        const errorMessage = responseData.message || `HTTP Error: ${response.status}`;
        console.error("Failed to update video progress on server:", errorMessage);
      }
    } catch (e) {
      console.error("A network error occurred while updating video progress:", e);
    }
  }, [videoId, currentTime, language, step, totalDuration, otp, playbackInfo, stage_name]);

  useFocusEffect(
    useCallback(() => {
      progressUpdated.current = false;
      return () => {
        progressUpdated.current = false;
      };
    }, [])
  );

  useEffect(() => {
    return () => {
      try {
        if (playerRef.current) {
          try {
            if (typeof playerRef.current.pause === 'function') playerRef.current.pause();
            if (typeof playerRef.current.stop === 'function') playerRef.current.stop();
            if (typeof playerRef.current.release === 'function') playerRef.current.release();
          } catch (e) {
            console.error('Unmount cleanup error:', e);
          } finally {
            playerRef.current = null;
          }
        }
        stopNativePlayer();
      } catch (e) {
        console.error('Unmount: Error in cleanup:', e);
      }
    };
  }, []);

  const handleLoaded = useCallback(() => {
    setIsLoading(false);
  }, []);

  const stopNativePlayer = useCallback(() => {
    try {
      const nm = NativeModules || {};
      const modulesToTry = [nm.VdoPlayer, nm.VdocipherRnBridge, nm.Vdocipher, nm.VdocipherRNBridge, nm.Vdo];
      const methodNames = ['stop', 'pause', 'release', 'releasePlayer', 'destroy', 'stopPlayer'];

      modulesToTry.forEach(mod => {
        if (!mod) return;
        methodNames.forEach(m => {
          try {
            if (typeof mod[m] === 'function') {
              mod[m]();
            }
          } catch (e) {}
        });
      });
    } catch (e) {
      console.error('stopNativePlayer: error', e);
    }
  }, []);

  const backAction = useCallback(async () => {
    if (orientation && orientation.includes('LANDSCAPE')) {
      try {
        Orientation.lockToPortrait();
        if (playerRef.current && typeof playerRef.current.exitFullscreen === 'function') {
          playerRef.current.exitFullscreen();
        }
        navigation.setOptions({ headerShown: true });
      } catch (e) {
        console.error('Error exiting fullscreen on back:', e);
      }
      return true;
    }

    if (playerRef.current) {
      try {
        if (typeof playerRef.current.pause === 'function') playerRef.current.pause();
        if (typeof playerRef.current.stop === 'function') playerRef.current.stop();
      } catch (e) {
        console.error('Error stopping video on back:', e);
      }
    }
    stopNativePlayer();
    
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
  }, [navigation, cameFrom, updateVideoProgress, stopNativePlayer, orientation]);

  const handleEnded = useCallback(async () => {
   if (playerRef.current) {
      try {
        if (typeof playerRef.current.pause === 'function') playerRef.current.pause();
        if (typeof playerRef.current.stop === 'function') playerRef.current.stop();
      } catch (e) {
        console.error('Error stopping video on end:', e);
      }
    }
    stopNativePlayer();
    
    await updateVideoProgress(true);
    if (cameFrom === 'Dashboard') {
      navigation.navigate('Home');
    } else if (cameFrom) {
      navigation.navigate(cameFrom);
    } else {
      navigation.goBack();
    }
  }, [navigation, cameFrom, updateVideoProgress, stopNativePlayer]);

  const handleInitFailure = useCallback((err) => {
    setIsLoading(false);
    const errorMessage = err.errorDescription || "Video initialization failed. Please try again.";
    setError(errorMessage);
    Alert.alert("Video Error", errorMessage,
      [{ text: "OK", onPress: () => backAction() }],
      { cancelable: false }
    );
  }, [backAction]);

  const handleLoadError = useCallback(({ errorDescription }) => {
    setIsLoading(false);
    const errorMessage = errorDescription || "Video failed to load. Please try again.";
    setError(errorMessage);
    Alert.alert("Video Error", errorMessage,
      [{ text: "OK", onPress: () => backAction() }],
      { cancelable: false }
    );
  }, [backAction]);

  const handleError = useCallback(({ errorDescription }) => {
    setIsLoading(false);
    const errorMessage = errorDescription || "An unknown playback error occurred. Please try again.";
    setError(errorMessage);
    Alert.alert("Video Error", errorMessage,
      [{ text: "OK", onPress: () => backAction() }],
      { cancelable: false }
    );
  }, [backAction]);

  const handleInitializationSuccess = useCallback(() => {}, []);

  const handleProgress = useCallback((progress) => {
    setCurrentTime(progress.currentTime);
  }, []);

  const handlePlayerStateChange = useCallback((state) => {
    if (state.duration && state.duration > 0 && state.duration !== totalDuration) {
      setTotalDuration(state.duration);
    }
  }, [totalDuration]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [backAction]);

  useEffect(() => {
    const handleAppStateChange = (nextState) => {
      if (nextState === 'background' || nextState === 'inactive') {
        (async () => {
          if (playerRef.current) {
            try {
              if (typeof playerRef.current.pause === 'function') playerRef.current.pause();
            } catch (e) {
              console.error('AppState pause error:', e);
            }
          }
          try {
            await updateVideoProgress(false);
          } catch (e) {
            console.error('AppState: Error saving progress:', e);
          }
        })();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, [updateVideoProgress, stopNativePlayer]);
  

  if (!otp || !playbackInfo) {
    return (
      <View style={[styles.container, { backgroundColor: isDarkMode ? Colors.darker : Colors.lighter, justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={isDarkMode ? Colors.darker : Colors.lighter} />
        <Text style={[styles.errorText, { color: isDarkMode ? Colors.light : Colors.dark }]}>
          The video details (OTP or playback information) are missing.
        </Text>
      </View>
    );
  }

  const isLandscape = orientation.includes('LANDSCAPE');

  const windowWidth = Dimensions.get('window').width;
  const portraitHeight = Math.round((windowWidth * 9) / 16);
  const playerStyle = isLandscape ? styles.playerLandscape : [styles.player, { height: portraitHeight }];

  return (
    <View style={styles.container}> 
      <StatusBar hidden={isLandscape} barStyle='light-content' backgroundColor='black' />
      {error && !isLoading ? (
        <View style={[styles.errorContainer, { backgroundColor: isDarkMode ? Colors.darker : Colors.lighter }]}> 
          <Text style={[styles.errorText, { color: isDarkMode ? Colors.light : Colors.dark }]}> 
            Error: {error}
          </Text>
        </View>
      ) : (
        <VdoPlayerView
          ref={playerRef}
          style={StyleSheet.flatten(playerStyle)}
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
    backgroundColor: '#000',
  },
  playerLandscape: {
    width: '88%', 
    height: '100%',
    backgroundColor: '#000',
    alignSelf: 'center',
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