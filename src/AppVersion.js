import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image, BackHandler, StatusBar, useColorScheme } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const AppVersion = ({ navigation }) => {
  const isDarkMode = useColorScheme() === 'dark'; 
  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#1a202c' : '#f0f4f8', 
  };

  const textColor = {
    color: isDarkMode ? Colors.white : Colors.black,
  };

  useEffect(() => {
    const backAction = () => {
      console.log('Hardware back press detected');
      if (navigation.canGoBack()) {
        console.log('Navigating back');
        navigation.goBack(); 
      } else {
        console.log('Cannot go back, staying on screen or navigating to Home');
      }
      return true; 
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => {
      console.log('Removing back handler');
      backHandler.remove();
      StatusBar.setHidden(false); 
    };
  }, [navigation]); 

  return (
    <View style={[styles.container, backgroundStyle]}>
      <View style={styles.contentWrapper}>
        <Image
          source={require('../img/loginlogo.png')}
          style={styles.logo}
          accessibilityLabel="App Logo"
        />
        {/* <Text style={[styles.appName, textColor]}>Allrounderbaby App</Text> */}
        <Text style={[styles.versionText, textColor]}>Version 1.0.0</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  contentWrapper: {
    alignItems: 'center', 
    padding: 0,
    borderRadius: 20, 
    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
    // shadowColor: '#000', 
    // shadowOffset: { width: 0, height: 10 },
    // shadowOpacity: 0.1,
    // shadowRadius: 20,
    // elevation: 10, 
  },
  logo: {
    width: 250, // Size of the logo
    height: 130,
    resizeMode: 'cover', // Ensures the whole logo is visible
    marginBottom: 15, // Space below the logo
    borderRadius: 50, // Slightly rounded logo corners
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 5 },
    // shadowOpacity: 0.1,
    // shadowRadius: 10,
    // elevation: 5,
  },
  appName: {
    fontSize: 28, 
    fontWeight: 'bold',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  versionText: {
    fontSize: 18, 
    fontWeight: '600', 
    opacity: 0.7,
  },
});

export default AppVersion;
