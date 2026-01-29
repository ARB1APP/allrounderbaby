import { Dimensions, Platform, PixelRatio } from 'react-native';

const baseWidth = 375;
const baseHeight = 812;

const getWindow = () => Dimensions.get('window');

export const isTablet = () => {
  const { width, height } = getWindow();
  const aspectRatio = height / width;
  return (
    (Platform.OS === 'ios' && aspectRatio < 1.6) ||
    (Platform.OS === 'android' && (width >= 600 || height >= 600))
  );
};

export const isSmallDevice = () => {
  const { width } = getWindow();
  return width < 375;
};

export const scale = (size) => {
  const { width } = getWindow();
  const ratio = width / baseWidth;
  return Math.round(size * ratio);
};

export const verticalScale = (size) => {
  const { height } = getWindow();
  const ratio = height / baseHeight;
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
  const { width } = getWindow();
  return (width * percentage) / 100;
};

export const hp = (percentage) => {
  const { height } = getWindow();
  return (height * percentage) / 100;
};

export const getMaxContentWidth = () => {
  const { width } = getWindow();
  if (isTablet()) {
    return Math.min(width * 0.85, 800);
  }
  return width * 0.9;
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
  const { width: w } = getWindow();
  const maxWidth = isTablet() ? w * 0.8 : w - 40;
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
  const { width, height } = getWindow();
  return width > height;
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

const getScreenWidth = () => getWindow().width;
const getScreenHeight = () => getWindow().height;

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
  SCREEN_WIDTH: getScreenWidth,
  SCREEN_HEIGHT: getScreenHeight,
};
