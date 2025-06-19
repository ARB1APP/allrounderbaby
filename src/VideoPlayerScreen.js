import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
  BackHandler,
  useColorScheme,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import { VdoPlayerView } from 'vdocipher-rn-bridge';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const { width, height } = Dimensions.get('window');

const VideoPlayerScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  // Safely destructure params, providing a default empty object for `route.params`
  // and then ensuring `cameFrom` is undefined if not explicitly passed.
  const {
    id: videoId,
    title,
    poster,
    otp,
    playbackInfo,
    language,
    step,
    cameFrom // This will be undefined if not passed from the navigating screen
  } = route.params || {}; // IMPORTANT: Add || {} here for safe destructuring

  // Log the received cameFrom value immediately on component render
  console.log('VideoPlayerScreen: received cameFrom (on render):', cameFrom);


  const isDarkMode = useColorScheme() === 'light';
  const playerRef = useRef(null);
  const hasTrackedView = useRef(false);
  const intervalRef = useRef(null);
  const maxWatchedTimeRef = useRef(0);
  const totalDurationRef = useRef(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); // State to hold specific error messages

  console.log('Video Params:', { videoId, title, poster: !!poster, otp: !!otp, playbackInfo: !!playbackInfo });
  console.log('Video Params after destructuring:', {
    videoId,
    title,
    poster: !!poster,
    otp: !!otp,
    playbackInfo: !!playbackInfo,
    language,
    step,
    cameFrom // Include cameFrom in this log as well
  });

  const sendWatchTimeData = useCallback(async () => {
    // Implement your watch time data sending logic here
    // For example, if you integrate with an API to send watch time
    // if (videoId && maxWatchedTimeRef.current > 0 && totalDurationRef.current > 0) {
    //   const watchedPercentage = (maxWatchedTimeRef.current / totalDurationRef.current) * 100;
    //   console.log(`Sending Watch Time Data for ${videoId}: Max Time = ${maxWatchedTimeRef.current.toFixed(2)}s, Duration = ${totalDurationRef.current.toFixed(2)}s, Percentage = ${watchedPercentage.toFixed(2)}%`);
    //   // Example API call (uncomment and replace with your actual endpoint and auth logic)
    //   // const token = await AsyncStorage.getItem('token');
    //   // fetch('your_watch_time_api_endpoint', {
    //   //   method: 'POST',
    //   //   headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    //   //   body: JSON.stringify({ videoId, maxWatchedTime: maxWatchedTimeRef.current, totalDuration: totalDurationRef.current })
    //   // });
    // }
    maxWatchedTimeRef.current = 0; // Reset after sending to prevent duplicate sends on subsequent blur/end events
  }, [videoId]);

  const handleProgress = useCallback(({ currentTime }) => {
    // currentTime is likely in milliseconds based on docs, convert to seconds
    const currentTimeSeconds = currentTime / 1000;
    if (currentTimeSeconds > maxWatchedTimeRef.current) {
      maxWatchedTimeRef.current = currentTimeSeconds;
    }
  }, []);

  const handleLoaded = useCallback(async (args) => {
    console.log('Player Loaded:', args);
    setIsLoading(false); // Turn off loading once the player reports it's loaded
    setError(null); // Clear any previous errors

    // Try to get and parse the video duration
    if (playerRef.current && typeof playerRef.current.getDuration === 'function') {
      try {
        const durationResult = await playerRef.current.getDuration();
        // Check if durationResult is an object with a 'duration' property (common for native modules)
        if (durationResult && typeof durationResult === 'object' && typeof durationResult.duration === 'number' && durationResult.duration > 0) {
          totalDurationRef.current = durationResult.duration;
          console.log('Total Duration fetched:', totalDurationRef.current);
        } else if (typeof durationResult === 'number' && durationResult > 0) { // Fallback for direct number return
            totalDurationRef.current = durationResult;
            console.log('Total Duration fetched (direct number):', totalDurationRef.current);
        } else {
          console.warn('Fetched duration is invalid or not in expected format:', durationResult);
        }
      } catch (e) {
        console.error("Error getting duration:", e);
      }
    } else {
         console.warn("getDuration method not available on playerRef");
    }

    // Start polling current time for maxWatchedTimeRef
    if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
      if (intervalRef.current) clearInterval(intervalRef.current); // Clear any existing interval

      intervalRef.current = setInterval(async () => {
        if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
          try {
            const currentTime = await playerRef.current.getCurrentTime();
             if (currentTime && typeof currentTime === 'number') {
                 if (currentTime > maxWatchedTimeRef.current) {
                    maxWatchedTimeRef.current = currentTime;
                 }
             }
          } catch (e) {
            // Ignore "player is null" errors during cleanup as ref might be nulled
            if (e.message && !e.message.toLowerCase().includes('player is null')) {
               console.error("Error polling current time:", e);
            }
          }
        } else {
             // If playerRef.current becomes null or method disappears, stop polling
             if (intervalRef.current) clearInterval(intervalRef.current);
             intervalRef.current = null;
        }
      }, 5000); // Poll every 5 seconds
      console.log('Started watch time polling interval.');
    } else {
         console.warn("getCurrentTime method not available on playerRef, cannot poll watch time.");
    }
  }, []);

  const handleEnded = useCallback(() => {
    console.log('Media Ended');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    // Set maxWatchedTime to total duration if video was watched till the end
    if (totalDurationRef.current > 0) {
      maxWatchedTimeRef.current = totalDurationRef.current;
    }
    sendWatchTimeData(); // Send final watch time data
    // Navigate back to the source or default home screen
    console.log('handleEnded: Navigating back. Came from:', cameFrom);
    if (cameFrom === 'Dashboard') { // Specific check for Dashboard
      navigation.navigate('Home'); // Navigate to 'Home' which is the registered name for Dashboard
    } else if (cameFrom) {
      navigation.navigate(cameFrom); // Use the provided name for other screens
    } else {
      navigation.goBack(); // Fallback to default back behavior
    }
  }, [sendWatchTimeData, navigation, cameFrom]);


  const handleInitFailure = useCallback((err) => {
    console.error('Player Initialization Failure:', err);
    setIsLoading(false);
    setError(err.errorDescription || "Video initialization failed.");
    Alert.alert("Video Error", err.errorDescription || "Video initialization failed. Please try again.");
    // Navigate back on critical error
    console.log('handleInitFailure: Navigating back. Came from:', cameFrom);
    if (cameFrom === 'Dashboard') { // Specific check for Dashboard
      navigation.navigate('Home'); // Navigate to 'Home'
    } else if (cameFrom) {
      navigation.navigate(cameFrom);
    } else {
      navigation.goBack();
    }
  }, [navigation, cameFrom]);

  const handleLoadError = useCallback(({ errorDescription }) => {
    console.error('Player Load Error:', errorDescription);
    setIsLoading(false);
    setError(errorDescription || "Video failed to load.");
    Alert.alert("Video Error", errorDescription || "Video failed to load. Please try again.");
    // Navigate back on critical error
    console.log('handleLoadError: Navigating back. Came from:', cameFrom);
    if (cameFrom === 'Dashboard') { // Specific check for Dashboard
      navigation.navigate('Home'); // Navigate to 'Home'
    } else if (cameFrom) {
      navigation.navigate(cameFrom);
    } else {
      navigation.goBack();
    }
  }, [navigation, cameFrom]);

  const handleError = useCallback(({ errorDescription }) => {
    console.error('Player Playback Error:', errorDescription);
    setIsLoading(false);
    if (intervalRef.current) { // Clear interval on playback error
        clearInterval(intervalRef.current);
        intervalRef.current = null;
    }
    setError(errorDescription || "An unknown playback error occurred.");
    Alert.alert("Video Error", errorDescription || "An unknown playback error occurred. Please try again.");
    // Navigate back on critical error
    console.log('handleError: Navigating back. Came from:', cameFrom);
    if (cameFrom === 'Dashboard') { // Specific check for Dashboard
      navigation.navigate('Home'); // Navigate to 'Home'
    } else if (cameFrom) {
      navigation.navigate(cameFrom);
    } else {
      navigation.goBack();
    }
  }, [navigation, cameFrom]);

  // Handle hardware back button press
  useEffect(() => {
    const backAction = () => {
      console.log('Back button pressed. Navigating from:', route.name, 'Came from:', cameFrom);
      sendWatchTimeData(); // Send data before navigating back

      if (cameFrom === 'Dashboard') { // Specific check for Dashboard
        navigation.navigate('Home'); // Navigate to 'Home' which is the registered name for Dashboard
      } else if (cameFrom) {
        navigation.navigate(cameFrom);
      } else if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate('Home');
      }
      return true; // Prevent default back button behavior
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove(); // Clean up the event listener
  }, [navigation, sendWatchTimeData, cameFrom, route.name]); // Add route.name to dependencies


  // Release player resources when screen loses focus or component unmounts
  useFocusEffect(
    useCallback(() => {
      // This will run when the screen is focused
      return () => {
        // This will run when the screen is unfocused (or component unmounts)
        console.log('VideoPlayerScreen unfocused or unmounting. Releasing player.');
        // --- FIX for TypeError: playerRef.current.release is not a function ---
        // Ensure playerRef.current exists and has the release function before calling
        if (playerRef.current && typeof playerRef.current.release === 'function') {
          try {
            playerRef.current.release();
            console.log('VdoPlayerView released successfully.');
          } catch (e) {
            console.error('Error releasing VdoPlayerView:', e);
          } finally {
            playerRef.current = null; // Important to nullify ref after attempting release
          }
        } else {
            console.warn('playerRef.current is null or release is not a function during unfocus/unmount. Skipping release.');
        }
        // --- END FIX ---

        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        sendWatchTimeData(); // Send data one last time before leaving
      };
    }, [sendWatchTimeData]) // Dependency array for useFocusEffect
  );

  // Display error message if OTP or PlaybackInfo are missing from route params
  if (!otp || !playbackInfo) {
    return (
      <View style={[styles.container, { backgroundColor: isDarkMode ? Colors.darker : Colors.lighter, justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={isDarkMode ? Colors.darker : Colors.lighter} />
        <Text style={[styles.errorText, { color: isDarkMode ? Colors.light : Colors.dark }]}>
          Video details are missing. Please go back and try again.
        </Text>
      </View>
    );
  }

  // Define a single style object to pass to VdoPlayerView (FIX for Invalid prop `style` type)
  const playerStyle = {
    ...styles.player, // Spread the base player styles
    opacity: isLoading ? 0 : 1, // Add the conditional opacity directly
  };

  return (
    // Main container for the screen. Centering content within it.
    <View style={[styles.container, { backgroundColor: isDarkMode ? Colors.darker : Colors.lighter, justifyContent: 'center', alignItems: 'center' }]}>
      <StatusBar barStyle='light-content' backgroundColor='black' />

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Loading video...</Text>
        </View>
      )}

      {error && !isLoading ? ( // Show error message if `error` state is set and not loading
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: isDarkMode ? Colors.light : Colors.dark }]}>
            Error: {error}
          </Text>
        </View>
      ) : (
        // Only render VdoPlayerView if otp and playbackInfo are available (checked in the if-block above)
        <VdoPlayerView
          onProgress={handleProgress}
          ref={playerRef}
          style={playerStyle} // Use the combined style object here
          embedInfo={{
            otp: otp,
            playbackInfo: playbackInfo,
            id: videoId,
          }}
          onInitializationSuccess={() => console.log('VdoPlayerView initialization success')}
          onInitializationFailure={handleInitFailure}
          onLoading={(args) => {
            console.log('VdoPlayerView loading args:', args);
            if (!isLoading) setIsLoading(true);
          }}
          onLoaded={handleLoaded}
          onLoadError={handleLoadError}
          onError={handleError}
          onTracksChanged={(args) => console.log('tracks changed')}
          onPlaybackSpeedChanged={(speed) => console.log('speed changed to', speed)}
          onMediaEnded={handleEnded}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Default background for video screen
  },
  player: {
    width: '100%',
    aspectRatio: 16 / 9, // Maintain 16:9 aspect ratio
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
    zIndex: 10, // Ensure loading overlay is on top
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
    backgroundColor: '#000', 
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#FFFFFF', 
  },
  // These poster and videoInfo styles were likely from an older design for showing video info,
  // not directly used in current playback logic, but kept for reference if needed.
  poster: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 5,
  },
  videoInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoTitle: {
    fontSize: 16,
  },
  playingIcon: {
    fontSize: 20,
    color: 'green',
  },
});

export default VideoPlayerScreen;
