import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, withRepeat, Easing } from 'react-native-reanimated';
import { StatusBar } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const MainApp = ({ navigation }) => {
    const isDarkMode = useColorScheme() === 'dark';
    const backgroundStyle = {
        backgroundColor: isDarkMode ? '#2a3144' : Colors.lighter,
    };

    const isFocused = useIsFocused();
    const welcomeX = useSharedValue(-300);
    const alwaysX = useSharedValue(300);
    const excitedX = useSharedValue(300);
    const alwaysGlow = useSharedValue(0);
    const imageOpacity = useSharedValue(0);
    const shakeX = useSharedValue(0);

    const startEarlyShineOpacity = useSharedValue(0);
    const startEarlyShineTranslateY = useSharedValue(-50);

    useEffect(() => {
        if (isFocused) {
            welcomeX.value = -300;
            alwaysX.value = 300;
            excitedX.value = 300;
            alwaysGlow.value = 0;
            imageOpacity.value = 0;
            startEarlyShineOpacity.value = 0;
            startEarlyShineTranslateY.value = -50;

            welcomeX.value = withTiming(0, { duration: 800 });
            alwaysX.value = withTiming(0, { duration: 800 });
            excitedX.value = withTiming(0, { duration: 800 });

            alwaysGlow.value = withDelay(900, withTiming(1, { duration: 800 }));
            imageOpacity.value = withDelay(500, withTiming(1, { duration: 800 }));

            shakeX.value = withDelay(
                1200,
                withRepeat(
                    withTiming(10, { duration: 100, easing: Easing.linear }),
                    6,
                    true
                )
            );

            startEarlyShineOpacity.value = withDelay(700, withTiming(1, { duration: 1000 }));
            startEarlyShineTranslateY.value = withDelay(700, withTiming(0, { duration: 1000, easing: Easing.out(Easing.exp) }));
        }
    }, [isFocused]);

    const welcomeStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: welcomeX.value }],
    }));

    const alwaysStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: alwaysX.value }],
        opacity: alwaysGlow.value,
    }));

    const excitedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: excitedX.value }],
    }));

    const imageStyle = useAnimatedStyle(() => ({
        opacity: imageOpacity.value,
    }));

    const shakeButtonStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: shakeX.value }],
    }));

    const startEarlyShineStyle = useAnimatedStyle(() => ({
        opacity: startEarlyShineOpacity.value,
        transform: [{ translateY: startEarlyShineTranslateY.value }],
    }));

    const handlePress = () => {
        navigation.navigate('Login');
    };

    return (
        <View style={[styles.container, backgroundStyle]}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundStyle.backgroundColor}
            />
            <Animated.Image
                style={[styles.image, welcomeStyle]}
                source={require('./img/babyone.jpg')}
            />
            <View style={styles.fullDiv}>
                <Animated.Text style={[styles.startAppText, startEarlyShineStyle, { color: isDarkMode ? Colors.white : Colors.black }]}>
                    Start Early, <Text style={[styles.highlightText, { color: isDarkMode ? Colors.white : Colors.black }]} >Shine Always!</Text>
                </Animated.Text>
                <Animated.Text style={[styles.excitedLink, excitedStyle, { color: isDarkMode ? Colors.white : Colors.black }]}>
                    Excited to begin?
                </Animated.Text>
                <Animated.View style={[styles.customButton, shakeButtonStyle,]}>
                    <TouchableOpacity
                        style={styles.customButtonInner}
                        onPress={handlePress}
                    >
                        <Animated.Text style={[styles.buttonText,]}>Let's Get Started</Animated.Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    welcomeTitleText: {
        fontSize: 40,
        margin: 10,
        fontFamily: 'Lexend-VariableFont_wght',
        color: '#000725',
        fontStyle: 'normal',
    },
    image: {
        height: '60%',
        width: '100%',
        marginTop: 0,
        borderBottomRightRadius: 150,
    },
    startAppText: {
        marginTop: 50,
        fontSize: 24,
        color: '#000',
        fontStyle: 'italic',
        fontFamily: 'Lexend-VariableFont_wght',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    highlightText: {
        color: '#000',
        fontFamily: 'Lexend-VariableFont_wght',
        fontWeight: 'bold',
    },
    excitedLink: {
        marginTop: 10,
        fontSize: 16,
        color: '#000',
        fontFamily: 'Lexend-VariableFont_wght',
        textAlign: 'center',
        marginBottom: '10%',
    },
    customButton: {
        marginTop: 40,
        width: '90%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    customButtonInner: {
        backgroundColor: '#1434A4',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        borderColor: '#d6fbe4',
        borderWidth: 0,
        alignItems: 'center',
        borderRadius: 5,
        marginBottom: '20%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Lexend-VariableFont_wght',
        fontWeight: 'bold',
    },
    fullDiv: {
        width: '100%',
        alignItems: 'center',
    },
});
export default MainApp;