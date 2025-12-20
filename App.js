import React, { useEffect, useState, memo, useCallback, useMemo } from 'react';
import { View, Image, StyleSheet, SafeAreaView, Text, useColorScheme, Alert, ActivityIndicator, BackHandler } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme, CommonActions, createNavigationContainerRef } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from './SplashScreen';
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
import PrivacyPolicywithoutLog from './src/PrivacyPolicywithoutLog';
import TermsofService from './src/TermsofService';
import TermsofServicewithoutLog from './src/TermsofServicewithoutLog';
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
import { exitApp } from './src/utils/exitApp';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();
const url = BASE_URL;
export const navigationRef = createNavigationContainerRef();
export const skipNavigationGuards = { current: false };

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

export const drawerItems = [
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

export const CustomDrawerContent = memo(({ theme, handleLogout, ...props }) => {
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
            accessibilityLabel={`drawer-item-${item.key}`}
            onPress={async () => {
              if (item.label === 'Logout') {
                handleLogout();
                return;
              }

              const guestPages = ['Login', 'LoginPage', 'Splash', 'TermsofServicewithoutLog', 'PrivacyPolicywithoutLog'];
              try {
                const token = await AsyncStorage.getItem('token');
                const isLoggedIn = !!token;
                const target = item.navigateTo === 'Home' ? 'Home' : item.navigateTo;

                if (isLoggedIn && guestPages.includes(target)) {
                  Alert.alert('Access Restricted', 'Please logout before accessing this page.');
                  return;
                }

                if (!isLoggedIn && !guestPages.includes(target)) {
                  Alert.alert('Login Required', 'Please login to access this page.', [
                    { text: 'OK', onPress: () => props.navigation.navigate('Login') },
                  ]);
                  return;
                }

                props.navigation.navigate(target, { source: item.label });
              } catch (err) {
                console.error('Navigation error:', err);
                props.navigation.navigate(item.navigateTo, { source: item.label });
              }
            }}
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
  const isLoggedInRef = React.useRef(false);
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
        const userId = await AsyncStorage.getItem('userId');
        const isid = userId ? userId : null;
        const isFirstTime = firstTime === 'true';
        const hasToken = !!token;
        isLoggedInRef.current = hasToken;

        if (!isMounted) return;

        if (!isFirstTime && !hasToken) {
          setInitialRoute('Splash');
        } else if (hasToken) {
          setInitialRoute('Home');
        } else {
          setInitialRoute('Login');
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
  const updateLoggedOutState = useCallback(() => {
    isLoggedInRef.current = false;
  }, []);

  const onNavigationReady = React.useCallback(async () => {
    const guestPages = ['Login', 'LoginPage', 'Splash', 'TermsofServicewithoutLog', 'PrivacyPolicywithoutLog'];

    if (!navigationRef.isReady()) return;

    try {
      const origNavigate = navigationRef.navigate.bind(navigationRef);
      navigationRef.navigate = async (...args) => {
        if (skipNavigationGuards.current) return origNavigate(...args);
        try {
          const token = await AsyncStorage.getItem('token');
          const isLoggedIn = !!token || isLoggedInRef.current;
          let name = null;
          if (typeof args[0] === 'string') name = args[0];
          else if (typeof args[0] === 'object' && args[0]?.name) name = args[0].name;
          if (isLoggedIn && name && guestPages.includes(name)) {
            Alert.alert('Access Restricted', 'Please logout before accessing this page.');
            return;
          }

          // If not logged in, block protected pages (not in guestPages)
          if (!isLoggedIn && name && !guestPages.includes(name)) {
            Alert.alert('Login Required', 'Please login to access this page.');
            // redirect to Login
            try { origNavigate('Login'); } catch (e) { }
            return;
          }
        } catch (e) {
          // ignore
        }
        return origNavigate(...args);
      };
    } catch (e) {
      // ignore
    }

    try {
      const origDispatch = navigationRef.dispatch.bind(navigationRef);
      navigationRef.dispatch = async (action) => {
        if (skipNavigationGuards.current) return origDispatch(action);
        try {
          const token = await AsyncStorage.getItem('token');
          const isLoggedIn = !!token || isLoggedInRef.current;

          const containsGuestRoute = (act) => {
            if (!act) return false;
            const payload = act.payload || act;
            if (payload && Array.isArray(payload.routes)) {
              return payload.routes.some(r => guestPages.includes(r.name));
            }
            if (payload && payload.name) return guestPages.includes(payload.name);
            if (act?.route && act.route.name) return guestPages.includes(act.route.name);
            return false;
          };

          const containsProtectedRoute = (act) => {
            if (!act) return false;
            const payload = act.payload || act;
            if (payload && Array.isArray(payload.routes)) {
              return payload.routes.some(r => !guestPages.includes(r.name));
            }
            if (payload && payload.name) return !guestPages.includes(payload.name);
            if (act?.route && act.route.name) return !guestPages.includes(act.route.name);
            return false;
          };

          if (isLoggedIn && containsGuestRoute(action)) {
            Alert.alert('Access Restricted', 'Please logout before accessing this page.');
            return;
          }

          if (!isLoggedIn && containsProtectedRoute(action)) {
            Alert.alert('Login Required', 'Please login to access this page.');
            try { navigationRef.navigate('Login'); } catch (e) { }
            return;
          }
        } catch (e) {
        }
        return origDispatch(action);
      };
    } catch (e) {
    }

    try {
        if (typeof navigationRef.resetRoot === 'function') {
        const origResetRoot = navigationRef.resetRoot.bind(navigationRef);
        navigationRef.resetRoot = async (state) => {
          if (skipNavigationGuards.current) return origResetRoot(state);
          try {
            const token = await AsyncStorage.getItem('token');
            const isLoggedIn = !!token || isLoggedInRef.current;
            if (state && Array.isArray(state.routes)) {
              const hasGuest = state.routes.some(r => guestPages.includes(r.name));
              if (isLoggedIn && hasGuest) {
                Alert.alert('Access Restricted', 'Please logout before accessing this page.');
                return;
              }
              const hasProtected = state && Array.isArray(state.routes) && state.routes.some(r => !guestPages.includes(r.name));
              if (!isLoggedIn && hasProtected) {
                Alert.alert('Login Required', 'Please login to access this page.');
                try { navigationRef.navigate('Login'); } catch (e) { }
                return;
              }
            }
          } catch (e) {
          }
          return origResetRoot(state);
        };
      }
    } catch (e) {
    }
  }, []);


  const handleVideoEnd = async () => {
    try {
      await AsyncStorage.setItem('first_time_opened', 'true');
      const token = await AsyncStorage.getItem('token');

      setInitialRoute('Login');
    } catch (error) {
      console.error('AsyncStorage error setting first_time_opened:', error);
      setInitialRoute('Login');
    }
  };

  const clearLocalSessionAndNavigate = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('username');
      isLoggedInRef.current = false;

      try {
        skipNavigationGuards.current = true;
        if (navigationRef.isReady()) {
          if (typeof navigationRef.resetRoot === 'function') {
            try {
              await navigationRef.resetRoot({ index: 0, routes: [{ name: 'Login' }] });
            } catch (e) {
              await navigationRef.dispatch(
                CommonActions.reset({ index: 0, routes: [{ name: 'Login' }] })
              );
            }
          } else {
            await navigationRef.dispatch(
              CommonActions.reset({ index: 0, routes: [{ name: 'Login' }] })
            );
          }
        }
      } finally {
        skipNavigationGuards.current = false;
      }
    } catch (localError) {
      console.error('Error clearing local storage:', localError);
      Alert.alert('Local Session Error', 'Failed to clear local session data. Please restart the app.');
    }
  }, []);

  useEffect(() => {
        const onBackPress = () => {
      try {
        if (!navigationRef.isReady()) return false;
        const rootState = navigationRef.getRootState && navigationRef.getRootState();
        const rootRoute = rootState && rootState.routes && rootState.routes[rootState.index] && rootState.routes[rootState.index].name;

        const current = navigationRef.getCurrentRoute && navigationRef.getCurrentRoute();

        const tabRootNames = ['HomeTab', 'CashbackTab', 'ReferEarnTab', 'ProfileTab'];

        const isOnTabRoot = (rootRoute === 'Home') && (current && tabRootNames.includes(current.name));

        if (isOnTabRoot && isLoggedInRef.current) {
          try { exitApp(); } catch (e) { BackHandler.exitApp(); }
          return true;
        }

        if (navigationRef.canGoBack()) {
          navigationRef.goBack();
          return true;
        }

        try { exitApp(); } catch (e) { BackHandler.exitApp(); }
        return true;
      } catch (e) {
        return false;
      }
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => backHandler.remove();
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
      <Stack.Screen name="TermsofServicewithoutLog" component={TermsofServicewithoutLog} options={{ headerShown: true, title: 'Terms of Service' }} />
      <Stack.Screen name="PrivacyPolicywithoutLog" component={PrivacyPolicywithoutLog} options={{ headerShown: true, title: 'Privacy Policy' }} />
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
        <Drawer.Screen
          name="Home"
          component={Dashboard}
          options={{}}
          listeners={({ navigation }) => ({
            beforeRemove: (e) => {
              try {
                if (isLoggedInRef.current && e && e.data && e.data.action && e.data.action.type) {
                  const t = e.data.action.type;
                    if (t === 'GO_BACK' || t === 'POP') {
                    e.preventDefault();
                    try { exitApp(); } catch (err2) { BackHandler.exitApp(); }
                  }
                }
              } catch (err) {
                // fallback: do nothing
              }
            },
          })}
        />
        <Drawer.Screen name="Login" component={LoginStack} options={{ headerShown: false, swipeEnabled: false }} />
        <Drawer.Screen name="My Profile" component={Profile} options={{}} />
        <Drawer.Screen name="About Us" component={AboutUs} options={{ headerShown: true, swipeEnabled: true }} />
        <Drawer.Screen name="Cashback for Feedback" component={ChasCashbackforFeedback} options={{}} />
        <Drawer.Screen name="Refer and Earn" component={ReferAndEarn} options={{}} />
        <Drawer.Screen name="VideoPlayerScreen" component={VideoPlayerScreen} options={{}} />
        <Drawer.Screen name="Refer and Earn conditiions" component={ReferAndEarnConditions} options={{}} />
        <Drawer.Screen name="Referral History" component={ReferralHistory} options={{}} />
        <Drawer.Screen name="My Orders" component={MyOrders} options={{}} />
        <Drawer.Screen name="My Earnings" component={MyEarnings} options={{}} />
        <Drawer.Screen name="App Version" component={AppVersion} options={{}} />
        <Drawer.Screen name="Privacy Policy" component={PrivacyPolicy} options={{}} />
        <Drawer.Screen name="Terms of Service" component={TermsofService} options={{}} />
        <Drawer.Screen name="TermsofServicewithoutLog" component={TermsofServicewithoutLog} options={{ title: 'Terms of Service' }} />
        <Drawer.Screen name="PrivacyPolicywithoutLog" component={PrivacyPolicywithoutLog} options={{ title: 'Privacy Policy' }} />
        <Drawer.Screen name="Community" component={Community} options={{}} />
        <Drawer.Screen name="FAQ" component={FAQ} options={{}} />
        <Drawer.Screen name="Restore Purchases" component={RestorePurchases} options={{}} />
        <Drawer.Screen name="Photo Permission" component={PhotoPermission} options={{}} />
        <Drawer.Screen name="My Notifications" component={MyNotifications} options={{}} />
        <Drawer.Screen name="Progress Snapshots" component={ProgressSnapshots} options={{}} />
        <Drawer.Screen name="My Referrals" component={MyReferrals} options={{}} />
        <Drawer.Screen name="Save Activities" component={SaveActivities} options={{}} />
        <Drawer.Screen name="Medals" component={Medals} options={{}} />
        <Drawer.Screen name="Star Tracker" component={StarTracker} options={{}} />
        <Drawer.Screen name="Trails" component={Trails} options={{}} />
        <Drawer.Screen name="Next Goal" component={NextGoal} options={{}} />
        <Drawer.Screen name="Cashback for Feedback Conditions" component={CashbackforFeedbackConditions} options={{}} />
        <Drawer.Screen name="Rate us / Update App" component={RateStarsStore} options={{}} />
        <Drawer.Screen name="Get Help" component={GetHelp} options={{}} />
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
      <NavigationContainer ref={navigationRef} theme={navigationTheme} onReady={onNavigationReady}>
        {initialRoute === 'Splash' ? (
          <SplashScreen onVideoEnd={handleVideoEnd} onSkip={() => setInitialRoute('Login')} />
        ) : (
          renderDrawerNavigator(initialRoute)
        )}
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default App;
