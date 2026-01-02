import AsyncStorage from '@react-native-async-storage/async-storage';
import safeJsonParse from './safeJsonParse';

const STORAGE_KEY = 'appErrorLogs';
const MAX_LOGS = 200;

export async function logError(error, context = {}) {
    try {
        const now = new Date().toISOString();
        const message = (error && (error.message || error.toString())) || 'Unknown error';
        const stack = error && error.stack ? error.stack : null;
        const entry = { timestamp: now, message, stack, context };

        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const existing = raw ? safeJsonParse(raw, []) : [];
        existing.unshift(entry);
        if (existing.length > MAX_LOGS) existing.length = MAX_LOGS;
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
        console.error('[Logged Error]', entry);
    } catch (e) {
        // best-effort only
        console.error('Failed to log error locally', e);
    }
}

export async function getLogs() {
    try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        return raw ? safeJsonParse(raw, []) : [];
    } catch (e) {
        console.error('Failed to read logs', e);
        return [];
    }
}

export async function clearLogs() {
    try {
        await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (e) {
        console.error('Failed to clear logs', e);
    }
}

export default { logError, getLogs, clearLogs };
