import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Animated, ScrollView, StatusBar, Platform, KeyboardAvoidingView, useColorScheme, Alert, ActivityIndicator, } from 'react-native';
import CheckBox from 'react-native-check-box';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import NetInfo from '@react-native-community/netinfo';
import { useRoute, useFocusEffect } from '@react-navigation/native';

const LoginPage = ({ navigation }) => {
    const isDarkMode = useColorScheme() === 'dark';
    const backgroundStyle = {
        backgroundColor: isDarkMode ? '#2a3144' : Colors.white,
    };
    const url = 'https://allrounderbaby-czh8hubjgpcxgrc7.canadacentral-01.azurewebsites.net/api/';
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(true);
    const [rememberMe, setRememberMe] = useState(true);
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

            if (username === "" || username === null) {
                setUsernameError('❗Please enter username.');
                setIsLoggingIn(false);
                return;
            }
            if (password === "" || password === null) {
                setPasswordError('❗Please enter password.');
                setIsLoggingIn(false);
                return;
            }
            if (!termsAccepted) {
                Alert.alert("Message !", "Please accept the Terms and Conditions and Privacy Policy.");
                setIsLoggingIn(false);
                return;
            }

            const API_URL = `${url}Login/LoginMobileUser?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
            console.log("Attempting to login with URL:", API_URL);

            const response = await fetch(API_URL);
            const data = await response.json();

            if (response.ok && data.data != null && data.code === 200) {
                // 🔹 Always save token + userId (so session persists)
                await AsyncStorage.setItem('token', data.data.token);
                await AsyncStorage.setItem('userId', data.data.userID.toString());

                console.log('userId', data.data.userID);
                console.log('token', data.data.token);
                if (rememberMe) {
                    await AsyncStorage.setItem('rememberedUsername', username);
                    await AsyncStorage.setItem('rememberedPassword', password);
                    await AsyncStorage.setItem('termsAccepted', 'true');
                    await AsyncStorage.setItem('rememberMePreference', 'true');
                    // The token and userId are already saved above
                    console.log("Username and preference saved.");
                } else {
                    await AsyncStorage.removeItem('rememberedUsername');
                    await AsyncStorage.removeItem('rememberedPassword');
                    await AsyncStorage.removeItem('termsAccepted');
                    await AsyncStorage.removeItem('rememberMePreference');
                    console.log("Username and preference removed.");
                }

                if (navigation) {
                    navigation.navigate('Home', { screen: 'Dashboard' });
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
                    setUsername(rememberedUsername);
                    setPassword(rememberedPassword);
                    setRememberMe(true);
                    setTermsAccepted(termsAcceptedStorage === 'true');
                } else {
                    setUsername('');
                    setPassword('');
                    setRememberMe(true);
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
                    console.log("Logout action detected in LoginPage. Clearing all stored credentials.");
                    try {
                        await AsyncStorage.removeItem('rememberedUsername');
                        await AsyncStorage.removeItem('rememberedPassword');
                        await AsyncStorage.removeItem('termsAccepted');
                        await AsyncStorage.removeItem('rememberMePreference');
                        // Clear all progress-related data as well
                        await AsyncStorage.removeItem('token');
                        await AsyncStorage.removeItem('userId'); // Ensure userId is cleared
                        await AsyncStorage.removeItem('completedSteps');
                        await AsyncStorage.removeItem('topicCompletionTimes');
                        await AsyncStorage.removeItem('middleLevelCompletionTime');
                        await AsyncStorage.removeItem('advancedLevelCompletionTime');

                        setUsername('');
                        setPassword('');
                        setRememberMe(false);
                        setTermsAccepted(true); // Reset to default

                    } catch (error) {
                        console.error("Error during logout credential clearing:", error);
                        Alert.alert("Logout Error", "Failed to clear local credentials during logout.");
                    } finally {
                        // This should be inside finally to ensure it runs
                        Alert.alert("Logged Out", "You have been successfully logged out.");
                        navigation.setParams({ logout: undefined });
                        // If we were already loading, we might need to reset this
                        if(isLoadingCredentials) setIsLoadingCredentials(false); 
                    }
                }
            };

            handleLogout();

            // Cleanup function is not strictly necessary here unless you need to specifically remove listeners,
            // but useFocusEffect handles focus/blur cleanup.
            return () => {
            };
        }, [route.params?.logout])
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
                                    onPress={() => navigation.navigate('Terms of Service')}
                                >
                                    Terms and Conditions
                                </Text>
                                {' '}and{' '}
                                <Text
                                    style={[styles.linkUnderline, { color: isDarkMode ? '#2754f7ff' : '#1434A4' }]}
                                    onPress={() => navigation.navigate('Privacy Policy')}
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
        height: 130,
        marginTop: 10,
        marginBottom: '5%',
    },
    startAppText: {
        marginTop: 15,
        marginBottom: 15,
        fontSize: 16,
        color: '#000000',
        fontFamily: 'Lexend-VariableFont_wght',
    },
    fieldset: {
        width: '90%',
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
        width: '90%',
        color: '#000000',
        fontFamily: 'Lexend-VariableFont_wght',
        fontSize: 14,
        paddingHorizontal: 5,
        marginBottom: 2,

    },
    input: {
        height: 45,
        paddingHorizontal: 10,
        color: '#333',
        fontFamily: 'Lexend-VariableFont_wght',
    },
    customButton: {
        marginTop: 25,
        width: '90%',
        height: 50,
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
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Lexend-VariableFont_wght',
    },
    checkboxesContainer: {
        width: '90%',
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
        fontSize: 14,
        width: '90%',
        textAlign: 'left',
        paddingHorizontal: 5,
        fontFamily: 'Lexend-VariableFont_wght',
    },
});

export default LoginPage;
