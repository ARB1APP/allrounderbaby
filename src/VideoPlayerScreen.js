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
import Orientation from 'react-native-orientation-locker';

const VideoPlayerScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const {
    id: videoId,
    otp,
    playbackInfo,
    cameFrom,
  } = route.params || {};

  const isDarkMode = useColorScheme() === 'dark';
  const playerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      setError(null);

      return () => {
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
    }, [navigation])
  );

  const handleLoaded = useCallback(() => {
    setIsLoading(false);
  }, []);

  const backAction = useCallback(() => {
    Orientation.lockToPortrait();
    if (cameFrom === 'Dashboard') {
      navigation.navigate('Home');
    } else if (cameFrom) {
      navigation.navigate(cameFrom);
    } else {
      navigation.goBack();
    }
    return true;
  }, [navigation, cameFrom]);

  const handleEnded = useCallback(() => {
    if (cameFrom === 'Dashboard') {
      navigation.navigate('Home');
    } else if (cameFrom) {
      navigation.navigate(cameFrom);
    } else {
      navigation.goBack();
    }
  }, [navigation, cameFrom]);

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