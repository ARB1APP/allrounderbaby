import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    Image,
    TextInput,
    Platform,
    Alert,
    ToastAndroid,
    useWindowDimensions,
    Keyboard,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const LoginOTP = ({ navigation }) => {
    const isDarkMode = useColorScheme() === 'dark';
    const [identifier, setIdentifier] = useState('');
    const [loading, setLoading] = useState(false);
    const [otpVisible, setOtpVisible] = useState(false);
    const [otp, setOtp] = useState('');
    const [verifyLoading, setVerifyLoading] = useState(false);
    const otpLength = 6;
    const otpInputsRef = useRef([]);

    useEffect(() => {
        if (otpVisible) {
            setOtp('');
            otpInputsRef.current = otpInputsRef.current.slice(0, otpLength);
        }
    }, [otpVisible]);

    const handleOtpChange = (text, idx) => {
        const digits = text.replace(/\D/g, '').split('');
        if (digits.length > 1) {
            const chars = Array.from({ length: otpLength }, (_, i) => (otp[i] ? otp[i] : ''));
            for (let i = 0; i < digits.length && idx + i < otpLength; i++) chars[idx + i] = digits[i];
            setOtp(chars.join('').slice(0, otpLength));
            const nextIndex = Math.min(otpLength - 1, idx + digits.length);
            const next = otpInputsRef.current[nextIndex];
            if (next) next.focus();
            return;
        }

        const char = digits[0] || '';
        const chars = Array.from({ length: otpLength }, (_, i) => (otp[i] ? otp[i] : ''));
        chars[idx] = char;
        setOtp(chars.join(''));
        if (char && idx < otpLength - 1) {
            const next = otpInputsRef.current[idx + 1];
            if (next) next.focus();
        }
    };

    const handleOtpKeyPress = ({ nativeEvent }, idx) => {
        if (nativeEvent.key === 'Backspace') {
            const chars = Array.from({ length: otpLength }, (_, i) => (otp[i] ? otp[i] : ''));
            if (!chars[idx] && idx > 0) {
                const prev = otpInputsRef.current[idx - 1];
                if (prev) prev.focus();
            } else {
                chars[idx] = '';
                setOtp(chars.join(''));
            }
        }
    };
    const { width } = useWindowDimensions();
    const isTabletLocal = width >= 600;

    const showToast = (msg) => {
        if (Platform.OS === 'android' && ToastAndroid && typeof ToastAndroid.show === 'function') {
            ToastAndroid.show(msg, ToastAndroid.SHORT);
        } else {
            Alert.alert('', msg);
        }
    };

    const handleSendOTP = () => {
        if (!identifier.trim()) {
            showToast('Please enter registered email/WhatsApp number.');
            return;
        }
        Keyboard.dismiss();
        setLoading(true);
        // TODO: wire actual API call to request OTP
        setTimeout(() => {
            setLoading(false);
            setOtpVisible(true);
            showToast('OTP sent to the provided contact.');
        }, 900);
    };

    const handleVerifyOTP = () => {
        const digitsOnly = (otp || '').replace(/\D/g, '');
        if (digitsOnly.length !== otpLength) {
            showToast(`Please enter the ${otpLength}-digit OTP.`);
            return;
        }
        Keyboard.dismiss();
        setVerifyLoading(true);
        // TODO: call verify OTP API
        setTimeout(() => {
            setVerifyLoading(false);
            showToast('OTP verified.');
            // proceed to next step after verification
        }, 800);
    };

    return (
        <KeyboardAwareScrollView
            style={[{ flex: 1, backgroundColor: isDarkMode ? '#2a3144' : '#FFFFFF' }]}
            contentContainerStyle={[styles.container, { paddingBottom: Platform.OS === 'ios' ? 120 : 80 }]}
            enableOnAndroid={true}
            extraScrollHeight={Platform.OS === 'ios' ? 20 : 200}
            enableAutomaticScroll={true}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={true}
        >
            <Image source={require('../img/newlaunchscreen.png')} style={styles.logo} resizeMode="contain" />

            <View style={[styles.form, { paddingHorizontal: isTabletLocal ? 40 : 20 }]}>
                <Text style={[styles.label, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Login ID</Text>
                <TextInput
                    value={identifier}
                    onChangeText={setIdentifier}
                    placeholder="Enter registered email/WhatsApp number"
                    placeholderTextColor="#a6a6a6"
                    style={styles.input}
                    keyboardType="default"
                    autoCapitalize="none"
                />

                {otpVisible ? (
                    <>
                        <Text style={[styles.label, { marginTop: 18, color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Enter OTP</Text>
                        <View style={{ width: '90%', marginTop: 4 }}>
                            <View style={styles.otpRow}>
                                {Array.from({ length: otpLength }).map((_, i) => (
                                    <TextInput
                                        key={i}
                                        ref={(r) => (otpInputsRef.current[i] = r)}
                                        value={(otp && otp[i]) ? otp[i] : ''}
                                        onChangeText={(t) => handleOtpChange(t, i)}
                                        onKeyPress={(e) => handleOtpKeyPress(e, i)}
                                        keyboardType="number-pad"
                                        maxLength={otpLength}
                                        style={styles.otpBox}
                                        placeholder="-"
                                        placeholderTextColor="#a6a6a6"
                                        textContentType="oneTimeCode"
                                        returnKeyType="done"
                                        autoFocus={false}
                                        blurOnSubmit={true}
                                    // KeyboardAwareScrollView handles scrolling
                                    />
                                ))}
                            </View>
                        </View>

                        <TouchableOpacity style={styles.button} onPress={handleVerifyOTP} disabled={verifyLoading}>
                            <Text style={[styles.buttonText, verifyLoading && styles.buttonTextDisabled]}>{verifyLoading ? 'Verifying...' : 'Verify OTP'}</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <TouchableOpacity
                        style={[styles.button, (loading || !identifier.trim()) && styles.buttonDisabled]}
                        onPress={handleSendOTP}
                        disabled={loading || !identifier.trim()}
                    >
                        <Text style={[styles.buttonText, (loading || !identifier.trim()) && styles.buttonTextDisabled]}>{loading ? 'Sending...' : 'Send OTP'}</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 12 }}>
                    <Text style={styles.backLink}>Close</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flexGrow: 1, alignItems: 'center', paddingTop: 36 },
    logo: { width: 180, height: 90, marginBottom: 18 },
    form: { width: '100%', maxWidth: 560, alignItems: 'center' },
    label: { alignSelf: 'flex-start', marginLeft: '5%', marginBottom: 8, fontSize: 14, fontWeight: '600' },
    input: { width: '90%', backgroundColor: '#f2f4f7', borderRadius: 8, height: 48, paddingHorizontal: 12, fontSize: 14, borderColor: '#e1e4e8', borderWidth: 1 },
    button: { marginTop: 20, width: '90%', backgroundColor: '#1434A4', paddingVertical: 14, borderRadius: 6, alignItems: 'center' },
    buttonDisabled: { backgroundColor: '#bdbdbd', opacity: 1 },
    buttonText: { color: '#FFFFFF', fontWeight: '700' },
    buttonTextDisabled: { color: '#e6e6e6' },
    backLink: { color: '#1434A4', textDecorationLine: 'underline', fontWeight: '700' },
    otpRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 6 },
    otpBox: { width: 44, height: 52, borderRadius: 8, borderWidth: 1, borderColor: '#e6e9ee', backgroundColor: '#fff', textAlign: 'center', fontSize: 18, fontWeight: '700', color: '#000' },
});

export default LoginOTP;
