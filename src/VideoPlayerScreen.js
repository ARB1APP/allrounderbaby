import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  StyleSheet,
  Text,
  View,
  BackHandler,
  Alert,
  StatusBar,
  Platform,
} from "react-native";
import { VdoPlayerView } from "vdocipher-rn-bridge";
import {
  useRoute,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "./config/api";
import { Dimensions } from "react-native";


const VideoPlayerScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const playerRef = useRef(null);
  const progressUpdated = useRef(false);
  const [playerKey, setPlayerKey] = useState(0);

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
  const screenWidth = Dimensions.get("window").width;
  const playerHeight = Math.round((screenWidth * 9) / 16);
  // const { width, height } = useWindowDimensions();
  // const isLandscape = width > height;

  const [credentials, setCredentials] = useState({
    otp: null,
    playbackInfo: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  /* ================= REFRESH WHEN VIDEO CHANGES ================= */

  useEffect(() => {
    if (videoId) {
      progressUpdated.current = false;
      setCredentials({ otp: null, playbackInfo: null });
      fetchVideoCredentials();
    }
  }, [videoId]);

  /* ================= CLEANUP ================= */

  useEffect(() => {
    // return () => {
    //   try {
    //     playerRef.current?.stop?.();
    //     playerRef.current?.release?.();
    //   } catch (e) { }
    // };
    return () => {
      try {
        if (playerRef.current) {
          playerRef.current.stop?.();
          playerRef.current.release?.();
          playerRef.current = null;
        }
      } catch (e) { }
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      setCurrentTime(0);
      setIsFullscreen(false);
      setError(null);
      setCredentials({ otp: null, playbackInfo: null });
      progressUpdated.current = false;

      if (videoId) {
        fetchVideoCredentials();
      }

      const sub = BackHandler.addEventListener(
        "hardwareBackPress",
        handleBack
      );

      return () => {
        sub.remove();
        setCurrentTime(0);
        setIsFullscreen(false);
        setError(null);
        setCredentials({ otp: null, playbackInfo: null });
        progressUpdated.current = false;
      };
    }, [videoId, handleBack, fetchVideoCredentials])
  );
  /* ================= UPDATE PROGRESS ================= */

  const updateProgress = useCallback(
    async (isFinished = false) => {
      if (!videoId) return;
      // avoid duplicate calls when progress already updated (unless marking finished)
      if (progressUpdated.current && !isFinished) return;

      try {
        const [userId, token, deviceKey, savedProgress] =
          await Promise.all([
            AsyncStorage.getItem("userId"),
            AsyncStorage.getItem("token"),
            AsyncStorage.getItem("deviceKey"),
            AsyncStorage.getItem("userProgress"),
          ]);

        const userIdInt = userId ? parseInt(userId, 10) : null;
        const seconds = Math.floor(currentTime || 0);

        let progressData = [];
        if (savedProgress) {
          try {
            progressData = JSON.parse(savedProgress);
          } catch {
            progressData = [];
          }
        }

        const index = progressData.findIndex(
          (p) => p.video_id === videoId
        );

        let previousFinishCount = 0;

        if (index > -1) {
          previousFinishCount = progressData[index].is_finished || 0;
        }

        const newFinishCount = isFinished
          ? previousFinishCount + 1
          : previousFinishCount;

        const payload = {
          User_id: userIdInt,
          video_id: videoId,
          last_watched_timestamp_seconds: seconds,
          Language: language,
          is_finished: newFinishCount,
          level_step: step,
          total_views: 1,
          total_time: total_time,
          playback: 'fgdfg',
          otp: 'dsg',
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

        const response = await fetch(
          `${BASE_URL}User/User_Video_Data`,
          {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        // ✅ Update Local Storage Properly
        if (index > -1) {
          progressData[index] = {
            ...progressData[index],
            last_watched_timestamp_seconds: seconds,
            is_finished: newFinishCount,
          };
        } else {
          progressData.push({
            video_id: videoId,
            last_watched_timestamp_seconds: seconds,
            is_finished: newFinishCount,
            level_step: step,
          });
        }

        await AsyncStorage.setItem(
          "userProgress",
          JSON.stringify(progressData)
        );

        // mark that we've updated progress so we don't send duplicate requests
        progressUpdated.current = true;
      } catch (error) {
        console.log("Progress update failed:", error);
      }
    },
    [
      videoId,
      currentTime,
      total_time,
      credentials?.otp,
      language,
      step,
      stage_name,
      displayStep,
    ]
  );
  /* ================= BACK HANDLER ================= */

  const handleBack = useCallback(async () => {
    if (isFullscreen) {
      playerRef.current?.exitFullscreenV2?.();
      return true;
    }

    await updateProgress();

    if (cameFrom === "Dashboard") {
      navigation.navigate("Home");
    } else if (cameFrom) {
      navigation.navigate(cameFrom);
    } else {
      navigation.goBack();
    }

    return true;
  }, [isFullscreen, navigation, cameFrom, updateProgress]);

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
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <VdoPlayerView
        key={`${videoId}-${playerKey}`}
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
          if (p?.currentTime) setCurrentTime(p.currentTime);
        }}
        onMediaEnded={async () => {
          await updateProgress(true);
          handleBack();
        }}
        onFullscreenChange={(isFull) => {
          setIsFullscreen(isFull);
          if (!isFull) {
            setTimeout(() => {
              setPlayerKey(prev => prev + 1);
            }, 400);
          }
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