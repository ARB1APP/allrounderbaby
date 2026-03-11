import React, { useEffect, useState, useRef, useCallback, useMemo, } from "react";
import { StyleSheet, Text, View, BackHandler, Alert, StatusBar, Platform, useWindowDimensions, } from "react-native";
import Orientation from 'react-native-orientation-locker';
import { VdoPlayerView } from "vdocipher-rn-bridge";
import { useRoute, useNavigation, useFocusEffect, } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "./config/api";

const VideoPlayerScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const playerRef = useRef(null);
  const skipImmediateCleanupRef = useRef(false);
  const delayedCleanupTimerRef = useRef(null);
  const progressSentRef = useRef(false);
  const finishedSentRef = useRef(false);
  const maxWatchedTimeRef = useRef(0);
  /* ================= GET PARAMS ================= */

  const {
    VideoId,
    annotate,
    total_time,
    language,
    step,
    cameFrom,
    stage_name,
    displayStep,
  } = route.params || {};

  const videoId = VideoId;
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const isLandscape = screenWidth > screenHeight;
  const playerHeight = isLandscape ? screenHeight : Math.round((screenWidth * 9) / 16);

  const [credentials, setCredentials] = useState({
    otp: null,
    playbackInfo: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoCompleted, setVideoCompleted] = useState(false);
  const currentTimeRef = useRef(0);


  /* ================= FETCH OTP ================= */

  const fetchVideoCredentials = useCallback(async () => {
    if (!videoId) return;
    try {
      setIsLoading(true);
      setError(null);
      const [userId, token] = await Promise.all([
        AsyncStorage.getItem("userId"),
        AsyncStorage.getItem("token"),
      ]);

      const response = await fetch(
        `${BASE_URL}Vdocipher/GetVideosFromVDOCipher_VideoId`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
          body: JSON.stringify({
            UserId: userId ? parseInt(userId, 10) : null,
            VideoId: videoId,
            annotate: annotate || JSON.stringify({}),
          }),
        }
      );

      if (!response.ok)
        throw new Error(`HTTP ${response.status}`);

      const data = await response.json();

      if (!data?.otp || !data?.playbackInfo)
        throw new Error("Invalid video credentials");

      setCredentials({
        otp: data.otp,
        playbackInfo:
          Platform.OS === "android" &&
            typeof data.playbackInfo !== "string"
            ? JSON.stringify(data.playbackInfo)
            : data.playbackInfo,
      });
    } catch (err) {
      setError({ message: err.message });
    } finally {
      setIsLoading(false);
    }
  }, [videoId]);


  const toSeconds = useCallback((val) => {
    if (val == null) return 0;
    const n = Number(val);
    if (Number.isNaN(n)) return 0;
    return n < 0 ? 0 : Math.floor(n);
  }, []);

  /* ================= REFRESH WHEN VIDEO CHANGES ================= */

  useEffect(() => {
    if (videoId) {
      progressSentRef.current = false;
      finishedSentRef.current = false;
      maxWatchedTimeRef.current = 0;
      setCurrentTime(0);
      fetchVideoCredentials();
    }
  }, [videoId, fetchVideoCredentials]);

  /* ================= CLEANUP ================= */

  useEffect(() => {
    return () => {
      try {
        // Simply stop and release the player immediately on unmount
        if (playerRef.current) {
          playerRef.current.stop?.();
          playerRef.current.release?.();
          playerRef.current = null;
        }
      } catch (e) {
        // silently ignore errors
      }
    };
  }, []);

  useEffect(() => {
    try {
      Orientation.unlockAllOrientations();
    } catch (e) {
    }

    return () => {
      try {
        Orientation.lockToPortrait();
      } catch (e) {
      }
    };
  }, []);

  // hide header and status bar when device rotated to landscape or when player enters fullscreen
  // useEffect(() => {
  //   try {
  //     navigation.setOptions({ headerShown: !isLandscape });
  //   } catch (e) { }

  //   try {
  //     StatusBar.setHidden(isLandscape || isFullscreen);
  //   } catch (e) { }
  // }, [isLandscape, navigation]);
  useEffect(() => {
    navigation.setOptions({ headerShown: !isLandscape });
    StatusBar.setHidden(isLandscape || isFullscreen);
  }, [isLandscape, isFullscreen, navigation]);

  useFocusEffect(
    useCallback(() => {
      setIsFullscreen(false);
      setError(null);
      setCredentials({ otp: null, playbackInfo: null });
      progressSentRef.current = false;
      finishedSentRef.current = false;

      if (videoId) {
        fetchVideoCredentials();
      }
      const sub = BackHandler.addEventListener(
        "hardwareBackPress",
        handleBack
      );

      return () => {
        sub.remove();
        setIsFullscreen(false);
        setError(null);
        setCredentials({ otp: null, playbackInfo: null });
        progressSentRef.current = false;
        finishedSentRef.current = false;
      };
    }, [videoId, fetchVideoCredentials, handleBack])
  );
  /* ================= UPDATE PROGRESS ================= */

  const updateProgress = useCallback(
    async (isFinished = false, overrideSeconds = null) => {
      if (!videoId) return;

      try {
        const [userId, token, deviceKey] = await Promise.all([
          AsyncStorage.getItem("userId"),
          AsyncStorage.getItem("token"),
          AsyncStorage.getItem("deviceKey"),
        ]);

        const userIdInt = userId ? parseInt(userId, 10) : null;

        // ✅ Use exact currentTime from player if overrideSeconds is not passed
        const sendSecs = overrideSeconds != null
          ? Math.floor(overrideSeconds)
          : Math.floor(currentTimeRef.current);

        //console.log("Sending watched time (exact currentTime):", sendSecs);

        const finishedThreshold = total_time ? Math.ceil(toSeconds(total_time) * 0.8) : sendSecs;
        const finished = sendSecs >= finishedThreshold ? 1 : 0;

        const payload = {
          User_id: userIdInt,
          video_id: videoId,
          last_watched_timestamp_seconds: sendSecs,
          Language: language,
          is_finished: finished,
          level_step: step,
          total_views: 1,
          total_time: toSeconds(total_time),
          playback: "fgdfg",
          otp: "dsg",
          stage_name: `${stage_name || ""} ${displayStep ?? step}`.trim(),
          DeviceKey: deviceKey,
        };

        const headers = {
          Accept: "application/json",
          "Content-Type": "application/json",
        };

        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(`${BASE_URL}User/User_Video_Data`, {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        //  console.log("Progress update response:", data);

      } catch (error) {
        // console.log("Failed to update progress", error?.message || error);
      }
    },
    [videoId, currentTime, language, step, stage_name, displayStep, total_time]
  );
  /* ================= BACK HANDLER ================= */


  const handleBack = useCallback(() => {
    // 1️⃣ Stop video immediately to release native player resources
    if (playerRef.current) {
      playerRef.current.stop?.();
      playerRef.current.release?.();
    }

    // 2️⃣ Fire progress update asynchronously (non-blocking)
    updateProgress().catch(() => { });

    // 3️⃣ Navigate immediately
    if (cameFrom === "Dashboard") {
      navigation.navigate("Home");
    } else if (cameFrom) {
      navigation.navigate(cameFrom);
    } else {
      navigation.goBack();
    }

    return true;
  }, [navigation, cameFrom, updateProgress]);

  /* ================= LOADING ================= */

  if (isLoading || !credentials?.otp) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#fff" }}>Loading video...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {error.message || "Unable to load video"}
        </Text>
      </View>
    );
  }

  /* ================= RENDER ================= */

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" hidden={isLandscape} />

      <VdoPlayerView
        key={videoId}
        ref={playerRef}
        style={{
          width: "100%",
          height: playerHeight,
          backgroundColor: "#000",
        }}
        embedInfo={{
          otp: credentials.otp,
          playbackInfo: credentials.playbackInfo,
        }}
        onProgress={(p) => {
          if (p && typeof p.currentTime === "number") {
            const secs = Math.floor(p.currentTime > 1000 ? p.currentTime / 1000 : p.currentTime);
            setCurrentTime(secs);         // state update for UI
            currentTimeRef.current = secs; // ref for real-time usage
            //  console.log("Current Time (s):", secs);
          }
        }}
        onMediaEnded={async () => {
          setVideoCompleted(true);
          try {
            await updateProgress(true);
          } catch (e) {
            // console.log('updateProgress onMediaEnded failed', e);
          }
          if (isFullscreen) {
            playerRef.current?.exitFullscreenV2?.();
          }
        }}
        onFullscreenChange={(isFull) => {
          setIsFullscreen(isFull);
        }}
        onInitializationFailure={(e) => {
          Alert.alert(
            "Playback Error",
            e?.errorDescription || "Video failed to load"
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  errorText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});

export default VideoPlayerScreen;