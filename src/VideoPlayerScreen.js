import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  BackHandler,
  AppState,
  useColorScheme,
  StatusBar,
  Alert,
  NativeModules,
} from 'react-native';
import { VdoPlayerView } from 'vdocipher-rn-bridge';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './config/api';
import safeJsonParse from './utils/safeJsonParse';

const url = BASE_URL;
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
    stage_name,
    displayStep,
    watermarkText,
  } = route.params || {};

  const isDarkMode = useColorScheme() === 'dark';
  const parseAnnotationColor = (col, alpha) => {
    try {
      if (!col) { return `rgba(255,255,255,${alpha || 0.22})`; }
      let hex = col;
      if (hex.startsWith('0x')) { hex = hex.slice(2); }
      if (hex.length === 6) {
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        const a = typeof alpha !== 'undefined' ? parseFloat(alpha) : 0.22;
        if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b) || Number.isNaN(a)) { return 'rgba(255,255,255,0.22)'; }
        return `rgba(${r},${g},${b},${a})`;
      }
    } catch (e) {
    }
    return `rgba(255,255,255,${alpha || 0.22})`;
  };
  const playerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(route.params.total_time || 0);
  const progressUpdated = useRef(false);

  const updateVideoProgress = useCallback(async (isFinished) => {
    if (progressUpdated.current) { return; }
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
          progressData = safeJsonParse(savedProgress, []);
        } catch (err) {
          progressData = [];
        }
        const videoProgress = progressData.find(p => p.video_id === videoId);
        if (videoProgress) {
          currentViews = videoProgress.total_views || 0;
          previousFinishCount = videoProgress.is_finished || 0;
        }
      }
    } catch (e) { console.error('Failed to get local video progress:', e); }

    const currentTimeInSeconds = Math.round(currentTime / 1000);
    const finishThresholdPercent = 0.8; // 80%
    const isNowConsideredFinished = isFinished ||
      (totalDuration > 0 && currentTimeInSeconds >= totalDuration * finishThresholdPercent);
    const newFinishCount = isNowConsideredFinished
      ? (previousFinishCount || 0) + 1
      : (previousFinishCount || 0);

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
      stage_name: (stage_name ? stage_name : '') + ' ' + (typeof displayStep !== 'undefined' && displayStep !== null ? displayStep : step),
      deviceKey: deviceKey,
    };

    const fetchWithTimeout = async (resource, options = {}) => {
      const { timeout = 15000, signal: providedSignal, ...rest } = options;
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);
      try {
        const signalToUse = providedSignal || controller.signal;
        const response = await fetch(resource, { ...rest, signal: signalToUse });
        return response;
      } finally {
        clearTimeout(id);
      }
    };

    try {

      const endpoint = `${url}User/User_Video_Data`;
      const response = await fetchWithTimeout(endpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
        timeout: 15000,
      });

      const responseData = await response.json();
      if (response.ok && responseData.code === 200) {
        try {
          const savedProgress = await AsyncStorage.getItem('userProgress');
          let progressData = [];
          if (savedProgress) {
            try {
              progressData = safeJsonParse(savedProgress, []);
            } catch (err) {
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
          console.error('Failed to update local userProgress cache:', e);
        }
      } else {
        const errorMessage = responseData.message || `HTTP Error: ${response.status}`;
        console.error('Failed to update video progress on server:', errorMessage);
      }
    } catch (e) {
      console.error('A network error occurred while updating video progress:', e);
    }
  }, [videoId, currentTime, language, step, totalDuration, otp, playbackInfo, stage_name]);

  useFocusEffect(
    useCallback(() => {

      progressUpdated.current = false;

      return () => {
        if (playerRef.current) {
          try {
            if (typeof playerRef.current.pause === 'function') {
              playerRef.current.pause();
            }
            if (typeof playerRef.current.stop === 'function') {
              playerRef.current.stop();
            }
            if (typeof playerRef.current.release === 'function') {
              playerRef.current.release();
            }
          } catch (e) {
            console.error('Cleanup: Error stopping video via ref:', e);
          }
        }
        stopNativePlayer();
      };
    }, [])
  );

  useEffect(() => {
    return () => {
      try {
        if (playerRef.current) {
          try {
            if (typeof playerRef.current.pause === 'function') { playerRef.current.pause(); }
            if (typeof playerRef.current.stop === 'function') { playerRef.current.stop(); }
            if (typeof playerRef.current.release === 'function') { playerRef.current.release(); }
          } catch (e) {
            console.error('Unmount: Error cleaning up video player via ref:', e);
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
        if (!mod) { return; }
        methodNames.forEach(m => {
          try {
            if (typeof mod[m] === 'function') {
              mod[m]();
            }
          } catch (e) {
          }
        });
      });
    } catch (e) {
      console.error('stopNativePlayer: error while attempting native stop/release', e);
    }
  }, []);

  const backAction = useCallback(async () => {
    if (playerRef.current) {
      try {
        if (typeof playerRef.current.pause === 'function') {
          playerRef.current.pause();
        }
        if (typeof playerRef.current.stop === 'function') {
          playerRef.current.stop();
        }
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
  }, [navigation, cameFrom, updateVideoProgress]);

  const handleEnded = useCallback(async () => {
    if (playerRef.current) {
      try {
        if (typeof playerRef.current.pause === 'function') {
          playerRef.current.pause();
        }
        if (typeof playerRef.current.stop === 'function') {
          playerRef.current.stop();
        }
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
  }, [navigation, cameFrom, updateVideoProgress]);

  const handleInitFailure = useCallback((err) => {
    setIsLoading(false);
    const errorMessage = err.errorDescription || 'Video initialization failed. Please try again.';
    setError(errorMessage);
    console.error('Video Error', errorMessage);
    backAction();
  }, [navigation, cameFrom, backAction]);

  const handleLoadError = useCallback(({ errorDescription }) => {
    setIsLoading(false);
    const errorMessage = errorDescription || 'Video failed to load. Please try again.';
    setError(errorMessage);
    console.error('Video Error', errorMessage);
    backAction();
  }, [navigation, cameFrom, backAction]);

  const handleError = useCallback(({ errorDescription }) => {
    setIsLoading(false);
    const errorMessage = errorDescription || 'An unknown playback error occurred. Please try again.';
    setError(errorMessage);
    console.error('Video Error', errorMessage);
    backAction();
  }, [navigation, cameFrom, backAction]);

  const handleInitializationSuccess = useCallback(() => {
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

  useEffect(() => {
    const handleAppStateChange = (nextState) => {
      if (nextState === 'background' || nextState === 'inactive') {
        (async () => {
          if (playerRef.current) {
            try {
              if (typeof playerRef.current.pause === 'function') { playerRef.current.pause(); }
              if (typeof playerRef.current.stop === 'function') { playerRef.current.stop(); }
              if (typeof playerRef.current.release === 'function') { playerRef.current.release(); }
            } catch (e) {
              console.error('AppState: Error cleaning up video player via ref:', e);
            } finally {
              playerRef.current = null;
            }
          }
          stopNativePlayer();
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
      try {
        subscription.remove();
      } catch (e) {
        AppState.removeEventListener && AppState.removeEventListener('change', handleAppStateChange);
      }
    };
  }, [updateVideoProgress]);

  useEffect(() => {
    const onBlur = () => {
      (async () => {
        if (playerRef.current) {
          try {
            if (typeof playerRef.current.pause === 'function') {
              playerRef.current.pause();
            }
            if (typeof playerRef.current.stop === 'function') {
              playerRef.current.stop();
            }
            if (typeof playerRef.current.release === 'function') {
              playerRef.current.release();
            }
          } catch (e) {
            console.error('Blur: Error cleaning up video player:', e);
          } finally {
            playerRef.current = null;
          }
        }
        stopNativePlayer();

        try {
          await updateVideoProgress(false);
        } catch (e) {
          console.error('Blur: Error saving progress:', e);
        }

        Orientation.lockToPortrait();
      })();
    };

    const unsubscribe = navigation.addListener('blur', onBlur);
    return unsubscribe;
  }, [navigation, updateVideoProgress]);


  if (!otp || !playbackInfo) {
    return (
      <View style={[styles.container, { backgroundColor: isDarkMode ? Colors.darker : Colors.lighter, justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar barStyle={'light-content'} backgroundColor={isDarkMode ? Colors.darker : Colors.lighter} />
        <Text style={[styles.errorText, { color: isDarkMode ? Colors.light : Colors.dark }]}>
          The video details (OTP or playback information) are missing. Please back up and try restarting.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: 'black' }]}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      {error && !isLoading ? (
        <View style={[styles.errorContainer, { backgroundColor: isDarkMode ? Colors.darker : Colors.lighter }]}>
          <Text style={[styles.errorText, { color: isDarkMode ? Colors.light : Colors.dark }]}>
            Error: {error}
          </Text>
        </View>
      ) : (
        <View style={styles.playerContainer}>
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
          {watermarkText ? (
            <View pointerEvents="none" style={styles.watermarkOverlay}>
              {Array.isArray(watermarkText) ? (
                watermarkText.map((w, i) => {
                  const text = w && w.text ? String(w.text) : '';
                  const color = parseAnnotationColor(w && w.color, w && w.alpha);
                  return (
                    <Text
                      key={i}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={[styles.watermarkText, { color, marginBottom: 6 }]}
                    >{text}</Text>
                  );
                })
              ) : (
                <Text numberOfLines={1} ellipsizeMode="middle" style={styles.watermarkText}>{String(watermarkText)}</Text>
              )}
            </View>
          ) : null}
        </View>
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
  playerContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    position: 'relative',
  },
  watermarkOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    paddingLeft: 10,
    paddingBottom: 8,
  },
  watermarkText: {
    color: 'rgba(255,255,255,0.22)',
    fontSize: 12,
    backgroundColor: 'transparent',
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
