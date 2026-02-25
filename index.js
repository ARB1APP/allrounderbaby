import { AppRegistry, Alert } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Safety: ensure Alert.message passed to native is always a string.
// Some code paths pass objects (ReadableMap) which causes a crash on Android
// (Value for message cannot be cast from ReadableNativeMap to String).
// Coerce non-string message values to a safe string representation.
try {
    const _origAlert = Alert.alert;
    Alert.alert = function patchedAlert(...args) {
        if (args.length >= 2) {
            let msg = args[1];
            if (msg !== null && msg !== undefined && typeof msg !== 'string') {
                try {
                    msg = typeof msg === 'object' ? JSON.stringify(msg) : String(msg);
                } catch (e) {
                    msg = String(msg);
                }
                args[1] = msg;
            }
        }
        return _origAlert.apply(this, args);
    };
} catch (e) {
    // ignore patch failures
}

AppRegistry.registerComponent(appName, () => App);
