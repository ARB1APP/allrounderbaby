// Disable verbose console methods in production builds to avoid JS thread overhead
// Keep console.error so fatal errors are still reported in crash logs
if (typeof __DEV__ !== 'undefined' && !__DEV__) {
    const noop = () => { };
    console.log = noop;
    console.info = noop;
    console.debug = noop;
    console.warn = noop;
}

export default null;
