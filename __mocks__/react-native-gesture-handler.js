const React = require('react');
const { View } = require('react-native');

module.exports = {
    GestureHandlerRootView: View,
    BaseButton: View,
    RectButton: View,
    BorderlessButton: View,
    RawButton: View,
    State: {},
    Directions: {},
    FlingGestureHandler: View,
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    PanGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    TapGestureHandler: View,
    Swipeable: View,
    DrawerLayout: View,
    GestureDetector: View,
    Gesture: {
        Race: () => View,
        Simultaneous: () => View,
        Exclusive: () => View,
    },
};
