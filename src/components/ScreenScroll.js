import React from 'react';
import { ScrollView, Dimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const footerHeight = Math.round(Math.max(56, width * 0.12));

const ScreenScroll = ({ children, contentContainerStyle, ...props }) => {
  const insets = useSafeAreaInsets();
  const bottomInset = insets?.bottom || (Platform.OS === 'android' ? 8 : 0);

  return (
    <ScrollView
      {...props}
    >
      {children}
    </ScrollView>
  );
};

export default ScreenScroll;


