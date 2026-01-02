export default function safeJsonParse(value, fallback = {}) {
    try {
        return JSON.parse(value);
    } catch (e) {
        return fallback;
    }
}
