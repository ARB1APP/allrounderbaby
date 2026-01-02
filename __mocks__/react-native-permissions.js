module.exports = {
    check: jest.fn(() => Promise.resolve('granted')),
    request: jest.fn(() => Promise.resolve('granted')),
    PERMISSIONS: {},
    RESULTS: { GRANTED: 'granted', DENIED: 'denied' },
};
