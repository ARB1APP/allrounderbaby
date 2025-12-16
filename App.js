import React, { useEffect, useState, memo, useCallback, useMemo } from 'react';
import { View, Image, StyleSheet, SafeAreaView, Text, useColorScheme, Alert, ActivityIndicator } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme, CommonActions, createNavigationContainerRef } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from './SplashScreen';
import MainApp from './MainApp';
import LoginPage from './src/LoginPage';
import Dashboard from './src/Dashboard';
import ChasCashbackforFeedback from './src/CashbackforFeedback';
import ReferAndEarn from './src/ReferAndEarn';
import Profile from './src/Profile';
import VideoPlayerScreen from './src/VideoPlayerScreen';
import ReferAndEarnConditions from './src/ReferAndEarnConditions';
import ReferralHistory from './src/ReferralHistory';
import MyOrders from './src/MyOrders';
import MyEarnings from './src/MyEarnings';
import AppVersion from './src/AppVersion';
import PrivacyPolicy from './src/PrivacyPolicy';
import TermsofService from './src/TermsofService';
import RateStarsStore from './src/RateStarsStore';
import Community from './src/Community';
import FAQ from './src/FAQ';
import GetHelp from './src/GetHelp';
import RestorePurchases from './src/RestorePurchases';
import PhotoPermission from './src/PhotoPermission';
import MyNotifications from './src/MyNotifications';
import ProgressSnapshots from './src/ProgressSnapshots';
import MyReferrals from './src/MyReferrals';
import SaveActivities from './src/SaveActivities';
import Medals from './src/Medals';
import StarTracker from './src/StarTracker';
import NextGoal from './src/NextGoal';
import AboutUs from './src/AboutUs';
import CashbackforFeedbackConditions from './src/CashbackforFeedbackConditions';
import Trails from './src/Trails';
import { BASE_URL } from './src/config/api';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();
const url = BASE_URL;
export const navigationRef = createNavigationContainerRef();

const LightThemeColors = {
  background: '#FFFFFF',
  text: '#000000',
  card: '#FFFFFF',
  border: '#CCCCCC',
  primary: 'rgba(20, 52, 164, 1)',
  headerBackground: 'rgba(20, 52, 164, 1)',
  headerTintColor: '#FFFFFF',
  headerBorderColor: '#d6fbe4',
  drawerHeaderBackground: '#FFFFFF',
  drawerContentBackground: '#FFFFFF',
  drawerBorderColor: '#CCCCCC',
  drawerFooterText: '#000000',
  drawerItemActiveBackground: 'rgba(20, 52, 164, 1)',
  drawerItemInactiveBackground: '#FFFFFF',
  drawerItemActiveLabelTint: '#FFFFFF',
  drawerItemInactiveLabelTint: '#000000',
  drawerItemActiveIconTint: '#FFFFFF',
  drawerItemInactiveIconTint: '#000000',
  safeAreaBackground: '#FFFFFF',
};
const DarkThemeColors = {
  background: '#121212',
  text: '#E0E0E0',
  card: '#1E1E1E',
  border: '#3A3A3A',
  primary: 'rgba(20, 52, 164, 1)',
  headerBackground: 'rgba(15, 39, 123, 1)',
  headerTintColor: '#FFFFFF',
  headerBorderColor: '#2E3B55',
  drawerHeaderBackground: '#1E1E1E',
  drawerContentBackground: '#1E1E1E',
  drawerBorderColor: '#3A3A3A',
  drawerFooterText: '#A0A0A0',
  drawerItemActiveBackground: '#007BFF',
  drawerItemInactiveBackground: '#1E1E1E',
  drawerItemActiveLabelTint: '#FFFFFF',
  drawerItemInactiveLabelTint: '#E0E0E0',
  drawerItemActiveIconTint: '#FFFFFF',
  drawerItemInactiveIconTint: '#E0E0E0',
  safeAreaBackground: '#000000',
};
const AppLightTheme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, ...LightThemeColors } };
const AppDarkTheme = { ...DarkTheme, colors: { ...DarkTheme.colors, ...DarkThemeColors } };

const createAppStyles = (theme) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.safeAreaBackground },
    drawerContentScrollView: { backgroundColor: theme.drawerContentBackground },
    headerContainer: { alignItems: 'center', justifyContent: 'center', backgroundColor: theme.drawerHeaderBackground, borderBottomWidth: 1, borderBottomColor: theme.drawerBorderColor, paddingBottom: 12 },
    logo: { height: 100, resizeMode: 'contain' },
    drawerItemsContainer: { paddingVertical: 10 },
    drawerItem: { height: 50 },
    drawerItemLabel: { fontSize: 16, fontFamily: 'Lexend-VariableFont_wght' },
    footerContainer: { marginTop: 'auto', padding: 10, borderTopWidth: 1, borderTopColor: theme.drawerBorderColor, alignItems: 'center', backgroundColor: theme.drawerContentBackground },
    footerText: { fontSize: 12, color: theme.drawerFooterText, fontFamily: 'Lexend-VariableFont_wght' },
  });

const drawerItems = [
  { key: "home", label: "Home", navigateTo: "Home", icon: require('./img/home.png'), iconSize: { width: 24, height: 24 } },
  { key: "profile", label: "My Profile", navigateTo: "My Profile", icon: require('./img/proflie.png'), iconSize: { width: 24, height: 24 } },
  { key: "about", label: "About Us", navigateTo: "About Us", icon: require('./img/about.png'), iconSize: { width: 22, height: 22 } },
  { key: "terms", label: "Terms of Service", navigateTo: "Terms of Service", icon: require('./img/pr.png'), iconSize: { width: 24, height: 24 } },
  { key: "privacy", label: "Privacy Policy", navigateTo: "Privacy Policy", icon: require('./img/tm.png'), iconSize: { width: 23, height: 23 } },
  { key: "rate", label: "Update App / Rate us", navigateTo: "Rate us / Update App", icon: require('./img/upadate.png'), iconSize: { width: 20, height: 20 } },
  { key: "version", label: "Version info", navigateTo: "App Version", icon: require('./img/info.png'), iconSize: { width: 24, height: 24 } },
  { key: "feedback", label: "Feedback", navigateTo: "Get Help", icon: require('./img/feedback.png'), iconSize: { width: 26, height: 26 } },
  { key: "contact", label: "Contact us", navigateTo: "Get Help", icon: require('./img/call.png'), iconSize: { width: 22, height: 22 } },
  { key: "logout", label: "Logout", navigateTo: "Login", icon: require('./img/logout.png'), iconSize: { width: 22, height: 22 } },
];

const isDrawerItemFocused = (item, props) => {
  const { state } = props;
  const currentRoute = state.routes[state.index];
  if (currentRoute.name === item.navigateTo) {
    if (item.navigateTo === 'Get Help') {
      return currentRoute.params?.source === item.label;
    }
    return true;
  }
  return false;
};

const CustomDrawerContent = memo(({ theme, handleLogout, ...props }) => {
  const styles = useMemo(() => createAppStyles(theme), [theme]);
  return (
    <DrawerContentScrollView {...props} style={styles.drawerContentScrollView} contentContainerStyle={{ flex: 1 }}>
      <View style={styles.headerContainer}>
        <Image source={require('./img/loginlogo.png')} style={styles.logo} />
      </View>
      <View style={styles.drawerItemsContainer}>
        {drawerItems.map((item) => (
          <DrawerItem
            key={item.key}
            label={item.label}
            onPress={() =>
              item.label === 'Logout'
                ? handleLogout()
                : props.navigation.navigate(item.navigateTo, { source: item.label })
            }
            style={styles.drawerItem}
            focused={isDrawerItemFocused(item, props)}
            activeBackgroundColor={theme.drawerItemActiveBackground}
            inactiveBackgroundColor={theme.drawerItemInactiveBackground}
            labelStyle={[
              styles.drawerItemLabel,
              { color: isDrawerItemFocused(item, props) ? theme.drawerItemActiveLabelTint : theme.drawerItemInactiveLabelTint },
            ]}
            icon={() => (
              <Image
                source={item.icon}
                style={{
                  width: item.iconSize.width,
                  height: item.iconSize.height,
                  tintColor: isDrawerItemFocused(item, props)
                    ? theme.drawerItemActiveIconTint
                    : theme.drawerItemInactiveIconTint,
                }}
              />
            )}
          />
        ))}
      </View>
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Copyright 2025. All Rights Reserved.</Text>
      </View>
    </DrawerContentScrollView>
  );
});

const App = () => {
  const [initialRoute, setInitialRoute] = useState(null);
  const colorScheme = useColorScheme();
  const currentThemeColors = colorScheme === 'dark' ? DarkThemeColors : LightThemeColors;
  const navigationTheme = colorScheme === 'dark' ? AppDarkTheme : AppLightTheme;
  const styles = createAppStyles(currentThemeColors);

  useEffect(() => {
    let isMounted = true;
    const checkAuthStatus = async () => {
      try {
        const firstTime = await AsyncStorage.getItem('first_time_opened');
        const token = await AsyncStorage.getItem('token');
        if (isMounted) {
          if (!firstTime) {
            setInitialRoute('Splash');
          } else if (token) {
            setInitialRoute('Home');
          } else {
            setInitialRoute('Login');
          }
        }
      } catch (error) {
        console.error('AsyncStorage error:', error);
        if (isMounted) {
          setInitialRoute('Login');
        }
      }
    };
    checkAuthStatus();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleVideoEnd = async () => {
    try {
      await AsyncStorage.setItem('first_time_opened', 'true');
      const token = await AsyncStorage.getItem('token');
      setInitialRoute(token ? 'Home' : 'Login');
    } catch (error) {
      console.error('AsyncStorage error setting first_time_opened:', error);
      setInitialRoute('Login');
    }
  };

  const clearLocalSessionAndNavigate = useCallback(async (navigation) => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('username');
      if (navigationRef.isReady()) {
        navigationRef.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
      );
      }
    } catch (localError) {
      console.error('Error clearing local storage:', localError);
      Alert.alert("Local Session Error", "Failed to clear local session data. Please restart the app.");
    }
  }, []);

  const handleGlobalLogout = useCallback(
    () => {
      Alert.alert(
        "Logout",
        "Are you sure you want to log out?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "OK",
            onPress: async () => {
              try {
                const token = await AsyncStorage.getItem('token');
                const userId = await AsyncStorage.getItem('userId');
                const deviceKey = await AsyncStorage.getItem('deviceKey');
                if (!userId) {
                  await clearLocalSessionAndNavigate();
                  return;
                }
                if (!deviceKey) {
                  await clearLocalSessionAndNavigate();
                  return;
                }
                const endpoint = `${url}Login/LogoutMobileUser?userid=${encodeURIComponent(userId)}&deviceKey=${encodeURIComponent(deviceKey)}`;
                const response = await fetch(endpoint, {
                  headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
                });
                if (!response.ok) {
                  const errorText = await response.text();
                  Alert.alert("Logout Warning", "Failed to log out from the server. Your local session has been cleared.");
                }
                await clearLocalSessionAndNavigate();
              } catch (error) {
                console.error('Error during logout process:', error);
                Alert.alert("Logout Error", "Failed to log out. Please check your network connection and try again.");
                await clearLocalSessionAndNavigate();
              }
            }
          }
        ]
      );
    },
    [clearLocalSessionAndNavigate]
  );

  const getHeaderOptions = (theme) => ({
    headerStyle: { backgroundColor: theme.headerBackground, borderBottomColor: theme.headerBorderColor },
    headerTintColor: theme.headerTintColor,
  });

  const LoginStack = () => (
    <Stack.Navigator screenOptions={getHeaderOptions(currentThemeColors)}>
      <Stack.Screen name="LoginPage" component={LoginPage} options={{ headerShown: false }} />
      <Stack.Screen name="Terms of Service" component={TermsofService} options={{ headerShown: true, title: 'Terms of Service' }} />
      <Stack.Screen name="Privacy Policy" component={PrivacyPolicy} options={{ headerShown: true, title: 'Privacy Policy' }} />
    </Stack.Navigator>
  );

  const renderDrawerNavigator = useCallback(
    (initialRouteName) => (
      <Drawer.Navigator
       initialRouteName={initialRouteName}
        drawerContent={(props) => (
          <CustomDrawerContent {...props} theme={currentThemeColors} handleLogout={handleGlobalLogout} />
        )}
        screenOptions={getHeaderOptions(currentThemeColors)}
      >
        <Drawer.Screen name="MainApp" component={MainApp} options={{ headerShown: false, swipeEnabled: false, unmountOnBlur: true }} />
        <Drawer.Screen name="Login" component={LoginStack} options={{ headerShown: false, swipeEnabled: false, unmountOnBlur: true }} />
        <Drawer.Screen name="Home" component={Dashboard} options={{ unmountOnBlur: true }} />
        <Drawer.Screen name="My Profile" component={Profile} options={{ unmountOnBlur: true }} />
        <Drawer.Screen name="About Us" component={AboutUs} options={{ headerShown: true, swipeEnabled: true, unmountOnBlur: true }} />
        <Drawer.Screen name="Cashback for Feedback" component={ChasCashbackforFeedback} options={{ unmountOnBlur: true }} />
        <Drawer.Screen name="Refer and Earn" component={ReferAndEarn} options={{ unmountOnBlur: true }} />
        <Drawer.Screen name="VideoPlayerScreen" component={VideoPlayerScreen} options={{ unmountOnBlur: true }} />
        <Drawer.Screen name="Refer and Earn conditiions" component={ReferAndEarnConditions} options={{ unmountOnBlur: true }} />
        <Drawer.Screen name="Referral History" component={ReferralHistory} options={{ unmountOnBlur: true }} />
        <Drawer.Screen name="My Orders" component={MyOrders} options={{ unmountOnBlur: true }} />
        <Drawer.Screen name="My Earnings" component={MyEarnings} options={{ unmountOnBlur: true }} />
        <Drawer.Screen name="App Version" component={AppVersion} options={{ unmountOnBlur: true }} />
        <Drawer.Screen name="Privacy Policy" component={PrivacyPolicy} options={{ unmountOnBlur: true }} />
        <Drawer.Screen name="Terms of Service" component={TermsofService} options={{ unmountOnBlur: true }} />
        <Drawer.Screen name="Community" component={Community} options={{ unmountOnBlur: true }} />
        <Drawer.Screen name="FAQ" component={FAQ} options={{ unmountOnBlur: true }} />
        <Drawer.Screen name="Restore Purchases" component={RestorePurchases} options={{ unmountOnBlur: true }} />
        <Drawer.Screen name="Photo Permission" component={PhotoPermission} options={{ unmountOnBlur: true }} />
        <Drawer.Screen name="My Notifications" component={MyNotifications} options={{ unmountOnBlur: true }} />
        <Drawer.Screen name="Progress Snapshots" component={ProgressSnapshots} options={{ unmountOnBlur: true }} />
        <Drawer.Screen name="My Referrals" component={MyReferrals} options={{ unmountOnBlur: true }} />
        <Drawer.Screen name="Save Activities" component={SaveActivities} options={{ unmountOnBlur: true }} />
        <Drawer.Screen name="Medals" component={Medals} options={{ unmountOnBlur: true }} />
        <Drawer.Screen name="Star Tracker" component={StarTracker} options={{ unmountOnBlur: true }} />
        <Drawer.Screen name="Trails" component={Trails} options={{ unmountOnBlur: true }} />
        <Drawer.Screen name="Next Goal" component={NextGoal} options={{ unmountOnBlur: true }} />
        <Drawer.Screen name="Cashback for Feedback Conditions" component={CashbackforFeedbackConditions} options={{ unmountOnBlur: true }} />
        <Drawer.Screen name="Rate us / Update App" component={RateStarsStore} options={{ unmountOnBlur: true }} />
        <Drawer.Screen name="Get Help" component={GetHelp} options={{ unmountOnBlur: true }} />
      </Drawer.Navigator>
    ),
    [currentThemeColors, handleGlobalLogout]
  );

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: currentThemeColors.background }}>
        <ActivityIndicator size="large" color={currentThemeColors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <NavigationContainer ref={navigationRef} theme={navigationTheme}>
        {initialRoute === 'Splash' ? (
          <SplashScreen onVideoEnd={handleVideoEnd} />
        ) : (
          renderDrawerNavigator(initialRoute)
        )}
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default App;
