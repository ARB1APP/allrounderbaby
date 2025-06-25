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
import AsyncStorage from '@react-native-async-storage/async-storage';

const url = 'https://allrounderbaby-czh8hubjgpcxgrc7.canadacentral-01.azurewebsites.net/api/';

const VideoPlayerScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const {
    id: videoId,
    title,
    otp,
    playbackInfo,
    language,
    step,
    cameFrom,
    length: videoLengthFromParams
  } = route.params || {};

  console.log('VideoPlayerScreen Mounted. Params:', {
    videoId,
    title,
    otp: !!otp,
    playbackInfo: !!playbackInfo,
    language,
    step,
    cameFrom,
    videoLengthFromParams
  });

  const isDarkMode = useColorScheme() === 'dark';

  const playerRef = useRef(null);
  const progressRef = useRef(0);
  const totalDurationRef = useRef(0);
  const targetSeekPositionRef = useRef(0);
  const isSeekingRef = useRef(false);
  const hasShownLimitAlertRef = useRef(false);
  const initialSeekAttemptedRef = useRef(false);
  const saveProgressTimeoutRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalViews, setTotalViews] = useState(0);
  const [isViewLimitReached, setIsViewLimitReached] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  const saveProgress = useCallback(async (currentTimeMs, isFinalSave = false) => {
    console.log(`saveProgress called: currentTimeMs=${currentTimeMs}, isFinalSave=${isFinalSave}, isViewLimitReached=${isViewLimitReached}`);
    if (isViewLimitReached) {
      console.warn("Save progress skipped: View limit already reached.");
      return;
    }
    if (!videoId) {
      console.warn("Save progress skipped: videoId is missing.");
      return;
    }

    try {
      const [storedToken, userIdString] = await Promise.all([
        AsyncStorage.getItem('token'),
        AsyncStorage.getItem('userId')
      ]);

      const storedUserId = userIdString ? parseInt(userIdString, 10) : null;

      if (!storedToken || !storedUserId) {
        console.error("Save progress failed: Authentication token or User ID not found in AsyncStorage.");
        return;
      }
      console.log(`Save progress: Retrieved token (present: ${!!storedToken}), userId=${storedUserId}`);

      const currentTimeSeconds = Math.floor(currentTimeMs / 1000);

      if (currentTimeSeconds <= 0 && !isFinalSave) {
        console.log("Save progress skipped: current time is 0 and not a final save.");
        return;
      }

      const finalTotalDurationSeconds =
        totalDurationRef.current > 0
          ? Math.floor(totalDurationRef.current / 1000)
          : (typeof videoLengthFromParams === 'number' && !isNaN(videoLengthFromParams)
            ? videoLengthFromParams
            : 0);

      const progressData = {
        user_id: storedUserId,
        video_id: videoId,
        last_watched_timestamp_seconds: currentTimeSeconds,
        is_finished: isFinalSave,
        total_duration_seconds: finalTotalDurationSeconds,
      };

      console.log('--- SaveProgress API Request ---');
      console.log('URL:', `${url}User/User_Video_Progress_Insert`);
      console.log('Headers:', { 'Authorization': `Bearer ${storedToken}`, 'Content-Type': 'application/json' });
      console.log('Body:', JSON.stringify(progressData, null, 2));

      const response = await fetch(`${url}User/User_Video_Progress_Insert`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${storedToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(progressData),
      });

      const responseText = await response.text();
      console.log('--- SaveProgress API Response ---');
      console.log('Status:', response.status);
      console.log('Body:', responseText);

      if (!response.ok) {
        console.error("Save progress API failed:", response.status, responseText);
      } else {
        console.log("Save progress API successful.");
      }
    } catch (err) {
      console.error("Error during saveProgress:", err);
    }
  }, [videoId, url, isViewLimitReached, videoLengthFromParams]);

  const checkViewLimit = useCallback((viewCount) => {
    const MAX_VIEWS = 3;
    console.log(`checkViewLimit: Current views = ${viewCount}, Max views = ${MAX_VIEWS}`);
    if (viewCount >= MAX_VIEWS) {
      setIsViewLimitReached(true);
      if (!hasShownLimitAlertRef.current) {
        hasShownLimitAlertRef.current = true;
        setTimeout(() => {
          Alert.alert(
            "View Limit Reached",
            `You have watched this video ${MAX_VIEWS} times. You will be redirected.`,
            [{ text: "OK", onPress: () => navigation.goBack() }],
            { cancelable: false }
          );
          console.log('View limit alert shown.');
        }, 100);
      }
      return true;
    }
    return false;
  }, [navigation]);

  const fetchLastWatchedPosition = useCallback(async () => {
    console.log('fetchLastWatchedPosition called.');
    if (!videoId) {
      console.warn("fetchLastWatchedPosition skipped: videoId is missing.");
      return 0;
    }

    try {
      const [storedToken, userIdString] = await Promise.all([
        AsyncStorage.getItem('token'),
        AsyncStorage.getItem('userId')
      ]);

      if (!storedToken || !userIdString) {
        console.error("Fetch progress failed: Authentication token or User ID not found in AsyncStorage.");
        return 0;
      }
      const storedUserId = parseInt(userIdString, 10);
      console.log(`Fetch progress: Retrieved token (present: ${!!storedToken}), userId=${storedUserId}`);

      const params = { userId: storedUserId, videoId: videoId };
      const queryString = new URLSearchParams(params).toString();
      const requestUrl = `${url}User/User_Video_Progress_Select_All_DATA?${queryString}`;

      console.log('--- FetchLastWatchedPosition API Request ---');
      console.log('URL:', requestUrl);
      console.log('Headers:', { 'Authorization': `Bearer ${storedToken}`, 'Accept': 'application/json' });

      const response = await fetch(requestUrl, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${storedToken}`, 'Accept': 'application/json' },
      });

      const responseText = await response.text();
      console.log('--- FetchLastWatchedPosition API Response ---');
      console.log('Status:', response.status);
      console.log('Body:', responseText);

      if (!response.ok) {
        console.error(`Fetch progress API failed: Status=${response.status}, Body=${responseText}`);
        throw new Error(`API Error fetching progress: ${response.status}`);
      }

      const data = JSON.parse(responseText);
      console.log('FetchLastWatchedPosition API Response (Parsed):', data);

      let lastWatched = 0;
      if (Array.isArray(data) && data.length > 0) {
        const views = data[0].total_views || 0;
        const lastWatchedFromApi = data[0].last_watched_timestamp_seconds || 0;
        const isCompleted = data[0].is_finished || false;

        console.log(`Received from API: total_views=${views}, last_watched_timestamp_seconds=${lastWatchedFromApi}, is_finished=${isCompleted}`);

        setTotalViews(views);

        if (checkViewLimit(views)) {
          console.log(`View limit reached for videoId: ${videoId}. Aborting playback.`);
          return -1;
        }

        if (isCompleted) {
          console.log('Video was previously marked as finished, starting from 0.');
          lastWatched = 0;
        } else {
          lastWatched = lastWatchedFromApi;
        }
      } else {
        console.log('No progress data found for this video. Starting from 0.');
        lastWatched = 0;
      }

      console.log(`fetchLastWatchedPosition returning: ${lastWatched} seconds.`);
      return lastWatched;
    } catch (error) {
      console.error("Error fetching last watched position:", error);
      setError("Could not retrieve video progress.");
      return 0;
    }
  }, [videoId, url, checkViewLimit]);

  useFocusEffect(
    useCallback(() => {
      console.log('--- useFocusEffect: Component Focused ---');
      setIsLoading(true);
      setError(null);
      progressRef.current = 0;
      totalDurationRef.current = 0;
      setIsPlayerReady(false);
      targetSeekPositionRef.current = 0;
      setTotalViews(0);
      setIsViewLimitReached(false);
      isSeekingRef.current = false;
      hasShownLimitAlertRef.current = false;
      initialSeekAttemptedRef.current = false;

      if (saveProgressTimeoutRef.current) {
        clearTimeout(saveProgressTimeoutRef.current);
        saveProgressTimeoutRef.current = null;
        console.log('useFocusEffect: Cleared existing save progress timeout.');
      }

      const initializePlayerAndFetchProgress = async () => {
        console.log('initializePlayerAndFetchProgress: Starting...');
        try {
          const lastPositionSeconds = await fetchLastWatchedPosition();
          console.log(`initializePlayerAndFetchProgress: fetchLastWatchedPosition returned: ${lastPositionSeconds}s`);

          if (lastPositionSeconds === -1) {
            setIsLoading(false);
            console.log('initializePlayerAndFetchProgress: View limit reached, stopping initialization.');
            return;
          }

          if (lastPositionSeconds > 0) {
            targetSeekPositionRef.current = lastPositionSeconds;
            console.log(`initializePlayerAndFetchProgress: Target seek position set to ${lastPositionSeconds}s.`);
          } else {
            console.log('initializePlayerAndFetchProgress: No seek needed (lastPosition is 0).');
          }
        } catch (err) {
          setError("Could not load video details.");
          setIsLoading(false);
          console.error('initializePlayerAndFetchProgress: Error during initialization flow:', err);
        }
      };
      initializePlayerAndFetchProgress();

      return () => {
        console.log('--- useFocusEffect Cleanup: Component Unfocused/Unmounting ---');
        if (saveProgressTimeoutRef.current) {
          clearTimeout(saveProgressTimeoutRef.current);
          saveProgressTimeoutRef.current = null;
          console.log('Cleanup: Cleared save progress timeout.');
        }

        const lastKnownTime = progressRef.current;
        if (lastKnownTime > 0 && !isViewLimitReached) {
          console.log("Cleanup: Attempting final progress save for:", lastKnownTime);
          saveProgress(lastKnownTime, false)
            .then(() => console.log('Cleanup: Final progress save completed.'))
            .catch(e => console.error('Cleanup: Error saving final progress:', e));
        } else {
          console.log(`Cleanup: Skipping final save. lastKnownTime=${lastKnownTime}, isViewLimitReached=${isViewLimitReached}`);
        }

        if (playerRef.current) {
          try {
            console.log('Cleanup: Attempting to pause and release VdoPlayerView.');
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
            console.log('Cleanup: playerRef.current set to null.');
          }
        } else {
          console.warn('Cleanup: playerRef.current is null. Skipping pause/release.');
        }
      };
    }, [fetchLastWatchedPosition, saveProgress, isViewLimitReached, navigation])
  );

  useEffect(() => {
    if (totalViews > 0 || isViewLimitReached) {
      console.log(`useEffect [totalViews]: Checking view limit with totalViews=${totalViews}`);
      checkViewLimit(totalViews);
    }
  }, [totalViews, checkViewLimit, isViewLimitReached]);

  useEffect(() => {
    console.log(`useEffect [isPlayerReady, targetSeekPositionRef.current]: isPlayerReady=${isPlayerReady}, targetSeekPosition=${targetSeekPositionRef.current}, initialSeekAttempted=${initialSeekAttemptedRef.current}`);

    if (isPlayerReady && targetSeekPositionRef.current > 0 && !initialSeekAttemptedRef.current) {
      initialSeekAttemptedRef.current = true;
      isSeekingRef.current = true;

      if (playerRef.current && typeof playerRef.current.seek === 'function') {
        const seekTimeMs = targetSeekPositionRef.current * 1000;
        console.log(`useEffect [seek trigger]: Attempting to seek to ${seekTimeMs}ms (target: ${targetSeekPositionRef.current}s).`);
        playerRef.current.seek(seekTimeMs);

        setTimeout(() => {
          if (playerRef.current && typeof playerRef.current.play === 'function') {
            playerRef.current.play();
            console.log('useEffect [seek trigger]: Player resumed after seek with delay.');
          } else {
            console.warn('useEffect [seek trigger]: playerRef.current or play function not available after seek delay. Player state might be unexpected.');
          }
        }, 500);
      } else {
        console.warn("useEffect [seek trigger]: playerRef.current.seek is not a function or playerRef.current is null. Cannot perform initial seek.");
        isSeekingRef.current = false;
        setIsLoading(false);
      }
    } else if (isPlayerReady && targetSeekPositionRef.current === 0 && !initialSeekAttemptedRef.current) {
        initialSeekAttemptedRef.current = true;
        setIsLoading(false);
        console.log('useEffect [seek trigger]: Player ready, no seek needed (starting from 0), hiding loading.');
    }
  }, [isPlayerReady, targetSeekPositionRef.current, initialSeekAttemptedRef.current]);

  const handleLoaded = useCallback(({ duration }) => {
    console.log(`VdoPlayerView handleLoaded: Player reported duration=${duration}ms.`);
    if (typeof duration === 'number' && !isNaN(duration) && duration > 0) {
      totalDurationRef.current = duration;
      console.log(`handleLoaded: totalDurationRef.current set to ${totalDurationRef.current}ms.`);
    } else {
      totalDurationRef.current = 0;
      console.warn('handleLoaded: Player reported invalid or zero duration. This will be saved as 0 in API.');
    }

    if (isViewLimitReached) {
      setIsLoading(false);
      console.log('handleLoaded: View limit already reached, hiding loading.');
      return;
    }
    console.log('handleLoaded: Video metadata loaded.');
  }, [isViewLimitReached]);

  const onProgress = useCallback((progress) => {
    if (!progress || typeof progress.currentTime !== 'number' || isViewLimitReached) {
      return;
    }

    const currentProgressSeconds = Math.floor(progress.currentTime / 1000);
    const targetSeekSeconds = targetSeekPositionRef.current;
    const seekToleranceSeconds = 3;

    if (isSeekingRef.current && targetSeekSeconds > 0 && currentProgressSeconds < (targetSeekSeconds - seekToleranceSeconds)) {
      return;
    }

    if (isSeekingRef.current && currentProgressSeconds >= (targetSeekSeconds - seekToleranceSeconds)) {
      isSeekingRef.current = false;
      targetSeekPositionRef.current = 0;
      console.log(`onProgress: Seek operation completed around ${currentProgressSeconds}s. Clearing targetSeekPositionRef.`);
    }

    progressRef.current = progress.currentTime;

    if (saveProgressTimeoutRef.current) {
      clearTimeout(saveProgressTimeoutRef.current);
      saveProgressTimeoutRef.current = null;
    }
    saveProgressTimeoutRef.current = setTimeout(() => {
      console.log(`onProgress: Debounced saveProgress triggered for ${progress.currentTime}ms.`);
      saveProgress(progress.currentTime);
    }, 10000);
  }, [isViewLimitReached, saveProgress]);

  const backAction = useCallback(async () => {
    console.log('backAction: Hardware back button pressed.');
    if (saveProgressTimeoutRef.current) {
      clearTimeout(saveProgressTimeoutRef.current);
      saveProgressTimeoutRef.current = null;
      console.log('backAction: Cleared save progress timeout.');
    }

    if (!isViewLimitReached) {
      const lastKnownTime = progressRef.current;
      if (lastKnownTime > 0) {
        console.log("backAction: Saving final progress before navigating back:", lastKnownTime);
        await saveProgress(lastKnownTime, false);
      }
    } else {
      console.log("backAction: Skipping final save due to view limit being reached.");
    }

    Orientation.lockToPortrait();

    console.log('backAction: Navigating. Came from:', cameFrom);
    if (cameFrom === 'Dashboard') {
      navigation.navigate('Home');
    } else if (cameFrom) {
      navigation.navigate(cameFrom);
    } else {
      navigation.goBack();
    }
    return true;
  }, [navigation, saveProgress, isViewLimitReached, cameFrom]);

  const handleEnded = useCallback(() => {
    console.log('handleEnded: Media Ended.');
    if (saveProgressTimeoutRef.current) {
      clearTimeout(saveProgressTimeoutRef.current);
      saveProgressTimeoutRef.current = null;
      console.log('handleEnded: Cleared save progress timeout.');
    }

    if (!isViewLimitReached) {
      console.log("handleEnded: Saving final progress (video finished).");
      saveProgress(progressRef.current, true)
        .then(() => console.log('handleEnded: Final progress save completed.'))
        .catch(e => console.error('handleEnded: Error saving final progress:', e));
    } else {
      console.log("handleEnded: Skipping final save due to view limit being reached.");
    }

    console.log('handleEnded: Navigating back. Came from:', cameFrom);
    if (cameFrom === 'Dashboard') {
      navigation.navigate('Home');
    } else if (cameFrom) {
      navigation.navigate(cameFrom);
    } else {
      navigation.goBack();
    }
  }, [saveProgress, navigation, cameFrom, isViewLimitReached]);

  const handleInitFailure = useCallback((err) => {
    console.error('VdoPlayerView Initialization Failure:', err);
    setIsLoading(false);
    const errorMessage = err.errorDescription || "Video initialization failed. Please try again.";
    Alert.alert("Video Error", errorMessage,
      [{
        text: "OK",
        onPress: () => {
          console.log('handleInitFailure: Navigating back. Came from:', cameFrom);
          if (cameFrom === 'Dashboard') {
            navigation.navigate('Home');
          } else if (cameFrom) {
            navigation.navigate(cameFrom);
          } else {
            navigation.goBack();
          }
        }
      }],
      { cancelable: false }
    );
  }, [navigation, cameFrom]);

  const handleLoadError = useCallback(({ errorDescription }) => {
    console.error('VdoPlayerView Load Error:', errorDescription);
    setIsLoading(false);
    const errorMessage = errorDescription || "Video failed to load. Please try again.";
    Alert.alert("Video Error", errorMessage,
      [{
        text: "OK",
        onPress: () => {
          console.log('handleLoadError: Navigating back. Came from:', cameFrom);
          if (cameFrom === 'Dashboard') {
            navigation.navigate('Home');
          } else if (cameFrom) {
            navigation.navigate(cameFrom);
          } else {
            navigation.goBack();
          }
        }
      }],
      { cancelable: false }
    );
  }, [navigation, cameFrom]);

  const handleError = useCallback(({ errorDescription }) => {
    console.error('VdoPlayerView Playback Error:', errorDescription);
    setIsLoading(false);
    if (saveProgressTimeoutRef.current) {
      clearTimeout(saveProgressTimeoutRef.current);
      saveProgressTimeoutRef.current = null;
      console.log('handleError: Cleared save progress timeout.');
    }
    const errorMessage = errorDescription || "An unknown playback error occurred. Please try again.";
    Alert.alert("Video Error", errorMessage,
      [{
        text: "OK",
        onPress: () => {
          console.log('handleError: Navigating back. Came from:', cameFrom);
          if (cameFrom === 'Dashboard') {
            navigation.navigate('Home');
          } else if (cameFrom) {
            navigation.navigate(cameFrom);
          } else {
            navigation.goBack();
          }
        }
      }],
      { cancelable: false }
    );
  }, [navigation, cameFrom]);

  const handleInitializationSuccess = useCallback(() => {
    console.log('VdoPlayerView handleInitializationSuccess: Player reports ready.');
    setIsPlayerReady(true);
  }, []);

  const onPlaybackStateChanged = useCallback((state) => {
    console.log('VdoPlayerView onPlaybackStateChanged:', state);
  }, []);

  useEffect(() => {
    console.log('BackHandler useEffect: Adding hardwareBackPress listener.');
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => {
      console.log('BackHandler useEffect cleanup: Removing listener.');
      backHandler.remove();
      if (saveProgressTimeoutRef.current) {
        clearTimeout(saveProgressTimeoutRef.current);
        saveProgressTimeoutRef.current = null;
        console.log('BackHandler cleanup: Cleared save progress timeout.');
      }
    };
  }, [backAction]);

  if (!otp || !playbackInfo) {
    return (
      <View style={[styles.container, { backgroundColor: isDarkMode ? Colors.darker : Colors.lighter, justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={isDarkMode ? Colors.darker : Colors.lighter} />
        <Text style={[styles.errorText, { color: isDarkMode ? Colors.light : Colors.dark }]}>
          वीडियो विवरण (ओटीपी या प्लेबैक जानकारी) गुम है। कृपया वापस जाएं और पुनः प्रयास करें।
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? Colors.darker : Colors.lighter, justifyContent: 'center', alignItems: 'center' }]}>
      <StatusBar barStyle='light-content' backgroundColor='black' />

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>वीडियो लोड हो रहा है...</Text>
        </View>
      )}

      {error && !isLoading ? (
        <View style={[styles.errorContainer, { backgroundColor: isDarkMode ? Colors.darker : Colors.lighter }]}>
          <Text style={[styles.errorText, { color: isDarkMode ? Colors.light : Colors.dark }]}>
            त्रुटि: {error}
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
          onLoading={() => { setIsLoading(true); console.log('VdoPlayerView onLoading event: Setting isLoading to true.'); }}
          onLoaded={handleLoaded}
          onProgress={onProgress}
          onLoadError={handleLoadError}
          onError={handleError}
          onPlaybackStateChanged={onPlaybackStateChanged}
          onPlaybackComplete={() => {
            console.log('VdoPlayerView onPlaybackComplete.');
            if (!isViewLimitReached) {
              saveProgress(progressRef.current, true);
            }
          }}
          onTracksChanged={(args) => console.log('VdoPlayerView tracks changed:', args)}
          onPlaybackSpeedChanged={(speed) => console.log('VdoPlayerView speed changed to', speed)}
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
