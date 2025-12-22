import React from 'react';
import { ScrollView, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const footerHeight = Math.round(Math.max(56, width * 0.12));

const ScreenScroll = ({ children, contentContainerStyle, ...props }) => {
  return (
    <ScrollView
      contentContainerStyle={[{ flexGrow: 1 }, contentContainerStyle, { paddingBottom: footerHeight + 12 }]}
      {...props}
    >
      {children}
    </ScrollView>
  );
};

export default ScreenScroll;


