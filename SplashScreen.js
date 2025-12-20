import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import Video from 'react-native-video';
import { StatusBar } from 'react-native';

const SplashScreen = ({ onVideoEnd, onSkip }) => {
  return (
    <View style={styles.container}>
       <StatusBar backgroundColor="#111" barStyle="light-content" />
      <Video
        source={require('./assets/splash_video.mp4')}
        style={styles.video}
        resizeMode="stretch"
        onEnd={onVideoEnd}
        repeat={false}
      />
      {onSkip ? (
        <TouchableOpacity style={styles.skipOverlay} activeOpacity={0.8} onPress={onSkip} accessibilityLabel="splash-skip">
          <Text style={styles.skipText}>Tap to continue</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'black',
  },
  video: {
    width: '100%',
    height: '100%',
  },
});

export default SplashScreen;