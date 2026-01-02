const defaultState = { isConnected: true, isInternetReachable: true };

module.exports = {
    addEventListener: jest.fn(() => ({ remove: jest.fn() })),
    fetch: jest.fn(() => Promise.resolve(defaultState)),
    useNetInfo: jest.fn(() => defaultState),
};
