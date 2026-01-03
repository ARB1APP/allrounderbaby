import { Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const baseWidth = 375;
const baseHeight = 812;

export const isTablet = () => {
  const aspectRatio = SCREEN_HEIGHT / SCREEN_WIDTH;
  return (
    (Platform.OS === 'ios' && aspectRatio < 1.6) ||
    (Platform.OS === 'android' && (SCREEN_WIDTH >= 600 || SCREEN_HEIGHT >= 600))
  );
};

export const isSmallDevice = () => {
  return SCREEN_WIDTH < 375;
};

export const scale = (size) => {
  const ratio = SCREEN_WIDTH / baseWidth;
  return Math.round(size * ratio);
};

export const verticalScale = (size) => {
  const ratio = SCREEN_HEIGHT / baseHeight;
  return Math.round(size * ratio);
};

export const moderateScale = (size, factor = 0.5) => {
  return Math.round(size + (scale(size) - size) * factor);
};

export const getFontSize = (size) => {
  if (isTablet()) {
    return size * 1.2;
  }
  if (isSmallDevice()) {
    return size * 0.9;
  }
  return moderateScale(size, 0.3);
};

export const getSpacing = (size) => {
  if (isTablet()) {
    return size * 1.3;
  }
  return moderateScale(size, 0.5);
};

export const wp = (percentage) => {
  return (SCREEN_WIDTH * percentage) / 100;
};

export const hp = (percentage) => {
  return (SCREEN_HEIGHT * percentage) / 100;
};

export const getMaxContentWidth = () => {
  if (isTablet()) {
    return Math.min(SCREEN_WIDTH * 0.85, 800);
  }
  return SCREEN_WIDTH * 0.9;
};

export const getButtonHeight = () => {
  if (isTablet()) {
    return 56;
  }
  if (isSmallDevice()) {
    return 44;
  }
  return 50;
};

export const getIconSize = (size) => {
  if (isTablet()) {
    return size * 1.3;
  }
  return size;
};

export const getImageDimensions = (width, height) => {
  const maxWidth = isTablet() ? SCREEN_WIDTH * 0.8 : SCREEN_WIDTH - 40;
  const aspectRatio = height / width;

  if (width > maxWidth) {
    return {
      width: maxWidth,
      height: maxWidth * aspectRatio,
    };
  }

  return { width, height };
};

export const isLandscape = () => {
  return SCREEN_WIDTH > SCREEN_HEIGHT;
};

export const getCardWidth = () => {
  if (isTablet()) {
    return isLandscape() ? wp(45) : wp(85);
  }
  return wp(90);
};

export const getGridColumns = () => {
  if (isTablet()) {
    return isLandscape() ? 3 : 2;
  }
  return 1;
};

export default {
  isTablet,
  isSmallDevice,
  scale,
  verticalScale,
  moderateScale,
  getFontSize,
  getSpacing,
  wp,
  hp,
  getMaxContentWidth,
  getButtonHeight,
  getIconSize,
  getImageDimensions,
  isLandscape,
  getCardWidth,
  getGridColumns,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
};
