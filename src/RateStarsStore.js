import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, BackHandler, StatusBar, useColorScheme } from 'react-native';
import ScreenScroll from './components/ScreenScroll';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const RateStarsStore = ({ navigation, route }) => {
  const isDarkMode = useColorScheme() === 'dark';
    const backgroundStyle = {
      backgroundColor: isDarkMode ? '#2a3144' : Colors.white,
    };

  useEffect(() => {
            const backAction = () => {
              if (navigation && typeof navigation.canGoBack === 'function' && navigation.canGoBack()) {
                navigation.navigate('My Profile');
                return true;
              }
              if (route && route.params && route.params.origin) {
                navigation.navigate(route.params.origin);
                return true;
              }
              return false;
            };

            const backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                backAction
            );

            return () => {
                backHandler.remove();
                StatusBar.setHidden(false);
            };
        }, [navigation]);

  return (
    <View style={[styles.container, backgroundStyle]}>
      <ScreenScroll contentContainerStyle={{ flexGrow: 1 }}>
        <Text style={[styles.text, { color: isDarkMode ? Colors.white : Colors.black }]}>Rate us 5 stars on the store</Text>
      </ScreenScroll>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f2f2'},
  text: { fontSize: 20, textAlign: 'center', margin: 10 },
  bottomNav: {flexDirection: 'row',justifyContent: 'space-around',alignItems: 'center', backgroundColor: '#fff',paddingVertical: 10,bottom: 0, width: '100%',borderTopLeftRadius: 20,borderTopRightRadius: 20,shadowColor: '#000',shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2,shadowRadius: 20,elevation: 5},
  navItem: { alignItems: 'center' },
  inactive: { opacity: 0.5 },
  navIcon: { width: 25, height: 25, resizeMode: 'contain'},
  navTextActive: { color: 'rgba(20, 52, 164, 1)', fontSize: 10, marginTop: 4, fontWeight:'bold'},
  navText: { color: 'gray', fontSize: 10, marginTop: 4, fontWeight:'bold' },
});

export default RateStarsStore;
