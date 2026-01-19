import React, { useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
  useColorScheme,
  StatusBar,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const lightThemeColors = {
  screenBackground: '#F4F6F8',
  textPrimary: '#1A202C',
  textSecondary: '#4A5568',
  linkColor: 'rgba(20, 52, 164, 1)',
  borderColor: '#E2E8F0',
  statusBarContent: 'dark-content',
};

const darkThemeColors = {
  screenBackground: '#1A202C',
  textPrimary: '#E2E8F0',
  textSecondary: '#A0AEC0',
  linkColor: '#63B3ED',
  borderColor: '#4A5568',
  statusBarContent: 'light-content',
};

const createGetHelpStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.screenBackground,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginTop: Platform.OS === 'ios' ? 40 : 25,
    marginBottom: 15,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: theme.borderColor,
    marginHorizontal: 20,
    marginBottom: 25,
  },
  introText: {
    fontSize: 16,
    color: theme.textSecondary,
    lineHeight: 26,
    textAlign: 'left',
    marginBottom: 30,
  },
  emailLinkButton: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    marginBottom: 30,
  },
  emailTextWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emailEmoji: {
    fontSize: 20,
    marginRight: 8,
    color: theme.textPrimary,
  },
  emailLink: {
    textDecorationLine: 'underline',
    color: theme.linkColor,
    fontWeight: '600',
    fontSize: 17,
  },
  closingText: {
    fontSize: 16,
    color: theme.textSecondary,
    lineHeight: 26,
    textAlign: 'center',
    marginTop: 20,
  },
});

const GetHelp = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkThemeColors : lightThemeColors;
  const styles = createGetHelpStyles(theme);
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      StatusBar.setBarStyle('light-content');
    }
  }, [isFocused]);
  const handleEmailPress = () => {
    Linking.openURL('mailto:support@allrounderbaby.com').catch(err =>
      console.error('Failed to open mail app:', err)
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={theme.statusBarContent}
        backgroundColor={theme.screenBackground}
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
    </SafeAreaView>
  );
};

export default GetHelp;
