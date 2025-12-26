import { BackHandler, Platform, ToastAndroid, Alert } from 'react-native';

export const exitApp = ({ confirm = false, toastMessage = null } = {}) => {
    if (confirm) {
        Alert.alert(
            'Exit App',
            'Are you sure you want to exit?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Exit', style: 'destructive', onPress: () => BackHandler.exitApp() }
            ],
            { cancelable: true }
        );
        return;
    }

    if (Platform.OS === 'android' && toastMessage) {
        ToastAndroid.show(toastMessage, ToastAndroid.SHORT);
    }

    BackHandler.exitApp();
};

export default exitApp;
