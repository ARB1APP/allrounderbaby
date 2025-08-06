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
import { blue } from 'react-native-reanimated/lib/typescript/Colors';

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
  container: {
    flex: 1,
    backgroundColor: theme.screenBackground,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 17,
    textAlign: 'center',
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 0,
    fontWeight: '600',
    color: theme.textPrimary,
    lineHeight: 24,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: theme.borderColor,
    marginHorizontal: 20,
    marginVertical: 20,
  },
  lastUpdatedText: {
    textAlign: 'center',
    fontSize: 12,
    color: theme.textMuted,
    marginBottom: 20,
    marginTop: 10,
  },
  introParagraph: {
    marginHorizontal: 20,
    fontSize: 15,
    lineHeight: 22,
    color: theme.textSecondary,
    marginBottom: 5,
  },
  sectionHeader: {
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 12,
    fontSize: 24,
    fontWeight: '600',
  },
  listItem: {
    marginHorizontal: 10,
    fontSize: 15,
    lineHeight: 22,
    color: theme.textSecondary,
    marginBottom: 8,
  },
  subListItem: {
    marginLeft: 15,
    marginRight: 20,
    fontSize: 15,
    lineHeight: 22,
    color: theme.textSecondary,
    marginBottom: 8,
  },
  emphasisText: {
    fontWeight: '600',
    color: theme.textPrimary,
  },
  highlightText: {
    color: theme.accentColor,
    fontWeight: '600',
  },
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
  detailPoint: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.textSecondary,
    marginBottom: 10,
     marginHorizontal: 10,
  },
  finalCallToAction: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  linkButton: {
    alignSelf: 'flex-end',
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 20,
  },
  linkText: {
    color: theme.linkColor,
    textDecorationLine: 'underline',
    fontSize: 15,
    fontWeight: '500',
  },
  videoLinksContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 25,
    backgroundColor: theme.cardBackground,
    borderRadius: 10,
    borderWidth: theme.elevation === 0 ? 1 : 0,
    borderColor: theme.borderColor,
    elevation: theme.elevation,
    shadowColor: theme.bottomNavShadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  videoLinkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  videoLinkItemInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  videoIcon: {
    width: 28,
    height: 28,
    marginRight: 12,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.textPrimary,
  },
  arrowIcon: {
    width: 20,
    height: 20,
    tintColor: theme.iconColor,
  },
  videoItemDivider: {
    height: 1,
    backgroundColor: theme.borderColor,
    marginHorizontal: 15,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: theme.bottomNavBackground,
    paddingVertical: Platform.OS === 'ios' ? 15 : 10,
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
    borderTopWidth: 1,
    borderTopColor: theme.borderColor,
    shadowColor: theme.bottomNavShadowColor,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: theme.elevation > 0 ? 0.1 : 0,
    shadowRadius: theme.elevation > 0 ? 4 : 0,
    elevation: theme.elevation,
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginBottom: 3,
  },
  navText: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
});

const CashbackforFeedbackConditions = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkThemeColors : lightThemeColors;
  const styles = createCashbackStyles(theme);
  const isDarkMode = useColorScheme() === 'dark';

       useEffect(() => {
    const backAction = () => {
        if (navigation.canGoBack()) {
            navigation.navigate('Cashback for Feedback');
        } else {
        }
        return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => {
        backHandler.remove();
    };
  }, [navigation]);
 
  return (
    <View style={styles.container}>
      <StatusBar barStyle={theme.statusBarContent} backgroundColor={theme.screenBackground} />
           {/* <View style={[styles.importantDetailsBox, { marginTop: 10 }]}>
                <Text style={styles.headerTitle}>Get ₹1,000 / $10 Cashback </Text>
                <Text style={styles.headerTitle}><Text style={styles.headerTitl}>for your genuine</Text> Feedback!</Text>
              </View> */}
      <View style={styles.sectionDivider} />

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
         {/* <View style={styles.importantDetailsBox}>
        <Text style={styles.introParagraph}>
           Your opinion matters! 💖 Help us improve <Text style={styles.emphasisText}>AllrounderBaby.com</Text> and <Text style={styles.emphasisText}>get rewarded</Text> with up to <Text style={styles.emphasisText}>₹1,000 / $10 / €10</Text> cashback! 💰
        </Text>
        </View> */}
     
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
