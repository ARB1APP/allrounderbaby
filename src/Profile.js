import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, useColorScheme, Alert } from 'react-native';
import ScreenScroll from './components/ScreenScroll';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import { navigationRef, skipNavigationGuards, isLoggedInRef } from '../App';
import { BASE_URL } from './config/api';
let Keychain = null;
try {
    Keychain = require('react-native-keychain');
} catch (e) {
    Keychain = null;
}
const keychainAvailable = Keychain && (
    typeof Keychain.getGenericPasswordForOptions === 'function' ||
    typeof Keychain.setGenericPasswordForOptions === 'function' ||
    (typeof Keychain.getGenericPassword === 'function' && typeof Keychain.setGenericPassword === 'function')
);

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
    },
};

const url = BASE_URL;

const Profile = ({ navigation, route }) => {
    const isDarkMode = useColorScheme() === 'dark';
    const theme = isDarkMode ? AppColors.dark : AppColors.light;

    const handleLogout = async () => {
        Alert.alert('Logout', 'Are you sure you want to log out?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'OK',
                onPress: async () => {
                    try {
                        const token = await AsyncStorage.getItem('token');
                        const userId = await AsyncStorage.getItem('userId');
                        const deviceId = await AsyncStorage.getItem('deviceKey');

                        if (!userId) {
                            await clearLocalSessionAndNavigate();
                            return;
                        }
                        if (!deviceId) {
                            await clearLocalSessionAndNavigate();
                            return;
                        }

                        const controller = new AbortController();
                        const timeoutId = setTimeout(() => controller.abort(), 15000);

                        try {
                            const endpoint = `${url}Login/LogoutMobileUser?userid=${encodeURIComponent(userId)}&deviceKey=${encodeURIComponent(deviceId)}`;
                            const response = await fetch(endpoint, {
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Accept': 'application/json',
                                },
                                signal: controller.signal,
                            });

                            clearTimeout(timeoutId);

                            if (!response.ok) {
                                const errorText = await response.text();
                                console.error('Server-side logout failed:', errorText);
                                Alert.alert(
                                    'Logout Warning',
                                    'Failed to log out from the server, but your local session has been cleared.'
                                );
                            }
                        } catch (fetchError) {
                            clearTimeout(timeoutId);
                            if (fetchError.name === 'AbortError') {
                                console.error('Logout request timed out');
                            } else {
                                console.error('Logout fetch error:', fetchError);
                            }
                        }

                        await clearLocalSessionAndNavigate();
                    } catch (error) {
                        console.error('Error during logout process:', error);
                        console.error('An unexpected error occurred during logout. Clearing local session as a fallback.');
                        await clearLocalSessionAndNavigate();
                    }
                },
            },
        ]);
    };

    const clearLocalSessionAndNavigate = async () => {
        try {
            const rememberPreference = await AsyncStorage.getItem('rememberMePreference');
            const keysToRemove = [
                'token',
                'userId',
                'deviceKey',
                'sessionId',
                'Name',
                'userEmail',
                'phoneNumber',
                'completedSteps',
                'topicCompletionTimes',
                'middleLevelCompletionTime',
                'advancedLevelCompletionTime',
                'userProgress',
            ];

            if (rememberPreference !== 'true') {
                keysToRemove.push('rememberedUsername', 'rememberedPassword', 'termsAccepted', 'rememberMePreference');
            }

            await AsyncStorage.multiRemove(keysToRemove);
            try {
                if (keychainAvailable && rememberPreference !== 'true') {
                    await Keychain.resetGenericPassword({ service: 'loginCredentials' });
                }
            } catch (kcErr) {
                console.warn('Failed to reset Keychain during logout', kcErr);
            }

            try {
                skipNavigationGuards.current = true;
                try { isLoggedInRef.current = false; } catch (e) { /* ignore if not available */ }

                if (navigationRef?.isReady && navigationRef.isReady()) {
                    try {
                        await navigationRef.resetRoot({ index: 0, routes: [{ name: 'Login', params: { logout: true } }] });
                    } catch (e) {
                        navigationRef.dispatch(
                            CommonActions.reset({ index: 0, routes: [{ name: 'Login', params: { logout: true } }] })
                        );
                    }
                } else {
                    navigation.dispatch(
                        CommonActions.reset({ index: 0, routes: [{ name: 'Login', params: { logout: true } }] })
                    );
                }
            } finally {
                skipNavigationGuards.current = false;
            }
        } catch (localError) {
            console.error('Error clearing local storage:', localError);
            console.error('Failed to clear local session data. Please restart the app.');
        }
    };

    const ListItem = ({ iconSource, title, subtitle, onPress, isLast, showArrow = true, titleColor }) => {
        const isSubtitleElement = React.isValidElement(subtitle);

        return (
            <TouchableOpacity onPress={onPress} style={styles.listItemWrapper}>
                <View style={styles.listItemRow}>
                    <View style={styles.listItemMainContent}>
                        <Image source={iconSource} style={[styles.listItemIcon, { tintColor: theme.icon }]} />
                        <View style={styles.listItemTextContainer}>
                            <Text style={[styles.listItemTitle, { color: titleColor || theme.textPrimary }]}>{title}</Text>
                            {subtitle !== null && subtitle !== undefined && (
                                isSubtitleElement ? (
                                    subtitle
                                ) : (
                                    <Text style={[styles.listItemSubtitle, { color: theme.textSecondary }]}>{String(subtitle)}</Text>
                                )
                            )}
                        </View>
                    </View>
                    {showArrow && <Image source={require('../img/arrowicon.png')} style={[styles.arrowicon, { tintColor: theme.textTertiary }]} />}
                </View>
                {!isLast && <View style={[styles.separator, { backgroundColor: theme.border }]} />}
            </TouchableOpacity>
        );
    };

    React.useEffect(() => {
        const backAction = () => {
            if (navigation && typeof navigation.canGoBack === 'function' && navigation.canGoBack()) {
                navigation.goBack();
                return true;
            }
            if (route && route.params && route.params.origin) {
                navigation.navigate(route.params.origin);
                return true;
            }
            return false;
        };
        const sub = require('react-native').BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => sub.remove();
    }, [navigation, route]);
    return (


        <View style={[{ paddingLeft: 2, paddingRight: 2 }, styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <ScreenScroll contentContainerStyle={styles.scrollContentContainer}>
                    <View style={[{ paddingLeft: 15, paddingRight: 14 }]} >
                        <View style={styles.header}>
                            <Text style={[styles.headerTitle, { color: theme.textPrimary, paddingLeft: 10 }]}>My Profile</Text>
                        </View>

                        <TouchableOpacity
                            style={[styles.card, { backgroundColor: theme.card, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}
                            onPress={() => navigation.navigate('My Referrals')}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={require('../img/three-dots.png')} style={[styles.listItemIcon, { tintColor: theme.icon, marginRight: 15 }]} />
                                <Text style={[styles.listItemTitle, { color: theme.textPrimary }]}>My Referrals</Text>
                            </View>
                            <Image source={require('../img/arrowicon.png')} style={[styles.arrowicon, { tintColor: theme.textTertiary }]} />
                        </TouchableOpacity>

                        <View style={[styles.card, { backgroundColor: theme.card }]}>
                            <Text style={[styles.sectionTitle, { color: theme.sectionTitle }]}>Settings</Text>
                            <ListItem iconSource={require('../img/bell.png')} title="My Notifications" onPress={() => navigation.navigate('My Notifications')} />

                            <ListItem
                                iconSource={require('../img/earningmoney.png')}
                                title="My Earnings"
                                subtitle={
                                    <View >
                                        <Text style={{ color: theme.textSecondary }}>
                                            Refer more, Earn more !!
                                        </Text>
                                    </View>
                                }
                                onPress={() => navigation.navigate('My Earnings')}
                            />

                            <ListItem
                                iconSource={require('../img/cart.png')}
                                title="My Orders"
                                subtitle={
                                    <View>
                                        <Text>
                                            View order history
                                        </Text>
                                    </View>
                                }
                                onPress={() => navigation.navigate('My Orders')}
                            />
                        </View>

                        <View style={[styles.card, { backgroundColor: theme.card }]}>
                            <Text style={[styles.sectionTitle, { color: theme.sectionTitle }]}>Help and Support</Text>
                            <ListItem
                                iconSource={require('../img/help.png')}
                                title="Get Help"
                                subtitle={
                                    <View>
                                        <Text>
                                            Chat With Support
                                        </Text>
                                    </View>
                                }
                                onPress={() => navigation.navigate('Get Help')}
                                isLast={true}
                            />
                        </View>

                        <View style={[styles.card, { backgroundColor: theme.card }]}>
                            <ListItem
                                iconSource={require('../img/starfive.png')}
                                title="Rate us 5 stars on the store"
                                subtitle={
                                    <View>
                                        <Text>
                                            Encourage users to leave a positive review
                                        </Text>
                                    </View>
                                }
                                onPress={() => navigation.navigate('Rate us / Update App')}
                            />
                            <ListItem iconSource={require('../img/pr.png')} title="Terms of Service" onPress={() => navigation.navigate('Terms of Service')} />
                            <ListItem iconSource={require('../img/tm.png')} title="Privacy Policy" onPress={() => navigation.navigate('Privacy Policy')} />
                            <ListItem iconSource={require('../img/infoV.png')} title="App Version" onPress={() => navigation.navigate('App Version')} isLast={true} />
                        </View>

                        <TouchableOpacity
                            style={[styles.logoutButton, { backgroundColor: isDarkMode ? theme.danger : theme.danger }]}
                            onPress={handleLogout}
                        >
                            <Image source={require('../img/logoutbtn.png')} style={[styles.logoutIcon, { tintColor: isDarkMode ? AppColors.dark.textPrimary : AppColors.light.card }]} />
                            <Text style={[styles.logoutText, { color: isDarkMode ? AppColors.dark.textPrimary : AppColors.light.card }]}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </ScreenScroll>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContentContainer: {
        paddingBottom: 0,
        paddingHorizontal: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'Lexend-VariableFont_wght',
    },
    card: {
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
        paddingHorizontal: 5,
        fontFamily: 'Lexend-VariableFont_wght',
    },
    listItemWrapper: {},
    listItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 5,
    },
    listItemMainContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 10,
    },
    listItemIcon: {
        width: 24,
        height: 24,
        marginRight: 15,
        resizeMode: 'contain',
    },
    listItemTextContainer: {
        flex: 1,
    },
    listItemTitle: {
        fontSize: 15,
        fontWeight: '500',
        fontFamily: 'Lexend-VariableFont_wght',
    },
    listItemSubtitle: {
        fontSize: 12,
        marginTop: 2,
        fontFamily: 'Lexend-VariableFont_wght',
    },
    separator: {
        height: 1,
        marginLeft: 5 + 24 + 15,
        marginVertical: 4,
    },
    arrowicon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        borderRadius: 12,
        marginTop: 10,
        marginBottom: 20,
    },
    logoutIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Lexend-VariableFont_wght',
    },
});
export default Profile;
