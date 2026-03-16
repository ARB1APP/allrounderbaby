import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import Video from 'react-native-video';

const SplashScreen = ({ onVideoEnd }) => {

  const timerRef = useRef(null);

  useEffect(() => {

    timerRef.current = setTimeout(() => {
      console.log("Fallback splash timeout");
      if (onVideoEnd) onVideoEnd();
    }, 7000);

    return () => clearTimeout(timerRef.current);

  }, []);

  const handleVideoEnd = () => {

    console.log("Video finished");

    clearTimeout(timerRef.current);

    if (onVideoEnd) onVideoEnd();
  };

  return (
    <View style={styles.container}>

      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <Video
        source={require('./assets/splash_video.mp4')}
        style={styles.video}
        resizeMode="stretch"
        paused={false}
        muted={true}
        repeat={false}
        useTextureView={false}
        onEnd={handleVideoEnd}
        onLoad={() => console.log("Video Loaded")}
        onError={(e) => console.log("Video Error", e)}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "black",
  },
  video: {
    width: "100%",
    height: "100%",
  },
});

export default SplashScreen;