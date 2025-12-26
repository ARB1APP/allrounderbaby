import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  View,
  Platform,
} from 'react-native';
import Video from 'react-native-video';

const SplashScreen = ({ onVideoEnd }) => {
  return (
    <SafeAreaView
      style={[
        styles.container,
        Platform.OS === 'android' && { paddingTop: StatusBar.currentHeight || 0 },
      ]}
    >
      <StatusBar backgroundColor="#000" barStyle="light-content" />

      <View style={styles.videoWrapper}>
        <Video
          source={require('./assets/splash_video.mp4')}
          style={styles.video}
          resizeMode="cover"
          onEnd={onVideoEnd}
          repeat={false}
          muted={false}
        />
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoWrapper: {
    flex: 1,
  },
  video: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  skipButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  skipText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SplashScreen;
