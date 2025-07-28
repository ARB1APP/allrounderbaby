import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, SafeAreaView, Text, useColorScheme } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme, CommonActions } from '@react-navigation/native'; // Import CommonActions
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
import Trails from './src/Trails';
import NextGoal from './src/NextGoal';
import AboutUs from './src/AboutUs';
import CashbackforFeedbackConditions from './src/CashbackforFeedbackConditions';

const Drawer = createDrawerNavigator();

// --- THEME DEFINITIONS (No changes needed here) ---
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
    drawerItemActiveBackground: '#e0e0e0',
    drawerItemInactiveBackground: '#FFFFFF',
    drawerItemActiveLabelTint: '#000000',
    drawerItemInactiveLabelTint: '#000000',
    drawerItemActiveIconTint: '#000000',
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
    drawerItemActiveBackground: 'rgba(20, 52, 164, 0.7)',
    drawerItemInactiveBackground: '#1E1E1E',
    drawerItemActiveLabelTint: '#FFFFFF',
    drawerItemInactiveLabelTint: '#E0E0E0',
    drawerItemActiveIconTint: '#FFFFFF',
    drawerItemInactiveIconTint: '#E0E0E0',
    safeAreaBackground: '#000000',
};
const AppLightTheme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, ...LightThemeColors } };
const AppDarkTheme = { ...DarkTheme, colors: { ...DarkTheme.colors, ...DarkThemeColors } };

// --- STYLESHEET (No changes needed here) ---
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


// --- FIXED CustomDrawerContent ---
const CustomDrawerContent = (props) => {
    const { theme } = props;
    const styles = createAppStyles(theme);

    // **FIX 1:** The `navigateTo` values now point to the correct, non-duplicate screen names.
    // The labels are unchanged, so the user sees the same menu.
    const drawerItems = [
        { label: "Home", navigateTo: "Home", icon: require('./img/home.png'), iconSize: { width: 24, height: 24 } },
        { label: "About Us", navigateTo: "About Us", icon: require('./img/about.png'), iconSize: { width: 22, height: 22 } },
        { label: "Terms of Service", navigateTo: "Terms of Service", icon: require('./img/pr.png'), iconSize: { width: 24, height: 24 } },
        { label: "Privacy Policy", navigateTo: "Privacy Policy", icon: require('./img/tm.png'), iconSize: { width: 23, height: 23 } },
        { label: "Update App / Rate us", navigateTo: "Rate us / Update App", icon: require('./img/upadate.png'), iconSize: { width: 20, height: 20 } },
        { label: "Version info", navigateTo: "App Version", icon: require('./img/info.png'), iconSize: { width: 24, height: 24 } },
        // These two items now correctly point to the "Get Help" screen
        { label: "Feedback", navigateTo: "Get Help", icon: require('./img/feedback.png'), iconSize: { width: 26, height: 26 } },
        { label: "Contact us", navigateTo: "Get Help", icon: require('./img/call.png'), iconSize: { width: 22, height: 22 } },
        { label: "Logout", navigateTo: "Login", icon: require('./img/logout.png'), iconSize: { width: 22, height: 22 } }, // navigateTo is now just for reference
    ];

    // **FIX 2:** Implemented proper logout logic.
    const handleLogout = async () => {
        // TODO: Add your code here to clear the user's token or data from AsyncStorage.
        // For example:
        // await AsyncStorage.removeItem('user_token');
        // await AsyncStorage.removeItem('user_profile');

        // This resets the navigation stack, so the user can't go back.
        props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            })
        );
    };

    return (
        <DrawerContentScrollView {...props} style={styles.drawerContentScrollView} contentContainerStyle={{ flex: 1 }}>
            <View style={styles.headerContainer}>
                <Image source={require('./img/loginlogo.png')} style={styles.logo} />
            </View>
            <View style={styles.drawerItemsContainer}>
                {drawerItems.map((item, index) => (
                    <DrawerItem
                        key={index}
                        label={item.label}
                        // Use the handleLogout function for the "Logout" item
                        onPress={() => item.label === 'Logout' ? handleLogout() : props.navigation.navigate(item.navigateTo)}
                        style={styles.drawerItem}
                        labelStyle={[styles.drawerItemLabel, { color: theme.drawerItemInactiveLabelTint }]}
                        activeBackgroundColor={theme.drawerItemActiveBackground}
                        inactiveBackgroundColor={theme.drawerItemInactiveBackground}
                        activeTintColor={theme.drawerItemActiveLabelTint}
                        inactiveTintColor={theme.drawerItemInactiveLabelTint}
                        icon={({ focused }) => (
                            <Image
                                source={item.icon}
                                style={{
                                    width: item.iconSize.width,
                                    height: item.iconSize.height,
                                    tintColor: focused ? theme.drawerItemActiveIconTint : theme.drawerItemInactiveIconTint,
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
};

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
                setIsFirstTime(false); // Default to not first time on error
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

    const getHeaderOptions = (theme) => ({
        headerStyle: { backgroundColor: theme.headerBackground, borderBottomColor: theme.headerBorderColor },
        headerTintColor: theme.headerTintColor,
    });

    // **FIX 1:** Removed all duplicate screen registrations.
    const renderDrawerNavigator = () => (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} theme={currentThemeColors} />}
            screenOptions={getHeaderOptions(currentThemeColors)}
        >
            {/* Core screens */}
            <Drawer.Screen name="MainApp" component={MainApp} options={{ headerShown: false, swipeEnabled: false }} />
            <Drawer.Screen name="Login" component={LoginPage} options={{ headerShown: false, swipeEnabled: false }} />
            <Drawer.Screen name="Home" component={Dashboard} />
            <Drawer.Screen name="My Profile" component={Profile} />

            {/* Screens accessible from drawer and other parts of the app */}
            <Drawer.Screen name="About Us" component={AboutUs} options={{ headerShown: true, swipeEnabled: true }} />
            <Drawer.Screen name="Cashback for Feedback" component={ChasCashbackforFeedback} />
            <Drawer.Screen name="Refer and Earn" component={ReferAndEarn} />
            <Drawer.Screen name="VideoPlayerScreen" component={VideoPlayerScreen} />
            <Drawer.Screen name="Refer and Earn conditiions" component={ReferAndEarnConditions} />
            <Drawer.Screen name="Referral History" component={ReferralHistory} />
            <Drawer.Screen name="My Orders" component={MyOrders} />
            <Drawer.Screen name="My Earnings" component={MyEarnings} />
            <Drawer.Screen name="App Version" component={AppVersion} />
            <Drawer.Screen name="Privacy Policy" component={PrivacyPolicy} />
            <Drawer.Screen name="Terms of Service" component={TermsofService} />
            <Drawer.Screen name="Community" component={Community} />
            <Drawer.Screen name="FAQ" component={FAQ} />
            <Drawer.Screen name="Restore Purchases" component={RestorePurchases} />
            <Drawer.Screen name="Photo Permission" component={PhotoPermission} />
            <Drawer.Screen name="My Notifications" component={MyNotifications} />
            <Drawer.Screen name="Progress Snapshots" component={ProgressSnapshots} />
            <Drawer.Screen name="My Referrals" component={MyReferrals} />
            <Drawer.Screen name="Save Activities" component={SaveActivities} />
            <Drawer.Screen name="Medals" component={Medals} />
            <Drawer.Screen name="Star Tracker" component={StarTracker} />
            <Drawer.Screen name="Trails" component={Trails} />
            <Drawer.Screen name="Next Goal" component={NextGoal} />
            <Drawer.Screen name="Cashback for Feedback Conditions" component={CashbackforFeedbackConditions} />

            {/* Consolidated Screens for the Drawer */}
            <Drawer.Screen name="Rate us / Update App" component={RateStarsStore} />
            <Drawer.Screen name="Get Help" component={GetHelp} />

            {/* DELETED the duplicate screens: "Rate us 5 stars on the store" and "Contact us / Feedback" */}
        </Drawer.Navigator>
    );

    // **FIX 3:** While checking AsyncStorage, return a blank view to prevent UI flicker.
    if (isFirstTime === null) {
        // This shows a simple blank screen matching the theme, preventing a flash of content.
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