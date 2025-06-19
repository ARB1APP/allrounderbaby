import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  // Image, // Not currently used, can be added back if icons are desired
  Linking,
  useColorScheme,
  StatusBar,
  Platform, // For platform-specific styling
} from 'react-native';
// Removed: import { Colors } from 'react-native/Libraries/NewAppScreen';

// --- Theme Colors ---
const lightThemeColors = {
  screenBackground: '#F4F6F8', // Softer white for a premium feel
  textPrimary: '#1A202C',    // Dark primary text for readability
  textSecondary: '#4A5568',  // Softer secondary text
  linkColor: 'rgba(20, 52, 164, 1)', // Your brand's primary color for links
  borderColor: '#E2E8F0',      // Light border for dividers
  statusBarContent: 'dark-content',
  // Bottom Nav (if it were on this screen, styles would be similar to other screens)
  // bottomNavBackground: '#FFFFFF',
  // bottomNavActiveTint: 'rgba(20, 52, 164, 1)',
  // bottomNavInactiveTint: '#A0AEC0',
  // bottomNavShadowColor: '#000000',
  // elevation: 5,
};

const darkThemeColors = {
  screenBackground: '#1A202C', // Dark blue-gray background
  textPrimary: '#E2E8F0',    // Light primary text
  textSecondary: '#A0AEC0',  // Lighter secondary text
  linkColor: '#63B3ED',        // Accessible blue for links in dark mode
  borderColor: '#4A5568',      // Darker border for dividers
  statusBarContent: 'light-content',
  // Bottom Nav (if it were on this screen)
  // bottomNavBackground: '#2D3748',
  // bottomNavActiveTint: '#63B3ED',
  // bottomNavInactiveTint: '#718096',
  // bottomNavShadowColor: '#000000',
  // elevation: 0, // Prefer borders
};

// --- Dynamic Styles ---
const createGetHelpStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.screenBackground,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 25, // Increased horizontal padding for content
    paddingTop: 20, // Add some top padding for the content itself
    paddingBottom: 40, // Ensure content is well above any potential bottom elements or OS gestures
  },
  title: {
    fontSize: 24, // Larger title for more impact
    textAlign: 'center',
    marginTop: Platform.OS === 'ios' ? 40 : 25, // Adjust for status bar height
    marginBottom: 15,
    fontWeight: '600', // Semi-bold
    color: theme.textPrimary,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: theme.borderColor,
    marginHorizontal: 20, // Match horizontal padding of content if desired, or make wider
    marginBottom: 25, // More space after the divider
  },
  introText: {
    fontSize: 16,
    color: theme.textSecondary,
    lineHeight: 26, // Increased line height for readability
    textAlign: 'left', // Default, but good to be explicit
    marginBottom: 30, // More space before the email link
  },
  emailLinkButton: {
    alignSelf: 'flex-start', // Keep it aligned to the start of its container
    paddingVertical: 10, // Increase touchable area
    marginBottom: 30,
  },
  emailTextWrapper: {
    flexDirection: 'row', // To align emoji and text
    alignItems: 'center',
  },
  emailEmoji: {
    fontSize: 20, // Slightly larger emoji
    marginRight: 8,
    color: theme.textPrimary, // Make emoji color consistent with text or a subtle accent
  },
  emailLink: {
    textDecorationLine: 'underline',
    color: theme.linkColor,
    fontWeight: '600', // Semi-bold for the link
    fontSize: 17, // Slightly larger link text
  },
  closingText: {
    fontSize: 16,
    color: theme.textSecondary,
    lineHeight: 26,
    textAlign: 'center',
    marginTop: 20, // Space from the email link
  },
  // Removed bottomNav styles as they are not rendered on this screen's JSX
  // If you add a bottom nav here, copy the themed styles from another component.
});

const GetHelp = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkThemeColors : lightThemeColors;
  const styles = createGetHelpStyles(theme); // Generate styles based on the theme

  const handleEmailPress = () => {
    Linking.openURL('mailto:support@allrounderbaby.com').catch(err =>
      console.error('Failed to open mail app:', err)
    );
  };

  // Note: BackHandler logic is usually handled by React Navigation's default behavior
  // unless you need specific override for this screen (e.g., show a confirmation dialog).
  // If this screen is part of a stack navigator, the header's back button will work.

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={theme.statusBarContent}
        backgroundColor={theme.screenBackground} // Match screen background
      />
      <Text style={styles.title}>Customer Support 💕</Text>
      <View style={styles.sectionDivider} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.introText}>
          We’re here for you! If you have any questions, need assistance, or just want to share your thoughts, please feel free to reach out.
        </Text>
        <TouchableOpacity style={styles.emailLinkButton} onPress={handleEmailPress}>
          <View style={styles.emailTextWrapper}>
            <Text style={styles.emailEmoji}>📧</Text>
            <Text style={styles.emailLink}>support@allrounderbaby.com</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.closingText}>
          Your parenting journey matters to us! 🌟✨
        </Text>
      </ScrollView>
      {/* No Bottom Nav Bar is rendered in the provided JSX for this screen */}
    </View>
  );
};

export default GetHelp;