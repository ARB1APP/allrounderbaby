import React, { useEffect, useState, memo, useCallback, useMemo } from 'react';
import { View, Image, StyleSheet, SafeAreaView, Text, useColorScheme, Alert, ActivityIndicator, BackHandler, TouchableOpacity, Dimensions, Platform, StatusBar, useWindowDimensions } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme, CommonActions, createNavigationContainerRef } from '@react-navigation/native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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
import MyNotifications from './src/MyNotifications';
import MyReferrals from './src/MyReferrals';
import AboutUs from './src/AboutUs';
import CashbackforFeedbackConditions from './src/CashbackforFeedbackConditions';
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
    drawerItem: { height: 56, justifyContent: 'center', paddingVertical: 0 },
    drawerItemLabel: { fontSize: 16, fontFamily: 'Lexend-VariableFont_wght', paddingVertical: 0, textAlignVertical: 'center' },
    footerContainer: {
      marginTop: 'auto',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderTopWidth: 1,
      borderTopColor: theme.drawerBorderColor,
      alignItems: 'center',
      backgroundColor: theme.drawerContentBackground,
    },
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
  /* { key: "feedback", label: "Feedback", navigateTo: "Get Help", icon: require('./img/feedback.png'), iconSize: { width: 26, height: 26 } }, */
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
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  return (
    <DrawerContentScrollView key={isLandscape ? 'drawer-land' : 'drawer-port'} {...props} style={styles.drawerContentScrollView} contentContainerStyle={isLandscape ? { flexGrow: 1 } : { flex: 1 }}>
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

                let origin = null;
                try {
                  if (navigationRef && typeof navigationRef.isReady === 'function' && navigationRef.isReady()) {
                    const current = navigationRef.getCurrentRoute && navigationRef.getCurrentRoute();
                    origin = current && current.name ? current.name : null;
                  }
                } catch (e) {
                  origin = null;
                }

                props.navigation.navigate(target, { source: item.label, origin });
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
                  alignSelf: 'center',
                  marginTop: 0,
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
  const [activeFooter, setActiveFooter] = useState('Home');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const prevDrawerOpenRef = React.useRef(false);

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

          if (!isLoggedIn && name && !guestPages.includes(name)) {
            Alert.alert('Login Required', 'Please login to access this page.');
            try { origNavigate('Login'); } catch (e) { }
            return;
          }
        } catch (e) {
        }
        return origNavigate(...args);
      };
    } catch (e) {
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

  const clearLocalSessionAndNavigate = useCallback(() => {
    try {
      AsyncStorage.removeItem('token');
      AsyncStorage.removeItem('userId');
      AsyncStorage.removeItem('username');
      isLoggedInRef.current = false;

      try {
        skipNavigationGuards.current = true;
        if (navigationRef.isReady()) {
          if (typeof navigationRef.resetRoot === 'function') {
            try {
              navigationRef.resetRoot({ index: 0, routes: [{ name: 'Login' }] });
            } catch (e) {
              navigationRef.dispatch(
                CommonActions.reset({ index: 0, routes: [{ name: 'Login' }] })
              );
            }
          } else {
            navigationRef.dispatch(
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
                  clearLocalSessionAndNavigate();
                  return;
                }
                if (!deviceKey) {
                  clearLocalSessionAndNavigate();
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
                clearLocalSessionAndNavigate();
              } catch (error) {
                console.error('Error during logout process:', error);
                Alert.alert("Logout Error", "Failed to log out. Please check your network connection and try again.");
                clearLocalSessionAndNavigate();
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
        <Drawer.Screen name="My Notifications" component={MyNotifications} options={{}} />
        <Drawer.Screen name="My Referrals" component={MyReferrals} options={{}} />
        <Drawer.Screen name="Cashback for Feedback Conditions" component={CashbackforFeedbackConditions} options={{}} />
        <Drawer.Screen name="Rate us / Update App" component={RateStarsStore} options={{}} />
        <Drawer.Screen name="Get Help" component={GetHelp} options={{}} />
      </Drawer.Navigator>
    ),
    [currentThemeColors, handleGlobalLogout]
  );

  const stylesGlobal = StyleSheet.create({
    footerWrap: { width: '100%', alignItems: 'center' },
    footerInner: {
      width: '100%', flexDirection: 'row',
      backgroundColor: '#fff',
      borderRadius: 0, alignItems: 'center',
      justifyContent: 'space-around', paddingHorizontal: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 4, borderTopWidth: 1, borderTopColor: '#eee'
    },
    footerItem: { alignItems: 'center', justifyContent: 'center' },
    footerIcon: { tintColor: '#888' },
    footerLabel: { color: '#666', marginTop: 6 },
  });

  const FooterBar = () => {
    const insets = useSafeAreaInsets();
    const bottomInset = insets?.bottom || (Platform.OS === 'android' ? 0 : 0);
    const { width, height } = useWindowDimensions();
    const baseWidth = Math.min(width, height); // use portrait width so sizes remain consistent across orientations
    // compute footer sizes dynamically based on portrait width (baseWidth)
    const iconSize = Math.round(Math.max(18, Math.min(28, baseWidth * 0.06)));
    const footerHeightLocal = Math.round(Math.max(56, Math.min(80, baseWidth * 0.12)));
    const footerFontSizeLocal = Math.round(Math.max(10, Math.min(14, baseWidth * 0.03)));

    const navigateTo = async (routeName) => {
      try {
        skipNavigationGuards.current = true;
        if (navigationRef.isReady()) navigationRef.navigate(routeName);
      } catch (e) {
      } finally {
        skipNavigationGuards.current = false;
      }
    };

    return (
      <View style={[stylesGlobal.footerWrap, { paddingBottom: bottomInset, backgroundColor: 'transparent' }]}>
        <View style={[stylesGlobal.footerInner, { height: footerHeightLocal }]}>
          <TouchableOpacity style={stylesGlobal.footerItem} onPress={() => navigateTo('Home')}>
            <Image source={require('./img/home.png')} style={[stylesGlobal.footerIcon, { width: iconSize, height: iconSize, tintColor: activeFooter === 'Home' ? currentThemeColors.primary : '#888' }]} />
            <Text style={[stylesGlobal.footerLabel, { fontSize: footerFontSizeLocal, color: activeFooter === 'Home' ? currentThemeColors.primary : '#666' }]}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={stylesGlobal.footerItem} onPress={() => navigateTo('Cashback for Feedback')}>
            <Image source={require('./img/feedbacktab.png')} style={[stylesGlobal.footerIcon, { width: iconSize, height: iconSize, tintColor: activeFooter === 'Cashback for Feedback' ? currentThemeColors.primary : '#888' }]} />
            <Text style={[stylesGlobal.footerLabel, { fontSize: footerFontSizeLocal, color: activeFooter === 'Cashback for Feedback' ? currentThemeColors.primary : '#666' }]}>Cashback</Text>
          </TouchableOpacity>

          <TouchableOpacity style={stylesGlobal.footerItem} onPress={() => navigateTo('Refer and Earn')}>
            <Image source={require('./img/money.png')} style={[stylesGlobal.footerIcon, { width: iconSize, height: iconSize, tintColor: activeFooter === 'Refer and Earn' ? currentThemeColors.primary : '#888' }]} />
            <Text style={[stylesGlobal.footerLabel, { fontSize: footerFontSizeLocal, color: activeFooter === 'Refer and Earn' ? currentThemeColors.primary : '#666' }]}>Refer & Earn</Text>
          </TouchableOpacity>

          <TouchableOpacity style={stylesGlobal.footerItem} onPress={() => navigateTo('My Profile')}>
            <Image source={require('./img/proflie.png')} style={[stylesGlobal.footerIcon, { width: iconSize, height: iconSize, tintColor: activeFooter === 'My Profile' ? currentThemeColors.primary : '#888' }]} />
            <Text style={[stylesGlobal.footerLabel, { fontSize: footerFontSizeLocal, color: activeFooter === 'My Profile' ? currentThemeColors.primary : '#666' }]}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: currentThemeColors.background }}>
        <ActivityIndicator size="large" color={currentThemeColors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Global StatusBar for white icons */}
      <StatusBar barStyle="light-content" backgroundColor="#1434A4" />
      <SafeAreaProvider>
        <View style={{ flex: 1 }}>
          <NavigationContainer
            ref={navigationRef}
            theme={navigationTheme}
            onReady={onNavigationReady}
            onStateChange={() => {
              try {
                if (!navigationRef.isReady()) return;
                const rootState = typeof navigationRef.getRootState === 'function' ? navigationRef.getRootState() : null;

                if (rootState && rootState.routes && typeof rootState.index === 'number') {
                  const top = rootState.routes[rootState.index];
                  if (top && top.name) {
                    setActiveFooter(top.name);
                  }
                } else {
                  const r = navigationRef.getCurrentRoute();
                  if (r && r.name) setActiveFooter(r.name);
                }

                const detectDrawerOpen = (state) => {
                  if (!state) return false;
                  try {
                    if (Array.isArray(state.history) && state.history.length) {
                      const drawerEntry = state.history.slice().reverse().find(h => h && h.type === 'drawer');
                      if (drawerEntry) {
                        if (drawerEntry.status === 'open') return true;
                        if (typeof drawerEntry.status === 'undefined') return true;
                      }
                    }

                    if (state.isDrawerOpen) return true;
                    const idx = typeof state.index === 'number' ? state.index : 0;
                    const route = state.routes && state.routes[idx];
                    if (route && route.state) return detectDrawerOpen(route.state);
                  } catch (e) {
                  }
                  return false;
                };

                const drawerOpen = detectDrawerOpen(rootState);
                if (prevDrawerOpenRef.current !== !!drawerOpen) {
                  prevDrawerOpenRef.current = !!drawerOpen;
                }
                setIsDrawerOpen(!!drawerOpen);

              } catch (e) {
              }
            }}
          >
            {initialRoute === 'Splash' ? (
              <SplashScreen onVideoEnd={handleVideoEnd} onSkip={() => setInitialRoute('Login')} />
            ) : (
              renderDrawerNavigator(initialRoute)
            )}
          </NavigationContainer>
        </View>
        {(() => {
          const guestFooterPages = ['Login', 'LoginPage', 'Splash', 'VideoPlayerScreen', 'TermsofServicewithoutLog', 'PrivacyPolicywithoutLog'];
          try {
            if (initialRoute === 'Splash') return null;
            if (navigationRef && typeof navigationRef.isReady === 'function' && navigationRef.isReady()) {
              const rootState = navigationRef.getRootState && navigationRef.getRootState();
              if (rootState) {
                const activeNames = [];
                let state = rootState;
                let hideFooterParam = false;
                while (state) {
                  const idx = typeof state.index === 'number' ? state.index : 0;
                  const route = state.routes && state.routes[idx];
                  if (!route) break;
                  activeNames.push(route.name);
                  if (route.params && route.params.hideFooter) hideFooterParam = true;
                  state = route.state;
                }
                const isGuest = activeNames.some(n => guestFooterPages.includes(n));
                if (isGuest || hideFooterParam) return null;
                if (isDrawerOpen) return null;
              }
            }
          } catch (e) {
          }
          return !guestFooterPages.includes(activeFooter) ? <FooterBar /> : null;
        })()}
      </SafeAreaProvider>
    </SafeAreaView>
  );
};

export default App;
