import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect, useRef } from 'react';
import { 
    View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Animated, ScrollView, 
    StatusBar, Platform, KeyboardAvoidingView, useColorScheme, Alert, ActivityIndicator, Dimensions, BackHandler, ToastAndroid
} from 'react-native';
import { exitApp } from './utils/exitApp';
import CheckBox from 'react-native-check-box';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import NetInfo from '@react-native-community/netinfo';
import { useIsFocused, CommonActions } from '@react-navigation/native';
import { BASE_URL } from './config/api';

const NEW_LAUNCH_IMAGE = require('../img/newlaunchscreen.png');

const _keychainModuleName = 'react-native-keychain';
let Keychain = null;
try { Keychain = require(_keychainModuleName); } catch (e) { Keychain = null; }

const keychainAvailable = Keychain && (
    typeof Keychain.getGenericPasswordForOptions === 'function' ||
    typeof Keychain.setGenericPasswordForOptions === 'function' ||
    (typeof Keychain.getGenericPassword === 'function' && typeof Keychain.setGenericPassword === 'function')
);

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 600;
const contentMaxWidth = isTablet ? 500 : SCREEN_WIDTH * 0.9;

const LoginPage = ({ navigation }) => {
    const isFocused = useIsFocused();
    const isDarkMode = useColorScheme() === 'dark';
    const lastBackPressed = useRef(0);
    const loginInProgressRef = useRef(false);

    const [showLoginForm, setShowLoginForm] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(true);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoadingCredentials, setIsLoadingCredentials] = useState(true);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    // Animation values from both sections
    const welcomeOpacity = useRef(new Animated.Value(1)).current;
    const loginOpacity = useRef(new Animated.Value(0)).current;
    const imageOpacity = useRef(new Animated.Value(0)).current;
    
    // New design animation stubs (to prevent crashes)
    const emailTextPosition = useRef(new Animated.Value(0)).current;
    const usernamePosition = useRef(new Animated.Value(0)).current;
    const passwordPosition = useRef(new Animated.Value(0)).current;
    const checkboxPosition = useRef(new Animated.Value(0)).current;
    const rememberMePosition = useRef(new Animated.Value(0)).current;

    const backgroundStyle = { backgroundColor: isDarkMode ? '#2a3144' : Colors.white };

    useEffect(() => {
        const loadCredentials = async () => {
            try {
                const rememberPref = await AsyncStorage.getItem('rememberMePreference');
                if (rememberPref === 'true') {
                    let creds = null;
                    if (keychainAvailable) creds = await Keychain.getGenericPassword({ service: 'loginCredentials' });
                    if (creds) {
                        setUsername(creds.username);
                        setPassword(creds.password);
                    }
                    setRememberMe(true);
                }
            } catch (e) { console.error(e); }
            finally { setIsLoadingCredentials(false); }
        };
        loadCredentials();
    }, []);

    useEffect(() => {
        const onBackPress = async () => {
            if (!isFocused) return false;
            if (showLoginForm) {
                setShowLoginForm(false);
                return true;
            }
            const now = Date.now();
            if (lastBackPressed.current && now - lastBackPressed.current < 2000) {
                exitApp();
                return true;
            }
            lastBackPressed.current = now;
            if (Platform.OS === 'android') ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
            return true;
        };
        const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
        return () => sub.remove();
    }, [isFocused, showLoginForm]);

    const handleStartPress = () => {
        setShowLoginForm(true);
        Animated.parallel([
            Animated.timing(welcomeOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
            Animated.timing(loginOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.timing(imageOpacity, { toValue: 1, duration: 800, useNativeDriver: true })
        ]).start();
    };

    useEffect(() => {
        if (showLoginForm) {
            Animated.parallel([
                Animated.timing(imageOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
                Animated.timing(loginOpacity, { toValue: 1, duration: 500, useNativeDriver: true })
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(imageOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
                Animated.timing(loginOpacity, { toValue: 0, duration: 300, useNativeDriver: true })
            ]).start();
        }
    }, [showLoginForm]);

    // Ensure a persistent device key is available
    const getDeviceKey = async () => {
        try {
            let devicekey = await AsyncStorage.getItem('devicekey');
            if (!devicekey) {
                devicekey = Date.now().toString(36) + Math.random().toString(36).substring(2);
                await AsyncStorage.setItem('devicekey', devicekey);
                console.log('Generated new devicekey:', devicekey);
            } else {
                console.log('Using existing devicekey:', devicekey);
            }
            return devicekey;
        } catch (e) {
            console.error('getDeviceKey error', e);
            return Date.now().toString(36) + Math.random().toString(36).substring(2);
        }
    };

    const handleLogin = async () => {
        if (loginInProgressRef.current) return;
        loginInProgressRef.current = true;
        setIsLoggingIn(true);
        setUsernameError('');
        setPasswordError('');

        try {
            const netInfo = await NetInfo.fetch();
            if (!netInfo.isInternetReachable) {
                Alert.alert("No Connection", "Please check your internet.");
                return;
            }

            const trimmedU = username?.trim();
            const trimmedP = password?.trim();

            if (!trimmedU) { setUsernameError('❗Please enter username.'); return; }
            if (!trimmedP) { setPasswordError('❗Please enter password.'); return; }
            if (!termsAccepted) { Alert.alert("Wait!", "Please accept terms."); return; }

            let devicekey = await getDeviceKey();
            const API_URL = `${BASE_URL}Login/LoginMobileUser?username=${encodeURIComponent(trimmedU)}&password=${encodeURIComponent(trimmedP)}&deviceId=${encodeURIComponent(devicekey)}`;

            const response = await fetch(API_URL);
            const data = await response.json();

            if (data?.code === 200) {
                const { firstName, lastName, emailAddress, phoneNumber, deviceKey: serverDeviceKey } = data.data || {};
                const finalDeviceKey = serverDeviceKey || devicekey;

                const sessionId = Math.random().toString(36).substring(2, 15);

                const items = [
                    ['token', data.data.token],
                    ['userId', data.data.userID.toString()],
                    ['deviceKey', finalDeviceKey],
                    ['sessionId', sessionId]
                ];

                if (firstName && lastName) items.push(['Name', `${firstName} ${lastName}`]);
                if (emailAddress) items.push(['userEmail', emailAddress]);
                if (phoneNumber) items.push(['phoneNumber', phoneNumber]);

                await AsyncStorage.multiSet(items);

                console.log('Session created:', sessionId);
                console.log('Login API call completed successfully');

                if (rememberMe) {
                    if (keychainAvailable) await Keychain.setGenericPassword(trimmedU, trimmedP, { service: 'loginCredentials' });
                    await AsyncStorage.setItem('rememberMePreference', 'true');
                }

                navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Home' }] }));
            } else {
                setPasswordError(data.message || '❗Invalid credentials.');
            }
        } catch (e) {
            Alert.alert("Error", "Login failed.");
        } finally {
            loginInProgressRef.current = false;
            setIsLoggingIn(false);
        }
    };

    if (isLoadingCredentials) {
        return (
            <View style={[styles.outermostContainer, backgroundStyle, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#1434A4" />
            </View>
        );
    }

    return (
        <View style={[styles.outermostContainer, backgroundStyle]}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={backgroundStyle.backgroundColor} />
            
            {!showLoginForm ? (
                /* SECTION 1: AS IT IS */
                <Animated.View style={[styles.container, { opacity: welcomeOpacity }]}>
                    <Image style={styles.welcomeImage} source={require('../img/babyone.jpg')} />
                    <View style={styles.fullDiv}>
                        <Text style={[styles.startAppText, { color: isDarkMode ? Colors.white : Colors.black }]}>
                            Start Early, <Text style={styles.highlightText}>Shine Always!</Text>
                        </Text>
                        <Text style={[styles.excitedLink, { color: isDarkMode ? Colors.white : Colors.black }]}>
                            Excited to begin?
                        </Text>
                        <TouchableOpacity style={styles.customButtonInnerStart} onPress={handleStartPress}>
                            <Text style={styles.buttonText}>Let's Get Started</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            ) : (
                /* SECTION 2: NEW DESIGN REPLACED */
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <ScrollView style={backgroundStyle} contentContainerStyle={styles.loginContainer} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                        <Animated.Image style={[styles.image, { opacity: imageOpacity }]} source={NEW_LAUNCH_IMAGE} resizeMode="contain" />
                         <Animated.Text style={[styles.loginInstructionText, { transform: [{ translateX: emailTextPosition }], color: isDarkMode ? Colors.white : Colors.black }]}>
                            Please enter login details below
                        </Animated.Text>

                        <Animated.Text style={[styles.legend, usernameError ? styles.errorLegend : null, { transform: [{ translateX: usernamePosition }], color: isDarkMode ? Colors.white : Colors.black }]}>
                            Login ID
                        </Animated.Text>
                        <Animated.View style={[styles.fieldset, usernameError ? styles.errorFieldset : null, { transform: [{ translateX: usernamePosition }] }]}>
                            <TextInput
                                style={[styles.input, usernameError ? styles.errorTextInput : null, { color: isDarkMode ? Colors.white : Colors.black }]}
                                placeholder="Enter your username"
                                placeholderTextColor="#a6a6a6"
                                value={username}
                                onChangeText={(t) => { setUsername(t); setUsernameError(''); }}
                                autoCapitalize="none"
                            />
                        </Animated.View>
                        {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}

                        <Animated.Text style={[styles.legend, passwordError ? styles.errorLegend : null, { transform: [{ translateX: passwordPosition }], color: isDarkMode ? Colors.white : Colors.black }]}>
                            Password
                        </Animated.Text>
                        <Animated.View style={[styles.fieldset, passwordError ? styles.errorFieldset : null, { transform: [{ translateX: passwordPosition }] }]}>
                            <TextInput
                                style={[styles.input, passwordError ? styles.errorTextInput : null, { color: isDarkMode ? Colors.white : Colors.black }]}
                                secureTextEntry
                                placeholder="Enter your password"
                                placeholderTextColor="#a6a6a6"
                                value={password}
                                onChangeText={(t) => { setPassword(t); setPasswordError(''); }}
                            />
                        </Animated.View>
                        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

                        <View style={styles.checkboxesContainer}>
                            <Animated.View style={[styles.checkboxContainer, { transform: [{ translateX: checkboxPosition }] }]}>
                                    <CheckBox isChecked={termsAccepted} onClick={() => setTermsAccepted(!termsAccepted)} checkBoxColor="#1434A4" />
                                    <View style={styles.checkboxTextContainer}>
                                        <Text style={[styles.checkboxLabel, { color: isDarkMode ? Colors.white : Colors.black }]}>By logging in, you agree to company’s </Text>

                                        <TouchableOpacity
                                            onPress={() => navigation.navigate('TermsofServicewithoutLog')}
                                            hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
                                            activeOpacity={0.7}
                                            style={styles.linkTouchable}
                                        >
                                            <Text style={styles.linkUnderline}>Terms and Conditions</Text>
                                        </TouchableOpacity>

                                        <Text style={[styles.checkboxLabel, { color: isDarkMode ? Colors.white : Colors.black }]}> and </Text>

                                        <TouchableOpacity
                                            onPress={() => navigation.navigate('PrivacyPolicywithoutLog')}
                                            hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
                                            activeOpacity={0.7}
                                            style={styles.linkTouchable}
                                        >
                                            <Text style={styles.linkUnderline}>Privacy Policy</Text>
                                        </TouchableOpacity>
                                    </View>
                                </Animated.View>

                            <Animated.View style={[styles.checkboxContainerSecond, { transform: [{ translateX: rememberMePosition }] }]}>
                                <CheckBox isChecked={rememberMe} onClick={() => setRememberMe(!rememberMe)} checkBoxColor="#1434A4" />
                                <Text style={[styles.checkboxLabel, { color: isDarkMode ? Colors.white : Colors.black }]}>Remember me</Text>
                            </Animated.View>
                        </View>

                        <Animated.View style={styles.shakeContainer}>
                            <TouchableOpacity style={[styles.customButton, isLoggingIn && styles.buttonDisabled]} onPress={handleLogin} disabled={isLoggingIn}>
                                {isLoggingIn ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Login</Text>}
                            </TouchableOpacity>
                        </Animated.View>

                        <Text style={[styles.otpLink, { color: isDarkMode ? '#2754f7ff' : '#1434A4' }]}>Login through OTP</Text>
                    </ScrollView>
                </KeyboardAvoidingView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    // GENERAL
    outermostContainer: { flex: 1 },
    loadingContainer: { justifyContent: 'center', alignItems: 'center' },
    
    // SECTION 1 STYLES (AS IT IS)
    container: { flex: 1, justifyContent: 'space-between', alignItems: 'center' },
    welcomeImage: { height: isTablet ? '55%' : '60%', width: '100%', borderBottomRightRadius: isTablet ? 200 : 150 },
    fullDiv: { width: '100%', alignItems: 'center', paddingBottom: 40 },
    startAppText: { fontSize: isTablet ? 28 : 24, fontStyle: 'italic', fontWeight: 'bold', textAlign: 'center', paddingHorizontal: 20 },
    highlightText: { color: '#1434A4' },
    excitedLink: { marginTop: 10, fontSize: 16, marginBottom: 20 },
    customButtonInnerStart: { backgroundColor: '#1434A4', width: contentMaxWidth, height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 5, elevation: 5 },

    // SECTION 2 STYLES (NEW DESIGN)
    loginContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 30 },
    image: { height: isTablet ? 160 : 130, width: isTablet ? contentMaxWidth : '90%', marginTop: 10, marginBottom: 20 },
    loginInstructionText: { marginTop: 15, marginBottom: 15, fontSize: isTablet ? 18 : 16 },
    fieldset: { width: isTablet ? contentMaxWidth : '90%', maxWidth: 500, alignSelf: 'center', borderColor: '#ced4da', borderWidth: 1, paddingHorizontal: 10, marginTop: 5, borderRadius: 5, backgroundColor: '#fff', elevation: 3 },
    legend: { width: isTablet ? contentMaxWidth : '90%', maxWidth: 500, alignSelf: 'center', fontSize: isTablet ? 16 : 14, marginBottom: 2 },
    input: { height: isTablet ? 52 : 45, paddingHorizontal: 10, fontSize: isTablet ? 16 : 14 },
    customButton: { marginTop: 25, width: isTablet ? contentMaxWidth : '90%', maxWidth: 500, height: isTablet ? 56 : 50, borderRadius: 5, backgroundColor: '#1434A4', justifyContent: 'center', alignItems: 'center', elevation: 5 },
    buttonDisabled: { backgroundColor: '#a9a9a9' },
    buttonText: { color: '#FFFFFF', fontSize: isTablet ? 18 : 16, fontWeight: 'bold' },
    checkboxesContainer: { width: isTablet ? contentMaxWidth : '90%', maxWidth: 500, alignSelf: 'center', marginTop: 25 },
    checkboxContainer: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 15 },
    checkboxContainerSecond: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    checkboxLabel: { fontSize: 14, flexShrink: 1, marginRight: 4 },
    checkboxTextContainer: { marginLeft: 10, flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-start' },
    linkTouchable: { paddingHorizontal: 4 },
    linkUnderline: { textDecorationLine: 'underline', fontWeight: 'bold', color: '#1434A4' },
    otpLink: { marginTop: 20, fontSize: 16, textDecorationLine: 'underline' },
    shakeContainer: { width: '100%', alignItems: 'center' },
    errorFieldset: { borderColor: '#DC143C', borderWidth: 1.5 },
    errorLegend: { color: '#DC143C', fontWeight: 'bold' },
    errorTextInput: { color: '#DC143C' },
    errorText: { color: '#DC143C', fontWeight: 'bold', marginTop: 5, fontSize: 14, width: '90%', alignSelf: 'center' },
});

export default LoginPage;