import React from 'react';
import { StyleSheet, View } from 'react-native';
import Video from 'react-native-video';
import { StatusBar } from 'react-native';

const SplashScreen = ({ onVideoEnd }) => {
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