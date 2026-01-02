module.exports = {
    preset: 'react-native',
    transformIgnorePatterns: [
        'node_modules/(?!(react-native|@react-native|@react-navigation|@testing-library/react-native|react-native-.*|@react-native-async-storage)/)'
    ],
};
