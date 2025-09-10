import React, { useEffect, useState, memo, useCallback, useMemo } from 'react';
import { View, Image, StyleSheet, SafeAreaView, Text, useColorScheme, Alert } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme, CommonActions } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
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


const Drawer = createDrawerNavigator();

const AppColors = {
    light: {
        background: '#F4F7FC',
        card: '#FFFFFF',
        textPrimary: '#1A232E',
        textSecondary: '#6A737D',
        textTertiary: '#8A94A6',
        primary: 'rgba(20, 52, 164, 1)',
        accent: '#60b5f6',
        border: '#E9EEF2',
        icon: '#495057',
        danger: '#E40606',
        dangerText: '#FFFFFF',
        pointsBackground: 'rgba(20, 52, 164, 0.1)',
        pointsText: 'rgba(20, 52, 164, 1)',
        levelBadgeBackground: 'rgba(255, 165, 0, 0.15)',
        levelBadgeText: '#D97706',
        avatarBackground: 'rgba(20, 52, 164, 1)',
        avatarText: '#FFFFFF',
        bottomNavBackground: '#FFFFFF',
        bottomNavActiveTint: 'rgba(20, 52, 164, 1)',
        bottomNavInactiveTint: '#ADB5BD',
        sectionTitle: '#333B49',
    },
    dark: {
        background: '#1C222B',
        card: '#2A313C',
        textPrimary: '#E8EDF2',
        textSecondary: '#A0AEC0',
        textTertiary: '#718096',
        primary: '#60b5f6',
        accent: '#60b5f6',
        border: '#3D4450',
        icon: '#CBD5E0',
        danger: '#F04F4F',
        dangerText: '#1C222B',
        pointsBackground: 'rgba(96, 181, 246, 0.2)',
        pointsText: '#60b5f6',
        levelBadgeBackground: 'rgba(251, 211, 141, 0.15)',
        levelBadgeText: '#FBD38D',
        avatarBackground: '#60b5f6',
        avatarText: '#1C222B',
        bottomNavBackground: '#232A37',
        bottomNavActiveTint: '#60b5f6',
        bottomNavInactiveTint: '#718096',
        sectionTitle: '#C1CAD4',
    }
};

const url = 'https://allrounderbaby-czh8hubjgpcxgrc7.canadacentral-01.azurewebsites.net/api/';


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
const createAppStyles = (theme) => StyleSheet.create({
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
                            item.label === 'Logout' ?
                                handleLogout() :
                                props.navigation.navigate(item.navigateTo, { source: item.label })
                        }
                        style={styles.drawerItem}
                        focused={isDrawerItemFocused(item, props)}
                        activeBackgroundColor={theme.drawerItemActiveBackground}
                        inactiveBackgroundColor={theme.drawerItemInactiveBackground}
                        labelStyle={[styles.drawerItemLabel, { color: isDrawerItemFocused(item, props) ? theme.drawerItemActiveLabelTint : theme.drawerItemInactiveLabelTint }]}
                        icon={() => (
                            <Image
                                source={item.icon}
                                style={{
                                    width: item.iconSize.width,
                                    height: item.iconSize.height,
                                    tintColor: isDrawerItemFocused(item, props) ? theme.drawerItemActiveIconTint : theme.drawerItemInactiveIconTint,
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
    const [isFirstTime, setIsFirstTime] = useState(null);
    const colorScheme = useColorScheme();
    const currentThemeColors = colorScheme === 'dark' ? DarkThemeColors : LightThemeColors;
    const navigationTheme = colorScheme === 'dark' ? AppDarkTheme : AppLightTheme;
    const styles = createAppStyles(currentThemeColors);

    useEffect(() => {
        const checkFirstTime = async () => {
            try {
                const value = await AsyncStorage.getItem('first_time_opened');
                setIsFirstTime(value === null);
            } catch (error) {
                console.error('AsyncStorage error:', error);
                setIsFirstTime(false);
            }
        };
        checkFirstTime();
    }, []);

    const handleVideoEnd = async () => {
        try {
            await AsyncStorage.setItem('first_time_opened', 'true');
            setIsFirstTime(false);
        } catch (error) {
            console.error('AsyncStorage error setting first_time_opened:', error);
        }
    };

    const clearLocalSessionAndNavigate = useCallback(async (navigation) => {
        try {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('userId');
            await AsyncStorage.removeItem('username');
            console.log('User session data cleared from AsyncStorage.');
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                })
            );
        } catch (localError) {
            console.error('Error clearing local storage:', localError);
            Alert.alert("Local Session Error", "Failed to clear local session data. Please restart the app.");
        }
    }, []);

    const handleGlobalLogout = useCallback(async (navigation) => {
        try {

            const token = await AsyncStorage.getItem('token');
            const userId = await AsyncStorage.getItem('userId');

            if (!userId) {
                console.warn('userId not found in AsyncStorage. Clearing local session anyway.');
                await clearLocalSessionAndNavigate(navigation);
                return;
            }
            const endpoint = `${url}/Login/LogoutMobileUser?userid=${userId}`;
            console.log('Error during logout process:', endpoint);
            const response = await fetch(endpoint, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server-side logout failed:', errorText);
                Alert.alert(
                    "Logout Warning",
                    "Failed to log out from the server. Your local session has been cleared. Please try logging in again if you encounter issues."
                );
            }

            await clearLocalSessionAndNavigate(navigation);

        } catch (error) {
            console.error('Error during logout process:', error);
            Alert.alert("Logout Error", "Failed to log out. Please check your network connection and try again.");
            await clearLocalSessionAndNavigate(navigation);
        }
    }, [clearLocalSessionAndNavigate]);

    const getHeaderOptions = (theme) => ({
        headerStyle: { backgroundColor: theme.headerBackground, borderBottomColor: theme.headerBorderColor },
        headerTintColor: theme.headerTintColor,
    });
    const renderDrawerNavigator = useCallback((navigation) => ( // Receive navigation as argument
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} theme={currentThemeColors} handleLogout={() => handleGlobalLogout(props.navigation)} />} // Pass handleGlobalLogout
            screenOptions={getHeaderOptions(currentThemeColors)}
        >
            <Drawer.Screen name="MainApp" component={MainApp} options={{ headerShown: false, swipeEnabled: false, unmountOnBlur: true }} />
            <Drawer.Screen name="Login" component={LoginPage} options={{ headerShown: false, swipeEnabled: false, unmountOnBlur: true }} />
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
    ), [currentThemeColors, handleGlobalLogout]);
    if (isFirstTime === null) {
        return <View style={{ flex: 1, backgroundColor: currentThemeColors.background }} />;
    }
    return (
        <SafeAreaView style={styles.safeArea}>
            <NavigationContainer theme={navigationTheme}>
                {isFirstTime ? (
                    <SplashScreen onVideoEnd={handleVideoEnd} />
                ) : (
                    renderDrawerNavigator()
                )}
            </NavigationContainer>
        </SafeAreaView>
    );
};

export default App;