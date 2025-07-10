import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  useColorScheme,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { VdoPlayerView } from 'vdocipher-rn-bridge';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Orientation from 'react-native-orientation-locker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SAVE_PROGRESS_INTERVAL = 5000;

const VideoPlayerScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const {
    id: videoId,
    otp,
    playbackInfo,
    returnToScreen,
  } = route.params || {};

  const isDarkMode = useColorScheme() === 'dark';

  const playerRef = useRef(null);
  const totalDurationRef = useRef(0);
  const hasSavedOnExit = useRef(false);

  const progressRef = useRef({
    currentPosition: 0,
    lastSavedPosition: 0,
  });

  const STORAGE_KEY = `video_progress_${videoId}`;

  const [playerState, setPlayerState] = useState({
    phase: 'loading',
    seekTime: 0,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalOnPress, setModalOnPress] = useState(() => () => {});

  React.useLayoutEffect(() => {
    if (navigation && route.params?.title) {
      navigation.setOptions({ title: route.params.title });
    }
  }, [navigation, route.params?.title]);

  const showCustomModal = useCallback((title, message, onPressCallback) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalOnPress(() => onPressCallback);
    setModalVisible(true);
  }, []);

  const hideCustomModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const getErrorMessage = useCallback((err) => {
    if (!err) return 'Unknown error';
    if (typeof err === 'string') return err;
    if (typeof err.errorDescription === 'string') return err.errorDescription;
    if (typeof err.message === 'string') return err.message;
    try {
      return JSON.stringify(err);
    } catch {
      return 'Unknown error';
    }
  }, []);

  const saveProgress = useCallback(async (isFinalSave = false) => {
    console.log("---");
    console.log("Attempting to save progress. isFinalSave:", isFinalSave);

    const currentTime = progressRef.current.currentPosition || 0;
    
    console.log("Guard clause check -> videoId:", videoId);
    if (!videoId) {
        console.error("SAVE FAILED: Exiting because videoId is missing.");
        console.log("---");
        return;
    }
    
    console.log("Guard clause check -> currentTime:", currentTime);
    if (currentTime <= 0 && !isFinalSave) {
        console.warn("SAVE SKIPPED: Exiting because currentTime is 0 and this is not a final save.");
        console.log("---");
        return;
    }

    try {
        const currentSeconds = Math.floor(currentTime);
        await AsyncStorage.setItem(STORAGE_KEY, currentSeconds.toString());
        progressRef.current.lastSavedPosition = currentSeconds;
        console.log(`💾 Saved progress for ${videoId}: ${currentSeconds}s to AsyncStorage`);
        console.log("---");

    } catch (e) {
        console.error("SAVE FAILED: Error saving to AsyncStorage.", e);
        console.log("---");
    }
  }, [videoId, STORAGE_KEY]);

  const handleExit = useCallback(async (isFinished = false) => {
    if (hasSavedOnExit.current) {
        return;
    }
    hasSavedOnExit.current = true;

    await saveProgress(isFinished);

    Orientation.lockToPortrait();

    if (returnToScreen) {
      navigation.navigate(returnToScreen);
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation, saveProgress, returnToScreen]);

  const onPlayerReady = useCallback(() => {
    console.log(`👍 Player is ready.`);
    setPlayerState(currentState => ({ ...currentState, phase: 'playing' }));
  }, []);

  const onLoaded = useCallback(({ duration }) => {
    totalDurationRef.current = duration;
    console.log(`Video Loaded. Duration: ${duration}s`);
  }, []);

  const onProgress = useCallback((e) => {
    if (progressRef.current) {
      progressRef.current.currentPosition = e.currentTime / 1000;
    }
  }, []);

  const onError = useCallback((errorSource, errorDescription) => {
    console.error(`VdoPlayer Error (${errorSource}):`, errorDescription);
    setPlayerState({ phase: 'error', seekTime: 0 });
    const errorMessage = getErrorMessage({ errorDescription });
    showCustomModal(
      "Video Playback Error",
      errorMessage || `An unexpected error occurred during playback.`,
      () => {
        hideCustomModal();
        handleExit(false);
      }
    );
  }, [showCustomModal, hideCustomModal, handleExit, getErrorMessage]);

  const onMediaEnded = useCallback(() => {
    console.log("Video playback ended.");
    AsyncStorage.removeItem(STORAGE_KEY).catch(e => console.error("Failed to clear progress on end:", e));
    handleExit(true);
  }, [handleExit, STORAGE_KEY]);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      console.log(`\n--- ✨ Screen Focused for Video: ${videoId} ---`);

      hasSavedOnExit.current = false;
      setPlayerState({ phase: 'loading', seekTime: 0 });
      progressRef.current = { currentPosition: 0, lastSavedPosition: 0 };
      totalDurationRef.current = 0;

      const loadAndPrepare = async () => {
        if (!videoId) {
          showCustomModal('Error', 'Video information is missing.', () => navigation.goBack());
          return;
        }
        try {
          const value = await AsyncStorage.getItem(STORAGE_KEY);
          const seconds = value ? parseInt(value, 10) : 0;
          
          if (isMounted) {
            console.log(`📼 Loaded last position from AsyncStorage: ${seconds}s`);
            progressRef.current.lastSavedPosition = seconds;
            
            setPlayerState({ phase: 'ready', seekTime: seconds });
          }
        } catch (e) {
          console.warn('Failed to load progress from AsyncStorage:', e);
          if (isMounted) {
            setPlayerState({ phase: 'ready', seekTime: 0 });
          }
        }
      };
      
      loadAndPrepare();
      
      const saveInterval = setInterval(() => {
        if (!isMounted) return;
        
        const currentPosition = Math.floor(progressRef.current.currentPosition);
        const lastSaved = Math.floor(progressRef.current.lastSavedPosition);
        
        if (currentPosition > lastSaved + 1) {
          AsyncStorage.setItem(STORAGE_KEY, currentPosition.toString());
          progressRef.current.lastSavedPosition = currentPosition;
          console.log(`💾 Saved progress for ${videoId}: ${currentPosition}s (interval)`);
        }
      }, SAVE_PROGRESS_INTERVAL);
      
      return () => {
        isMounted = false;
        clearInterval(saveInterval);
        console.log(`--- 🚪 Screen Unfocused for Video: ${videoId} ---`);
      };
    }, [videoId, STORAGE_KEY, navigation, showCustomModal])
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      e.preventDefault(); 

      handleExit(false);
    });

    return unsubscribe;
  }, [navigation, handleExit]);

  const isLoading = playerState.phase === 'loading';
  const showPlayer = playerState.phase === 'ready' || playerState.phase === 'playing';
  const shouldPlay = playerState.phase === 'playing';

  if (!videoId || !otp || !playbackInfo) {
    return (
      <View style={[styles.container, { backgroundColor: isDarkMode ? Colors.darker : Colors.lighter, justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <Text style={[styles.errorText, { color: isDarkMode ? Colors.light : Colors.dark }]}>Video details are missing. Please go back and try again.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle='light-content' backgroundColor='black' />

      {showPlayer && (
        <VdoPlayerView
          ref={playerRef}
          style={styles.player}
          embedInfo={{ otp, playbackInfo, id: videoId }}
          playWhenReady={shouldPlay}
          seek={playerState.seekTime * 1000}
          onInitializationSuccess={onPlayerReady}
          onInitializationFailure={(err) => onError("Initialization", err.errorDescription)}
          onLoading={() => {
            if (playerState.phase === 'loading') {
            }
          }}
          onLoaded={onLoaded}
          onProgress={onProgress}
          onLoadError={(err) => onError("Load", err.errorDescription)}
          onError={(err) => onError("Playback", err.errorDescription)}
          onMediaEnded={onMediaEnded}
        />
      )}

      {isLoading && <ActivityIndicator style={StyleSheet.absoluteFill} size="large" color="#FFFFFF" />}

      {modalVisible && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: isDarkMode ? Colors.darker : Colors.lighter }]}>
            <Text style={[styles.modalTitle, { color: isDarkMode ? Colors.light : Colors.dark }]}>{modalTitle}</Text>
            <Text style={[styles.modalMessage, { color: isDarkMode ? Colors.light : Colors.dark }]}>{modalMessage}</Text>
            <TouchableOpacity style={[styles.modalButton, { backgroundColor: isDarkMode ? '#6200EE' : '#03DAC6' }]} onPress={modalOnPress}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  player: { width: '100%', aspectRatio: 16 / 9, backgroundColor: '#000' },
  errorText: { fontSize: 16, textAlign: 'center', padding: 20 },
  modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalContainer: { width: '80%', padding: 20, borderRadius: 10, alignItems: 'center', elevation: 5 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  modalMessage: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  modalButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5 },
  modalButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});

export default VideoPlayerScreen;