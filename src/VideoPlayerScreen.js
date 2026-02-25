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
  // normalized error: { message: string, raw: any }
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(route.params?.total_time || 0);
  const progressUpdated = useRef(false);
  const orientationUnlocked = useRef(false);
  const lastAppStateUpdate = useRef(0);

  useFocusEffect(
    useCallback(() => {
      if (!orientationUnlocked.current) {
        Orientation.unlockAllOrientations();
        orientationUnlocked.current = true;
      }

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
        let progressData = [];
        try {
          progressData = JSON.parse(savedProgress);
        } catch (e) {
          console.error('Failed to parse savedProgress, resetting to empty array:', e);
          progressData = [];
        }
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
          let progressData = [];
          if (savedProgress) {
            try {
              progressData = JSON.parse(savedProgress);
            } catch (e) {
              console.error('Failed to parse savedProgress during update, using empty array:', e);
              progressData = [];
            }
          }
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

  // const stopNativePlayer = useCallback(() => {
  //   try {
  //     const nm = NativeModules || {};
  //     const modulesToTry = [nm.VdoPlayer, nm.VdocipherRnBridge, nm.Vdocipher, nm.VdocipherRNBridge, nm.Vdo];
  //     const methodNames = ['stop', 'pause', 'release', 'releasePlayer', 'destroy', 'stopPlayer'];

  //     modulesToTry.forEach(mod => {
  //       try {
  //         if (!mod) {
  //           if (typeof __DEV__ !== 'undefined' && __DEV__) console.debug('stopNativePlayer: native module reference is null/undefined');
  //           return;
  //         }
  //         const moduleKey = Object.keys(nm).find(k => nm[k] === mod) || 'unknown_native_module';
  //         methodNames.forEach(m => {
  //           try {
  //             if (typeof mod[m] === 'function') {
  //               if (typeof __DEV__ !== 'undefined' && __DEV__) console.debug(`stopNativePlayer: calling ${m} on ${moduleKey}`);
  //               mod[m]();
  //               if (typeof __DEV__ !== 'undefined' && __DEV__) console.debug(`stopNativePlayer: called ${m} on ${moduleKey}`);
  //             }
  //           } catch (e) {
  //             if (typeof __DEV__ !== 'undefined' && __DEV__) console.debug(`stopNativePlayer: error calling ${m} on ${moduleKey}`, e);
  //           }
  //         });
  //       } catch (e) {
  //         if (typeof __DEV__ !== 'undefined' && __DEV__) console.debug('stopNativePlayer: unexpected error iterating native modules', e);
  //       }
  //     });
  //   } catch (e) {
  //     console.error('stopNativePlayer: error', e);
  //   }
  // }, []);
  const stopNativePlayer = useCallback(() => {
    try {
      const nm = NativeModules || {};
      const modulesToTry = [
        nm.VdoPlayer,
        nm.VdocipherRnBridge,
        nm.Vdocipher,
        nm.VdocipherRNBridge,
        nm.Vdo,
      ];
      const methodNames = ['stop', 'pause', 'release', 'releasePlayer', 'destroy', 'stopPlayer'];

      modulesToTry.forEach(mod => {
        if (!mod) return; // 🔕 no logging for null modules

        methodNames.forEach(method => {
          try {
            if (typeof mod[method] === 'function') {
              if (__DEV__) {
                console.debug(`stopNativePlayer: calling ${method}`);
              }
              mod[method]();
            }
          } catch (e) {
            if (__DEV__) {
              console.debug(`stopNativePlayer: error calling ${method}`, e);
            }
          }
        });
      });
    } catch (e) {
      console.error('stopNativePlayer: unexpected error', e);
    }
  }, []);

  const forceStopEverything = useCallback(() => {
    try {
      // JS side
      if (playerRef.current) {
        try {
          playerRef.current.pause?.();
          playerRef.current.stop?.();
          playerRef.current.release?.();
        } catch (e) { }
        playerRef.current = null;
      }

      // Native side
      stopNativePlayer();

      // Android audio focus kill
      if (NativeModules?.AudioManager) {
        NativeModules.AudioManager.abandonAudioFocus?.();
      }
    } catch (e) {
      console.error('forceStopEverything error:', e);
    }
  }, [stopNativePlayer]);

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

    // allow progress update to run even if it ran earlier
    progressUpdated.current = false;
    await updateVideoProgress(false);

    // 🔴 IMPORTANT: ensure everything is force-stopped (JS + native + audio focus)
    try { forceStopEverything(); } catch (e) { console.error('backAction forceStopEverything error', e); }

    Orientation.lockToPortrait();
    if (cameFrom === 'Dashboard') {
      navigation.navigate('Home');
    } else if (cameFrom) {
      navigation.navigate(cameFrom);
    } else {
      navigation.goBack();
    }
    return true;
  }, [navigation, cameFrom, updateVideoProgress, stopNativePlayer, forceStopEverything, orientation]);

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

    // reset guard so progress update will be sent on end
    progressUpdated.current = false;
    await updateVideoProgress(true);

    // 🔴 IMPORTANT: ensure everything is force-stopped on video end
    try { forceStopEverything(); } catch (e) { console.error('handleEnded forceStopEverything error', e); }

    if (cameFrom === 'Dashboard') {
      navigation.navigate('Home');
    } else if (cameFrom) {
      navigation.navigate(cameFrom);
    } else {
      navigation.goBack();
    }
  }, [navigation, cameFrom, updateVideoProgress, stopNativePlayer, forceStopEverything]);

  const showErrorAndBack = useCallback((message) => {
    try {
      const extract = (msg) => {
        if (msg === null || typeof msg === 'undefined') return null;
        if (typeof msg === 'string') return msg;
        if (typeof msg === 'object') {
          // Prefer explicit fields
          const prefer = msg.errorMsg || msg.errorMessage || msg.message || msg.error_description || msg.errorDescription || msg.error || null;
          if (prefer) return prefer;

          // Sometimes errorDescription is a JSON string containing inner details
          const candidate = msg.errorDescription || msg.error_description || msg;
          if (typeof candidate === 'string') {
            try {
              const parsed = JSON.parse(candidate);
              return parsed.errorMsg || parsed.errorMessage || parsed.message || JSON.stringify(parsed);
            } catch (e) {
              // not JSON, return truncated string to avoid huge embedInfo
              const trimmed = candidate.length > 200 ? candidate.slice(0, 200) + '...' : candidate;
              return trimmed;
            }
          }

          // Avoid showing large embedInfo objects; try to find an inner error
          if (msg.embedInfo && typeof msg.embedInfo === 'object') {
            const ei = msg.embedInfo;
            if (ei.errorDescription) {
              try {
                const parsed = typeof ei.errorDescription === 'string' ? JSON.parse(ei.errorDescription) : ei.errorDescription;
                return parsed.errorMsg || parsed.message || JSON.stringify(parsed);
              } catch (e) {
                // fallthrough
              }
            }
          }

          // fallback: try to serialize only relevant keys
          try {
            const small = {};
            ['errorMsg', 'errorMessage', 'message', 'errorCode', 'httpStatusCode'].forEach(k => { if (msg[k]) small[k] = msg[k]; });
            const keys = Object.keys(small);
            if (keys.length) return JSON.stringify(small);
          } catch (e) { }

          return null;
        }
        try { return String(msg); } catch (e) { return null; }
      };

      let msgText = extract(message) || extract(message && message.raw) || 'Video playback error. Please try again.';

      // update normalized error state so UI shows friendly text
      try { setError({ message: msgText, raw: message }); } catch (e) { }

      Alert.alert('Video Error', msgText,
        [{ text: 'OK', onPress: () => { setTimeout(() => { backAction(); }, 50); } }],
        { cancelable: false }
      );
    } catch (e) {
      console.error('showErrorAndBack error:', e);
      // fallback to immediate backAction if alert fails
      try { backAction(); } catch (err) { console.error('fallback backAction failed', err); }
    }
  }, [backAction]);

  const handleInitFailure = useCallback((err) => {
    setIsLoading(false);
    const errorMessage = (err && (err.errorDescription || err.message || err.errorMsg)) || "Video initialization failed. Please try again.";
    setError({ message: typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage), raw: err });
    showErrorAndBack(err || errorMessage);
  }, [showErrorAndBack]);

  const handleLoadError = useCallback((err) => {
    setIsLoading(false);
    const errorDescription = err?.errorDescription || err?.errorMsg || err?.message || null;
    const errorMessage = errorDescription || "Video failed to load. Please try again.";
    setError({ message: typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage), raw: err });
    showErrorAndBack(err || errorMessage);
  }, [showErrorAndBack]);

  const handleError = useCallback((err) => {
    setIsLoading(false);
    const errorDescription = err?.errorDescription || err?.errorMsg || err?.message || null;
    const errorMessage = errorDescription || "An unknown playback error occurred. Please try again.";
    setError({ message: typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage), raw: err });
    showErrorAndBack(err || errorMessage);
  }, [showErrorAndBack]);

  const handleInitializationSuccess = useCallback(() => { }, []);

  const handleProgress = useCallback((progress) => {
    setCurrentTime(progress.currentTime);
  }, []);

  const handlePlayerStateChange = useCallback((state) => {
    const newDuration = state && state.duration;
    if (typeof newDuration === 'number' && newDuration > 0) {
      const diff = Math.abs(newDuration - totalDuration);
      if (diff > 0.5) { // update only when change is significant (>0.5s)
        setTotalDuration(newDuration);
      }
    }
  }, [totalDuration]);

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
      return () => backHandler.remove();
    }, [backAction])
  );

  useEffect(() => {
    const handleAppStateChange = (nextState) => {
      try {
        // debounce frequent app state changes (avoid duplicate rapid updates)
        const now = Date.now();
        if (now - lastAppStateUpdate.current < 1000) return;
        lastAppStateUpdate.current = now;

        if (nextState === 'background' || nextState === 'inactive') {
          (async () => {
            try {
              try { forceStopEverything(); } catch (e) { console.error('AppState forceStopEverything error', e); }
              await updateVideoProgress(false);
            } catch (e) {
              console.error('AppState: Error saving progress:', e);
            }
          })();
        }
      } catch (e) {
        console.error('AppState handler unexpected error:', e);
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, [updateVideoProgress, stopNativePlayer, forceStopEverything]);


  if (!otp || !playbackInfo) {
    return (
      <View style={[styles.container, { backgroundColor: isDarkMode ? Colors.darker : Colors.lighter, justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar barStyle="light-content" backgroundColor="#1434A4" />
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
      <StatusBar hidden={isLandscape} barStyle="light-content" backgroundColor="#1434A4" />
      {error && !isLoading ? (
        <View style={[styles.errorContainer, { backgroundColor: isDarkMode ? Colors.darker : Colors.lighter }]}>
          <Text style={[styles.errorText, { color: isDarkMode ? Colors.light : Colors.dark }]}>
            Error: {error.message || (error.raw && (error.raw.errorMsg || error.raw.message)) || JSON.stringify(error.raw || error)}
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
    width: '100%',
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