import React from 'react';
import { ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// footerHeight can be computed where needed via useWindowDimensions if required

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


