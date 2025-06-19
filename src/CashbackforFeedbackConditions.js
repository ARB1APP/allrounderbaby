import React, { useEffect } from 'react'; // Added useEffect for BackHandler
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  useColorScheme,
  StatusBar,
  BackHandler, // Added BackHandler
  Platform, // For platform-specific styling
} from 'react-native';
// Removed: import { Colors } from 'react-native/Libraries/NewAppScreen';

// --- Theme Colors ---
const lightThemeColors = {
  screenBackground: '#F4F6F8',
  cardBackground: '#FFFFFF', // For video links section
  textPrimary: '#1A202C',
  textSecondary: '#4A5568',
  textMuted: '#718096',
  accentColor: 'rgba(20, 52, 164, 1)', // Your primary brand color
  linkColor: 'rgba(20, 52, 164, 1)',
  borderColor: '#E2E8F0',
  iconColor: '#4A5568', // General icon color
  videoIconTint: 'rgba(20, 52, 164, 1)', // Specific for play icon
  bottomNavBackground: '#FFFFFF',
  bottomNavActiveTint: 'rgba(20, 52, 164, 1)',
  bottomNavInactiveTint: '#A0AEC0',
  bottomNavShadowColor: '#000000',
  statusBarContent: 'dark-content',
  elevation: 5, // General elevation for cards/nav
};

const darkThemeColors = {
  screenBackground: '#1A202C',
  cardBackground: '#2D3748',
  textPrimary: '#E2E8F0',
  textSecondary: '#A0AEC0',
  textMuted: '#718096',
  accentColor: 'rgba(40, 72, 184, 1)', // Brighter accent for dark
  linkColor: '#63B3ED', // Lighter blue for links
  borderColor: '#4A5568',
  iconColor: '#A0AEC0',
  videoIconTint: 'rgba(40, 72, 184, 1)',
  bottomNavBackground: '#2D3748',
  bottomNavActiveTint: '#63B3ED',
  bottomNavInactiveTint: '#718096',
  bottomNavShadowColor: '#000000',
  statusBarContent: 'light-content',
  elevation: 0, // Prefer borders in dark mode
};

// --- Dynamic Styles ---
const createCashbackStyles = (theme) => StyleSheet.create({
  // --- Main Container & ScrollView ---
  container: {
    flex: 1,
    backgroundColor: theme.screenBackground,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20, // Space for content before bottom nav
  },
  // --- Typography & Structure ---
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
    marginTop: 10, // Added some top margin
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
    //color: theme.textPrimary,
  },
  listItem: {
    marginHorizontal: 10,
    fontSize: 15,
    lineHeight: 22,
    color: theme.textSecondary,
    marginBottom: 8,
  },
  subListItem: { // For indented points or details under a list item
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
  highlightText: { // For emojis or special callouts
    color: theme.accentColor,
    fontWeight: '600',
  },
  importantDetailsBox: {
    marginHorizontal: 20,
    marginTop: 0, // Reduced from checkListBox
    padding: 15,
    backgroundColor: theme.cardBackground, // Use card background for this box
    borderRadius: 8,
    borderWidth: theme.elevation === 0 ? 1 : 0,
    borderColor: theme.borderColor,
    elevation: theme.elevation / 2, // Subtle elevation
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
    fontWeight: '500', // Give it some prominence
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
  // --- Video Links Section ---
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
    //tintColor: theme.videoIconTint,
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
  // --- Bottom Navigation ---
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: theme.bottomNavBackground,
    paddingVertical: Platform.OS === 'ios' ? 15 : 10,
    paddingBottom: Platform.OS === 'ios' ? 25 : 10, // For home indicator
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
    flex: 1, // Ensure items take equal space
  },
  navIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginBottom: 3,
  },
  navText: {
    fontSize: 10,
    fontWeight: '500', // Medium weight for readability
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
        // console.log('Hardware back press detected on Cashback Conditions');
        if (navigation.canGoBack()) {
            // console.log('Navigating back to Cashback for Feedback');
            navigation.navigate('Cashback for Feedback'); // Explicit navigation
        } else {
            // console.log('Cannot go back from Cashback Conditions');
        }
        return true; // Prevent default back action
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => {
        // console.log('Removing back handler from Cashback Conditions');
        backHandler.remove();
        // StatusBar.setHidden(false); // Only if it was set hidden for this screen
    };
  }, [navigation]);
 
  return (
    <View style={styles.container}>
      <StatusBar barStyle={theme.statusBarContent} backgroundColor={theme.screenBackground} />
            <View style={[styles.importantDetailsBox, { marginTop: 10 }]}>
      <Text style={styles.headerTitle}>🎉 Give Feedback & Get ₹1,000 / $10 / €10 Cashback! 🎉</Text>
      </View>
      <View style={styles.sectionDivider} />

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
         <View style={styles.importantDetailsBox}>
        {/* <Text style={styles.lastUpdatedText}>Last updated: 21st April, 2025</Text> */}
        <Text style={styles.introParagraph}>
           Your opinion matters! 💖 Help us improve <Text style={styles.emphasisText}>AllrounderBaby.com</Text> and <Text style={styles.emphasisText}>get rewarded</Text> with up to <Text style={styles.emphasisText}>₹1,000 / $10 / €10</Text> cashback! 💰
        </Text>
        </View>
          <View style={styles.sectionDivider} />
      <View style={styles.importantDetailsBox}>
        <Text  style={[
                    styles.sectionHeader,
                    { color: isDarkMode ? '#fff' : '#1434a4' }
                ]}>🛠 How It Works?</Text>
        <Text style={styles.listItem}>
           <Text style={styles.emphasisText}>🟡 1️⃣ Submit Your Feedback on Our Website ✍️</Text>
        </Text>
         <Text style={styles.subListItem}>
          🔗 Feedback can <Text style={styles.emphasisText}>only be submitted</Text> through the <Text style={styles.emphasisText}>official form</Text> on AllrounderBaby.com.
        </Text>
        <Text style={styles.subListItem}>
          💡 Ensure your feedback is <Text style={styles.emphasisText}>detailed, genuine, and valuable</Text> to qualify for cashback.
        </Text>
         <Text style={styles.listItem}>
          <Text style={styles.emphasisText}>🟢 2️⃣ Approval & Payment Process ✅</Text>
        </Text>
        <Text style={styles.subListItem}>
          🔍 Our team will <Text style={styles.emphasisText}>review & verify</Text> the feedback before approval.
        </Text>
        <Text style={styles.subListItem}>
          💰 Cashback is <Text style={styles.emphasisText}>only issued after approval</Text> based on quality & authenticity.
        </Text>
        <Text style={styles.subListItem}>
          <Text style={styles.emphasisText}>⚠️ One-time submission only –</Text> You can submit feedback <Text style={styles.emphasisText}>once per account.</Text>
        </Text>
</View>
        <View style={styles.sectionDivider} />
      

        <View style={styles.importantDetailsBox}>
           <Text  style={[
                    styles.sectionHeader,
                    { color: isDarkMode ? '#fff' : '#1434a4' }
                ]}>💳 Bank Account & Payment Processing</Text>
       <Text style={styles.subListItem}>
          💰 The <Text style={styles.emphasisText}>bank account</Text> used for your <Text style={styles.emphasisText}>initial program payment</Text> will be set as your <Text style={styles.emphasisText}>default account.</Text>
        </Text>
        <Text style={styles.subListItem}>
          🔄 To <Text style={styles.emphasisText}>change your default bank account,</Text> update the details on our <Text style={styles.emphasisText}>website.</Text>
        </Text>
        <Text style={styles.subListItem}>
          ⏳ Payments may take <Text style={styles.emphasisText}>1 to 60 days</Text> for processing & transfer.
        </Text>
        </View>
    <View style={styles.sectionDivider} />
         <View style={styles.importantDetailsBox}>
           <Text  style={[
                    styles.sectionHeader,
                    { color: isDarkMode ? '#fff' : '#1434a4' }
                ]}>🌍 International Payments & Charges</Text>
         <Text style={styles.subListItem}>
          💵 If receiving cashback in <Text style={styles.emphasisText}>USD or EUR, transaction fees & currency conversion charges may apply.</Text>
        </Text>
        <Text style={styles.subListItem}>
          🔄 The final credited amount will depend on the <Text style={styles.emphasisText}>exchange rate & deductions</Text> by banks/payment providers.
        </Text>
        </View>
    <View style={styles.sectionDivider} />
           <View style={styles.importantDetailsBox}>
           <Text  style={[
                    styles.sectionHeader,
                    { color: isDarkMode ? '#fff' : '#1434a4' }
                ]}>📑 Tax & Compliance</Text>
        <Text style={styles.subListItem}>
          💵 Your cashback is <Text style={styles.emphasisText}>considered commission income</Text> and is <Text style={styles.emphasisText}>subject to tax</Text> as per government rules.
        </Text>
        <Text style={styles.listItem}><Text style={styles.emphasisText}>💼 For Indian Residents:</Text></Text>
        <Text style={styles.subListItem}>
          ✅ Cashback may be <Text style={styles.emphasisText}>subject to TDS (Tax Deducted at Source)</Text> under Indian tax laws.
        </Text>
        <Text style={styles.subListItem}>
          ✅ Payments may be processed <Text style={styles.emphasisText}>after applicable tax deductions.</Text>
        </Text>
        <Text style={styles.listItem}><Text style={styles.emphasisText}>🌎 For International Participants:</Text></Text>
        <Text style={styles.subListItem}>
          ✅ Tax laws vary based on <Text style={styles.emphasisText}>your country’s regulations.</Text>
        </Text>
        <Text style={styles.subListItem}>
          ✅ You are responsible for <Text style={styles.emphasisText}>reporting & paying applicable taxes</Text> in your country.
        </Text>
        </View>
    <View style={styles.sectionDivider} />
  <View style={styles.importantDetailsBox}>
           <Text  style={[
                    styles.sectionHeader,
                    { color: isDarkMode ? '#fff' : '#1434a4' }
                ]}>📜 Important Notes</Text>
          <Text style={styles.subListItem}>
          <Text style={styles.emphasisText}>📍 AllrounderBaby.com does not provide tax consultation.</Text> Please check with a tax expert for compliance.
        </Text>
        <Text style={styles.subListItem}>
          📍 For more details, please read our <Text style={styles.emphasisText}>“Terms of Use” and “Privacy Policy”.</Text>
        </Text>

       
        </View>
 <View style={styles.sectionDivider} />
         <View style={styles.importantDetailsBox}>
           <Text style={styles.finalCallToAction}>
          <Text style={styles.emphasisText}>📲 Submit your feedback now on our website & earn up to ₹1,000 / $10 / €10 !🚀</Text>
        </Text>
         </View>




        
      </ScrollView>
    </View>
  );
};

export default CashbackforFeedbackConditions;