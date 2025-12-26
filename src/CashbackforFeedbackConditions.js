import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  useColorScheme,
  StatusBar,
  BackHandler,
  Platform,
} from 'react-native';

const lightThemeColors = {
  screenBackground: '#F4F6F8',
  cardBackground: '#FFFFFF',
  textPrimary: '#1A202C',
  textSecondary: '#4A5568',
  textMuted: '#718096',
  accentColor: 'rgba(20, 52, 164, 1)',
  linkColor: 'rgba(20, 52, 164, 1)',
  borderColor: '#E2E8F0',
  iconColor: '#4A5568',
  videoIconTint: 'rgba(20, 52, 164, 1)',
  bottomNavBackground: '#FFFFFF',
  bottomNavActiveTint: 'rgba(20, 52, 164, 1)',
  bottomNavInactiveTint: '#A0AEC0',
  bottomNavShadowColor: '#000000',
  statusBarContent: 'dark-content',
  elevation: 5,
};

const darkThemeColors = {
  screenBackground: '#1A202C',
  cardBackground: '#2D3748',
  textPrimary: '#E2E8F0',
  textSecondary: '#A0AEC0',
  textMuted: '#718096',
  accentColor: 'rgba(40, 72, 184, 1)',
  linkColor: '#63B3ED',
  borderColor: '#4A5568',
  iconColor: '#A0AEC0',
  videoIconTint: 'rgba(40, 72, 184, 1)',
  bottomNavBackground: '#2D3748',
  bottomNavActiveTint: '#63B3ED',
  bottomNavInactiveTint: '#718096',
  bottomNavShadowColor: '#000000',
  statusBarContent: 'light-content',
  elevation: 0,
};

const createCashbackStyles = (theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.screenBackground },
  scrollViewContent: { flexGrow: 1, paddingBottom: 20 },

  sectionDivider: { height: 1, backgroundColor: theme.borderColor, marginHorizontal: 20, marginVertical: 20 },

  importantDetailsBox: {
    marginHorizontal: 20,
    marginTop: 0,
    padding: 15,
    backgroundColor: theme.cardBackground,
    borderRadius: 8,
    borderWidth: theme.elevation === 0 ? 1 : 0,
    borderColor: theme.borderColor,
    elevation: theme.elevation / 2,
    shadowColor: theme.bottomNavShadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },

  sectionHeader: { marginHorizontal: 0, marginTop: 0, marginBottom: 12, fontSize: 24, fontWeight: '600' },
  subListItem: { marginLeft: 15, marginRight: 20, fontSize: 15, lineHeight: 22, color: theme.textSecondary, marginBottom: 8 },
  emphasisText: { fontWeight: '600', color: theme.textPrimary },

  finalCallToAction: { fontSize: 15, lineHeight: 22, color: theme.textSecondary, textAlign: 'center', fontWeight: '500' },
});

const CashbackforFeedbackConditions = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkThemeColors : lightThemeColors;
  const styles = createCashbackStyles(theme);
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    const backAction = () => {
      if (navigation && typeof navigation.canGoBack === 'function' && navigation.canGoBack()) {
        navigation.goBack();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [navigation]);
 
  return (
    <View style={styles.container}>
      <StatusBar barStyle={theme.statusBarContent} backgroundColor={theme.screenBackground} />
      <View style={styles.sectionDivider} />

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
     
  <View style={styles.importantDetailsBox}>
           <Text  style={[
                    styles.sectionHeader,
                    { color: isDarkMode ? '#fff' : '#1434a4' }
                ]}>Submission & Review Process</Text>
       <Text style={styles.subListItem}>
          <Text style={styles.emphasisText}>✔️ 
            </Text> Feedback  must be submitted after logging in to our website .
        </Text>
        <Text style={styles.subListItem}>
          <Text style={styles.emphasisText}>✔️ 
             </Text> Our team will review and verify yourfeedback before 
                  approval. 
        </Text>
        <Text style={styles.subListItem}>
          <Text style={styles.emphasisText}>✔️ 
            </Text> Cashback is issued only if the feedback is detailed, genuine, and approved.
            <Text style={styles.emphasisText}></Text>
        </Text>
        </View>
        <View style={styles.sectionDivider} />
        <View style={styles.importantDetailsBox}>
           <Text  style={[
                    styles.sectionHeader,
                    { color: isDarkMode ? '#fff' : '#1434a4' }
                ]}>Bank Account & Payment Processing</Text>
       <Text style={styles.subListItem}>
         <Text style={styles.emphasisText}>✔️ </Text> 
          Update your bank details after logging in to our website—this account will be used for your cashback payout.
        </Text>
        <Text style={styles.subListItem}>
          <Text style={styles.emphasisText}>✔️ </Text> 
          Cashback is processed within 1 to 60 days after approval.
        </Text>
        </View>
    <View style={styles.sectionDivider} />
         <View style={styles.importantDetailsBox}>
           <Text  style={[
                    styles.sectionHeader,
                    { color: isDarkMode ? '#fff' : '#1434a4' }
                ]}>International Participants</Text>
         <Text style={styles.subListItem}>
           <Text style={styles.emphasisText}>✔️ </Text> 
            For payments made in currencies other than INR, applicable transaction fees and currency conversion charges may apply
        </Text>
        <Text style={styles.subListItem}>
            <Text style={styles.emphasisText}>✔️ </Text> 
            The final amount credited depends on your bank’s deductions and exchange rates.
        </Text>
        </View>
    <View style={styles.sectionDivider} />
           <View style={styles.importantDetailsBox}>
           <Text  style={[
                    styles.sectionHeader,
                    { color: isDarkMode ? '#fff' : '#1434a4' }
                ]}>Tax & Compliance</Text>
        <Text style={styles.subListItem}>
              <Text style={styles.emphasisText}>✔️ </Text> 
               No TDS will be deducted under Section 194J of the Indian Income Tax Act, subject to applicable rules.
        </Text> 
          <Text style={styles.subListItem}>{'\n'}
              <Text style={styles.emphasisText}>For International Users:</Text> 
        </Text>
           <Text style={styles.subListItem}>
               <Text style={styles.emphasisText}>✔️ </Text> 
               You are responsible for reporting and paying taxes in accordance with your local tax regulations.
        </Text>
        <Text style={styles.subListItem}>
               <Text style={styles.emphasisText}>✔️ </Text> 
               Cashback is treated as commission income and may be taxable under the laws of your country.
        </Text>
        </View>
    <View style={styles.sectionDivider} />
  <View style={styles.importantDetailsBox}>
           <Text  style={[
                    styles.sectionHeader,
                    { color: isDarkMode ? '#fff' : '#1434a4' }
                ]}>Important Notes</Text>
          <Text style={styles.subListItem}>
               <Text style={styles.emphasisText}>✔️ </Text> 
               AllrounderBaby does not offer tax advice. Please consult your tax advisor.
        </Text>
            <Text style={styles.subListItem}>
               <Text style={styles.emphasisText}>✔️ </Text> 
              By submitting feedback, you agree to our Terms of Use and Privacy Policy.
        </Text>
        </View>
     <View style={styles.sectionDivider} />
        <View style={styles.importantDetailsBox}>
          <Text style={styles.finalCallToAction}>
            Your feedback matters! Help us improve and get rewarded with cashback up to ₹1,000 / $10
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default CashbackforFeedbackConditions;
