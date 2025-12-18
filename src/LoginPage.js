import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Animated, ScrollView, StatusBar, Platform, KeyboardAvoidingView, useColorScheme, Alert, ActivityIndicator, Dimensions, } from 'react-native';
import CheckBox from 'react-native-check-box';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import NetInfo from '@react-native-community/netinfo';
import { useRoute, useFocusEffect, CommonActions } from '@react-navigation/native';
import { BASE_URL } from './config/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 600;
const contentMaxWidth = isTablet ? 500 : SCREEN_WIDTH * 0.9;

const LoginPage = ({ navigation }) => {
    const isDarkMode = useColorScheme() === 'dark';
    const backgroundStyle = {
        backgroundColor: isDarkMode ? '#2a3144' : Colors.white,
    };

    const url = BASE_URL;
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(true);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoadingCredentials, setIsLoadingCredentials] = useState(true);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const emailTextPosition = useRef(new Animated.Value(-300)).current;
    const usernamePosition = useRef(new Animated.Value(300)).current;
    const passwordPosition = useRef(new Animated.Value(-300)).current;
    const checkboxPosition = useRef(new Animated.Value(300)).current;
    const rememberMePosition = useRef(new Animated.Value(-300)).current;
    const imageOpacity = useRef(new Animated.Value(0)).current;

    const route = useRoute();

    const handleUsernameChange = (text) => {
        setUsername(text);
        setUsernameError('');
    };
    const handlePasswordChange = (text) => {
        setPassword(text);
        setPasswordError('');
    };
    const handleTermsChange = () => setTermsAccepted((prev) => !prev);
    const handleRememberMeChange = () => setRememberMe((prev) => !prev);

    const handlePress = async () => {
        const getDevicekey = async () => {
            let devicekey = await AsyncStorage.getItem('devicekey');
            if (!devicekey) {
                devicekey = Date.now().toString(36) + Math.random().toString(36).substring(2);
                await AsyncStorage.setItem('devicekey', devicekey);
                console.log('Generated new devicekey:', devicekey);
            } else {
                console.log('Using existing devicekey:', devicekey);
            }
            return devicekey;
           
        };

        setIsLoggingIn(true);
        try {
            setUsernameError('');
            setPasswordError('');

            const netInfoState = await NetInfo.fetch();
            if (!netInfoState.isInternetReachable) {
                Alert.alert(
                    "No Internet Connection",
                    "Please check your internet connection and try again."
                );
                setIsLoggingIn(false);
                return;
            }

            const trimmedUsername = username?.trim();
            const trimmedPassword = password?.trim();
            
            if (!trimmedUsername) {
                setUsernameError('❗Please enter username.');
                setIsLoggingIn(false);
                return;
            }
            if (!trimmedPassword) {
                setPasswordError('❗Please enter password.');
                setIsLoggingIn(false);
                return;
            }
            if (!termsAccepted) {
                Alert.alert("Message !", "Please accept the Terms and Conditions and Privacy Policy.");
                setIsLoggingIn(false);
                return;
            }

            const devicekey = await getDevicekey();
            const API_URL = `${url}Login/LoginMobileUser?username=${encodeURIComponent(trimmedUsername)}&password=${encodeURIComponent(trimmedPassword)}&deviceId=${encodeURIComponent(devicekey)}`;
            
          //  console.log('Calling login API for user:', trimmedUsername);
            //console.log('Device ID:', devicekey);
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000);
            
            let response;
            try {
                response = await fetch(API_URL, { signal: controller.signal });
                clearTimeout(timeoutId);
            } catch (fetchError) {
                clearTimeout(timeoutId);
                if (fetchError.name === 'AbortError') {
                    Alert.alert('Request Timeout', 'The login request took too long. Please try again.');
                    setIsLoggingIn(false);
                    return;
                }
                throw fetchError;
            }
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                setPasswordError(errorData.message || '❗Invalid username or password.');
                setIsLoggingIn(false);
                return;
            }
            
            const data = await response.json();

            if (data?.data && data.code === 200) {
                console.log('Login successful for user:', trimmedUsername);
                console.log('Device ID:', data.data.deviceKey);
                console.log('User ID received:', data.data.userID);
                console.log('Token received:', data.data.token ? 'Yes' : 'No');
                console.log('Session ID will be generated');
                
                await AsyncStorage.setItem('deviceKey', data.data.deviceKey || devicekey);
                await AsyncStorage.setItem('token', data.data.token);
                await AsyncStorage.setItem('userId', data.data.userID.toString());
                const sessionId = Math.random().toString(36).substring(2, 15);
                await AsyncStorage.setItem('sessionId', sessionId);
                console.log('Session created:', sessionId);
                console.log('Login API call completed successfully');
                const { firstName, lastName, emailAddress, phoneNumber, deviceKey } = data.data || {};
                if (firstName && lastName) {
                    await AsyncStorage.setItem('Name', `${firstName} ${lastName}`);
                }
                if (emailAddress) await AsyncStorage.setItem('userEmail', emailAddress);
                if (phoneNumber) await AsyncStorage.setItem('phoneNumber', phoneNumber);
                if (deviceKey) await AsyncStorage.setItem('deviceKey', deviceKey);
                
                if (rememberMe) {
                    console.log('Remember Me: Saving credentials');
                    await AsyncStorage.setItem('rememberedUsername', trimmedUsername);
                    await AsyncStorage.setItem('rememberedPassword', trimmedPassword);
                    await AsyncStorage.setItem('termsAccepted', 'true');
                    await AsyncStorage.setItem('rememberMePreference', 'true');
                } else {
                    console.log('Remember Me: Clearing saved credentials');
                    await AsyncStorage.removeItem('rememberedUsername');
                    await AsyncStorage.removeItem('rememberedPassword');
                    await AsyncStorage.removeItem('termsAccepted');
                    await AsyncStorage.removeItem('rememberMePreference');
                }

                if (navigation) {
                    // navigation.dispatch(
                    //     CommonActions.reset({
                    //         index: 0,
                    //         routes: [{ name: 'Home' }],
                    //     })
                    // );
                } else {
                    console.warn("navigation prop is not available!");
                }
            } else {
                setPasswordError(data.message || '❗Invalid username or password.');
            }
        } catch (error) {
            console.error("Login Error:", error);
            Alert.alert("Login Failed", "An unexpected error occurred. Please try again later.");
        } finally {
            setIsLoggingIn(false);
        }
    };

    useEffect(() => {
        if (!isLoadingCredentials) {
            Animated.timing(imageOpacity, {
                toValue: 1,
                duration: 800,
                delay: 200,
                useNativeDriver: true,
            }).start();

            Animated.parallel([
                Animated.timing(emailTextPosition, { toValue: 0, duration: 600, useNativeDriver: true }),
                Animated.timing(usernamePosition, { toValue: 0, duration: 600, delay: 100, useNativeDriver: true }),
                Animated.timing(passwordPosition, { toValue: 0, duration: 600, delay: 200, useNativeDriver: true }),
                Animated.timing(checkboxPosition, { toValue: 0, duration: 600, delay: 300, useNativeDriver: true }),
                Animated.timing(rememberMePosition, { toValue: 0, duration: 600, delay: 400, useNativeDriver: true }),
            ]).start();
        }
    }, [isLoadingCredentials]);

    useEffect(() => {
        const loadCredentials = async () => {
            setIsLoadingCredentials(true);
            try {
                const rememberedUsername = await AsyncStorage.getItem('rememberedUsername');
                const rememberedPassword = await AsyncStorage.getItem('rememberedPassword');
                const rememberPreference = await AsyncStorage.getItem('rememberMePreference');
                const termsAcceptedStorage = await AsyncStorage.getItem('termsAccepted');

                if (rememberPreference === 'true' && rememberedUsername && rememberedPassword) {
                    console.log('Loading saved credentials');
                    setUsername(rememberedUsername);
                    setPassword(rememberedPassword);
                    setRememberMe(true);
                    setTermsAccepted(termsAcceptedStorage === 'true');
                } else {
                    console.log('No saved credentials found');
                    setUsername('');
                    setPassword('');
                    setRememberMe(false);
                    setTermsAccepted(true);
                }

            } catch (error) {
                console.error("Failed to load credentials from storage", error);
                setRememberMe(false);
                setTermsAccepted(true);
            } finally {
                setIsLoadingCredentials(false);
            }
        };

        loadCredentials();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            const handleLogout = async () => {

                if (route.params?.logout) {
                     try {
                        debugger;
                        console.log('Logout initiated');
                        const rememberPreference = await AsyncStorage.getItem('rememberMePreference');
                        const devicekey = await AsyncStorage.getItem('deviceKey');
                        const userId = await AsyncStorage.getItem('userId');
                        const token = await AsyncStorage.getItem('token');
                        const sessionId = await AsyncStorage.getItem('sessionId');
                        
                        console.log('Device ID:', devicekey);
                        console.log('Remember preference:', rememberPreference);
                        console.log('User ID:', userId);
                        console.log('Session ID:', sessionId);
                        
                        if (userId && token && devicekey) {
                            try {
                                console.log('Calling logout API...');
                                const LOGOUT_API_URL = `${url}Login/LogoutMobileUser?userid=${encodeURIComponent(userId)}&deviceKey=${encodeURIComponent(devicekey)}`;
                                
                                const logoutController = new AbortController();
                                const logoutTimeoutId = setTimeout(() => logoutController.abort(), 15000);
                                
                                let logoutResponse;
                                try {
                                    logoutResponse = await fetch(LOGOUT_API_URL, {
                                        headers: {
                                            'Authorization': `Bearer ${token}`,
                                            'Accept': 'application/json',
                                        },
                                        signal: logoutController.signal,
                                    });
                                    clearTimeout(logoutTimeoutId);
                                } catch (logoutFetchError) {
                                    clearTimeout(logoutTimeoutId);
                                    if (logoutFetchError.name === 'AbortError') {
                                        console.warn('Logout API timeout, proceeding with local cleanup');
                                    } else {
                                        throw logoutFetchError;
                                    }
                                }
                                
                                if (logoutResponse && logoutResponse.ok) {
                                    console.log('Server logout successful');
                                } else if (logoutResponse) {
                                    console.warn('Server logout failed, proceeding with local cleanup');
                                }
                            } catch (apiError) {
                                console.error('Logout API error:', apiError);
                            }
                        }
                        
                        const keysToRemove = [
                            'token',
                            'sessionId',
                            'deviceKey',
                            'userId',
                            'completedSteps',
                            'topicCompletionTimes',
                            'middleLevelCompletionTime',
                            'advancedLevelCompletionTime',
                            'Name',
                            'userEmail',
                            'phoneNumber'
                        ];
                        
                        if (rememberPreference !== 'true') {
                            keysToRemove.push(
                                'rememberedUsername',
                                'rememberedPassword',
                                'termsAccepted',
                                'rememberMePreference'
                            );
                            setUsername('');
                            setPassword('');
                            setRememberMe(false);
                        }
                        
                        await AsyncStorage.multiRemove(keysToRemove);
                        setTermsAccepted(true);

                    } catch (error) {
                        console.error("Error during logout credential clearing:", error);
                        Alert.alert("Logout Error", "Failed to clear local credentials during logout.");
                    } finally {
                        Alert.alert("Logged Out", "You have been successfully logged out.");
                        navigation.setParams({ logout: undefined });
                        if (isLoadingCredentials) setIsLoadingCredentials(false);
                    }
                }
            };

            handleLogout();
            return () => {
            };
        }, [route.params?.logout, navigation, url, isLoadingCredentials])
    );


    if (isLoadingCredentials) {
        return (
            <View style={[styles.outermostContainer, backgroundStyle, styles.loadingContainer]}>
                <ActivityIndicator size="large" color={isDarkMode ? Colors.white : '#1434A4'} />
                <Text style={{ color: isDarkMode ? Colors.white : Colors.black, marginTop: 10 }}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={[styles.outermostContainer, backgroundStyle]}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundStyle.backgroundColor}
            />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView style={backgroundStyle}
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <Animated.Image
                        style={[styles.image, { opacity: imageOpacity }]}
                        source={require('../img/newlaunchscreen.png')}
                        resizeMode="contain"
                    />

                    <Animated.Text
                        style={[styles.startAppText, { transform: [{ translateX: emailTextPosition }] }, { color: isDarkMode ? Colors.white : Colors.black }]}
                    >
                        Please enter login details below
                    </Animated.Text>

                    <Animated.Text
                        style={[
                            styles.legend,
                            usernameError ? styles.errorLegend : null,
                            { transform: [{ translateX: usernamePosition }] }, { color: isDarkMode ? Colors.white : Colors.black }
                        ]}
                    >
                        Login ID
                    </Animated.Text>
                    <Animated.View
                        style={[
                            styles.fieldset,
                            usernameError ? styles.errorFieldset : null,
                            { transform: [{ translateX: usernamePosition }] }
                        ]}
                    >
                        <TextInput
                            style={[styles.input, usernameError ? styles.errorTextInput : null, { color: isDarkMode ? Colors.white : Colors.black }]}
                            placeholder="Enter your username"
                            placeholderTextColor={isDarkMode ? '#a6a6a6' : '#a6a6a6'}
                            value={username}
                            onChangeText={handleUsernameChange}
                            autoCapitalize="none"
                            keyboardAppearance={isDarkMode ? 'dark' : 'light'}
                            returnKeyType='next'
                        />
                    </Animated.View>
                    {usernameError !== '' && (
                        <Text style={[styles.errorText]}>{usernameError}</Text>
                    )}

                    <View style={{ height: 15 }} />

                    <Animated.Text style={[styles.legend, passwordError ? styles.errorLegend : null, { transform: [{ translateX: passwordPosition }] }, { color: isDarkMode ? Colors.white : Colors.black }]}>Password</Animated.Text>
                    <Animated.View style={[styles.fieldset, passwordError ? styles.errorFieldset : null, { transform: [{ translateX: passwordPosition }] }]}>
                        <TextInput
                            style={[styles.input, passwordError ? styles.errorTextInput : null, { color: isDarkMode ? Colors.white : Colors.black }]}
                            secureTextEntry
                            placeholder="Enter your password"
                            placeholderTextColor={isDarkMode ? '#a6a6a6' : '#a6a6a6'}
                            value={password}
                            onChangeText={handlePasswordChange}
                            keyboardAppearance={isDarkMode ? 'dark' : 'light'}
                            returnKeyType='done' />
                    </Animated.View>
                    {passwordError !== '' && (
                        <Text style={styles.errorText}>{passwordError}</Text>
                    )}
                    <View style={styles.checkboxesContainer}>
                        <Animated.View style={[styles.checkboxContainer, { transform: [{ translateX: checkboxPosition }] }]}>
                            <CheckBox
                                isChecked={termsAccepted}
                                onClick={handleTermsChange}
                                checkBoxColor={isDarkMode ? '#2754f7ff' : 'rgba(20, 52, 164, 1)'}
                                checkedCheckBoxColor={isDarkMode ? '#2754f7ff' : 'rgba(20, 52, 164, 1)'}
                            />
                            <Text style={[styles.checkboxLabel, { color: isDarkMode ? Colors.white : Colors.black }]}>
                                By logging in, you agree to company’s{' '}
                                <Text
                                    style={[styles.linkUnderline, { color: isDarkMode ? '#2754f7ff' : '#1434A4' }]}
                                  //  onPress={() => navigation.navigate('Privacy Policy')}
                                >
                                    Terms and Conditions
                                </Text>
                                {' '}and{' '}
                                <Text
                                    style={[styles.linkUnderline, { color: isDarkMode ? '#2754f7ff' : '#1434A4' }]}
                                  onPress={() => navigation.navigate('PrivacyPolicywithoutLog')}
                                >
                                    Privacy Policy
                                </Text>
                            </Text>
                        </Animated.View>
                        <Animated.View style={[styles.checkboxContainerSecond, { transform: [{ translateX: rememberMePosition }] }]}>
                            <CheckBox
                                isChecked={rememberMe}
                                onClick={handleRememberMeChange}
                                checkBoxColor={isDarkMode ? '#2754f7ff' : 'rgba(20, 52, 164, 1)'}
                                checkedCheckBoxColor={isDarkMode ? '#2754f7ff' : 'rgba(20, 52, 164, 1)'}
                            />
                            <Text style={[styles.checkboxLabel, { color: isDarkMode ? Colors.white : Colors.black }]}>Remember me</Text>
                        </Animated.View>
                    </View>
                    <Animated.View style={styles.shakeContainer}>
                        <TouchableOpacity
                            style={[styles.customButton, isLoggingIn && styles.buttonDisabled]}
                            onPress={handlePress}
                            activeOpacity={0.8}
                            disabled={isLoggingIn}
                        >
                            {isLoggingIn ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.buttonText}>Login</Text>
                            )}
                        </TouchableOpacity>
                    </Animated.View>
                    <Text style={[styles.otpLink, { color: isDarkMode ? '#2754f7ff' : '#1434A4' }]}>Login through OTP</Text>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};
const styles = StyleSheet.create({
    outermostContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 30,
    },
    image: {
        height: isTablet ? 160 : 130,
        marginTop: 10,
        marginBottom: '5%',
    },
    startAppText: {
        marginTop: 15,
        marginBottom: 15,
        fontSize: isTablet ? 18 : 16,
        color: '#000000',
        fontFamily: 'Lexend-VariableFont_wght',
    },
    fieldset: {
        width: isTablet ? contentMaxWidth : '90%',
        maxWidth: 500,
        alignSelf: 'center',
        borderColor: '#ced4da',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginTop: 5,
        position: 'relative',
        borderRadius: 5,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    legend: {
        position: 'relative',
        top: 0,
        left: 0,
        width: isTablet ? contentMaxWidth : '90%',
        maxWidth: 500,
        alignSelf: 'center',
        color: '#000000',
        fontFamily: 'Lexend-VariableFont_wght',
        fontSize: isTablet ? 16 : 14,
        paddingHorizontal: 5,
        marginBottom: 2,
    },
    input: {
        height: isTablet ? 52 : 45,
        paddingHorizontal: 10,
        color: '#333',
        fontSize: isTablet ? 16 : 14,
        fontFamily: 'Lexend-VariableFont_wght',
    },
    customButton: {
        marginTop: 25,
        width: isTablet ? contentMaxWidth : '90%',
        maxWidth: 500,
        alignSelf: 'center',
        height: isTablet ? 56 : 50,
        borderRadius: 5,
        backgroundColor: '#1434A4',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonDisabled: {
        backgroundColor: '#a9a9a9',
        elevation: 0,
        shadowOpacity: 0,
        shadowRadius: 0,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: isTablet ? 18 : 16,
        fontWeight: 'bold',
        fontFamily: 'Lexend-VariableFont_wght',
    },
    checkboxesContainer: {
        width: isTablet ? contentMaxWidth : '90%',
        maxWidth: 500,
        alignSelf: 'center',
        marginTop: 25,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 15,
    },
    checkboxContainerSecond: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    checkboxLabel: {
        marginLeft: 10,
        marginRight: 5,
        fontSize: 14,
        lineHeight: 18,
        color: '#000000',
        fontFamily: 'Lexend-VariableFont_wght',
        flex: 1,
    },
    linkUnderline: {
        textDecorationLine: 'underline',
        fontWeight: 'bold',
    },
    otpLink: {
        marginTop: 20,
        fontSize: 16,
        color: '#1434A4',
        fontFamily: 'Lexend-VariableFont_wght',
        textDecorationLine: 'underline',
    },
    shakeContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorFieldset: {
        borderColor: '#DC143C',
        borderWidth: 1.5,
    },
    errorLegend: {
        color: '#DC143C',
        fontWeight: 'bold',
    },
    errorTextInput: {
        color: '#DC143C',
    },
    errorText: {
        color: '#DC143C',
        fontWeight: 'bold',
        marginTop: 5,
        fontSize: isTablet ? 15 : 14,
        width: isTablet ? contentMaxWidth : '90%',
        maxWidth: 500,
        alignSelf: 'center',
        textAlign: 'left',
        paddingHorizontal: 5,
        fontFamily: 'Lexend-VariableFont_wght',
    },
});

export default LoginPage;
